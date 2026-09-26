import React from 'react';
import { X, Calendar, Flame, Download, Upload, CloudCheck, RefreshCw, Award, ChevronRight, FileText } from 'lucide-react';
import { calculateScore, formatDateDisplay } from '../utils/storage';
import { DailyRecord } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { computeBadges } from '../utils/badges';
import { Badges } from './Badges';
import { ScoreTrendChart } from './ScoreTrendChart';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  streak: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
  records: Record<string, DailyRecord>;
  onForceSync?: () => Promise<void>;
  isSyncing?: boolean;
  onOpenProfile?: () => void;
  onOpenReport?: () => void;
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
  onOpenReport,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121815]/70 backdrop-blur-xs">
      <div 
        className="bg-[#fcfbfa] dark:bg-[#18221d] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-[#e4e1d6] dark:border-[#28362e]"
        id="history-modal"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Execution History & Insights
              </h3>
              {currentUser && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2d5641]/10 text-[#244b36] dark:bg-[#7fc09d]/15 dark:text-[#88d2af] border border-[#2d5641]/25 dark:border-[#7fc09d]/30 flex items-center gap-1 font-mono">
                  <CloudCheck className="w-3 h-3 text-[#2d5641] dark:text-[#7fc09d]" />
                  Cloud Synced
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2]">
              Review consistency across days and audit the behavioral loop
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#798b7f] dark:text-[#6e8275] hover:text-[#1b2620] dark:hover:text-[#edf0ec] p-1.5 rounded-lg hover:bg-[#edeae0] dark:hover:bg-[#223128] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] text-center">
            <div className="flex items-center justify-center gap-1 text-[#c06541] dark:text-[#e88d6a] mb-1">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-[11px] font-semibold uppercase">Current Streak</span>
            </div>
            <span className="text-2xl font-bold text-[#1b2620] dark:text-[#edf0ec]">
              {streak.currentStreak} <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">days</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] text-center">
            <div className="flex items-center justify-center gap-1 text-[#2d5641] dark:text-[#7fc09d] mb-1">
              <Award className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase">Best Streak</span>
            </div>
            <span className="text-2xl font-bold text-[#1b2620] dark:text-[#edf0ec]">
              {streak.bestStreak} <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">days</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] text-center">
            <div className="flex items-center justify-center gap-1 text-[#376d75] dark:text-[#6db5c0] mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-semibold uppercase">Total Tracked</span>
            </div>
            <span className="text-2xl font-bold text-[#1b2620] dark:text-[#edf0ec]">
              {streak.totalLoggedDays} <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">days</span>
            </span>
          </div>
        </div>

        {/* Badges & Milestones Preview Card */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
              <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                Milestones & Badges ({unlockedBadgesCount} / {badges.length} Unlocked)
              </span>
            </div>
            {onOpenProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="text-xs font-medium text-[#2d5641] dark:text-[#7fc09d] hover:text-[#1b2620] dark:hover:text-[#edf0ec] flex items-center gap-1 transition-colors"
              >
                <span>View Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Badges badges={badges} compact />
        </div>

        {/* 7-Day Recharts Score Trend Chart */}
        <ScoreTrendChart
          records={records}
          onSelectDate={(date) => {
            onSelectDate(date);
            onClose();
          }}
        />

        {/* Records list */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] uppercase tracking-wider">
              Logged Execution Records
            </h4>
            {currentUser && onForceSync && (
              <button
                type="button"
                onClick={onForceSync}
                disabled={isSyncing}
                className="text-xs text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] font-medium flex items-center gap-1 disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync with Firestore</span>
              </button>
            )}
          </div>

          {sortedDates.length === 0 ? (
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] py-6 text-center">
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
                    className="w-full text-left p-3 rounded-xl border border-[#dedad0] dark:border-[#2c3d33] hover:border-[#2d5641]/50 dark:hover:border-[#7fc09d]/50 hover:bg-[#edeae0] dark:hover:bg-[#223128] transition-all flex items-center justify-between bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                          {formatDateDisplay(dateStr)}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${score.totalScore >= 4 ? 'text-[#2d5641] dark:text-[#7fc09d]' : 'text-[#798b7f] dark:text-[#6e8275]'}`}>
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
                              className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded ${
                                passed
                                  ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] font-bold'
                                  : 'bg-[#dedad0] dark:bg-[#2b3a31] text-[#798b7f] dark:text-[#6e8275]'
                              }`}
                            >
                              {letter}
                            </span>
                          );
                        })}
                      </div>

                      {/* Logged Distractions if any */}
                      {Array.isArray(rec.distractions) && rec.distractions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {rec.distractions.slice(0, 3).map((d) => (
                            <span
                              key={d}
                              className="text-[10px] px-1.5 py-0.2 rounded bg-[#dedad0]/60 dark:bg-[#28382e] text-[#344339] dark:text-[#d3ded7] border border-[#c5c1b4] dark:border-[#384c3e]"
                            >
                              {d}
                            </span>
                          ))}
                          {rec.distractions.length > 3 && (
                            <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275]">
                              +{rec.distractions.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-[#c06541] dark:text-[#e88d6a] hover:underline">
                      View / Edit →
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Export / Import footer */}
        <div className="mt-6 pt-4 border-t border-[#e5e1d7] dark:border-[#28382e] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenReport && (
              <button
                type="button"
                id="btn-history-open-report"
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Open comprehensive report analysis and download PDF"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Full Diagnostic Report & PDF</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#dedad0] dark:border-[#2c3d33] hover:bg-[#edeae0] dark:hover:bg-[#223128] text-[#344339] dark:text-[#d3ded7] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#526357] dark:text-[#9bb0a2]" />
              <span>Export JSON Backup</span>
            </button>

            <label className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#dedad0] dark:border-[#2c3d33] hover:bg-[#edeae0] dark:hover:bg-[#223128] text-[#344339] dark:text-[#d3ded7] flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#526357] dark:text-[#9bb0a2]" />
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
            className="px-4 py-1.5 bg-[#1b2620] dark:bg-[#edf0ec] text-white dark:text-[#1b2620] rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
