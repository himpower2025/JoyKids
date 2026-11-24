import React from 'react';
import { TEAMS_DATA } from '../types';
import { Users, Settings } from 'lucide-react';

interface Props {
  playerCount: number;
  activeTeam: number;
  scores: Record<number, number>;
  difficultyLabel?: string;
  turnMessage?: string;
  onChangeSettings?: () => void;
}

export const TeamScoreboard: React.FC<Props> = ({
  playerCount,
  activeTeam,
  scores,
  difficultyLabel,
  turnMessage,
  onChangeSettings,
}) => {
  if (playerCount <= 1) {
    if (!difficultyLabel && !onChangeSettings) return null;
    return (
      <div className="flex items-center justify-between w-full max-w-2xl px-2 mb-3">
        {difficultyLabel && (
          <span className="text-xs font-bold text-gray-500 bg-white/80 border border-gray-200 px-3 py-1 rounded-xl shadow-xs">
            Level: <strong className="text-indigo-600 uppercase">{difficultyLabel}</strong>
          </span>
        )}
        {onChangeSettings && (
          <button
            onClick={onChangeSettings}
            className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-indigo-600 bg-white/80 border border-gray-200 px-2.5 py-1 rounded-xl transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        )}
      </div>
    );
  }

  const currentTeam = TEAMS_DATA[activeTeam] || TEAMS_DATA[1];

  return (
    <div className="w-full max-w-2xl mb-4 flex flex-col gap-2">
      {/* Active Turn Alert Banner */}
      <div
        className={`w-full py-2 px-4 rounded-2xl border-2 flex items-center justify-between shadow-sm transition-all duration-300 ${currentTeam.bgClass} ${currentTeam.borderClass}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce">{currentTeam.emoji}</span>
          <div>
            <span className={`text-sm font-black ${currentTeam.colorClass}`}>
              {currentTeam.name}'s Turn!
            </span>
            {turnMessage && (
              <span className="text-xs text-gray-500 font-semibold ml-2 hidden sm:inline">
                ({turnMessage})
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {difficultyLabel && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2 py-0.5 rounded-lg text-gray-600 border border-gray-200">
              {difficultyLabel}
            </span>
          )}
          {onChangeSettings && (
            <button
              onClick={onChangeSettings}
              className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-gray-700 transition"
              title="Change team/difficulty"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Team Score Cards */}
      <div
        className={`grid gap-2 w-full ${
          playerCount === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}
      >
        {Array.from({ length: playerCount }).map((_, idx) => {
          const teamId = idx + 1;
          const team = TEAMS_DATA[teamId];
          const isTurn = activeTeam === teamId;
          const score = scores[teamId] || 0;

          return (
            <div
              key={teamId}
              className={`p-2.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                isTurn
                  ? `${team.bgClass} ${team.borderClass} ring-2 ring-indigo-400 shadow-md scale-102`
                  : 'bg-white/70 border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-lg">{team.emoji}</span>
                <span className={`text-xs font-black truncate ${team.colorClass}`}>
                  {team.name}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-gray-900">{score}</span>
                <span className="text-[10px] font-bold text-gray-400">pts</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
