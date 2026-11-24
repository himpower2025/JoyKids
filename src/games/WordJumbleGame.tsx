import React, { useState, useEffect, useRef } from 'react';
import { GameSettings } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, Volume2, Lightbulb, Trophy, CheckCircle2, Sparkles } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface JumbleWord {
  word: string;
  emoji: string;
  sentence: string;
}

const WORDS_BY_DIFFICULTY: Record<'easy' | 'medium' | 'hard', JumbleWord[]> = {
  easy: [
    { word: 'JOY', emoji: '😊', sentence: 'Sing with JOY and gladness' },
    { word: 'LOVE', emoji: '❤️', sentence: 'God is LOVE' },
    { word: 'HOPE', emoji: '🌈', sentence: 'We have HOPE in our hearts' },
    { word: 'PRAY', emoji: '🙏', sentence: 'PRAY every morning and night' },
    { word: 'STAR', emoji: '⭐', sentence: 'The bright Bethlehem STAR' },
    { word: 'ARK', emoji: '⛵', sentence: "Noah's wooden ARK on the waters" },
    { word: 'SUN', emoji: '☀️', sentence: 'The warm SUN shines on the hills' },
    { word: 'DOVE', emoji: '🕊️', sentence: 'A white DOVE brings peace' },
    { word: 'FISH', emoji: '🐟', sentence: 'A little FISH swims in clear water' },
    { word: 'LAMB', emoji: '🐑', sentence: 'The gentle LAMB follows the shepherd' },
    { word: 'KING', emoji: '👑', sentence: 'Praise the glorious KING' },
    { word: 'SONG', emoji: '🎵', sentence: 'Let us sing a happy SONG' },
    { word: 'BELL', emoji: '🔔', sentence: 'Ring the church BELL together' },
    { word: 'GIFT', emoji: '🎁', sentence: 'Every good day is a GIFT' },
    { word: 'BOOK', emoji: '📖', sentence: 'Open the good BOOK to read' },
    { word: 'GOOD', emoji: '👍', sentence: 'Be kind and do GOOD today' },
    { word: 'HELP', emoji: '🤝', sentence: 'Friends HELP one another' },
    { word: 'TREE', emoji: '🌳', sentence: 'A tall green TREE gives shade' },
    { word: 'RAIN', emoji: '🌧️', sentence: 'Gentle RAIN helps flowers grow' },
    { word: 'HOME', emoji: '🏠', sentence: 'Peace fills our sweet HOME' },
    { word: 'LION', emoji: '🦁', sentence: 'Daniel was safe beside the LION' },
    { word: 'GOLD', emoji: '✨', sentence: 'A heart brighter than GOLD' },
    { word: 'SEED', emoji: '🌱', sentence: 'A tiny SEED grows into a tree' },
    { word: 'PATH', emoji: '🛤️', sentence: 'Walk on the bright right PATH' },
  ],
  medium: [
    { word: 'PEACE', emoji: '🕊️', sentence: 'May PEACE be with you all' },
    { word: 'FAITH', emoji: '🛡️', sentence: 'Stand strong in FAITH' },
    { word: 'GRACE', emoji: '✨', sentence: 'Full of GRACE and truth' },
    { word: 'SHINE', emoji: '⭐', sentence: 'Let your light SHINE bright' },
    { word: 'TRUTH', emoji: '📖', sentence: 'Speak the TRUTH in love' },
    { word: 'HEART', emoji: '💖', sentence: 'A clean and joyful HEART' },
    { word: 'BREAD', emoji: '🍞', sentence: 'Thankful for our daily BREAD' },
    { word: 'SHEEP', emoji: '🐑', sentence: 'Counting every little SHEEP' },
    { word: 'LIGHT', emoji: '🕯️', sentence: 'A candle brings LIGHT in darkness' },
    { word: 'MERCY', emoji: '🤲', sentence: 'Show MERCY and kindness daily' },
    { word: 'SMILE', emoji: '😄', sentence: 'Share a warm SMILE with friends' },
    { word: 'GLORY', emoji: '🌟', sentence: 'Sing songs of GLORY and praise' },
    { word: 'CROWN', emoji: '👑', sentence: 'A golden CROWN of joy' },
    { word: 'TRUST', emoji: '🤝', sentence: 'We TRUST with all our heart' },
    { word: 'CHURCH', emoji: '⛪', sentence: 'Friends meet together at CHURCH' },
    { word: 'FRIEND', emoji: '🫂', sentence: 'A loyal FRIEND loves at all times' },
    { word: 'ANGEL', emoji: '👼', sentence: 'The ANGEL sang good news' },
    { word: 'RIVER', emoji: '🌊', sentence: 'Cool water flowing in the RIVER' },
    { word: 'CLOUD', emoji: '☁️', sentence: 'A white CLOUD floats above peaks' },
    { word: 'GRAPE', emoji: '🍇', sentence: 'Sweet GRAPE growing on the vine' },
    { word: 'HAPPY', emoji: '🎉', sentence: 'So HAPPY to learn English' },
    { word: 'MUSIC', emoji: '🎶', sentence: 'Joyful MUSIC fills the room' },
    { word: 'SHARE', emoji: '🍎', sentence: 'We SHARE our snacks happily' },
    { word: 'THANK', emoji: '🙏', sentence: 'Always remember to say THANK you' },
  ],
  hard: [
    { word: 'BLESSING', emoji: '✨', sentence: 'Showers of heavenly BLESSING' },
    { word: 'KINDNESS', emoji: '🤝', sentence: 'Clothe yourselves with KINDNESS' },
    { word: 'REJOICE', emoji: '🎉', sentence: 'REJOICE in the Lord always' },
    { word: 'PROMISE', emoji: '🌈', sentence: 'God remembers His eternal PROMISE' },
    { word: 'CREATION', emoji: '🌳', sentence: 'The beauty of all CREATION' },
    { word: 'FORGIVE', emoji: '🫂', sentence: 'Learn to FORGIVE one another' },
    { word: 'FAITHFUL', emoji: '🌟', sentence: 'Always stay true and FAITHFUL' },
    { word: 'THANKFUL', emoji: '🙏', sentence: 'Have a grateful THANKFUL spirit' },
    { word: 'PATIENCE', emoji: '⏳', sentence: 'Wait calmly with gentle PATIENCE' },
    { word: 'SHEPHERD', emoji: '🐑', sentence: 'The Good SHEPHERD knows His flock' },
    { word: 'RAINBOW', emoji: '🌈', sentence: 'Seven colors form a bright RAINBOW' },
    { word: 'WORSHIP', emoji: '🙌', sentence: 'Lifting our voices in WORSHIP' },
    { word: 'MIRACLE', emoji: '🌊', sentence: 'An amazing MIRACLE happened there' },
    { word: 'COURAGE', emoji: '🦁', sentence: 'Take heart and have great COURAGE' },
    { word: 'WISDOM', emoji: '📖', sentence: 'Learning truth brings true WISDOM' },
    { word: 'COMFORT', emoji: '🕊️', sentence: 'Kind words bring warm COMFORT' },
    { word: 'HARVEST', emoji: '🌾', sentence: 'The fields are ready for HARVEST' },
    { word: 'TREASURE', emoji: '💎', sentence: 'Kindness is a priceless TREASURE' },
    { word: 'JOURNEY', emoji: '⛰️', sentence: 'Every step is a joyful JOURNEY' },
    { word: 'KINGDOM', emoji: '👑', sentence: 'Citizens of a peaceful KINGDOM' },
    { word: 'HEAVENS', emoji: '🌌', sentence: 'Stars declare the glory of HEAVENS' },
    { word: 'DISCIPLE', emoji: '👥', sentence: 'A faithful DISCIPLE learns and serves' },
    { word: 'GOODNESS', emoji: '💖', sentence: 'Fill every day with GOODNESS' },
    { word: 'SUNSHINE', emoji: '☀️', sentence: 'Morning SUNSHINE warms the hills' },
  ],
};

