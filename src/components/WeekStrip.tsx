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
      className="bg-[#fcfbfa] dark:bg-[#18221d] border border-[#e4e1d6] dark:border-[#28362e] rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs transition-all"
      id="week-momentum-strip"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#c06541]/10 dark:bg-[#e88d6a]/15 text-[#b25735] dark:text-[#f09a79] flex items-center justify-center shrink-0">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Weekly Momentum
              </span>
              {streak && streak.currentStreak > 0 && (
                <span className="text-[11px] font-semibold text-[#b25735] dark:text-[#f09a79] font-mono">
                  {streak.currentStreak}d streak
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-[#798b7f] dark:text-[#6e8275] font-normal hidden md:inline">
            · Tap any day to log or view
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {!isViewingToday && (
            <button
              type="button"
              onClick={() => onSelectDate(todayStr)}
              className="text-[11px] font-semibold text-[#2d5641] dark:text-[#88d2af] hover:text-[#1e3c2c] dark:hover:text-[#9fe3c1] flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2d5641]/10 hover:bg-[#2d5641]/15 dark:bg-[#7fc09d]/15 dark:hover:bg-[#7fc09d]/25 border border-[#2d5641]/20 dark:border-[#7fc09d]/30 transition-all cursor-pointer"
            >
              <span>Back to Today</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          <div className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#f4f2ea] dark:bg-[#1c2720] text-[#344339] dark:text-[#d3ded7]">
            <span>Week Score:</span>
            <strong className="text-[#1b2620] dark:text-[#edf0ec] font-bold">{totalScoreThisWeek}/42</strong>
            <span className="text-[#798b7f] dark:text-[#6e8275]">({loggedDaysThisWeek}/7 active)</span>
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#dedad0] dark:bg-[#2c3d33] inline-block" />
          );

          if (day.hasRecord) {
            if (day.score === 6) {
              scoreBadge = (
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full flex items-center gap-0.5 ${
                  isSelected
                    ? 'bg-[#deb16d] text-[#1b2620] shadow-2xs'
                    : 'bg-[#deb16d]/20 text-[#9c691c] dark:text-[#f2d08a] border border-[#deb16d]/40'
                }`}>
                  ★ 6/6
                </span>
              );
            } else if (day.score >= 4) {
              scoreBadge = (
                <span className={`text-[10px] font-semibold font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-[#edf5f0] text-[#1b2620]'
                    : 'bg-[#2d5641]/15 text-[#244b36] dark:text-[#88d2af] border border-[#2d5641]/25 dark:border-[#7fc09d]/30'
                }`}>
                  ✓ {day.score}/6
                </span>
              );
            } else {
              scoreBadge = (
                <span className={`text-[10px] font-medium font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-[#24352a] text-[#edf0ec]'
                    : 'bg-[#dedad0] dark:bg-[#293930] text-[#526357] dark:text-[#9bb0a2]'
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
                  ? 'bg-[#2d5641] text-[#f4f7f4] dark:bg-[#7fc09d] dark:text-[#0f1d15] shadow-md ring-2 ring-[#2d5641]/20 dark:ring-[#7fc09d]/30 scale-[1.02]'
                  : 'bg-[#f5f3ec] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#233229] border border-[#e4e1d6] dark:border-[#29382f] text-[#344339] dark:text-[#d3ded7] hover:scale-[1.01]'
              }`}
            >
              {/* Day Name */}
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-medium tracking-wide uppercase ${
                    isSelected ? 'text-[#cbe3d5] dark:text-[#183324]' : 'text-[#798b7f] dark:text-[#6e8275]'
                  }`}
                >
                  {day.weekday}
                </span>
                {isToday && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#deb16d]' : 'bg-[#c06541] dark:bg-[#e88d6a]'}`} />
                )}
              </div>

              {/* Day Number */}
              <span
                className={`text-base sm:text-lg font-bold font-mono my-0.5 leading-none ${
                  isSelected ? 'text-white dark:text-[#0f1d15]' : 'text-[#1b2620] dark:text-[#edf0ec]'
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
