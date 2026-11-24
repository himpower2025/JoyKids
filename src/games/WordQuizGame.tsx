import React, { useState, useEffect, useRef } from 'react';
import { GameSettings } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { ArrowLeft, Volume2, CheckCircle2, Sparkles } from 'lucide-react';
import { TeamScoreboard } from '../components/TeamScoreboard';
import { TeamVictoryModal } from '../components/TeamVictoryModal';

interface Props {
  settings: GameSettings;
  onBack: () => void;
  onEarnStars: (count: number) => void;
  onChangeSettings: () => void;
}

interface QuizWord {
  emoji: string;
  word: string;
  hint: string;
  topic: string;
}

const WORDS_BY_DIFFICULTY: Record<'easy' | 'medium' | 'hard', QuizWord[]> = {
  easy: [
    { emoji: '☀️', word: 'SUN', hint: 'Warm morning light', topic: 'Nature' },
    { emoji: '⛵', word: 'ARK', hint: "Noah's big safe boat", topic: 'Bible' },
    { emoji: '🐟', word: 'FISH', hint: 'Swims in the clear river', topic: 'Animals' },
    { emoji: '⭐', word: 'STAR', hint: 'Shines bright in the night sky', topic: 'Nature' },
    { emoji: '🦁', word: 'LION', hint: 'Brave and strong animal friend', topic: 'Animals' },
    { emoji: '🕊️', word: 'DOVE', hint: 'White bird of peace', topic: 'Bible' },
    { emoji: '🐑', word: 'SHEEP', hint: 'Little gentle lamb', topic: 'Animals' },
    { emoji: '🍞', word: 'BREAD', hint: 'Our daily food', topic: 'Daily' },
    { emoji: '🌳', word: 'TREE', hint: 'Tall and leafy green', topic: 'Nature' },
    { emoji: '💖', word: 'LOVE', hint: 'Caring for everyone kindly', topic: 'Bible' },
    { emoji: '😊', word: 'JOY', hint: 'A bright and happy heart', topic: 'Bible' },
    { emoji: '🌧️', word: 'RAIN', hint: 'Soft water falling for plants', topic: 'Nature' },
    { emoji: '🌙', word: 'MOON', hint: 'Glows gently in the dark night', topic: 'Nature' },
    { emoji: '🔔', word: 'BELL', hint: 'Rings ding-dong at church', topic: 'Bible' },
    { emoji: '📖', word: 'BOOK', hint: 'We read stories from it', topic: 'School' },
    { emoji: '🍎', word: 'APPLE', hint: 'Crunchy sweet red fruit', topic: 'Food' },
    { emoji: '🦆', word: 'DUCK', hint: 'Swims on the pond saying quack', topic: 'Animals' },
    { emoji: '🐘', word: 'ELEPHANT', hint: 'Big friend with a long trunk', topic: 'Animals' },
    { emoji: '🌸', word: 'FLOWER', hint: 'Colorful bloom in the garden', topic: 'Nature' },
    { emoji: '🏠', word: 'HOME', hint: 'Where family lives together', topic: 'Daily' },
    { emoji: '🙏', word: 'PRAY', hint: 'Talking with God in our heart', topic: 'Bible' },
    { emoji: '🎁', word: 'GIFT', hint: 'A loving present for a friend', topic: 'Daily' },
    { emoji: '🐮', word: 'COW', hint: 'Gives fresh milk on the farm', topic: 'Animals' },
    { emoji: '🐸', word: 'FROG', hint: 'Green jumper near the stream', topic: 'Animals' },
    { emoji: '🎵', word: 'SONG', hint: 'Happy music we sing together', topic: 'School' },
    { emoji: '🌊', word: 'WATER', hint: 'Cool clear drink and river', topic: 'Nature' },
    { emoji: '☁️', word: 'CLOUD', hint: 'Soft white puff in the sky', topic: 'Nature' },
    { emoji: '🐝', word: 'BEE', hint: 'Little buzz that makes sweet honey', topic: 'Animals' },
    { emoji: '🐶', word: 'DOG', hint: 'Playful loyal puppy friend', topic: 'Animals' },
    { emoji: '🕊️', word: 'BIRD', hint: 'Has wings to fly high', topic: 'Animals' },
  ],
  medium: [
    { emoji: '⛪', word: 'CHURCH', hint: 'Where we sing and learn', topic: 'Bible' },
    { emoji: '👑', word: 'CROWN', hint: 'For the King of kings', topic: 'Bible' },
    { emoji: '🌈', word: 'RAINBOW', hint: "God's promise in the clouds", topic: 'Bible' },
    { emoji: '🍇', word: 'GRAPES', hint: 'Sweet fruit on the vine', topic: 'Food' },
    { emoji: '🕯️', word: 'CANDLE', hint: 'Giving light in the room', topic: 'Bible' },
    { emoji: '🛡️', word: 'SHIELD', hint: 'Shield of faith', topic: 'Bible' },
    { emoji: '👼', word: 'ANGEL', hint: 'Heavenly messenger of joy', topic: 'Bible' },
    { emoji: '📜', word: 'SCROLL', hint: 'Ancient sacred scriptures', topic: 'Bible' },
    { emoji: '🦒', word: 'GIRAFFE', hint: 'Tall animal reaching the leaves', topic: 'Animals' },
    { emoji: '🐪', word: 'CAMEL', hint: 'Carries travelers across the desert', topic: 'Animals' },
    { emoji: '⛰️', word: 'MOUNTAIN', hint: 'High snowy peak touching the sky', topic: 'Nature' },
    { emoji: '🌻', word: 'GARDEN', hint: 'Where flowers and trees grow', topic: 'Nature' },
    { emoji: '🤝', word: 'FRIEND', hint: 'Someone who helps and shares', topic: 'Values' },
    { emoji: '✏️', word: 'PENCIL', hint: 'Tool for writing and drawing', topic: 'School' },
    { emoji: '🧺', word: 'BASKET', hint: 'Woven holder for bread and fruit', topic: 'Bible' },
    { emoji: '🌊', word: 'RIVER', hint: 'Flowing water from the hills', topic: 'Nature' },
    { emoji: '🕊️', word: 'PEACE', hint: 'Calm and gentle harmony', topic: 'Values' },
    { emoji: '🌅', word: 'MORNING', hint: 'Fresh start when the sun rises', topic: 'Nature' },
    { emoji: '🦋', word: 'BUTTERFLY', hint: 'Pretty winged insect on flowers', topic: 'Animals' },
    { emoji: '🌾', word: 'HARVEST', hint: 'Gathering ripe grain from fields', topic: 'Nature' },
    { emoji: '🎺', word: 'TRUMPET', hint: 'Bright horn played in celebration', topic: 'Bible' },
    { emoji: '🔑', word: 'KEY', hint: 'Unlocks a door safely', topic: 'Daily' },
    { emoji: '💡', word: 'LIGHT', hint: 'Shines brightly in dark places', topic: 'Bible' },
    { emoji: '❤️', word: 'HEART', hint: 'Where love and kindness live', topic: 'Values' },
    { emoji: '🍯', word: 'HONEY', hint: 'Golden sweet treat from bees', topic: 'Food' },
    { emoji: '⛵', word: 'SAILOR', hint: 'Guides a boat across the sea', topic: 'Daily' },
    { emoji: '🧥', word: 'JACKET', hint: 'Keeps us warm on cool hills', topic: 'Daily' },
    { emoji: '🎒', word: 'SCHOOL', hint: 'Place to learn new wisdom', topic: 'School' },
    { emoji: '🌿', word: 'BRANCH', hint: 'Grows out from a strong vine', topic: 'Bible' },
    { emoji: '🌟', word: 'BRIGHT', hint: 'Full of sparkling light', topic: 'Nature' },
  ],
  hard: [
    { emoji: '✨', word: 'BLESSING', hint: 'Heavenly gifts of goodness and joy', topic: 'Faith' },
    { emoji: '👑', word: 'KINGDOM', hint: 'The kingdom of heaven and peace', topic: 'Faith' },
    { emoji: '🤝', word: 'FORGIVE', hint: 'Forgiving one another in love', topic: 'Values' },
    { emoji: '🌟', word: 'FAITHFUL', hint: 'Trustworthy and loyal in heart', topic: 'Values' },
    { emoji: '🙌', word: 'WORSHIP', hint: 'Giving praise and thanks together', topic: 'Faith' },
    { emoji: '🌈', word: 'PROMISE', hint: 'A covenant that will never be broken', topic: 'Faith' },
    { emoji: '🌊', word: 'MIRACLE', hint: 'Wonder of the parting sea', topic: 'Bible' },
    { emoji: '👥', word: 'DISCIPLE', hint: 'Follower who learns and shares love', topic: 'Bible' },
    { emoji: '🐑', word: 'SHEPHERD', hint: 'Cares lovingly for every sheep', topic: 'Bible' },
    { emoji: '❤️', word: 'KINDNESS', hint: 'Being gentle, caring, and helpful', topic: 'Values' },
    { emoji: '🕊️', word: 'PATIENCE', hint: 'Waiting calmly with hope', topic: 'Values' },
    { emoji: '🙏', word: 'THANKFUL', hint: 'Feeling grateful for every blessing', topic: 'Values' },
    { emoji: '📖', word: 'SCRIPTURE', hint: 'Sacred words written in the Bible', topic: 'Bible' },
    { emoji: '🌿', word: 'CREATION', hint: 'All wonderful things made by God', topic: 'Nature' },
    { emoji: '🛡️', word: 'COURAGE', hint: 'Being brave when things look hard', topic: 'Values' },
    { emoji: '🦁', word: 'STRENGTH', hint: 'Power to stand firm and help others', topic: 'Values' },
    { emoji: '🎉', word: 'REJOICE', hint: 'Celebrate with gladness in your heart', topic: 'Faith' },
    { emoji: '🌞', word: 'SUNSHINE', hint: 'Warm golden light across the valley', topic: 'Nature' },
    { emoji: '🏔️', word: 'HIMALAYA', hint: 'Majestic snowy mountain range', topic: 'Nature' },
    { emoji: '🏡', word: 'NEIGHBOR', hint: 'Friend living near us whom we love', topic: 'Values' },
    { emoji: '💎', word: 'TREASURE', hint: 'Something precious kept safe in heart', topic: 'Bible' },
    { emoji: '🕯️', word: 'WISDOM', hint: 'Knowing what is good and true', topic: 'Values' },
    { emoji: '🌱', word: 'GENTLENESS', hint: 'Soft and loving touch toward others', topic: 'Values' },
    { emoji: '🎶', word: 'HARMONY', hint: 'Different voices singing together cleanly', topic: 'Music' },
    { emoji: '🚶', word: 'JOURNEY', hint: 'Long walk full of new lessons', topic: 'Life' },
    { emoji: '🤲', word: 'GENEROUS', hint: 'Willingly sharing what we have', topic: 'Values' },
    { emoji: '🕊️', word: 'PEACEFUL', hint: 'Quiet, safe, and free of worry', topic: 'Values' },
    { emoji: '🍞', word: 'PROVISION', hint: 'Everything needed for each day', topic: 'Bible' },
    { emoji: '🌈', word: 'COVENANT', hint: 'Faithful agreement of love', topic: 'Bible' },
    { emoji: '🔭', word: 'DISCOVER', hint: 'Finding amazing new truths', topic: 'Learning' },
  ],
};

