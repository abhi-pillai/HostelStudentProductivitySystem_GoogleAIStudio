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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121815]/70 backdrop-blur-xs">
      <div className="bg-[#fcfbfa] dark:bg-[#18221d] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e4e1d6] dark:border-[#28362e]">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2d5641]/10 text-[#2d5641] dark:bg-[#7fc09d]/15 dark:text-[#7fc09d] flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Install as Mobile App
              </h3>
              <p className="text-xs text-[#526357] dark:text-[#9bb0a2]">
                Run fullscreen on your phone without browser URL bars
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#798b7f] dark:text-[#6e8275] hover:text-[#1b2620] dark:hover:text-[#edf0ec] p-1.5 rounded-lg hover:bg-[#edeae0] dark:hover:bg-[#223128] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits list */}
        <div className="my-4 space-y-2 text-xs text-[#344339] dark:text-[#d3ded7]">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <CheckCircle className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d] shrink-0 mt-0.5" />
            <span><strong>Zero Browser Distractions:</strong> Hides navigation bars, tabs, and notifications so you stay locked into your study routine.</span>
          </div>
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <CheckCircle className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d] shrink-0 mt-0.5" />
            <span><strong>Offline Reliability:</strong> Cached service worker ensures all your checklists, timers, and aptitude tests load instantly even in hostel rooms with spotty Wi-Fi.</span>
          </div>
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <CheckCircle className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d] shrink-0 mt-0.5" />
            <span><strong>Active Fullscreen Focus Mode:</strong> Locks screen wakefulness during deep work timer sprints.</span>
          </div>
        </div>

        {/* Installation Actions */}
        {isInstallable ? (
          <button
            type="button"
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full py-3 px-4 bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] dark:hover:bg-[#90d2af] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{installing ? 'Opening Install Dialog...' : 'Install App Now (1-Click)'}</span>
          </button>
        ) : isIOS ? (
          <div className="p-4 rounded-xl bg-[#deb16d]/15 dark:bg-[#deb16d]/10 border border-[#deb16d]/30 text-xs text-[#9c691c] dark:text-[#f2d08a] space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <Share className="w-4 h-4 text-[#deb16d]" />
              How to Install on iPhone / iPad (Safari):
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pl-1 text-[#344339] dark:text-[#d3ded7]">
              <li>Tap the <strong>Share</strong> button at the bottom of Safari toolbar.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> at top right. Launch from your home screen icon!</li>
            </ol>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] text-xs text-[#344339] dark:text-[#d3ded7] space-y-2">
            <p className="font-bold text-[#1b2620] dark:text-[#edf0ec]">
              How to Install on Android / Chrome:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed pl-1 text-[#526357] dark:text-[#9bb0a2]">
              <li>Open this page in Chrome or your mobile browser.</li>
              <li>Tap the three dots <strong>⋮ menu</strong> at the top right.</li>
              <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
              <li>Open the app directly from your home screen!</li>
            </ol>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#e5e1d7] dark:border-[#28382e] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] cursor-pointer"
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
        className="bg-[#2d5641] dark:bg-[#1a3828] text-white px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs transition-colors"
      >
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 text-[#7fc09d]" />
          <span className="font-medium">
            <strong>Run as Mobile App:</strong> Install on your phone to run fullscreen without browser tabs & stay focused.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {isInstallable ? (
            <button
              type="button"
              onClick={install}
              className="px-2.5 py-1 rounded bg-[#fcfbfa] text-[#1b2620] font-bold hover:bg-[#edeae0] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-2.5 py-1 rounded bg-[#fcfbfa] text-[#1b2620] font-bold hover:bg-[#edeae0] transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
            >
              How to Install <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-[#9cb0a2] hover:text-white transition-colors cursor-pointer"
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
