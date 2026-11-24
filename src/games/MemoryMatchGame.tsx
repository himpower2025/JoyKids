import React, { useState, useEffect } from 'react';
import { GameSettings } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface Card {
  id: number;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const THEMES = {
  animals: {
    name: 'Animal Friends 🐾',
    items: [
      { emoji: '🐑', name: 'Sheep' },
      { emoji: '🦁', name: 'Lion' },
      { emoji: '🕊️', name: 'Dove' },
      { emoji: '🐘', name: 'Elephant' },
      { emoji: '🐒', name: 'Monkey' },
      { emoji: '🐠', name: 'Fish' },
      { emoji: '🦒', name: 'Giraffe' },
      { emoji: '🐪', name: 'Camel' },
      { emoji: '🦅', name: 'Eagle' },
      { emoji: '🐴', name: 'Donkey' },
      { emoji: '🦋', name: 'Butterfly' },
      { emoji: '🐢', name: 'Turtle' },
      { emoji: '🦆', name: 'Duck' },
      { emoji: '🐝', name: 'Bee' },
    ],
  },
  bible: {
    name: 'Sunday School ⛪',
    items: [
      { emoji: '⭐', name: 'Star' },
      { emoji: '⛵', name: 'Ark' },
      { emoji: '🍞', name: 'Bread' },
      { emoji: '🌈', name: 'Rainbow' },
      { emoji: '⛪', name: 'Church' },
      { emoji: '💖', name: 'Heart' },
      { emoji: '🍇', name: 'Grapes' },
      { emoji: '👑', name: 'Crown' },
      { emoji: '🕯️', name: 'Candle' },
      { emoji: '📖', name: 'Bible' },
      { emoji: '🔔', name: 'Bell' },
      { emoji: '👼', name: 'Angel' },
      { emoji: '🛡️', name: 'Shield' },
      { emoji: '🎵', name: 'Praise' },
    ],
  },
  nature: {
    name: 'Creation & Nature 🌿',
    items: [
      { emoji: '☀️', name: 'Sun' },
      { emoji: '🌙', name: 'Moon' },
      { emoji: '🌳', name: 'Tree' },
      { emoji: '🌸', name: 'Flower' },
      { emoji: '🏔️', name: 'Mountain' },
      { emoji: '🌊', name: 'River' },
      { emoji: '🌧️', name: 'Rain' },
      { emoji: '🌻', name: 'Sunflower' },
      { emoji: '🍂', name: 'Leaf' },
      { emoji: '☁️', name: 'Cloud' },
      { emoji: '🌾', name: 'Wheat' },
      { emoji: '🌺', name: 'Hibiscus' },
      { emoji: '🪨', name: 'Rock' },
      { emoji: '🌱', name: 'Sprout' },
    ],
  },
  food: {
    name: 'Daily Blessings 🍎',
    items: [
      { emoji: '🍎', name: 'Apple' },
      { emoji: '🍌', name: 'Banana' },
      { emoji: '🍊', name: 'Orange' },
      { emoji: '🍉', name: 'Melon' },
      { emoji: '🥕', name: 'Carrot' },
      { emoji: '🌽', name: 'Corn' },
      { emoji: '🥭', name: 'Mango' },
      { emoji: '🍯', name: 'Honey' },
      { emoji: '🥛', name: 'Milk' },
      { emoji: '🍚', name: 'Rice' },
      { emoji: '🍓', name: 'Berry' },
      { emoji: '🥔', name: 'Potato' },
      { emoji: '🍋', name: 'Lemon' },
      { emoji: '🍒', name: 'Cherry' },
    ],
  },
};

export const MemoryMatchGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [theme, setTheme] = useState<keyof typeof THEMES>('animals');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Multiplayer team state
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  // Initialize deck based on difficulty — shuffle BEFORE slicing so every game deals fresh pairs!
  const startNewGame = () => {
    sounds.playClick();
    // Easy: 3 pairs (6 cards), Medium: 6 pairs (12 cards), Hard: 9 pairs (18 cards)
    const countPairs = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 6 : 9;
    const shuffledPool = [...THEMES[theme].items].sort(() => Math.random() - 0.5);
    const selectedItems = shuffledPool.slice(0, countPairs);
    const deckItems = [...selectedItems, ...selectedItems];

    const shuffled = deckItems
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
    setIsChecking(false);
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
  };

  useEffect(() => {
    startNewGame();
  }, [theme, difficulty, playerCount]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched) return;

    sounds.playPop();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setIsChecking(true);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        // Matched!
        setTimeout(() => {
          sounds.playSuccess();
          const matchedCards = [...cards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setIsChecking(false);

          // Team scores points
          if (playerCount > 1) {
            setTeamScores((prev) => ({
              ...prev,
              [activeTeam]: (prev[activeTeam] || 0) + 10,
            }));
            // Same team gets a bonus turn on match!
          }

          const totalPairs = cards.length / 2;
          const newMatches = matches + 1;
          setMatches(newMatches);

          if (newMatches === totalPairs) {
            handleVictory();
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          sounds.playWrong();
          const resetCards = [...cards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsChecking(false);

          // In multiplayer, switch turn to next team
          if (playerCount > 1) {
            setActiveTeam((current) => (current % playerCount) + 1);
          }
        }, 850);
      }
    }
  };

  const handleVictory = () => {
    setIsWon(true);
    sounds.playWin();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    const reward = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15;
    onEarnStars(reward);
  };

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • Preschool-Gr.2'
      : difficulty === 'medium'
      ? 'Medium • Gr.3-5'
      : 'Hard • Gr.6+';

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-4 py-4 w-full animate-fadeIn select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-bold rounded-2xl shadow hover:bg-gray-50 border border-gray-200 transition active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-indigo-600" />
          <span>Menu</span>
        </button>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow border border-gray-100">
          <div className="text-xs font-semibold text-gray-500">
            Pairs: <span className="text-emerald-600 font-black text-base">{matches}/{cards.length / 2}</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="text-xs font-semibold text-gray-500">
            Moves: <span className="text-indigo-600 font-black text-base">{moves}</span>
          </div>
        </div>

        <button
          onClick={startNewGame}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-2xl shadow transition active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart</span>
        </button>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={teamScores}
        difficultyLabel={difficultyText}
        turnMessage="Tap 2 cards to find a pair!"
        onChangeSettings={onChangeSettings}
      />

      {/* Theme selector tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-3 bg-white/80 p-1 rounded-2xl border border-gray-200 shadow-xs">
        {(
          [
            { id: 'animals', label: '🐾 Animals' },
            { id: 'bible', label: '⛪ Sunday School' },
            { id: 'nature', label: '🌿 Nature' },
            { id: 'food', label: '🍎 Good Food' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTheme(tab.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
              theme === tab.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Game Cards Grid */}
      <div
        className={`grid gap-2 sm:gap-2.5 w-full max-w-2xl justify-center items-center ${
          difficulty === 'easy'
            ? 'grid-cols-3 sm:grid-cols-3 max-w-md'
            : difficulty === 'medium'
            ? 'grid-cols-4 sm:grid-cols-4'
            : 'grid-cols-6 sm:grid-cols-6 max-w-3xl'
        }`}
      >
        {cards.map((card, idx) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(idx)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all duration-300 transform select-none ${
              card.isMatched
                ? 'bg-emerald-100 border-2 sm:border-3 border-emerald-400 scale-95 opacity-80 shadow-inner'
                : card.isFlipped
                ? 'bg-white border-2 sm:border-3 border-indigo-400 shadow-lg scale-105'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:scale-105 cursor-pointer active:scale-95 border-2 border-white/50'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <>
                <span
                  className={`${
                    difficulty === 'easy'
                      ? 'text-5xl sm:text-6xl'
                      : difficulty === 'medium'
                      ? 'text-4xl sm:text-5xl'
                      : 'text-3xl sm:text-4xl'
                  } animate-bounce drop-shadow-sm`}
                >
                  {card.emoji}
                </span>
                <span className="text-[10px] font-bold text-gray-600 mt-1 truncate max-w-full">
                  {card.name}
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-white/90">
                <Sparkles className="w-6 h-6 animate-pulse text-amber-200" />
                <span className="text-[9px] font-bold tracking-wider uppercase mt-0.5 text-indigo-100">
                  Tap
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Won Modal: Solo or Team Podium */}
      {isWon && playerCount > 1 && (
        <TeamVictoryModal
          playerCount={playerCount}
          scores={teamScores}
          totalStarsEarned={difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15}
          onPlayAgain={startNewGame}
          onBackToMenu={onBack}
        />
      )}

      {isWon && playerCount === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-1">Wonderful Job! 🎉</h2>
            <p className="text-gray-600 font-medium mb-4">
              You matched all pairs in <strong className="text-indigo-600">{moves} moves</strong>!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full font-bold mb-6">
              <span>⭐ You earned</span>
              <span className="text-xl text-amber-600 font-black">
                +{difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15} Stars!
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition"
              >
                Menu
              </button>
              <button
                onClick={startNewGame}
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
