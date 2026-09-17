import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  RotateCcw,
  Sparkles,
  Cloud,
  CloudCheck,
  Loader2,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { formatDateDisplay, getTodayDateString } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  streak: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onResetDay: () => void;
  onPrefillSample: () => void;
  onOpenAuth: () => void;
  syncState: 'idle' | 'syncing' | 'synced' | 'error';
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  streak,
  onOpenRules,
  onOpenHistory,
  onResetDay,
  onPrefillSample,
  onOpenAuth,
  syncState,
}) => {
  const { currentUser, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isToday = currentDate === getTodayDateString();

  const handlePrevDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const newStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onDateChange(newStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = currentDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const newStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onDateChange(newStr);
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs" id="main-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand & Framework Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold tracking-wider text-base shadow-sm shrink-0">
            HL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-tight">
                H.O.S.T.E.L.
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Execution Loop
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              High Output Student Time Execution Loop
            </p>
          </div>
        </div>

        {/* Date Selector, Cloud Status & Streak */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Streak Badge */}
          <div 
            id="streak-badge"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-2xs"
            title={`Current execution streak: ${streak.currentStreak} days (Best: ${streak.bestStreak})`}
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>{streak.currentStreak}d Streak</span>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 text-xs font-medium">
            <button
              id="prev-date-btn"
              onClick={handlePrevDay}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-md transition-colors"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 py-1 text-stone-800">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-semibold text-xs">{formatDateDisplay(currentDate)}</span>
              {isToday && (
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded">
                  Today
                </span>
              )}
            </div>
            <button
              id="next-date-btn"
              onClick={handleNextDay}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-md transition-colors"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cloud Sync Status Indicator */}
          {currentUser && (
            <div
              id="cloud-sync-status"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border border-stone-200 bg-stone-50 text-stone-600"
              title={
                syncState === 'syncing'
                  ? 'Syncing with Firestore...'
                  : syncState === 'synced'
                  ? 'All changes saved to Firestore'
                  : 'Connected to Firestore'
              }
            >
              {syncState === 'syncing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span className="hidden md:inline text-amber-700">Syncing</span>
                </>
              ) : syncState === 'synced' ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline text-emerald-700 font-semibold">Synced</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 text-stone-500" />
                  <span className="hidden md:inline">Cloud</span>
                </>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              id="btn-rules-modal"
              onClick={onOpenRules}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1"
              title="Philosophy & Principles"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden lg:inline">Philosophy</span>
            </button>

            <button
              id="btn-history-modal"
              onClick={onOpenHistory}
              className="px-2 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Stats
            </button>

            <button
              id="btn-sample-fill"
              onClick={onPrefillSample}
              className="px-2 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors flex items-center gap-1"
              title="Fill example 6/6 day to test"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Example</span>
            </button>

            <button
              id="btn-reset-day"
              onClick={onResetDay}
              className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Reset day's progress"
              aria-label="Reset Progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Authentication Button / User Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  id="user-profile-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg border border-amber-300 bg-amber-50/60 hover:bg-amber-100/60 transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-amber-400"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : currentUser.email
                        ? currentUser.email.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-amber-900 max-w-[80px] truncate hidden sm:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-50 animate-in fade-in"
                    id="user-dropdown-menu"
                  >
                    <div className="p-2 border-b border-stone-100 mb-1">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {currentUser.displayName || 'Hostel Student'}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-700 font-semibold">
                        <CloudCheck className="w-3 h-3" />
                        <span>Firestore Database Active</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                id="btn-login-cloud"
                onClick={onOpenAuth}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
