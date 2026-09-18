import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle, ArrowRight } from 'lucide-react';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, install } = usePWAInstall();
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      const outcome = await install();
      if (outcome) {
        onClose();
      }
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Install as Mobile App
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Run fullscreen on your phone without browser URL bars
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits list */}
        <div className="my-4 space-y-2 text-xs text-stone-700 dark:text-stone-300">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Zero Browser Distractions:</strong> Hides navigation bars, tabs, and notifications so you stay locked into your study routine.</span>
          </div>
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Offline Reliability:</strong> Cached service worker ensures all your checklists, timers, and aptitude tests load instantly even in hostel rooms with spotty Wi-Fi.</span>
          </div>
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Active Fullscreen Focus Mode:</strong> Locks screen wakefulness during deep work timer sprints.</span>
          </div>
        </div>

        {/* Installation Actions */}
        {isInstallable ? (
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{installing ? 'Opening Install Dialog...' : 'Install App Now (1-Click)'}</span>
          </button>
        ) : isIOS ? (
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-950 dark:text-amber-200 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <Share className="w-4 h-4 text-amber-600" />
              How to Install on iPhone / iPad (Safari):
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pl-1 text-stone-700 dark:text-stone-300">
              <li>Tap the <strong>Share</strong> button at the bottom of Safari toolbar.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> at top right. Launch from your home screen icon!</li>
            </ol>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 space-y-2">
            <p className="font-bold text-stone-900 dark:text-stone-100">
              How to Install on Android / Chrome:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pl-1">
              <li>Open this page in Chrome or your mobile browser.</li>
              <li>Tap the three dots <strong>⋮ menu</strong> at the top right.</li>
              <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
              <li>Open the app directly from your home screen!</li>
            </ol>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already running standalone as native app or user dismissed banner
  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      <aside 
        aria-label="Install mobile application"
        className="bg-amber-600 dark:bg-amber-700 text-white px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs transition-colors"
      >
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 text-amber-200" />
          <span className="font-medium">
            <strong>Run as Mobile App:</strong> Install on your phone to run fullscreen without browser tabs & stay focused.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {isInstallable ? (
            <button
              type="button"
              onClick={install}
              className="px-2.5 py-1 rounded bg-white text-amber-950 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 text-[11px]"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-2.5 py-1 rounded bg-white text-amber-950 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 text-[11px]"
            >
              How to Install <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-200 hover:text-white transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
