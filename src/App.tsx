import React, { useState, useEffect } from 'react';
import { GameId, GameInfo, GameSettings } from './types';
import { sounds } from './utils/sound';
import {
  loadPlayerStats,
  savePlayerStats,
  loadSoundPreference,
  saveSoundPreference,
  ALL_STICKERS,
} from './utils/storage';
import { Header } from './components/Header';
import { GameCard } from './components/GameCard';
import { GameSetupModal } from './components/GameSetupModal';
import { StickerAlbumModal } from './components/StickerAlbumModal';
import { OfflineHelpModal } from './components/OfflineHelpModal';

// Games
import { MemoryMatchGame } from './games/MemoryMatchGame';
import { WordQuizGame } from './games/WordQuizGame';
import { StarCatcherGame } from './games/StarCatcherGame';
import { ColoringBookGame } from './games/ColoringBookGame';
import { MazeGame } from './games/MazeGame';
import { SpotDifferenceGame } from './games/SpotDifferenceGame';
import { WordJumbleGame } from './games/WordJumbleGame';
import { HiddenObjectsGame } from './games/HiddenObjectsGame';

import { Sparkles, Trophy, BookOpen, Star, Heart, Users, Award } from 'lucide-react';

const GAMES_LIST: GameInfo[] = [
  {
    id: 'memory',
    title: 'Memory Match',
    subtitle: 'Find matching animal & Sunday School cards!',
    icon: '🃏',
    color: 'bg-indigo-500',
    tag: 'Memory',
  },
  {
    id: 'word-quiz',
    title: 'Emoji Word Quiz',
    subtitle: 'Read simple English words and spell them!',
    icon: '🔤',
    color: 'bg-emerald-500',
    tag: 'Vocabulary',
  },
  {
    id: 'star-catcher',
    title: 'Star Catcher',
    subtitle: 'Catch falling stars and sweet fruit in your basket!',
    icon: '⭐',
    color: 'bg-amber-500',
    tag: 'Action',
  },
  {
    id: 'coloring',
    title: 'Color & Draw',
    subtitle: "Color Noah's Ark, the sheep, and paint pictures!",
    icon: '🎨',
    color: 'bg-rose-500',
    tag: 'Creative',
  },
  {
    id: 'maze',
    title: 'Maze Escape',
    subtitle: 'Guide the little lost sheep back safely to church!',
    icon: '🐑',
    color: 'bg-teal-500',
    tag: 'Adventure',
  },
  {
    id: 'spot-difference',
    title: 'Spot the Difference',
    subtitle: 'Compare two pictures side-by-side to find 5 subtle differences!',
    icon: '🔍',
    color: 'bg-cyan-500',
    tag: 'Observation',
  },
  {
    id: 'word-jumble',
    title: 'Word Jumble',
    subtitle: 'Unscramble tiles for LOVE, JOY, PEACE, and HOPE!',
    icon: '🔠',
    color: 'bg-purple-500',
    tag: 'Spelling',
  },
  {
    id: 'hidden-objects',
    title: 'Hidden Objects',
    subtitle: 'Search the scene to find 5 hidden tools like spoons & keys!',
    icon: '🕵️',
    color: 'bg-pink-500',
    tag: 'Discovery',
  },
];

const DEFAULT_SETTINGS: GameSettings = {
  difficulty: 'easy',
  playerCount: 1,
};

