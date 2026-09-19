import React from 'react';
import { X, Calendar, Flame, Download, Upload, CloudCheck, RefreshCw, Award, ChevronRight } from 'lucide-react';
import { calculateScore, formatDateDisplay } from '../utils/storage';
import { DailyRecord } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { computeBadges } from '../utils/badges';
import { Badges } from './Badges';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  streak: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
  records: Record<string, DailyRecord>;
  onForceSync?: () => Promise<void>;
  isSyncing?: boolean;
  onOpenProfile?: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
  streak,
  records,
  onForceSync,
  isSyncing,
  onOpenProfile,
}) => {
  const { currentUser } = useAuth();
  if (!isOpen) return null;

  const sortedDates = Object.keys(records).sort().reverse();
  const badges = computeBadges(streak, records);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hostel-productivity-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed === 'object') {
          localStorage.setItem('hostel_student_productivity_records_v1', JSON.stringify(parsed));
          window.location.reload();
        }
      } catch {
        alert('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-stone-200 dark:border-stone-800"
        id="history-modal"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Execution History & Insights
              </h3>
              {currentUser && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CloudCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Firestore Sync Active
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Review consistency across days and audit the behavioral loop
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-700 dark:text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase">Current Streak</span>
            </div>
            <span className="text-2xl font-extrabold text-orange-900 dark:text-orange-200">
              {streak.currentStreak} <span className="text-xs font-normal">days</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 mb-1">
              <span className="text-[11px] font-bold uppercase">Best Streak</span>
            </div>
            <span className="text-2xl font-extrabold text-amber-900 dark:text-amber-200">
              {streak.bestStreak} <span className="text-xs font-normal">days</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
            <div className="flex items-center justify-center gap-1 text-stone-600 dark:text-stone-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase">Total Tracked</span>
            </div>
            <span className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
              {streak.totalLoggedDays} <span className="text-xs font-normal">days</span>
            </span>
          </div>
        </div>

        {/* Badges & Milestones Preview Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Streak Milestones & Badges ({unlockedBadgesCount} / {badges.length} Unlocked)
              </span>
            </div>
            {onOpenProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 flex items-center gap-1 transition-colors"
              >
                <span>View Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Badges badges={badges} compact />
        </div>

        {/* Records list */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Logged Execution Records
            </h4>
            {currentUser && onForceSync && (
              <button
                type="button"
                onClick={onForceSync}
                disabled={isSyncing}
                className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-semibold flex items-center gap-1 disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync with Firestore</span>
              </button>
            )}
          </div>

          {sortedDates.length === 0 ? (
            <p className="text-xs text-stone-500 dark:text-stone-400 py-6 text-center">
              No historical records found yet. Complete today's loop to begin building your streak!
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {sortedDates.map((dateStr) => {
                const rec = records[dateStr];
                if (!rec) return null;
                const score = calculateScore(rec);
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      onSelectDate(dateStr);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all flex items-center justify-between bg-stone-50/30 dark:bg-stone-800/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {formatDateDisplay(dateStr)}
                        </span>
                        <span className={`text-[11px] font-bold ${score.verdictColor}`}>
                          ({score.totalScore}/6)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {['H', 'O', 'S', 'T', 'E', 'L'].map((letter) => {
                          const passed =
                            (letter === 'H' && score.hardStart) ||
                            (letter === 'O' && score.organize) ||
                            (letter === 'S' && score.smallSessions) ||
                            (letter === 'T' && score.targetedWork) ||
                            (letter === 'E' && score.entertainment) ||
                            (letter === 'L' && score.lightsOut);

                          return (
                            <span
                              key={letter}
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                passed
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                              }`}
                            >
                              {letter}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline">
                      View / Edit →
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Export / Import footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <label className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
