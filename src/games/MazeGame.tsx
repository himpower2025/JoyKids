import React, { useState, useEffect, useCallback } from 'react';
import { GameSettings, TEAMS_DATA } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, ArrowUp, ArrowDown, ArrowLeft as LeftIcon, ArrowRight as RightIcon, Play } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface Cell {
  x: number;
  y: number;
  isWall: boolean;
  hasBell: boolean;
}

function generateMaze(size: number): { grid: Cell[][]; start: [number, number]; end: [number, number] } {
  const actualSize = size % 2 === 0 ? size + 1 : size;
  const grid: Cell[][] = [];

  for (let y = 0; y < actualSize; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < actualSize; x++) {
      row.push({ x, y, isWall: true, hasBell: false });
    }
    grid.push(row);
  }

  const stack: [number, number][] = [];
  grid[1][1].isWall = false;
  stack.push([1, 1]);

  const directions = [
    [0, -2],
    [0, 2],
    [-2, 0],
    [2, 0],
  ];

  while (stack.length > 0) {
    const [cx, cy] = stack[stack.length - 1];
    const neighbors: [number, number, number, number][] = [];

    directions.forEach(([dx, dy]) => {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx > 0 && nx < actualSize - 1 && ny > 0 && ny < actualSize - 1) {
        if (grid[ny][nx].isWall) {
          neighbors.push([nx, ny, cx + dx / 2, cy + dy / 2]);
        }
      }
    });

    if (neighbors.length > 0) {
      const [nx, ny, wx, wy] = neighbors[Math.floor(Math.random() * neighbors.length)];
      grid[wy][wx].isWall = false;
      grid[ny][nx].isWall = false;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  const start: [number, number] = [1, 1];
  const end: [number, number] = [actualSize - 2, actualSize - 2];
  grid[end[1]][end[0]].isWall = false;

  let bellsPlaced = 0;
  for (let y = 1; y < actualSize - 1; y++) {
    for (let x = 1; x < actualSize - 1; x++) {
      if (!grid[y][x].isWall && (x !== start[0] || y !== start[1]) && (x !== end[0] || y !== end[1])) {
        if (Math.random() < 0.16 && bellsPlaced < 5) {
          grid[y][x].hasBell = true;
          bellsPlaced++;
        }
      }
    }
  }

  return { grid, start, end };
}

interface MazeTheme {
  id: string;
  playerEmoji: string;
  exitEmoji: string;
  pickupEmoji: string;
  turnText: string;
  winTitle: string;
  winDesc: string;
  boxBg: string;
  wallBg: string;
  pathBg: string;
}

const MAZE_THEMES: MazeTheme[] = [
  {
    id: 'sheep-church',
    playerEmoji: '🐑',
    exitEmoji: '⛪',
    pickupEmoji: '🔔',
    turnText: 'Guide the sheep to church!',
    winTitle: 'Sheep is Safe! 🎉',
    winDesc: 'You guided the little sheep home to church',
    boxBg: 'bg-emerald-800 border-emerald-600',
    wallBg: 'bg-emerald-950 border-emerald-900/60',
    pathBg: 'bg-emerald-100/95 border-emerald-200/50',
  },
  {
    id: 'dove-ark',
    playerEmoji: '🕊️',
    exitEmoji: '⛵',
    pickupEmoji: '🌿',
    turnText: 'Fly the dove back to the Ark!',
    winTitle: 'Dove Found the Ark! 🎉',
    winDesc: 'You flew the peace dove safely to Noah’s Ark',
    boxBg: 'bg-sky-800 border-sky-500',
    wallBg: 'bg-sky-950 border-sky-900/60',
    pathBg: 'bg-sky-100/95 border-sky-200/50',
  },
  {
    id: 'bee-flower',
    playerEmoji: '🐝',
    exitEmoji: '🌻',
    pickupEmoji: '🍯',
    turnText: 'Guide the honeybee to the sunflower!',
    winTitle: 'Sweet Sunflower! 🎉',
    winDesc: 'You helped the little bee reach the bright flower',
    boxBg: 'bg-amber-700 border-amber-500',
    wallBg: 'bg-amber-950 border-amber-900/60',
    pathBg: 'bg-amber-50/95 border-amber-200/50',
  },
  {
    id: 'star-camp',
    playerEmoji: '🐪',
    exitEmoji: '⭐',
    pickupEmoji: '🎁',
    turnText: 'Follow the desert trail to the Bethlehem star!',
    winTitle: 'Found the Star! 🎉',
    winDesc: 'You followed the shining star across the hills',
    boxBg: 'bg-indigo-800 border-indigo-500',
    wallBg: 'bg-indigo-950 border-indigo-900/60',
    pathBg: 'bg-indigo-100/95 border-indigo-200/50',
  },
];

