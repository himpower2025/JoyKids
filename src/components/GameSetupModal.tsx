import React, { useState } from 'react';
import { GameInfo, DifficultyLevel, PlayerMode, GameSettings, TEAMS_DATA } from '../types';
import { sounds } from '../utils/sound';
import { X, Play, Users, User, Award, Sparkles, Check } from 'lucide-react';

interface Props {
  game: GameInfo;
  initialSettings?: GameSettings;
  onStart: (settings: GameSettings) => void;
  onClose: () => void;
}

export const GameSetupModal: React.FC<Props> = ({
  game,
  initialSettings = { difficulty: 'easy', playerCount: 1 },
  onStart,
  onClose,
}) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialSettings.difficulty);
  const [playerCount, setPlayerCount] = useState<PlayerMode>(initialSettings.playerCount);

  const handleStart = () => {
    sounds.playWin();
    onStart({ difficulty, playerCount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-indigo-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-indigo-100 flex items-center justify-center text-3xl">
              {game.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">{game.title}</h2>
                <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  {game.tag}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-semibold">{game.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Section 1: Difficulty Level */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>1. Select Difficulty Level</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Easy */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setDifficulty('easy');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  difficulty === 'easy'
                    ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-300 ring-offset-1'
                    : 'bg-gray-50 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40'
                }`}
              >
                {difficulty === 'easy' && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 mb-1">
                  Easy
                </div>
                <div className="font-black text-sm text-gray-900">Junior Level</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                  Preschool – Grade 2
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  Big images, gentle pace, simple 3-4 letter words.
                </p>
              </button>

              {/* Medium */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setDifficulty('medium');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  difficulty === 'medium'
                    ? 'bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-300 ring-offset-1'
                    : 'bg-gray-50 border-gray-200 hover:border-amber-200 hover:bg-amber-50/40'
                }`}
              >
                {difficulty === 'medium' && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-100 text-amber-800 mb-1">
                  Medium
                </div>
                <div className="font-black text-sm text-gray-900">Middle Level</div>
                <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                  Grade 3 – Grade 5
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  Standard challenge, 5-6 letter words, medium mazes.
                </p>
              </button>

              {/* Hard */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setDifficulty('hard');
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  difficulty === 'hard'
                    ? 'bg-purple-50 border-purple-500 shadow-md ring-2 ring-purple-300 ring-offset-1'
                    : 'bg-gray-50 border-gray-200 hover:border-purple-200 hover:bg-purple-50/40'
                }`}
              >
                {difficulty === 'hard' && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 text-purple-800 mb-1">
                  Hard
                </div>
                <div className="font-black text-sm text-gray-900">Senior Level</div>
                <div className="text-[11px] font-bold text-purple-700 mt-0.5">
                  Grade 6+ &amp; Youth
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  Quick speed, advanced words, complex puzzles.
                </p>
              </button>
            </div>
          </div>

          {/* Section 2: Player & Team Mode */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>2. How Many Players / Teams?</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* 1 Player */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPlayerCount(1);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  playerCount === 1
                    ? 'bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/40'
                }`}
              >
                {playerCount === 1 && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                  <User className="w-5 h-5" />
                </div>
                <div className="font-black text-sm text-gray-900">1 Player (Solo)</div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Play alone and collect stars for the album!
                </p>
              </button>

              {/* 2 Teams */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPlayerCount(2);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  playerCount === 2
                    ? 'bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/40'
                }`}
              >
                {playerCount === 2 && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xl">🔴</span>
                  <span className="text-xs font-black text-gray-400">vs</span>
                  <span className="text-xl">🔵</span>
                </div>
                <div className="font-black text-sm text-gray-900">2 Teams / Players</div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Red Team vs Blue Team take turns on this laptop!
                </p>
              </button>

              {/* 3 Teams */}
              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setPlayerCount(3);
                }}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all relative cursor-pointer ${
                  playerCount === 3
                    ? 'bg-indigo-50 border-indigo-600 shadow-md ring-2 ring-indigo-300 ring-offset-1'
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/40'
                }`}
              >
                {playerCount === 3 && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xl">🔴</span>
                  <span className="text-xl">🔵</span>
                  <span className="text-xl">🟢</span>
                </div>
                <div className="font-black text-sm text-gray-900">3 Teams / Players</div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Red, Blue &amp; Green Teams battle with turns!
                </p>
              </button>
            </div>

            {/* Team preview pills when 2 or 3 teams selected */}
            {playerCount > 1 && (
              <div className="mt-3 p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-indigo-900">Teams taking turns:</span>
                {Array.from({ length: playerCount }).map((_, i) => {
                  const team = TEAMS_DATA[i + 1];
                  return (
                    <span
                      key={team.id}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 ${team.bgClass} ${team.colorClass} border ${team.borderClass}`}
                    >
                      <span>{team.emoji}</span>
                      <span>{team.name}</span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-3 rounded-2xl text-gray-600 hover:bg-gray-200 font-bold text-sm transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="flex-1 max-w-xs py-3.5 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Game 🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
