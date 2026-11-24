import React from 'react';
import { TEAMS_DATA } from '../types';
import { Trophy, Star, Users, RotateCcw, Home } from 'lucide-react';

interface Props {
  playerCount: number;
  scores: Record<number, number>;
  totalStarsEarned: number;
  playAgainLabel?: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const TeamVictoryModal: React.FC<Props> = ({
  playerCount,
  scores,
  totalStarsEarned,
  playAgainLabel = 'Play Again',
  onPlayAgain,
  onBackToMenu,
}) => {
  // Sort teams by score descending
  const teamRankings = Array.from({ length: playerCount })
    .map((_, i) => {
      const id = i + 1;
      return {
        team: TEAMS_DATA[id],
        score: scores[id] || 0,
      };
    })
    .sort((a, b) => b.score - a.score);

  const highestScore = teamRankings[0]?.score || 0;
  const isTie = teamRankings.filter((t) => t.score === highestScore).length > 1;
  const winningTeam = teamRankings[0]?.team;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-300 animate-scaleUp">
        {/* Top Trophy */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
        </div>

        {/* Winner Title */}
        {isTie ? (
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
              It's a Wonderful Tie! 🤝
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-4">
              All teams played with great courage and teamwork!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
              {winningTeam?.emoji} {winningTeam?.name} Wins! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-4">
              Congratulations on a fantastic game!
            </p>
          </div>
        )}

        {/* Team Scoreboard Podium */}
        <div className="space-y-2 mb-5">
          {teamRankings.map((item, index) => {
            const isWinner = item.score === highestScore;
            return (
              <div
                key={item.team.id}
                className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isWinner
                    ? `${item.team.bgClass} ${item.team.borderClass} shadow-md`
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base font-black w-6 text-gray-400">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                  <span className="text-xl">{item.team.emoji}</span>
                  <span className={`text-sm font-black ${item.team.colorClass}`}>
                    {item.team.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-gray-900">{item.score}</span>
                  <span className="text-xs font-bold text-gray-400">pts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combined Star Reward for Sunday School Album */}
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-5 py-2.5 rounded-2xl font-bold mb-6">
          <Star className="w-5 h-5 fill-current text-amber-500" />
          <span>Total Stars Earned:</span>
          <span className="text-xl text-amber-600 font-black">+{totalStarsEarned} Stars!</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onBackToMenu}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Menu</span>
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{playAgainLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
