import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, TEAMS_DATA } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Trophy, ArrowBigLeft, ArrowBigRight, Play } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface FallingItem {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'star' | 'heart' | 'fruit' | 'bread' | 'cloud';
  emoji: string;
  points: number;
}

interface SkyTheme {
  name: string;
  bgClass: string;
  borderClass: string;
  decor: string;
}

const SKY_THEMES: SkyTheme[] = [
  {
    name: '🌙 Starry Night',
    bgClass: 'from-indigo-950 via-indigo-900 to-sky-900',
    borderClass: 'border-indigo-300',
    decor: '🌙',
  },
  {
    name: '🌅 Golden Sunrise',
    bgClass: 'from-amber-600 via-orange-500 to-sky-600',
    borderClass: 'border-amber-300',
    decor: '☀️',
  },
  {
    name: '🌈 Rainbow Sky',
    bgClass: 'from-sky-500 via-teal-500 to-emerald-600',
    borderClass: 'border-teal-200',
    decor: '🌈',
  },
  {
    name: '🏔️ Mountain Twilight',
    bgClass: 'from-purple-950 via-fuchsia-900 to-indigo-800',
    borderClass: 'border-purple-300',
    decor: '🏔️',
  },
];

export const StarCatcherGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [basketX, setBasketX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [skyIndex, setSkyIndex] = useState(0);

  const roundDuration = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 35 : 40;
  const [timeLeft, setTimeLeft] = useState(roundDuration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Multiplayer teams
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });
  const [isWaitingNextTeam, setIsWaitingNextTeam] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const animFrameRef = useRef<number | null>(null);
  const keysDown = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });
  const basketXRef = useRef(50);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);

  const updateBasketX = (val: number) => {
    const clamped = Math.max(8, Math.min(92, val));
    basketXRef.current = clamped;
    setBasketX(clamped);
  };

  const startGame = () => {
    sounds.playClick();
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setTimeLeft(roundDuration);
    updateBasketX(50);
    setItems([]);
    setIsGameOver(false);
    setIsWaitingNextTeam(false);
    setIsPlaying(true);
  };

  const startFullGame = () => {
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
    setSkyIndex((idx) => (idx + 1) % SKY_THEMES.length);
    startGame();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysDown.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysDown.current.right = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysDown.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysDown.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || isGameOver || isWaitingNextTeam) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, isWaitingNextTeam]);

  // Trigger round end cleanly when timeLeft hits 0
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      handleRoundEnd();
    }
  }, [timeLeft, isPlaying]);

  const handleRoundEnd = () => {
    setIsPlaying(false);
    const finalRoundScore = scoreRef.current;

    if (playerCount > 1) {
      const newTeamScores = {
        ...teamScores,
        [activeTeam]: finalRoundScore,
      };
      setTeamScores(newTeamScores);

      if (activeTeam < playerCount) {
        sounds.playSuccess();
        setIsWaitingNextTeam(true);
      } else {
        setIsGameOver(true);
        sounds.playWin();
        try {
          confetti({ particleCount: 80, spread: 70 });
        } catch {
          // ignore
        }
        const totalTeamScore = Object.values(newTeamScores).reduce((a, b) => a + b, 0);
        const earnedStars = Math.max(5, Math.floor(totalTeamScore / 60));
        onEarnStars(earnedStars);
      }
    } else {
      setIsGameOver(true);
      sounds.playWin();
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // ignore
      }
      const earnedStars = Math.max(3, Math.floor(finalRoundScore / 50));
      onEarnStars(earnedStars);
    }
  };

  const startNextTeamRound = () => {
    const nextTeam = activeTeam + 1;
    setActiveTeam(nextTeam);
    setIsWaitingNextTeam(false);
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setTimeLeft(roundDuration);
    updateBasketX(50);
    setItems([]);
    setSkyIndex((idx) => (idx + 1) % SKY_THEMES.length);
    setIsPlaying(true);
    sounds.playWin();
  };

  // Mouse / Touchpad tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isPlaying) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    updateBasketX(x);
  };

  // Game loop (uses refs so basket movement never resets spawnTimer!)
  useEffect(() => {
    if (!isPlaying) return;

    let spawnTimer = 0;
    const baseSpeed = difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 0.8 : 1.15;
    const spawnInterval = difficulty === 'easy' ? 38 : difficulty === 'medium' ? 30 : 24;
    const basketCatchWidth = difficulty === 'easy' ? 14 : difficulty === 'medium' ? 10 : 8.5;

    const loop = () => {
      if (keysDown.current.left) {
        updateBasketX(basketXRef.current - 1.6);
      }
      if (keysDown.current.right) {
        updateBasketX(basketXRef.current + 1.6);
      }

      spawnTimer++;
      if (spawnTimer % spawnInterval === 0) {
        const rand = Math.random();
        let type: FallingItem['type'] = 'star';
        let emoji = '⭐';
        let points = 10;
        let speed = baseSpeed + Math.random() * 0.4;

        if (difficulty === 'easy') {
          if (rand < 0.35) {
            type = 'star'; emoji = '⭐'; points = 10;
          } else if (rand < 0.58) {
            type = 'heart'; emoji = '💖'; points = 15;
          } else if (rand < 0.78) {
            type = 'fruit'; emoji = Math.random() < 0.5 ? '🍇' : '🍎'; points = 20;
          } else if (rand < 0.92) {
            type = 'bread'; emoji = '🍞'; points = 25;
          } else {
            type = 'star'; emoji = '🌟'; points = 35; speed *= 1.15;
          }
        } else {
          if (rand < 0.32) {
            type = 'star'; emoji = '⭐'; points = 10;
          } else if (rand < 0.5) {
            type = 'heart'; emoji = '💖'; points = 15;
          } else if (rand < 0.68) {
            type = 'fruit'; emoji = Math.random() < 0.5 ? '🍇' : '🍎'; points = 20;
          } else if (rand < 0.8) {
            type = 'bread'; emoji = '🍞'; points = 25;
          } else if (rand < 0.86) {
            type = 'star'; emoji = '🌟'; points = 35; speed *= 1.25;
          } else {
            type = 'cloud';
            emoji = difficulty === 'hard' ? '⛈️' : '🌧️';
            points = difficulty === 'hard' ? -20 : -10;
            speed = baseSpeed * 0.9;
          }
        }

        const newItem: FallingItem = {
          id: nextId.current++,
          x: 10 + Math.random() * 80,
          y: -5,
          speed,
          type,
          emoji,
          points,
        };

        setItems((prev) => [...prev, newItem]);
      }

      setItems((prevItems) => {
        const remaining: FallingItem[] = [];
        const currentBasketX = basketXRef.current;

        prevItems.forEach((item) => {
          const nextY = item.y + item.speed;

          if (nextY >= 81 && nextY <= 92 && Math.abs(item.x - currentBasketX) < basketCatchWidth) {
            if (item.type === 'cloud') {
              sounds.playWrong();
              scoreRef.current = Math.max(0, scoreRef.current + item.points);
              comboRef.current = 0;
              setScore(scoreRef.current);
              setCombo(0);
            } else {
              sounds.playStar();
              const multiplier = comboRef.current >= 5 ? 2 : 1;
              const pointsEarned = item.points * multiplier;
              scoreRef.current += pointsEarned;
              comboRef.current += 1;
              setScore(scoreRef.current);
              setCombo(comboRef.current);
            }
            return;
          }

          if (nextY < 100) {
            remaining.push({ ...item, y: nextY });
          } else if (item.type !== 'cloud') {
            comboRef.current = 0;
            setCombo(0);
          }
        });

        return remaining;
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, difficulty]);

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • Preschool-Gr.2'
      : difficulty === 'medium'
      ? 'Medium • Gr.3-5'
      : 'Hard • Gr.6+';

  const currentTeamInfo = TEAMS_DATA[activeTeam];
  const currentSky = SKY_THEMES[skyIndex];

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto px-3 sm:px-4 py-2 sm:py-3 w-full animate-fadeIn select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 font-bold rounded-xl shadow hover:bg-gray-50 border border-gray-200 transition active:scale-95 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Menu</span>
        </button>

        {/* Score & Time info */}
        <div className="flex items-center gap-2.5 bg-white px-3 py-1 rounded-xl shadow border border-gray-100">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block font-bold">SCORE</span>
            <span className="text-lg font-black text-amber-500">{score}</span>
          </div>
          <div className="w-px h-5 bg-gray-200" />
          <div className="text-center">
            <span className="text-[10px] text-gray-400 block font-bold">TIME</span>
            <span className={`text-lg font-black ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`}>
              {timeLeft}s
            </span>
          </div>
          {combo >= 3 && (
            <>
              <div className="w-px h-5 bg-gray-200" />
              <div className="text-center">
                <span className="text-[10px] text-amber-500 block font-bold">COMBO</span>
                <span className="text-sm font-black text-amber-600 animate-bounce">x{combo}</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={startFullGame}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-xl shadow transition active:scale-95 text-xs sm:text-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={playerCount > 1 ? { ...teamScores, [activeTeam]: score } : { 1: score }}
        difficultyLabel={difficultyText}
        turnMessage="Catch stars for your team!"
        onChangeSettings={onChangeSettings}
      />

      {/* Game Play Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className={`w-full h-[34vh] min-h-[220px] max-h-[330px] bg-gradient-to-b ${currentSky.bgClass} rounded-3xl relative overflow-hidden shadow-2xl border-4 ${currentSky.borderClass} cursor-crosshair touch-none transition-colors duration-700`}
      >
        <div className="absolute top-3 left-4 text-white/70 text-xs font-bold pointer-events-none flex items-center gap-2">
          <span className="bg-black/25 px-2 py-0.5 rounded-full">{currentSky.name}</span>
          <span>
            {difficulty === 'easy' ? 'Catch ⭐ 🌟 💖 🍇 🍞!' : 'Catch ⭐ 🌟 💖 🍇 — Avoid 🌧️!'}
          </span>
        </div>
        <div className="absolute top-3 right-5 text-3xl opacity-35 pointer-events-none select-none">
          {currentSky.decor}
        </div>

        {/* Falling Items */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute text-4xl sm:text-5xl pointer-events-none drop-shadow-md select-none transition-transform duration-75"
          >
            {item.emoji}
          </div>
        ))}

        {/* Basket */}
        <div
          style={{
            left: `${basketX}%`,
            top: '88%',
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute flex flex-col items-center pointer-events-none select-none transition-all duration-75"
        >
          <div className="text-5xl sm:text-6xl filter drop-shadow-lg">🧺</div>
          {playerCount > 1 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-[-6px] shadow ${currentTeamInfo.badgeClass}`}>
              {currentTeamInfo.name}
            </span>
          )}
        </div>

        {/* Start Overlay */}
        {!isPlaying && !isGameOver && !isWaitingNextTeam && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-5xl mb-2 animate-bounce">⭐</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-1">
              {playerCount > 1 ? `${currentTeamInfo.name}'s Round!` : 'Catch the Stars!'}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 max-w-sm mb-5">
              Move your basket left and right with keys, mouse, or the buttons below!
            </p>
            <button
              onClick={startGame}
              className="px-7 py-3 bg-amber-400 hover:bg-amber-300 text-amber-950 text-lg font-black rounded-2xl shadow-xl transform active:scale-95 transition cursor-pointer"
            >
              Start Playing ⭐
            </button>
          </div>
        )}

        {/* Between Team Handoff Overlay */}
        {isWaitingNextTeam && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white animate-scaleUp">
            <div className="text-5xl mb-2">👏</div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-300 mb-1">
              Great Round, {currentTeamInfo.name}!
            </h3>
            <p className="text-sm text-gray-200 mb-2">
              Score: <strong className="text-white text-xl">{score} pts</strong>
            </p>
            <div className="my-3 p-3 bg-white/10 rounded-2xl border border-white/20">
              <p className="text-xs text-amber-200 font-bold">
                Pass the laptop to:
              </p>
              <div className="text-2xl font-black text-white mt-1">
                {TEAMS_DATA[activeTeam + 1]?.emoji} {TEAMS_DATA[activeTeam + 1]?.name}
              </div>
            </div>
            <button
              onClick={startNextTeamRound}
              className="mt-2 px-7 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl transform active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start {TEAMS_DATA[activeTeam + 1]?.name}'s Turn</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen Large Left/Right Controls */}
      <div className="flex gap-3 w-full max-w-md mt-2 justify-between">
        <button
          onMouseDown={() => { keysDown.current.left = true; }}
          onMouseUp={() => { keysDown.current.left = false; }}
          onTouchStart={() => { keysDown.current.left = true; }}
          onTouchEnd={() => { keysDown.current.left = false; }}
          className="flex-1 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-1 select-none active:scale-95 cursor-pointer"
        >
          <ArrowBigLeft className="w-6 h-6" />
          <span className="text-sm sm:text-base font-black">LEFT</span>
        </button>

        <button
          onMouseDown={() => { keysDown.current.right = true; }}
          onMouseUp={() => { keysDown.current.right = false; }}
          onTouchStart={() => { keysDown.current.right = true; }}
          onTouchEnd={() => { keysDown.current.right = false; }}
          className="flex-1 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-1 select-none active:scale-95 cursor-pointer"
        >
          <span className="text-sm sm:text-base font-black">RIGHT</span>
          <ArrowBigRight className="w-6 h-6" />
        </button>
      </div>

      {/* Game Over Modal: Team Podium or Solo */}
      {isGameOver && playerCount > 1 && (
        <TeamVictoryModal
          playerCount={playerCount}
          scores={teamScores}
          totalStarsEarned={Math.max(5, Math.floor(Object.values(teamScores).reduce((a, b) => a + b, 0) / 60))}
          onPlayAgain={startFullGame}
          onBackToMenu={onBack}
        />
      )}

      {isGameOver && playerCount === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-1">Time's Up!</h2>
            <p className="text-gray-600 font-medium mb-2">
              You caught a wonderful score of <strong className="text-indigo-600 font-black text-2xl">{score}</strong>!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2.5 rounded-full font-bold mb-6">
              <span>⭐ Reward:</span>
              <span className="text-xl text-amber-600 font-black">+{Math.max(3, Math.floor(score / 50))} Stars!</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition"
              >
                Menu
              </button>
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition"
              >
                Play Again ⭐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