export const WordQuizGame: React.FC<Props> = ({
  settings,
  onBack,
  onEarnStars,
  onChangeSettings,
}) => {
  const { difficulty, playerCount } = settings;
  const [mode, setMode] = useState<'choice' | 'spell'>('choice');
  const [setNumber, setSetNumber] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordList, setWordList] = useState<QuizWord[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Spelling mode states
  const [spelledLetters, setSpelledLetters] = useState<string[]>([]);
  const [availableLetterTiles, setAvailableLetterTiles] = useState<{ id: number; char: string; used: boolean }[]>([]);

  // Scores & Teams
  const [score, setScore] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [activeTeam, setActiveTeam] = useState(1);
  const [teamScores, setTeamScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0 });

  // Track used words across rounds so successive sets NEVER repeat words until full pool is used
  const usedWordsRef = useRef<Set<string>>(new Set());

  const totalQuestions = 6;

  useEffect(() => {
    usedWordsRef.current.clear();
    setSetNumber(1);
    dealFreshSet(true);
  }, [mode, difficulty, playerCount]);

  const dealFreshSet = (isFirstSet = false) => {
    const fullPool = WORDS_BY_DIFFICULTY[difficulty];
    let unseen = fullPool.filter((item) => !usedWordsRef.current.has(item.word));

    // If fewer than 6 unseen remain, reset history while excluding the very last round's words
    if (unseen.length < totalQuestions) {
      const currentWords = new Set(wordList.map((w) => w.word));
      usedWordsRef.current.clear();
      unseen = fullPool.filter((item) => !currentWords.has(item.word));
    }

    const picked = [...unseen].sort(() => Math.random() - 0.5).slice(0, totalQuestions);
    picked.forEach((p) => usedWordsRef.current.add(p.word));

    setWordList(picked);
    setCurrentIndex(0);
    setScore(0);
    setRoundCompleted(false);
    setActiveTeam(1);
    setTeamScores({ 1: 0, 2: 0, 3: 0 });
    if (!isFirstSet) {
      setSetNumber((n) => n + 1);
    }
    loadQuestion(0, picked);
  };

  const loadQuestion = (index: number, list: QuizWord[] = wordList) => {
    if (!list[index]) return;
    const current = list[index];
    setSelectedAnswer(null);
    setIsCorrect(null);

    // Option choices from full pool
    const wrongOptions = WORDS_BY_DIFFICULTY[difficulty]
      .filter((w) => w.word !== current.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((w) => w.word);

    const choices = [current.word, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(choices);

    // Spelling tiles
    const letters = current.word.split('');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const extraCount = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const extraChars: string[] = [];
    for (let i = 0; i < extraCount; i++) {
      extraChars.push(alphabet[Math.floor(Math.random() * 26)]);
    }

    const allTiles = [...letters, ...extraChars]
      .sort(() => Math.random() - 0.5)
      .map((char, idx) => ({ id: idx, char, used: false }));

    setAvailableLetterTiles(allTiles);
    setSpelledLetters([]);

    sounds.speakWord(current.word.toLowerCase());
  };

  const currentItem = wordList[currentIndex];

  const handleChooseAnswer = (choice: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);

    if (choice === currentItem.word) {
      setIsCorrect(true);
      sounds.playSuccess();
      setScore((s) => s + 1);

      if (playerCount > 1) {
        setTeamScores((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 10,
        }));
      }

      setTimeout(() => advanceNext(true), 1100);
    } else {
      setIsCorrect(false);
      sounds.playWrong();
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 950);
    }
  };

  const handleTileClick = (tileId: number, char: string) => {
    sounds.playPop();
    const newTiles = availableLetterTiles.map((t) => (t.id === tileId ? { ...t, used: true } : t));
    const newSpelled = [...spelledLetters, char];
    setAvailableLetterTiles(newTiles);
    setSpelledLetters(newSpelled);

    if (newSpelled.join('') === currentItem.word) {
      sounds.playSuccess();
      setIsCorrect(true);
      setScore((s) => s + 1);

      if (playerCount > 1) {
        setTeamScores((prev) => ({
          ...prev,
          [activeTeam]: (prev[activeTeam] || 0) + 10,
        }));
      }

      setTimeout(() => advanceNext(true), 1100);
    } else if (newSpelled.length >= currentItem.word.length) {
      sounds.playWrong();
      setIsCorrect(false);
      setTimeout(() => {
        setSpelledLetters([]);
        setAvailableLetterTiles((tiles) => tiles.map((t) => ({ ...t, used: false })));
        setIsCorrect(null);
      }, 850);
    }
  };

  const handleRemoveLetter = (index: number) => {
    sounds.playClick();
    const charToRemove = spelledLetters[index];
    const newSpelled = spelledLetters.filter((_, i) => i !== index);
    setSpelledLetters(newSpelled);

    let uncheckDone = false;
    const newTiles = availableLetterTiles.map((t) => {
      if (!uncheckDone && t.used && t.char === charToRemove) {
        uncheckDone = true;
        return { ...t, used: false };
      }
      return t;
    });
    setAvailableLetterTiles(newTiles);
  };

  const advanceNext = (earnedPoint: boolean) => {
    if (currentIndex + 1 >= totalQuestions) {
      setRoundCompleted(true);
      sounds.playWin();
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {
        // ignore
      }
      const earnedStars = score + (earnedPoint ? 1 : 0) + (difficulty === 'hard' ? 6 : 4);
      onEarnStars(earnedStars);
    } else {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (playerCount > 1) {
        setActiveTeam((t) => (t % playerCount) + 1);
      }
      loadQuestion(nextIdx);
    }
  };

  const difficultyText =
    difficulty === 'easy'
      ? 'Easy • 30 Words'
      : difficulty === 'medium'
      ? 'Medium • 30 Words'
      : 'Hard • 30 Words';

  if (!currentItem) return null;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto px-3 sm:px-4 py-2 sm:py-3 w-full animate-fadeIn select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 font-bold rounded-xl shadow hover:bg-gray-50 border border-gray-200 transition active:scale-95 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-4 h-4 text-indigo-600" />
          <span>Menu</span>
        </button>

        <div className="bg-white px-3.5 py-1.5 rounded-xl shadow border border-gray-100 flex items-center gap-2.5">
          <span className="text-[11px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
            Set #{setNumber}
          </span>
          <span className="text-xs font-semibold text-gray-500">
            Word: <strong className="text-indigo-600 font-black text-sm">{currentIndex + 1} / {totalQuestions}</strong>
          </span>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('choice')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === 'choice' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-500'
            }`}
          >
            Pick
          </button>
          <button
            onClick={() => setMode('spell')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              mode === 'spell' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-500'
            }`}
          >
            Spell
          </button>
        </div>
      </div>

      {/* Multiplayer Team Scoreboard & Level Display */}
      <TeamScoreboard
        playerCount={playerCount}
        activeTeam={activeTeam}
        scores={teamScores}
        difficultyLabel={difficultyText}
        turnMessage="Answer this vocabulary question!"
        onChangeSettings={onChangeSettings}
      />

      {/* Main Question Card */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-indigo-100 flex flex-col items-center text-center relative overflow-hidden">
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
          {currentItem.topic}
        </span>

        <div className="text-5xl sm:text-7xl mb-1.5 drop-shadow-md select-none transform hover:scale-105 transition duration-300">
          {currentItem.emoji}
        </div>

        <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2 bg-indigo-50/80 px-3.5 py-1 rounded-full">
          💡 {currentItem.hint}
        </p>

        {/* Sound / Speak button */}
        <button
          onClick={() => {
            sounds.playPop();
            sounds.speakWord(currentItem.word.toLowerCase());
          }}
          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded-xl mb-3 text-xs transition active:scale-95 cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Listen in English</span>
        </button>

        {/* Mode 1: Multiple Choice */}
        {mode === 'choice' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full">
            {options.map((opt) => {
              const isChosen = selectedAnswer === opt;
              const isAnswerCorrect = isChosen && isCorrect === true;
              const isAnswerWrong = isChosen && isCorrect === false;

              return (
                <button
                  key={opt}
                  onClick={() => handleChooseAnswer(opt)}
                  disabled={selectedAnswer !== null}
                  className={`py-3 px-3 rounded-2xl text-base sm:text-lg font-black tracking-wider transition-all transform active:scale-95 shadow-md cursor-pointer ${
                    isAnswerCorrect
                      ? 'bg-emerald-500 text-white scale-105 shadow-emerald-200'
                      : isAnswerWrong
                      ? 'bg-rose-500 text-white animate-shake'
                      : 'bg-gradient-to-b from-indigo-50 to-white hover:from-indigo-100 text-indigo-900 border-2 border-indigo-200 hover:border-indigo-400'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Mode 2: Spelling Mode */}
        {mode === 'spell' && (
          <div className="w-full flex flex-col items-center">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-3">
              {currentItem.word.split('').map((_, idx) => {
                const char = spelledLetters[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => char && handleRemoveLetter(idx)}
                    className={`w-9 h-11 sm:w-11 sm:h-13 rounded-xl border-2 sm:border-3 flex items-center justify-center text-lg sm:text-xl font-black shadow-inner transition ${
                      char
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
                        : 'bg-gray-100 border-dashed border-gray-300 text-transparent'
                    }`}
                  >
                    {char || '_'}
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] font-semibold text-gray-400 mb-2">Tap letter tiles to spell the word:</p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-md">
              {availableLetterTiles.map((tile) => (
                <button
                  key={tile.id}
                  onClick={() => !tile.used && handleTileClick(tile.id, tile.char)}
                  disabled={tile.used}
                  className={`w-9 h-10 sm:w-10 sm:h-11 rounded-xl font-black text-base sm:text-lg flex items-center justify-center shadow-md transition transform active:scale-90 ${
                    tile.used
                      ? 'opacity-25 bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-b-4 border-amber-600 hover:scale-105 cursor-pointer'
                  }`}
                >
                  {tile.char}
                </button>
              ))}
            </div>
          </div>
        )}

        {isCorrect === true && (
          <div className="mt-3 flex items-center gap-1.5 text-emerald-600 font-black text-sm sm:text-base animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>Great Job! Correct! ⭐</span>
          </div>
        )}
      </div>

      {/* Won Modal: Solo or Team Podium */}
      {roundCompleted && playerCount > 1 && (
        <TeamVictoryModal
          playerCount={playerCount}
          scores={teamScores}
          totalStarsEarned={score + (difficulty === 'hard' ? 6 : 4)}
          playAgainLabel="Next Word Set ➔"
          onPlayAgain={() => dealFreshSet(false)}
          onBackToMenu={onBack}
        />
      )}

      {roundCompleted && playerCount === 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
            <div className="text-5xl mb-2">🌟</div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
              Set #{setNumber} Complete!
            </h2>
            <p className="text-sm text-gray-600 font-medium mb-4">
              You scored <strong className="text-indigo-600 font-black">{score} out of {totalQuestions}</strong> correct!
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-2 rounded-full font-bold mb-5">
              <span>⭐ Reward:</span>
              <span className="text-xl text-amber-600 font-black">
                +{score + (difficulty === 'hard' ? 6 : 4)} Stars!
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
