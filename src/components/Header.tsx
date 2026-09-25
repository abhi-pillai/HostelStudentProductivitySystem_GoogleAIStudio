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
  Sun,
  Moon,
  Smartphone,
  Zap,
  Award,
  User,
  Terminal,
  FileText,
} from 'lucide-react';
import { formatDateDisplay, getTodayDateString } from '../utils/storage';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  streak: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onResetDay: () => void;
  onPrefillSample: () => void;
  onOpenAuth: () => void;
  onOpenInstall: () => void;
  onOpenFocusMode: () => void;
  onOpenProfile: () => void;
  onOpenReport?: () => void;
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
  onOpenInstall,
  onOpenFocusMode,
  onOpenProfile,
  onOpenReport,
  syncState,
}) => {
  const { currentUser, isDevBypass, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isInstalled } = usePWAInstall();
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
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-30 shadow-xs transition-colors" id="main-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Brand & Framework Name */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-bold tracking-wider text-xs shadow-2xs shrink-0">
              HL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight">
                  H.O.S.T.E.L.
                </h1>
                <span className="text-stone-300 dark:text-stone-650 text-xs">/</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Daily Execution Loop
                </span>
                {isInstalled && (
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 font-mono hidden md:inline">
                    · App
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">
                High Output Student Time Execution Loop
              </p>
            </div>
          </div>

          {/* Quick Active Focus Mode Trigger for Mobile header */}
          <button
            type="button"
            onClick={onOpenFocusMode}
            className="sm:hidden px-2.5 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium rounded-lg text-xs flex items-center gap-1 shadow-2xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Focus Mode</span>
          </button>
        </div>

        {/* Date Selector, Cloud Status, Theme Toggle & Streak */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Active Focus Mode Button (Desktop / Tablet) */}
          <button
            type="button"
            id="btn-active-focus"
            onClick={onOpenFocusMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-xs font-medium shadow-2xs transition-colors"
            title="Launch Fullscreen Focus Lock Screen with Screen Awake & Tab Tracking"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Focus Mode</span>
          </button>

          {/* Install App Button if not installed yet */}
          {!isInstalled && (
            <button
              type="button"
              id="btn-install-app-header"
              onClick={onOpenInstall}
              className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-750 bg-stone-50/80 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-medium flex items-center gap-1 transition-colors"
              title="Install on your phone or desktop"
            >
              <Smartphone className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Install</span>
            </button>
          )}

          {/* Streak Badge */}
          <button
            type="button"
            id="streak-badge"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            title={`Current execution streak: ${streak.currentStreak} days (Best: ${streak.bestStreak}). Click to view Profile & Badges`}
          >
            <Flame className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            <span>{streak.currentStreak}d streak</span>
          </button>

          {/* Date Navigator */}
          <div className="flex items-center bg-white dark:bg-stone-850 rounded-lg p-0.5 border border-stone-200 dark:border-stone-750 text-xs font-medium">
            <button
              id="prev-date-btn"
              onClick={handlePrevDay}
              className="p-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-750 rounded-md transition-colors"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 px-2 py-0.5 text-stone-800 dark:text-stone-200">
              <Calendar className="w-3 h-3 text-stone-500 dark:text-stone-400" />
              <span className="font-semibold text-xs">{formatDateDisplay(currentDate)}</span>
              {isToday && (
                <span className="text-[10px] uppercase font-medium text-stone-500 dark:text-stone-400">
                  · Today
                </span>
              )}
            </div>
            <button
              id="next-date-btn"
              onClick={handleNextDay}
              className="p-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-750 rounded-md transition-colors"
              aria-label="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cloud Sync Status Indicator */}
          {currentUser && (
            <div
              id="cloud-sync-status"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-850 text-stone-600 dark:text-stone-300"
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
                  <Loader2 className="w-3 h-3 animate-spin text-stone-600 dark:text-stone-400" />
                  <span className="hidden md:inline text-stone-700 dark:text-stone-300">Syncing</span>
                </>
              ) : syncState === 'synced' ? (
                <>
                  <CloudCheck className="w-3 h-3 text-stone-700 dark:text-stone-300" />
                  <span className="hidden md:inline font-medium">Synced</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-stone-500 dark:text-stone-400" />
                  <span className="hidden md:inline">Cloud</span>
                </>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            {/* Dark Mode Toggle */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-750"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-stone-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-stone-600" />
              )}
            </button>

            <button
              id="btn-rules-modal"
              onClick={onOpenRules}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200 dark:border-stone-750"
              title="Philosophy & Principles"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span className="hidden lg:inline">Philosophy</span>
            </button>

            <button
              id="btn-history-modal"
              onClick={onOpenHistory}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors border border-stone-200 dark:border-stone-750"
            >
              Stats
            </button>

            {onOpenReport && (
              <button
                type="button"
                id="btn-header-report"
                onClick={onOpenReport}
                className="px-2.5 py-1.5 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 border border-stone-250 dark:border-stone-700 rounded-lg transition-colors flex items-center gap-1.5"
                title="Detailed Report Analysis & Ways to Improve (Downloadable PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span className="hidden sm:inline">Report & PDF</span>
                <span className="sm:hidden">Report</span>
              </button>
            )}

            <button
              type="button"
              id="btn-badges-header"
              onClick={onOpenProfile}
              className="px-2 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 rounded-lg transition-colors flex items-center gap-1"
              title="View Streak Milestones & Badges in Profile"
            >
              <Award className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span>Badges</span>
            </button>

            <button
              id="btn-sample-fill"
              onClick={onPrefillSample}
              className="px-2 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-750 rounded-lg transition-colors flex items-center gap-1"
              title="Fill example 6/6 day to test"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span className="hidden sm:inline">Example</span>
            </button>

            <button
              id="btn-reset-day"
              onClick={onResetDay}
              className="p-1.5 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
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
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg border border-stone-200 dark:border-stone-750 bg-white dark:bg-stone-850 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-stone-300 dark:border-stone-600"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center text-[10px] font-bold">
                      {currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : currentUser.email
                        ? currentUser.email.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-800 dark:text-stone-200 max-w-[80px] truncate hidden sm:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg p-2 z-50 animate-in fade-in"
                    id="user-dropdown-menu"
                  >
                    <div className="p-2 border-b border-stone-100 dark:border-stone-750 mb-1">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                        {currentUser.displayName || 'Hostel Student'}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {currentUser.email}
                      </p>
                      {isDevBypass ? (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-600 dark:text-stone-400 font-mono">
                          <Terminal className="w-3 h-3" />
                          <span>Dev / Tester Bypass Mode</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                          <CloudCheck className="w-3 h-3 text-stone-700 dark:text-stone-300" />
                          <span>Firestore Synced</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenProfile();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 flex items-center gap-2 transition-colors mb-0.5"
                    >
                      <Award className="w-3.5 h-3.5 text-stone-500" />
                      <span>Profile & Badges</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-750 flex items-center gap-2 transition-colors"
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
                className="px-2.5 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
