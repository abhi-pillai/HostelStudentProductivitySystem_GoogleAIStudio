import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Flame,
  Calendar,
  Award,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121815]/70 backdrop-blur-xs animate-in fade-in"
      id="user-profile-modal-backdrop"
    >
      <div
        className="bg-[#fcfbfa] dark:bg-[#18221d] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-[#e4e1d6] dark:border-[#28362e]"
        id="user-profile-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#e5e1d7] dark:border-[#28382e]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#2d5641] dark:text-[#7fc09d]" />
            <h3 className="text-base sm:text-lg font-bold text-[#1b2620] dark:text-[#edf0ec]">
              Hostel Student Profile & Milestones
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#798b7f] dark:text-[#6e8275] hover:text-[#1b2620] dark:hover:text-[#edf0ec] p-1.5 rounded-lg hover:bg-[#edeae0] dark:hover:bg-[#223128] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="mt-4 p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Student'}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border border-[#2d5641]/30 dark:border-[#7fc09d]/30 shadow-2xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-[#2d5641] text-[#f4f7f4] dark:bg-[#7fc09d] dark:text-[#0f1d15] flex items-center justify-center font-bold text-base shadow-2xs">
                {currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : 'H'}
              </div>
            )}
            <div>
              <h4 className="text-sm font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center gap-1.5 flex-wrap">
                {currentUser?.displayName || (currentUser ? 'Hostel Scholar' : 'Guest Student')}
                {isDevBypass && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f4f2ea] dark:bg-[#202d25] text-[#344339] dark:text-[#d3ded7] border border-[#dedad0] dark:border-[#2c3d33] font-mono font-medium flex items-center gap-1">
                    <Terminal className="w-2.5 h-2.5" /> Dev Mode
                  </span>
                )}
                {currentUser && !isDevBypass && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2d5641]/10 text-[#244b36] dark:bg-[#7fc09d]/15 dark:text-[#88d2af] border border-[#2d5641]/25 dark:border-[#7fc09d]/30 font-mono font-medium flex items-center gap-1">
                    <CloudCheck className="w-2.5 h-2.5" /> Cloud Synced
                  </span>
                )}
              </h4>
              <p className="text-xs text-[#526357] dark:text-[#9bb0a2] flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-[#798b7f] dark:text-[#6e8275]" />
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
                className="px-3 py-1.5 text-xs font-medium text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] hover:bg-[#edeae0] dark:hover:bg-[#223128] rounded-lg border border-[#dedad0] dark:border-[#2c3d33] flex items-center gap-1.5 transition-colors cursor-pointer"
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
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2d5641] hover:bg-[#234534] dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Log In / Sync</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Execution Stats Bar */}
        <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <div className="flex items-center justify-center gap-1 text-[#c06541] dark:text-[#e88d6a] text-[10px] font-semibold uppercase">
              <Flame className="w-3.5 h-3.5 fill-current" /> Streak
            </div>
            <div className="text-xl font-bold text-[#1b2620] dark:text-[#edf0ec] mt-0.5 font-mono">
              {streak.currentStreak}d
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <div className="flex items-center justify-center gap-1 text-[#2d5641] dark:text-[#7fc09d] text-[10px] font-semibold uppercase">
              <Award className="w-3.5 h-3.5" /> All-Time Best
            </div>
            <div className="text-xl font-bold text-[#1b2620] dark:text-[#edf0ec] mt-0.5 font-mono">
              {streak.bestStreak}d
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <div className="flex items-center justify-center gap-1 text-[#376d75] dark:text-[#6db5c0] text-[10px] font-semibold uppercase">
              <Calendar className="w-3.5 h-3.5" /> Badges Cleared
            </div>
            <div className="text-xl font-bold text-[#1b2620] dark:text-[#edf0ec] mt-0.5 font-mono">
              {unlockedBadges.length} / {badges.length}
            </div>
          </div>
        </div>

        {/* Generate Report Action Banner */}
        {onOpenReport && (
          <div className="mt-3.5 p-3 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] flex items-center justify-between gap-3">
            <div>
              <h5 className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
                <span>Productivity Analysis & PDF Report</span>
              </h5>
              <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2]">
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
              className="px-3 py-1.5 rounded-lg bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] font-semibold text-xs flex items-center gap-1 shrink-0 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Generate PDF</span>
            </button>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="mt-4 flex items-center gap-1 border-b border-[#e5e1d7] dark:border-[#28382e] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] shadow-2xs'
                : 'text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Streak Milestones & Badges</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] shadow-2xs'
                : 'text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec]'
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
              <div className="p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
                <h5 className="font-bold text-[#1b2620] dark:text-[#edf0ec] mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#deb16d]" />
                  How Milestone Badges Unlock
                </h5>
                <p className="text-[#526357] dark:text-[#9bb0a2] leading-relaxed">
                  Badges reflect real behavior in your hostel room. Consistency is graded when your daily H.O.S.T.E.L. execution score reaches at least <strong>4 out of 6 points</strong>.
                </p>
                <ul className="mt-2 space-y-1 text-[#526357] dark:text-[#9bb0a2] list-disc list-inside">
                  <li><strong>7-Day Consistent Performer:</strong> 7 uninterrupted days of disciplined execution.</li>
                  <li><strong>Early Bird 14-Day:</strong> 14 consecutive mornings waking up with zero phone scrolling.</li>
                  <li><strong>21-Day Habit Master:</strong> Full 3-week rewiring of your study rhythm.</li>
                  <li><strong>30-Day Iron Will:</strong> Complete 1-month mastery over hostel distractions.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-[#2d5641]/10 dark:bg-[#7fc09d]/10 border border-[#2d5641]/25 dark:border-[#7fc09d]/25 text-[#244b36] dark:text-[#88d2af]">
                <span className="font-bold text-[#1b2620] dark:text-[#edf0ec] block mb-0.5">
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
