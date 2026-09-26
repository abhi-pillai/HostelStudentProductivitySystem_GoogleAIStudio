import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

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
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
          <span>Quick target ideas</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {currentGoal && (
          <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275]">
            Auto-saved
          </span>
        )}
      </div>

      {isOpen && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#e4e1d6] dark:border-[#28362e] animate-in fade-in duration-150">
          {INSPIRATIONS.map((text, idx) => {
            const isSelected = currentGoal === text;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectGoal(text)}
                className={`text-left text-xs p-2 rounded-md transition-all flex items-start gap-1.5 border ${
                  isSelected
                    ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] border-[#2d5641] dark:border-[#7fc09d] font-medium shadow-2xs'
                    : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#dedad0] dark:border-[#2b3a31] text-[#344339] dark:text-[#d3ded7] hover:bg-[#edeae0] dark:hover:bg-[#223128]'
                }`}
              >
                <span className={`font-bold shrink-0 text-[10px] mt-0.5 ${isSelected ? 'text-white dark:text-[#0f1d15]' : 'text-[#798b7f]'}`}>•</span>
                <span className="flex-1 leading-snug">{text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
