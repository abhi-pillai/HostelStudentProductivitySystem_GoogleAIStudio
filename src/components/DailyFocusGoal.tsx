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
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs transition-all hover:border-stone-300 dark:hover:border-stone-700"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <label
            htmlFor="daily-focus-goal-input"
            className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200"
          >
            Daily Focus Goal
          </label>
        </div>
        <span className="text-xs text-stone-400 dark:text-stone-500 font-normal hidden sm:inline">
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
          className="w-full text-xs sm:text-sm font-medium pl-3.5 pr-8 py-2.5 rounded-lg border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-1 focus:ring-stone-400 focus:border-stone-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 bg-stone-50/50 dark:bg-stone-850/60"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-700/50"
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