const WORDS_PER_SET = 6;

export const WordJumbleGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;

  const [setNumber, setSetNumber] = useState(1);
  const [wordList, setWordList] = useState<JumbleWord[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [letters, setLetters] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Multiplayer teams
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  const usedWordsRef = useRef<Set<string>>(new Set());

  const setupWord = (w: JumbleWord) => {
    const chars = w.word.split('');
    let scrambled = [...chars].sort(() => Math.random() - 0.5);
    if (scrambled.join('') === w.word && chars.length > 2) {
      scrambled = [...chars].reverse();
    }

    setLetters(scrambled.map((char, i) => ({ id: i, char, used: false })));
    setPlacedLetters(new Array(chars.length).fill(null));
    setIsCorrect(false);

    sounds.speakWord(w.word.toLowerCase());
  };

  const dealFreshSet = (isFirstSet = false) => {
    const fullPool = WORDS_BY_DIFFICULTY[difficulty];
    let unseen = fullPool.filter((w) => !usedWordsRef.current.has(w.word));

    if (unseen.length < WORDS_PER_SET) {
      const currentWords = new Set(wordList.map((w) => w.word));
      usedWordsRef.current.clear();
      unseen = fullPool.filter((w) => !currentWords.has(w.word));
    }

    const picked = [...unseen].sort(() => Math.random() - 0.5).slice(0, WORDS_PER_SET);
    picked.forEach((p) => usedWordsRef.current.add(p.word));

    setWordList(picked);
    setWordIndex(0);
    setScore(0);
    setIsWon(false);
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
    if (!isFirstSet) {
      setSetNumber((n) => n + 1);
    }
    if (picked[0]) {
      setupWord(picked[0]);
    }
  };

  useEffect(() => {
    usedWordsRef.current.clear();
    setSetNumber(1);
    dealFreshSet(true);
  }, [difficulty, playerCount]);

  useEffect(() => {
    if (wordList[wordIndex]) {
      setupWord(wordList[wordIndex]);
    }
  }, [wordIndex, wordList]);

  const current = wordList[wordIndex];
  if (!current) return null;

  const handleTileClick = (tileId: number, char: string) => {
    const firstEmpty = placedLetters.indexOf(null);
    if (firstEmpty === -1) return;

    sounds.playPop();

    const newPlaced = [...placedLetters];
    newPlaced[firstEmpty] = char;
    setPlacedLetters(newPlaced);

    setLetters((prev) => prev.map((t) => (t.id === tileId ? { ...t, used: true } : t)));

    if (!newPlaced.includes(null)) {
      if (newPlaced.join('') === current.word) {
        setIsCorrect(true);
        sounds.playSuccess();
        setScore((s) => s + 1);

        if (playerCount > 1) {
          setTeamScores((prev) => ({
            ...prev,
            [activeTeam]: (prev[activeTeam] || 0) + 10,
          }));
        }

        setTimeout(() => {
          if (wordIndex + 1 >= wordList.length) {
            setIsWon(true);
            sounds.playWin();
            try {
              confetti({ particleCount: 75, spread: 65 });
            } catch {
              // ignore
            }
            const totalStars = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15;
            onEarnStars(totalStars);
          } else {
            setWordIndex((i) => i + 1);
            if (playerCount > 1) {
              setActiveTeam((t) => (t % playerCount) + 1);
            }
          }
        }, 1100);
      } else {
        sounds.playWrong();
      }
    }
  };

  const handleSlotClick = (index: number) => {
    const char = placedLetters[index];
    if (!char) return;

    sounds.playClick();

    const newPlaced = [...placedLetters];
    newPlaced[index] = null;
    setPlacedLetters(newPlaced);

    let freed = false;
    setLetters((prev) =>
      prev.map((t) => {
        if (!freed && t.used && t.char === char) {
          freed = true;
          return { ...t, used: false };
        }
        return t;
      })
    );
  };

  const handleGiveHint = () => {
    sounds.playStar();
    const correctChars = current.word.split('');
    const firstMismatch = placedLetters.findIndex((char, i) => char !== correctChars[i]);

    if (firstMismatch !== -1) {
      const wrongChar = placedLetters[firstMismatch];
      if (wrongChar) {
        handleSlotClick(firstMismatch);
      }
      const targetChar = correctChars[firstMismatch];
      const matchTile = letters.find((t) => !t.used && t.char === targetChar);
      if (matchTile) {
        handleTileClick(matchTile.id, targetChar);
      }
    }
  };

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • 24 Words'
      : difficulty === 'medium'
      ? 'Medium • 24 Words'
      : 'Hard • 24 Words';

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

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl shadow border border-gray-100">
          <span className="text-[11px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
            Set #{setNumber}
          </span>
          <span className="text-[10px] font-bold text-gray-400">WORD</span>
          <span className="text-indigo-600 font-black text-sm">
            {wordIndex + 1} / {wordList.length}
          </span>
        </div>

        <button
          onClick={handleGiveHint}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl shadow-xs transition active:scale-95 text-xs cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>Hint</span>
        </button>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={teamScores}
        difficultyLabel={difficultyText}
        turnMessage="Unscramble this word for your team!"
        onChangeSettings={onChangeSettings}
      />

      {/* Main Jumble Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-indigo-100 flex flex-col items-center text-center">
        <div className="text-5xl sm:text-6xl mb-1 drop-shadow-sm">{current.emoji}</div>

        <p className="text-xs sm:text-sm font-bold text-indigo-950 mb-1 italic">
          "{current.sentence}"
        </p>

        <button
          onClick={() => {
            sounds.playPop();
            sounds.speakWord(current.word.toLowerCase());
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded-xl mb-3 text-xs transition active:scale-95 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Hear Pronunciation</span>
        </button>

        {/* Target Letter Slots */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4">
          {placedLetters.map((char, idx) => (
            <button
              key={idx}
              onClick={() => handleSlotClick(idx)}
              className={`w-10 h-12 sm:w-12 sm:h-14 rounded-2xl border-2 sm:border-3 flex items-center justify-center text-lg sm:text-2xl font-black transition transform active:scale-90 ${
                char
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md cursor-pointer'
                  : 'bg-gray-100 border-dashed border-gray-300 text-transparent'
              }`}
            >
              {char || '_'}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-gray-400 mb-2">Tap tiles to unscramble the letters:</p>

        {/* Scrambled Letter Tiles */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-md">
          {letters.map((tile) => (
            <button
              key={tile.id}
              onClick={() => !tile.used && handleTileClick(tile.id, tile.char)}
              disabled={tile.used}
              className={`w-10 h-11 sm:w-11 sm:h-12 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center shadow-md transition transform active:scale-90 ${
                tile.used
                  ? 'opacity-20 bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 hover:scale-105 cursor-pointer'
              }`}
            >
              {tile.char}
            </button>
          ))}
        </div>

        {isCorrect && (
          <div className="mt-3 flex items-center gap-2 text-emerald-600 font-black text-sm sm:text-base animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>Well Done! That spells {current.word}! ⭐</span>
          </div>
        )}
      </div>

      {/* Won Modal: Team Podium or Solo */}
      {isWon && playerCount > 1 && (
        <TeamVictoryModal
          playerCount={playerCount}
          scores={teamScores}
          totalStarsEarned={difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15}
          playAgainLabel="Next Word Set ➔"
          onPlayAgain={() => dealFreshSet(false)}
          onBackToMenu={onBack}
        />
      )}

      {isWon && playerCount === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="w-18 h-18 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
              Set #{setNumber} Complete! 🎉
            </h2>
            <p className="text-sm text-gray-600 font-medium mb-4">
              You unscrambled all {wordList.length} words with excellence!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2 rounded-full font-bold mb-5">
              <span>⭐ Reward:</span>
              <span className="text-xl text-amber-600 font-black">
                +{difficulty === 'easy' ? 6 : difficulty === 'medium' ? 10 : 15} Stars!
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
                onClick={() => dealFreshSet(false)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Next Word Set ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
