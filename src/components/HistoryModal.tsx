import React from 'react';
import { X, Calendar, Flame, Download, Upload, CheckCircle2, CircleDashed } from 'lucide-react';
import { getAllRecords, calculateScore, formatDateDisplay } from '../utils/storage';
import { DailyRecord } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  streak: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
  streak,
}) => {
  if (!isOpen) return null;

  const records = getAllRecords();
  const sortedDates = Object.keys(records).sort().reverse();

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
      } catch (err) {
        alert('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-stone-200"
        id="history-modal"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Execution History & Insights
            </h3>
            <p className="text-xs text-stone-500">
              Review consistency across days and audit the behavioral loop
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-orange-700 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase">Current Streak</span>
            </div>
            <span className="text-2xl font-extrabold text-orange-900">
              {streak.currentStreak} <span className="text-xs font-normal">days</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
              <span className="text-[11px] font-bold uppercase">Best Streak</span>
            </div>
            <span className="text-2xl font-extrabold text-amber-900">
              {streak.bestStreak} <span className="text-xs font-normal">days</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-center">
            <div className="flex items-center justify-center gap-1 text-stone-600 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase">Total Tracked</span>
            </div>
            <span className="text-2xl font-extrabold text-stone-900">
              {streak.totalLoggedDays} <span className="text-xs font-normal">days</span>
            </span>
          </div>
        </div>

        {/* Records list */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">
            Logged Execution Records
          </h4>

          {sortedDates.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              No historical records found yet. Complete today's loop to begin building your streak!
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {sortedDates.map((dateStr) => {
                const rec = records[dateStr];
                const score = calculateScore(rec);
                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      onSelectDate(dateStr);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
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
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {letter}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-amber-700 hover:underline">
                      View / Edit →
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Export / Import footer */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <label className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 cursor-pointer">
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
            className="px-4 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
