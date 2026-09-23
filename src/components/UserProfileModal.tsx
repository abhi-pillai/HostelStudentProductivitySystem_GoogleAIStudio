import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Flame,
  Calendar,
  Award,
  CheckCircle2,
  CloudCheck,
  LogOut,
  Sparkles,
  ShieldAlert,
  Clock,
  Terminal,
  FileText,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DailyRecord, StreakStats } from '../types';
import { computeBadges } from '../utils/badges';
import { Badges } from './Badges';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: StreakStats;
  records: Record<string, DailyRecord>;
  onOpenAuth: () => void;
  onOpenReport?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  streak,
  records,
  onOpenAuth,
  onOpenReport,
}) => {
  const { currentUser, isDevBypass, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'badges' | 'overview'>('badges');

  if (!isOpen) return null;

  const badges = computeBadges(streak, records);
  const unlockedBadges = badges.filter((b) => b.unlocked);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      id="user-profile-modal-backdrop"
    >
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800"
        id="user-profile-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              Hostel Student Profile & Milestones
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="mt-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Student'}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : 'H'}
              </div>
            )}
            <div>
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 flex-wrap">
                {currentUser?.displayName || (currentUser ? 'Hostel Scholar' : 'Guest Student')}
                {isDevBypass && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-mono font-bold flex items-center gap-1">
                    <Terminal className="w-2.5 h-2.5" /> Dev/Tester Bypass Mode
                  </span>
                )}
                {currentUser && !isDevBypass && (
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                    <CloudCheck className="w-2.5 h-2.5" /> Cloud Active
                  </span>
                )}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-stone-400" />
                {currentUser?.email || 'Local Storage Session (Sign in to sync across devices)'}
              </p>
            </div>
          </div>

          <div>
            {currentUser ? (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/60 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                <span>Log In / Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Execution Stats Bar */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40">
            <div className="flex items-center justify-center gap-1 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase">
              <Flame className="w-3.5 h-3.5" /> Streak
            </div>
            <div className="text-xl font-extrabold text-orange-950 dark:text-orange-200 mt-0.5">
              {streak.currentStreak}d
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase">
              <Award className="w-3.5 h-3.5" /> All-Time Best
            </div>
            <div className="text-xl font-extrabold text-amber-950 dark:text-amber-200 mt-0.5">
              {streak.bestStreak}d
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60">
            <div className="flex items-center justify-center gap-1 text-stone-600 dark:text-stone-400 text-[10px] font-bold uppercase">
              <Calendar className="w-3.5 h-3.5" /> Badges Cleared
            </div>
            <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
              {unlockedBadges.length} / {badges.length}
            </div>
          </div>
        </div>

        {/* Generate Report Action Banner */}
        {onOpenReport && (
          <div className="mt-3.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3">
            <div>
              <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Productivity Analysis & PDF Report</span>
              </h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Detailed diagnostics across all 6 pillars and personalized ways to improve
              </p>
            </div>
            <button
              type="button"
              id="btn-profile-generate-report"
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
            >
              <span>Generate PDF</span>
            </button>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="mt-4 flex items-center gap-1 border-b border-stone-200 dark:border-stone-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'badges'
                ? 'bg-amber-500 text-stone-950 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Streak Milestones & Badges</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Discipline Overview</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'badges' ? (
            <Badges badges={badges} />
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <h5 className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  How Milestone Badges Unlock
                </h5>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                  Badges reflect real behavior in your hostel room. Consistency is graded when your daily H.O.S.T.E.L. execution score reaches at least <strong>4 out of 6 points</strong>.
                </p>
                <ul className="mt-2 space-y-1 text-stone-600 dark:text-stone-400 list-disc list-inside">
                  <li><strong>7-Day Consistent Performer:</strong> 7 uninterrupted days of disciplined execution.</li>
                  <li><strong>Early Bird 14-Day:</strong> 14 consecutive mornings waking up with zero phone scrolling.</li>
                  <li><strong>21-Day Habit Master:</strong> Full 3-week rewiring of your study rhythm.</li>
                  <li><strong>30-Day Iron Will:</strong> Complete 1-month mastery over hostel distractions.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-stone-700 dark:text-stone-300">
                <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                  Hostel Environmental Tip:
                </span>
                Keep your desk clear of clutter before going to bed. When you sit down for your evening block, having all notes and textbook tabs pre-opened reduces initial activation resistance.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
