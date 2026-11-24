import React from 'react';
import { sounds } from '../utils/sound';
import { X, WifiOff, Laptop, Award, ShieldCheck, Heart } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const OfflineHelpModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-indigo-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">100% Offline Guide</h2>
              <p className="text-xs text-indigo-700 font-semibold">
                Designed for Sunday School laptops in Nepal 🇳🇵
              </p>
            </div>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-gray-700 text-sm">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-3 items-start">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-950 text-base">Zero Internet Required</h4>
              <p className="text-xs text-emerald-800 mt-1">
                All 8 mini games, sound synthesizer, and visuals run directly inside your laptop's browser. No Wi-Fi or data connection is needed during playtime!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black shrink-0">
                1
              </div>
              <div>
                <h5 className="font-bold text-gray-900">Install as Laptop App (PWA)</h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click the <strong>"Install App"</strong> button in the top bar (in Chrome or Edge) to add a desktop icon. You can launch it anytime like a native program!
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black shrink-0">
                2
              </div>
              <div>
                <h5 className="font-bold text-gray-900">Synthesized Real Sound</h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sounds are generated with the browser's built-in Web Audio engine. No large audio files to download, with instant zero-lag response.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black shrink-0">
                3
              </div>
              <div>
                <h5 className="font-bold text-gray-900">Local Stars &amp; Stickers Save</h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  Stars and unlocked stickers are saved right on this laptop. When children return next Sunday, their progress will still be here!
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black shrink-0">
                4
              </div>
              <div>
                <h5 className="font-bold text-gray-900">Small Laptop &amp; Trackpad Friendly</h5>
                <p className="text-xs text-gray-500 mt-0.5">
                  Every game includes large on-screen arrow buttons and keyboard shortcuts (Arrow keys, WASD, 1-8 keys) so kids can play easily on any laptop.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
              <span>Made with love for children in Nepal</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </p>
          </div>
        </div>

        {/* Footer button */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow transition"
          >
            Got it, Let's Play! ⭐
          </button>
        </div>
      </div>
    </div>
  );
};
