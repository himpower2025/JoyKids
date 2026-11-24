import React, { useState } from 'react';
import { ALL_STICKERS } from '../utils/storage';
import { Sticker } from '../types';
import { sounds } from '../utils/sound';
import confetti from 'canvas-confetti';
import { X, Lock, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  stars: number;
  unlockedStickers: string[];
  onUnlockSticker: (stickerId: string, cost: number) => void;
  onClose: () => void;
}

export const StickerAlbumModal: React.FC<Props> = ({
  stars,
  unlockedStickers,
  onUnlockSticker,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'bible' | 'animals' | 'nature'>('all');
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  const filteredStickers = ALL_STICKERS.filter(
    (s) => activeCategory === 'all' || s.category === activeCategory
  );

  const handleUnlock = (sticker: Sticker) => {
    if (stars >= sticker.cost && !unlockedStickers.includes(sticker.id)) {
      sounds.playWin();
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {
        // ignore
      }
      onUnlockSticker(sticker.id, sticker.cost);
      setSelectedSticker(sticker);
    } else {
      sounds.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-indigo-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-indigo-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-xs">
              📖
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Sunday School Sticker Album</h2>
              <p className="text-xs text-gray-500 font-semibold">
                Earn stars by playing games to unlock stickers!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-amber-100 px-3 py-1 rounded-full text-xs font-black text-amber-900 border border-amber-300">
              ⭐ {stars} Stars
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-3 bg-gray-50 border-b border-gray-100 justify-center">
          {(['all', 'bible', 'animals', 'nature'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? '🌟 All Stickers' : cat === 'bible' ? '⛪ Sunday School' : cat === 'animals' ? '🐾 Animals' : '🌿 Nature'}
            </button>
          ))}
        </div>

        {/* Stickers Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {filteredStickers.map((sticker) => {
            const isUnlocked = unlockedStickers.includes(sticker.id);
            const canAfford = stars >= sticker.cost;

            return (
              <div
                key={sticker.id}
                onClick={() => setSelectedSticker(sticker)}
                className={`p-3.5 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer relative ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300 opacity-90'
                }`}
              >
                {/* Sticker Emoji */}
                <div className={`text-4xl sm:text-5xl my-1 filter transition-transform ${isUnlocked ? 'hover:scale-125' : 'grayscale-50 opacity-60'}`}>
                  {sticker.emoji}
                </div>

                <div className="text-xs font-black text-gray-900 mt-1 truncate max-w-full">
                  {sticker.name}
                </div>

                {isUnlocked ? (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlock(sticker);
                    }}
                    disabled={!canAfford}
                    className={`mt-2 w-full py-1 px-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 shadow-xs transition active:scale-95 ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 cursor-pointer animate-pulse'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>⭐ {sticker.cost}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Sticker Detail Popup if selected */}
        {selectedSticker && (
          <div className="p-4 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedSticker.emoji}</span>
              <div>
                <h4 className="text-sm font-black text-gray-900">{selectedSticker.name}</h4>
                <p className="text-xs text-gray-600 italic">"{selectedSticker.description}"</p>
              </div>
            </div>
            {!unlockedStickers.includes(selectedSticker.id) && (
              <button
                onClick={() => handleUnlock(selectedSticker)}
                disabled={stars < selectedSticker.cost}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-200 text-amber-950 font-black rounded-xl text-xs transition active:scale-95 shadow shrink-0"
              >
                Unlock for ⭐ {selectedSticker.cost}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
