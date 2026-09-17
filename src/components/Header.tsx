import React from 'react';
import { Flame, Calendar, ChevronLeft, ChevronRight, BookOpen, RotateCcw, Sparkles } from 'lucide-react';
import { formatDateDisplay, getTodayDateString } from '../utils/storage';

interface HeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  streak: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onResetDay: () => void;
  onPrefillSample: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  streak,
  onOpenRules,
  onOpenHistory,
  onResetDay,
  onPrefillSample,
}) => {
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

        {/* Date Selector & Streak */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Streak Badge */}
          <div 
            id="streak-badge"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold shadow-2xs"
            title={`Current execution streak: ${streak.currentStreak} days (Best: ${streak.bestStreak})`}
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-500" />
            <span>{streak.currentStreak} Day Streak</span>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center bg-stone-100 rounded-lg p-1 border border-stone-200 text-xs font-medium">
            <button
              id="prev-date-btn"
              onClick={handlePrevDay}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-md transition-colors"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2.5 py-1 text-stone-800">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span className="font-semibold">{formatDateDisplay(currentDate)}</span>
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

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-rules-modal"
              onClick={onOpenRules}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Philosophy & Principles"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden md:inline">Philosophy</span>
            </button>

            <button
              id="btn-history-modal"
              onClick={onOpenHistory}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Stats
            </button>

            <button
              id="btn-sample-fill"
              onClick={onPrefillSample}
              className="px-2.5 py-1.5 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors flex items-center gap-1"
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
          </div>
        </div>
      </div>
    </header>
  );
};
