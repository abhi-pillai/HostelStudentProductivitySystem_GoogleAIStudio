import React from 'react';
import { DailyRecord } from '../types';
import { calculateScore, getTodayDateString } from '../utils/storage';
import { Flame, ArrowRight } from 'lucide-react';

interface WeekStripProps {
  currentDate: string;
  onSelectDate: (date: string) => void;
  records: Record<string, DailyRecord>;
  streak?: { currentStreak: number; bestStreak: number; totalLoggedDays: number };
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  currentDate,
  onSelectDate,
  records,
  streak,
}) => {
  const todayStr = getTodayDateString();
  const isViewingToday = currentDate === todayStr;

  // Generate 7-day rolling window ending today
  const days = React.useMemo(() => {
    const list: {
      date: string;
      weekday: string;
      dayNumber: string;
      month: string;
      isToday: boolean;
      isSelected: boolean;
      score: number;
      hasRecord: boolean;
      verdict: string;
    }[] = [];

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const rec = records[dateStr];
      const scoreData = rec ? calculateScore(rec) : null;
      const score = scoreData ? scoreData.totalScore : 0;

      list.push({
        date: dateStr,
        weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: String(d.getDate()),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        isToday: dateStr === todayStr,
        isSelected: dateStr === currentDate,
        score,
        hasRecord: Boolean(rec && score > 0),
        verdict: scoreData ? scoreData.verdict : 'No log',
      });
    }
    return list;
  }, [records, currentDate, todayStr]);

  const loggedDaysThisWeek = days.filter((d) => d.hasRecord).length;
  const totalScoreThisWeek = days.reduce((sum, d) => sum + d.score, 0);

  return (
    <div
      className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs transition-all"
      id="week-momentum-strip"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                Weekly Momentum
              </span>
              {streak && streak.currentStreak > 0 && (
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono">
                  {streak.currentStreak}d streak
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-stone-400 dark:text-stone-500 font-normal hidden md:inline">
            · Tap any day to log or view
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {!isViewingToday && (
            <button
              type="button"
              onClick={() => onSelectDate(todayStr)}
              className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all cursor-pointer"
            >
              <span>Back to Today</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
            <span>Week Score:</span>
            <strong className="text-stone-900 dark:text-stone-100 font-bold">{totalScoreThisWeek}/42</strong>
            <span className="text-stone-400 dark:text-stone-500">({loggedDaysThisWeek}/7 active)</span>
          </div>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((day) => {
          const isSelected = day.isSelected;
          const isToday = day.isToday;

          // Badging style
          let scoreBadge = (
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 inline-block" />
          );

          if (day.hasRecord) {
            if (day.score === 6) {
              scoreBadge = (
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 shadow-2xs'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                }`}>
                  ★ 6/6
                </span>
              );
            } else if (day.score >= 4) {
              scoreBadge = (
                <span className={`text-[10px] font-semibold font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-emerald-400 text-stone-950'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25'
                }`}>
                  ✓ {day.score}/6
                </span>
              );
            } else {
              scoreBadge = (
                <span className={`text-[10px] font-medium font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-stone-700 text-stone-200'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                }`}>
                  {day.score}/6
                </span>
              );
            }
          }

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDate(day.date)}
              title={`${day.weekday}, ${day.month} ${day.dayNumber}: ${day.hasRecord ? `${day.score}/6 points (${day.verdict})` : 'No execution logged'}`}
              className={`flex flex-col items-center justify-between py-2 px-1 sm:px-2 rounded-xl transition-all cursor-pointer text-center relative ${
                isSelected
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md ring-2 ring-stone-900/15 dark:ring-stone-100/30 scale-[1.02]'
                  : 'bg-stone-50/70 dark:bg-stone-850/50 hover:bg-stone-100 dark:hover:bg-stone-800/80 border border-stone-200/70 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:scale-[1.01]'
              }`}
            >
              {/* Day Name */}
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-medium tracking-wide uppercase ${
                    isSelected ? 'text-stone-300 dark:text-stone-600' : 'text-stone-400 dark:text-stone-500'
                  }`}
                >
                  {day.weekday}
                </span>
                {isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-amber-500'}`} />
                )}
              </div>

              {/* Day Number */}
              <span
                className={`text-base sm:text-lg font-bold font-mono my-0.5 leading-none ${
                  isSelected ? 'text-white dark:text-stone-900' : 'text-stone-900 dark:text-stone-100'
                }`}
              >
                {day.dayNumber}
              </span>

              {/* Mini Score Pill */}
              <div className="mt-1 h-4 flex items-center justify-center">
                {scoreBadge}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
