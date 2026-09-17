import React from 'react';
import { Target } from 'lucide-react';

interface DailyFocusGoalProps {
  value?: string;
  onChange: (value: string) => void;
}

export const DailyFocusGoal: React.FC<DailyFocusGoalProps> = ({ value = '', onChange }) => {
  return (
    <div
      id="daily-focus-goal-container"
      className="bg-white border border-stone-200 rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs transition-all hover:border-amber-300"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
            <Target className="w-3.5 h-3.5" />
          </div>
          <label
            htmlFor="daily-focus-goal-input"
            className="text-xs font-bold uppercase tracking-wider text-stone-800"
          >
            Daily Focus Goal
          </label>
        </div>
        <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
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
          className="w-full text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-lg border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder-stone-400 bg-stone-50/50"
        />
      </div>
    </div>
  );
};