export default function App() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [setupGame, setSetupGame] = useState<GameInfo | null>(null);
  const [gameSettings, setGameSettings] = useState<Record<string, GameSettings>>({});

  const [playerStats, setPlayerStats] = useState(loadPlayerStats);
  const [soundEnabled, setSoundEnabled] = useState(loadSoundPreference);
  const [showStickerAlbum, setShowStickerAlbum] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [rewardToast, setRewardToast] = useState<{ message: string; stars: number } | null>(null);

  // Sync sound controller
  useEffect(() => {
    sounds.enabled = soundEnabled;
    saveSoundPreference(soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleOpenGameSetup = (game: GameInfo) => {
    sounds.playPop();
    setSetupGame(game);
  };

  const handleStartGameWithSettings = (settings: GameSettings) => {
    if (!setupGame) return;
    setGameSettings((prev) => ({
      ...prev,
      [setupGame.id]: settings,
    }));
    setActiveGame(setupGame.id);
    setSetupGame(null);
  };

  const handleEarnStars = (count: number) => {
    setPlayerStats((prev) => {
      const updated = {
        ...prev,
        stars: prev.stars + count,
        gamesPlayed: prev.gamesPlayed + 1,
      };
      savePlayerStats(updated);
      return updated;
    });

    setRewardToast({
      message: 'Great Playing!',
      stars: count,
    });

    setTimeout(() => {
      setRewardToast(null);
    }, 2800);
  };

  const handleUnlockSticker = (stickerId: string, cost: number) => {
    setPlayerStats((prev) => {
      const updated = {
        ...prev,
        stars: prev.stars - cost,
        unlockedStickers: [...prev.unlockedStickers, stickerId],
      };
      savePlayerStats(updated);
      return updated;
    });
  };

  const nextStickerToUnlock = ALL_STICKERS.find(
    (s) => !playerStats.unlockedStickers.includes(s.id)
  );

  const activeGameInfo = GAMES_LIST.find((g) => g.id === activeGame);
  const currentSettings = (activeGame && gameSettings[activeGame]) || DEFAULT_SETTINGS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-indigo-50/40 to-amber-50/40 text-gray-800 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        stars={playerStats.stars}
        unlockedStickersCount={playerStats.unlockedStickers.length}
        totalStickersCount={ALL_STICKERS.length}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onOpenStickerAlbum={() => setShowStickerAlbum(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Floating Reward Toast */}
      {rewardToast && (
        <div className="fixed top-20 right-6 z-50 bg-amber-400 text-amber-950 px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-300 font-black flex items-center gap-2 animate-bounce">
          <Star className="w-5 h-5 fill-current text-amber-900" />
          <span>{rewardToast.message}</span>
          <span className="text-xl">+{rewardToast.stars} ⭐</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col">
        {activeGame ? (
          <div className="flex-1 flex flex-col justify-center">
            {activeGame === 'memory' && (
              <MemoryMatchGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'word-quiz' && (
              <WordQuizGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'star-catcher' && (
              <StarCatcherGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'coloring' && (
              <ColoringBookGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'maze' && (
              <MazeGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'spot-difference' && (
              <SpotDifferenceGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'word-jumble' && (
              <WordJumbleGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
            {activeGame === 'hidden-objects' && (
              <HiddenObjectsGame
                settings={currentSettings}
                onBack={() => setActiveGame(null)}
                onEarnStars={handleEarnStars}
                onChangeSettings={() => setSetupGame(activeGameInfo || null)}
              />
            )}
          </div>
        ) : (
          /* Main Menu / Games Hub */
          <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 w-full animate-fadeIn">
            {/* Friendly Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 text-amber-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sunday School Play &amp; Learn</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
                  Welcome to Sunday School! ✨
                </h2>
                <p className="text-sm sm:text-base text-indigo-100 font-medium mb-5">
                  Play 8 educational mini-games, choose your age difficulty, play solo or with 2-3 teams, and collect awesome Sunday School stickers!
                </p>

                {/* Progress banner & Team pills */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      setShowStickerAlbum(true);
                    }}
                    className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-amber-950 font-black px-4 py-2.5 rounded-2xl shadow-lg transition active:scale-95 cursor-pointer text-xs sm:text-sm"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Sticker Album</span>
                  </button>

                  <div className="flex items-center gap-2 bg-black/25 backdrop-blur-xs px-3.5 py-2 rounded-2xl text-xs font-bold text-white">
                    <Users className="w-4 h-4 text-amber-300" />
                    <span>Solo or 2-3 Teams Available</span>
                  </div>

                  {nextStickerToUnlock && (
                    <div className="bg-black/20 backdrop-blur-xs px-3.5 py-2 rounded-2xl text-xs font-bold text-white flex items-center gap-2 hidden sm:flex">
                      <span>Next:</span>
                      <span className="text-lg">{nextStickerToUnlock.emoji}</span>
                      <span>{nextStickerToUnlock.name} (⭐ {nextStickerToUnlock.cost})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Background decorative illustrations */}
              <div className="absolute right-4 bottom-[-10px] sm:bottom-0 text-7xl sm:text-9xl opacity-25 select-none pointer-events-none animate-pulse">
                🌈
              </div>
            </div>

            {/* Quick Level Guide Bar */}
            <div className="mb-6 p-3.5 bg-white/80 backdrop-blur rounded-2xl border border-indigo-100 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-gray-700">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Choose Difficulty for Any Game:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                  🟢 Easy: Preschool – Gr.2
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800 font-bold">
                  🟡 Medium: Gr.3 – Gr.5
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-800 font-bold">
                  🔴 Hard: Gr.6+ &amp; Youth
                </span>
              </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">Choose a Game to Play</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Tap any game to choose difficulty (Easy/Medium/Hard) &amp; players (1, 2, or 3 teams)
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Earn Stars on Every Win!</span>
              </div>
            </div>

            {/* 8 Games Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {GAMES_LIST.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelect={() => handleOpenGameSetup(game)}
                />
              ))}
            </div>

            {/* Bottom Warm Info Banner */}
            <div className="mt-10 p-5 bg-white/70 rounded-3xl border border-indigo-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇳🇵</span>
                <div>
                  <h4 className="text-sm font-black text-gray-900">
                    Nepal Sunday School Children's Mini-Game Center
                  </h4>
                  <p className="text-xs text-gray-500 font-semibold">
                    Works anytime on your laptop even when Wi-Fi and mobile data are disconnected.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playPop();
                  setShowHelp(true);
                }}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded-2xl text-xs transition active:scale-95 cursor-pointer"
              >
                Learn How Offline Works ℹ️
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center text-xs text-gray-400 font-medium border-t border-indigo-50">
        <p className="flex items-center justify-center gap-1">
          <span>JoyKids Nepal</span> • <span>Self-Contained Offline Web App</span> •{' '}
          <span className="flex items-center gap-1 text-rose-500 font-semibold">
            <Heart className="w-3 h-3 fill-current" /> Grace &amp; Peace
          </span>
        </p>
      </footer>

      {/* Pre-Game Setup Modal (Difficulty & Teams) */}
      {setupGame && (
        <GameSetupModal
          game={setupGame}
          initialSettings={gameSettings[setupGame.id] || DEFAULT_SETTINGS}
          onStart={handleStartGameWithSettings}
          onClose={() => setSetupGame(null)}
        />
      )}

      {/* Modals */}
      {showStickerAlbum && (
        <StickerAlbumModal
          stars={playerStats.stars}
          unlockedStickers={playerStats.unlockedStickers}
          onUnlockSticker={handleUnlockSticker}
          onClose={() => setShowStickerAlbum(false)}
        />
      )}

      {showHelp && (
        <OfflineHelpModal onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}
