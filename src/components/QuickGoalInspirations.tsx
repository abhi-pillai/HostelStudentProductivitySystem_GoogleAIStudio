import React, { useState } from 'react';
import { Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface QuickGoalInspirationsProps {
  currentGoal?: string;
  onSelectGoal: (goal: string) => void;
}

const INSPIRATIONS = [
  'Master DP Subsequences & solve 4 LeetCode mediums',
  'Finish Capstone API auth routes & clean Swagger docs',
  'Crack 20 Aptitude speed drills before evening college exit',
  'Revise OS Virtual Memory paging & TLB cache tables',
  'Implement Binary Tree traversals from memory & benchmark',
  'Deep focus 90-min session at library with zero social media',
];

export const QuickGoalInspirations: React.FC<QuickGoalInspirationsProps> = ({
  currentGoal = '',
  onSelectGoal,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Need inspiration? Quick hostel targets</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {currentGoal && (
          <span className="text-[10px] text-stone-400 dark:text-stone-500 italic">
            Saved automatically
          </span>
        )}
      </div>

      {isOpen && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-lg bg-stone-50/80 dark:bg-stone-850/80 border border-stone-200/70 dark:border-stone-800 animate-in fade-in duration-150">
          {INSPIRATIONS.map((text, idx) => {
            const isSelected = currentGoal === text;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectGoal(text)}
                className={`text-left text-xs p-2 rounded-md transition-all flex items-start gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400/50 text-amber-900 dark:text-amber-200 font-medium'
                    : 'bg-white dark:bg-stone-800 border-stone-200/70 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-amber-50/60 dark:hover:bg-stone-750'
                }`}
              >
                <span className="text-amber-500 font-bold shrink-0 text-[10px] mt-0.5">•</span>
                <span className="flex-1 leading-snug">{text}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
