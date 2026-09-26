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
    <header className="bg-[#fcfbfa]/90 dark:bg-[#151d18]/90 backdrop-blur-md border-b border-[#e3e0d5] dark:border-[#26352c] sticky top-0 z-30 shadow-xs transition-colors" id="main-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Brand & Framework Name */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2d5641] dark:bg-[#39634e] text-white flex items-center justify-center font-bold tracking-wider text-xs shadow-2xs shrink-0 relative">
              HL
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#e08c69] ring-2 ring-[#fcfbfa] dark:ring-[#151d18]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#1b2620] dark:text-[#edf0ec] leading-tight">
                  H.O.S.T.E.L.
                </h1>
                <span className="text-[#a4b5aa] dark:text-[#52665a] text-xs">/</span>
                <span className="text-xs text-[#526357] dark:text-[#9bb0a2] font-medium">
                  Daily Execution Loop
                </span>
                {isInstalled && (
                  <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275] font-mono hidden md:inline">
                    · App
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] font-normal">
                High Output Student Time Execution Loop
              </p>
            </div>
          </div>

          {/* Quick Active Focus Mode Trigger for Mobile header */}
          <button
            type="button"
            onClick={onOpenFocusMode}
            className="sm:hidden px-2.5 py-1.5 bg-[#2d5641] dark:bg-[#7fc09d] text-white dark:text-[#0f1d15] font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Zap className="w-3.5 h-3.5 fill-[#e88d6a] text-[#e88d6a] dark:fill-[#0f1d15] dark:text-[#0f1d15]" />
            <span>Focus</span>
          </button>
        </div>

        {/* Date Selector, Cloud Status, Theme Toggle & Streak */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Active Focus Mode Button (Desktop / Tablet) */}
          <button
            type="button"
            id="btn-active-focus"
            onClick={onOpenFocusMode}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] text-xs font-semibold shadow-2xs transition-colors"
            title="Launch Fullscreen Focus Lock Screen with Screen Awake & Tab Tracking"
          >
            <Zap className="w-3.5 h-3.5 fill-[#e88d6a] text-[#e88d6a] dark:fill-[#0f1d15] dark:text-[#0f1d15]" />
            <span>Focus Mode</span>
          </button>

          {/* Install App Button if not installed yet */}
          {!isInstalled && (
            <button
              type="button"
              id="btn-install-app-header"
              onClick={onOpenInstall}
              className="px-2.5 py-1.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#edeae0] dark:hover:bg-[#233229] text-[#344339] dark:text-[#d3ddd6] text-xs font-medium flex items-center gap-1 transition-colors"
              title="Install on your phone or desktop"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
              <span>Install</span>
            </button>
          )}

          {/* Streak Badge with warm nature terracotta flame */}
          <button
            type="button"
            id="streak-badge"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#c06541]/10 dark:bg-[#e88d6a]/15 hover:bg-[#c06541]/15 dark:hover:bg-[#e88d6a]/25 border border-[#c06541]/25 dark:border-[#e88d6a]/30 text-[#b25735] dark:text-[#f09a79] text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            title={`Current execution streak: ${streak.currentStreak} days (Best: ${streak.bestStreak}). Click to view Profile & Badges`}
          >
            <Flame className="w-3.5 h-3.5 text-[#c06541] dark:text-[#e88d6a] fill-current" />
            <span>{streak.currentStreak}d streak</span>
          </button>

          {/* Date Navigator */}
          <div className="flex items-center bg-[#f4f2ea] dark:bg-[#1c2720] rounded-lg p-0.5 border border-[#dedad0] dark:border-[#2b3a31] text-xs font-medium">
            <button
              id="prev-date-btn"
              onClick={handlePrevDay}
              className="p-1 text-[#4f6356] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] hover:bg-[#e8e4d8] dark:hover:bg-[#25352c] rounded-md transition-colors"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1.5 px-2 py-0.5 text-[#1b2620] dark:text-[#edf0ec]">
              <Calendar className="w-3 h-3 text-[#5f7467] dark:text-[#8fa395]" />
              <span className="font-semibold text-xs">{formatDateDisplay(currentDate)}</span>
              {isToday && (
                <span className="text-[10px] uppercase font-bold text-[#2d5641] dark:text-[#7fc09d]">
                  · Today
                </span>
              )}
            </div>
            <button
              id="next-date-btn"
              onClick={handleNextDay}
              className="p-1 text-[#4f6356] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] hover:bg-[#e8e4d8] dark:hover:bg-[#25352c] rounded-md transition-colors"
              aria-label="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cloud Sync Status Indicator */}
          {currentUser && (
            <div
              id="cloud-sync-status"
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium border border-[#dedad0] dark:border-[#2b3a31] bg-[#f4f2ea] dark:bg-[#1c2720] text-[#4f6356] dark:text-[#9bb0a2]"
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
                  <Loader2 className="w-3 h-3 animate-spin text-[#2d5641] dark:text-[#7fc09d]" />
                  <span className="hidden md:inline">Syncing</span>
                </>
              ) : syncState === 'synced' ? (
                <>
                  <CloudCheck className="w-3 h-3 text-[#2d5641] dark:text-[#7fc09d]" />
                  <span className="hidden md:inline font-medium">Synced</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-[#798b7f] dark:text-[#6e8275]" />
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
              className="p-1.5 text-[#4f6356] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#24342a] rounded-lg transition-colors border border-[#dedad0] dark:border-[#2b3a31]"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-[#deb16d]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#4f6356]" />
              )}
            </button>

            <button
              id="btn-rules-modal"
              onClick={onOpenRules}
              className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-[#324238] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#24342a] rounded-lg transition-colors flex items-center gap-1.5 border border-[#dedad0] dark:border-[#2b3a31]"
              title="Philosophy & Principles"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
              <span className="hidden lg:inline">Philosophy</span>
            </button>

            <button
              id="btn-history-modal"
              onClick={onOpenHistory}
              className="px-2.5 py-1.5 text-xs font-medium text-[#324238] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#24342a] rounded-lg transition-colors border border-[#dedad0] dark:border-[#2b3a31]"
            >
              Stats
            </button>

            {onOpenReport && (
              <button
                type="button"
                id="btn-header-report"
                onClick={onOpenReport}
                className="px-2.5 py-1.5 text-xs font-medium text-[#244b37] dark:text-[#88d2af] bg-[#2d5641]/10 hover:bg-[#2d5641]/15 dark:bg-[#7fc09d]/15 dark:hover:bg-[#7fc09d]/25 border border-[#2d5641]/25 dark:border-[#7fc09d]/30 rounded-lg transition-colors flex items-center gap-1.5"
                title="Detailed Report Analysis & Ways to Improve (Downloadable PDF)"
              >
                <FileText className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
                <span className="hidden sm:inline">Report & PDF</span>
                <span className="sm:hidden">Report</span>
              </button>
            )}

            <button
              type="button"
              id="btn-badges-header"
              onClick={onOpenProfile}
              className="px-2 py-1.5 text-xs font-medium text-[#324238] dark:text-[#d3ded7] bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#24342a] border border-[#dedad0] dark:border-[#2b3a31] rounded-lg transition-colors flex items-center gap-1"
              title="View Streak Milestones & Badges in Profile"
            >
              <Award className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
              <span>Badges</span>
            </button>

            <button
              id="btn-sample-fill"
              onClick={onPrefillSample}
              className="px-2 py-1.5 text-xs font-medium text-[#324238] dark:text-[#d3ded7] bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#24342a] border border-[#dedad0] dark:border-[#2b3a31] rounded-lg transition-colors flex items-center gap-1"
              title="Fill example 6/6 day to test"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
              <span className="hidden sm:inline">Example</span>
            </button>

            <button
              id="btn-reset-day"
              onClick={onResetDay}
              className="p-1.5 text-[#798b7f] dark:text-[#6e8275] hover:text-[#1b2620] dark:hover:text-[#edf0ec] hover:bg-[#eae6db] dark:hover:bg-[#24342a] rounded-lg transition-colors"
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
                  className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] bg-[#f4f2ea] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#24342a] transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-[#2d5641]/30 dark:border-[#7fc09d]/30"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] flex items-center justify-center text-[10px] font-bold">
                      {currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : currentUser.email
                        ? currentUser.email.charAt(0).toUpperCase()
                        : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-[#1b2620] dark:text-[#edf0ec] max-w-[80px] truncate hidden sm:inline">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-1.5 w-56 bg-[#fcfbfa] dark:bg-[#18231d] border border-[#dedad0] dark:border-[#28382e] rounded-xl shadow-lg p-2 z-50 animate-in fade-in"
                    id="user-dropdown-menu"
                  >
                    <div className="p-2 border-b border-[#e5e1d7] dark:border-[#28382e] mb-1">
                      <p className="text-xs font-bold text-[#1b2620] dark:text-[#edf0ec] truncate">
                        {currentUser.displayName || 'Hostel Student'}
                      </p>
                      <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] truncate">
                        {currentUser.email}
                      </p>
                      {isDevBypass ? (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#526357] dark:text-[#9bb0a2] font-mono">
                          <Terminal className="w-3 h-3" />
                          <span>Dev / Tester Bypass Mode</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-[#2d5641] dark:text-[#7fc09d] font-medium">
                          <CloudCheck className="w-3 h-3" />
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
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#324238] dark:text-[#d3ded7] hover:bg-[#efece4] dark:hover:bg-[#202d24] flex items-center gap-2 transition-colors mb-0.5"
                    >
                      <Award className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
                      <span>Profile & Badges</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#c06541] dark:text-[#e88d6a] hover:bg-[#efece4] dark:hover:bg-[#202d24] flex items-center gap-2 transition-colors"
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
                className="px-2.5 py-1.5 text-xs font-medium text-white bg-[#2d5641] dark:bg-[#7fc09d] dark:text-[#0f1d15] hover:bg-[#224433] dark:hover:bg-[#91d1b0] rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
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
