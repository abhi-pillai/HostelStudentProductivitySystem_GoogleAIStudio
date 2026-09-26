import React from 'react';
import { Target, X } from 'lucide-react';
import { QuickGoalInspirations } from './QuickGoalInspirations';

interface DailyFocusGoalProps {
  value?: string;
  onChange: (value: string) => void;
}

export const DailyFocusGoal: React.FC<DailyFocusGoalProps> = ({ value = '', onChange }) => {
  return (
    <div
      id="daily-focus-goal-container"
      className="bg-[#fcfbfa] dark:bg-[#18221d] border border-[#e4e1d6] dark:border-[#28362e] rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs transition-all hover:border-[#2d5641]/40 dark:hover:border-[#7fc09d]/30"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#2d5641]/10 text-[#2d5641] dark:bg-[#7fc09d]/15 dark:text-[#7fc09d] flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <label
            htmlFor="daily-focus-goal-input"
            className="text-xs font-semibold uppercase tracking-wider text-[#1b2620] dark:text-[#edf0ec]"
          >
            Daily Focus Goal
          </label>
        </div>
        <span className="text-xs text-[#798b7f] dark:text-[#6e8275] font-normal hidden sm:inline">
          Single most important objective
        </span>
      </div>

      <div className="relative">
        <input
          id="daily-focus-goal-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Master DP Subsequences & finish Capstone API endpoints by 8:30 PM..."
          className="w-full text-xs sm:text-sm font-medium pl-3.5 pr-8 py-2.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] focus:outline-hidden focus:ring-1 focus:ring-[#2d5641]/30 dark:focus:ring-[#7fc09d]/40 focus:border-[#2d5641] dark:focus:border-[#7fc09d] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] bg-[#f5f3ec] dark:bg-[#1e2a22]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#798b7f] hover:text-[#1b2620] dark:text-[#6e8275] dark:hover:text-[#edf0ec] rounded-full hover:bg-[#eae6db] dark:hover:bg-[#25362c]"
            title="Clear goal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <QuickGoalInspirations currentGoal={value} onSelectGoal={onChange} />
    </div>
  );
};
