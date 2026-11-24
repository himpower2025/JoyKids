import React from 'react';
import { GameInfo } from '../types';
import { sounds } from '../utils/sound';
import { Play } from 'lucide-react';

interface Props {
  game: GameInfo;
  onSelect: () => void;
}

export const GameCard: React.FC<Props> = ({ game, onSelect }) => {
  return (
    <div
      onClick={() => {
        sounds.playPop();
        onSelect();
      }}
      className="group relative bg-white rounded-3xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border-2 border-gray-100 hover:border-indigo-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Decorative background glow circle */}
      <div
        className={`absolute -right-8 -top-8 w-28 h-28 rounded-full ${game.color} opacity-10 group-hover:scale-150 transition-transform duration-500`}
      />

      <div>
        {/* Top Tag & Big Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-center text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-xs">
            {game.icon}
          </div>
          <span className="px-3 py-1 bg-gray-100 group-hover:bg-indigo-100 text-gray-600 group-hover:text-indigo-700 text-xs font-black rounded-full uppercase tracking-wider transition">
            {game.tag}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition">
          {game.title}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-gray-500 line-clamp-2">
          {game.subtitle}
        </p>
      </div>

      {/* Bottom Button */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:underline">
          Tap to Play
        </span>
        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-indigo-700 transition">
          <Play className="w-4 h-4 fill-current ml-0.5" />
        </div>
      </div>
    </div>
  );
};