export const MazeGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [themeIndex, setThemeIndex] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<[number, number]>([1, 1]);
  const [endPos, setEndPos] = useState<[number, number]>([5, 5]);
  const [steps, setSteps] = useState(0);
  const [bellsCollected, setBellsCollected] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const currentTheme = MAZE_THEMES[themeIndex];

  // Multiplayer teams
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [isWaitingNextTeam, setIsWaitingNextTeam] = useState(false);
  const [isAllTeamsDone, setIsAllTeamsDone] = useState(false);

  const initMaze = useCallback(() => {
    sounds.playClick();
    const size = difficulty === 'easy' ? 7 : difficulty === 'medium' ? 11 : 15;
    const { grid: newGrid, start, end } = generateMaze(size);
    setGrid(newGrid);
    setPlayerPos(start);
    setEndPos(end);
    setSteps(0);
    setBellsCollected(0);
    setIsWon(false);
  }, [difficulty]);

  useEffect(() => {
    initMaze();
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
    setIsWaitingNextTeam(false);
    setIsAllTeamsDone(false);
  }, [difficulty, playerCount, initMaze]);

  const handleMazeWin = useCallback(
    (finalSteps: number, finalBells: number) => {
      const roundScore = 50 + finalBells * 15 - Math.min(20, Math.floor(finalSteps / 2));
      sounds.playSuccess();

      if (playerCount > 1) {
        const updatedTeamScores = {
          ...teamScores,
          [activeTeam]: Math.max(10, roundScore),
        };
        setTeamScores(updatedTeamScores);

        if (activeTeam < playerCount) {
          setIsWaitingNextTeam(true);
        } else {
          setIsAllTeamsDone(true);
          sounds.playWin();
          try {
            confetti({ particleCount: 80, spread: 70 });
          } catch {
            // ignore
          }
          const totalStars = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 16;
          onEarnStars(totalStars);
        }
      } else {
        setIsWon(true);
        sounds.playWin();
        try {
          confetti({ particleCount: 80, spread: 70 });
        } catch {
          // ignore
        }
        const totalStars = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 16;
        onEarnStars(totalStars);
      }
    },
    [activeTeam, difficulty, onEarnStars, playerCount, teamScores]
  );

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isWon || grid.length === 0 || isWaitingNextTeam || isAllTeamsDone) return;
      const [px, py] = playerPos;
      const nx = px + dx;
      const ny = py + dy;

      if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
        if (!grid[ny][nx].isWall) {
          sounds.playPop();
          const nextSteps = steps + 1;
          let nextBells = bellsCollected;
          setSteps(nextSteps);
          setPlayerPos([nx, ny]);

          if (grid[ny][nx].hasBell) {
            sounds.playStar();
            nextBells = bellsCollected + 1;
            setBellsCollected(nextBells);
            const updated = grid.map((row) =>
              row.map((cell) => (cell.x === nx && cell.y === ny ? { ...cell, hasBell: false } : cell))
            );
            setGrid(updated);
          }

          if (nx === endPos[0] && ny === endPos[1]) {
            handleMazeWin(nextSteps, nextBells);
          }
        } else {
          sounds.playWrong();
        }
      }
    },
    [isWon, grid, playerPos, endPos, isWaitingNextTeam, isAllTeamsDone, steps, bellsCollected, handleMazeWin]
  );

  const startNextTeamRound = () => {
    const nextTeam = activeTeam + 1;
    setActiveTeam(nextTeam);
    setIsWaitingNextTeam(false);
    initMaze();
    sounds.playWin();
  };

  const startFullRestart = () => {
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
    setIsWaitingNextTeam(false);
    setIsAllTeamsDone(false);
    setThemeIndex((i) => (i + 1) % MAZE_THEMES.length);
    initMaze();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • 7x7 Grid'
      : difficulty === 'medium'
      ? 'Medium • 11x11 Grid'
      : 'Hard • 15x15 Grid';

  const currentTeamInfo = TEAMS_DATA[activeTeam];

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto px-3 sm:px-4 py-2 w-full animate-fadeIn select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 font-bold rounded-xl shadow hover:bg-gray-50 border border-gray-200 transition active:scale-95 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Menu</span>
        </button>

      <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-xl shadow border border-gray-100">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block font-bold">STEPS</span>
            <span className="text-base font-black text-indigo-600">{steps}</span>
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block font-bold">BONUS</span>
            <span className="text-base font-black text-amber-500">
              {currentTheme.pickupEmoji} {bellsCollected}
            </span>
          </div>
        </div>

        <button
          onClick={startFullRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl shadow transition active:scale-95 text-xs sm:text-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Maze</span>
        </button>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={teamScores}
        difficultyLabel={difficultyText}
        turnMessage={currentTheme.turnText}
        onChangeSettings={onChangeSettings}
      />

      {/* Maze Grid Box */}
      <div
        className={`relative ${currentTheme.boxBg} p-2 rounded-2xl shadow-xl border-3 w-full max-w-[min(340px,36vh)] aspect-square flex items-center justify-center overflow-hidden my-1 transition-colors duration-500`}
      >
        <div
          className="grid gap-0.5 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = playerPos[0] === x && playerPos[1] === y;
              const isExit = endPos[0] === x && endPos[1] === y;

              return (
                <div
                  key={`${x}-${y}`}
                  className={`rounded-xs sm:rounded-md flex items-center justify-center text-center transition-all ${
                    cell.isWall ? `${currentTheme.wallBg} border shadow-inner` : `${currentTheme.pathBg} border`
                  }`}
                >
                  {isPlayer ? (
                    <span
                      className={`${
                        grid.length <= 9 ? 'text-2xl sm:text-3xl' : 'text-sm sm:text-base'
                      } animate-bounce filter drop-shadow select-none`}
                    >
                      {currentTheme.playerEmoji}
                    </span>
                  ) : isExit ? (
                    <span
                      className={`${
                        grid.length <= 9 ? 'text-2xl sm:text-3xl' : 'text-sm sm:text-base'
                      } filter drop-shadow animate-pulse select-none`}
                    >
                      {currentTheme.exitEmoji}
                    </span>
                  ) : cell.hasBell ? (
                    <span
                      className={`${
                        grid.length <= 9 ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm'
                      } filter drop-shadow animate-wiggle select-none`}
                    >
                      {currentTheme.pickupEmoji}
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Handoff Modal when waiting for next team */}
        {isWaitingNextTeam && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center text-white animate-scaleUp z-20">
            <div className="text-4xl mb-1">{currentTheme.exitEmoji}</div>
            <h3 className="text-lg sm:text-xl font-black text-amber-300 mb-0.5">
              Goal Reached!
            </h3>
            <p className="text-xs text-gray-200 mb-2">
              {currentTeamInfo.name} solved it in {steps} steps!
            </p>
            <div className="my-2 p-2 bg-white/10 rounded-xl border border-white/20">
              <p className="text-[10px] text-amber-200 font-bold">Pass the laptop to:</p>
              <div className="text-lg font-black text-white mt-0.5">
                {TEAMS_DATA[activeTeam + 1]?.emoji} {TEAMS_DATA[activeTeam + 1]?.name}
              </div>
            </div>
            <button
              onClick={startNextTeamRound}
              className="mt-1 px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm rounded-xl shadow-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start {TEAMS_DATA[activeTeam + 1]?.name}'s Turn</span>
            </button>
          </div>
        )}
      </div>

      {/* Directional Pad */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <button
          onClick={() => movePlayer(0, -1)}
          className="w-14 h-9 sm:w-16 sm:h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-md flex items-center justify-center active:scale-90 transition cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex gap-2.5">
          <button
            onClick={() => movePlayer(-1, 0)}
            className="w-14 h-9 sm:w-16 sm:h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-md flex items-center justify-center active:scale-90 transition cursor-pointer"
          >
            <LeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => movePlayer(0, 1)}
            className="w-14 h-9 sm:w-16 sm:h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-md flex items-center justify-center active:scale-90 transition cursor-pointer"
          >
            <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="w-14 h-9 sm:w-16 sm:h-10 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl shadow-md flex items-center justify-center active:scale-90 transition cursor-pointer"
          >
            <RightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Team Podium at the end */}
      {isAllTeamsDone && playerCount > 1 && (
        <TeamVictoryModal
          playerCount={playerCount}
          scores={teamScores}
          totalStarsEarned={difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 16}
          playAgainLabel="New Maze ➔"
          onPlayAgain={startFullRestart}
          onBackToMenu={onBack}
        />
      )}

      {/* Solo Win Modal */}
      {isWon && playerCount === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="text-6xl mb-3">{currentTheme.exitEmoji}</div>
            <h2 className="text-3xl font-black text-gray-900 mb-1">{currentTheme.winTitle}</h2>
            <p className="text-gray-600 font-medium mb-4">
              {currentTheme.winDesc} in <strong className="text-indigo-600">{steps} steps</strong>!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2 rounded-full font-bold mb-6">
              <span>⭐ Reward:</span>
              <span className="text-xl text-amber-600 font-black">
                +{difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 16} Stars!
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition cursor-pointer"
              >
                Menu
              </button>
              <button
                onClick={() => {
                  setThemeIndex((i) => (i + 1) % MAZE_THEMES.length);
                  initMaze();
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition cursor-pointer"
              >
                New Maze ➔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
