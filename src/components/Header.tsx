import React, { useState } from 'react';
import { sounds } from '../utils/sound';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Volume2, VolumeX, Maximize2, Minimize2, Download, BookOpen, HelpCircle, WifiOff } from 'lucide-react';

interface Props {
  stars: number;
  unlockedStickersCount: number;
  totalStickersCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStickerAlbum: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<Props> = ({
  stars,
  unlockedStickersCount,
  totalStickersCount,
  soundEnabled,
  onToggleSound,
  onOpenStickerAlbum,
  onOpenHelp,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-xs px-3 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Offline Badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-md shadow-indigo-200">
            ☀️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-black text-gray-900 tracking-tight">
                JoyKids <span className="text-indigo-600">Nepal</span>
              </h1>
              {/* 100% Offline Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                <WifiOff className="w-3 h-3" />
                <span>Offline Ready</span>
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-500 hidden sm:block">
              Sunday School Play &amp; Learn • No Internet Needed
            </p>
          </div>
        </div>

        {/* Right side controls: Stars, Stickers, Sound, Fullscreen, Install */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Star Wallet */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl shadow-xs">
            <span className="text-lg animate-wiggle">⭐</span>
            <span className="text-sm sm:text-base font-black text-amber-700">{stars}</span>
          </div>

          {/* Sticker Book Shortcut */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenStickerAlbum();
            }}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 px-2.5 sm:px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="hidden md:inline">Stickers</span>
            <span className="bg-indigo-600 text-white px-1.5 py-0.2 rounded-full text-[10px]">
              {unlockedStickersCount}/{totalStickersCount}
            </span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Sounds' : 'Turn On Sounds'}
            className="p-2 sm:p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition active:scale-90 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 sm:p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition active:scale-90 cursor-pointer hidden sm:flex"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-gray-600" />
            ) : (
              <Maximize2 className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={() => {
                sounds.playPop();
                install();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {isIOS && !isInstalled && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl border border-gray-300 text-xs font-bold text-gray-700"
            >
              iOS Install
            </button>
          )}

          {/* Help Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenHelp();
            }}
            title="Offline Help"
            className="p-2 sm:p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition active:scale-90 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
          </button>
        </div>
      </div>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-indigo-200">
            <h3 className="text-lg font-black text-gray-900">Install on iPad / iPhone</h3>
            <p className="mt-2 text-sm text-gray-600">
              1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-2xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
