import React, { useState } from 'react';
import { Sparkles, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface QuickReflectionPromptsProps {
  currentNotes?: string;
  onAppendNote: (text: string) => void;
}

const HOSTEL_PROMPTS = [
  'Disciplined morning start; maintained focus through afternoon breaks.',
  'Roommate noise was high; switched to library/earphones for Targeted Work.',
  'Struggled with phone urges in bed; keeping device on study desk tonight.',
  'Completed coding and project targets before 9:30 PM entertainment window.',
  'Chai corridor chat ran 20 mins over; will set an alarm next time.',
  'Energy was low in the evening; took a 15-min walk, then finished 45-min sprint.',
];

export const QuickReflectionPrompts: React.FC<QuickReflectionPromptsProps> = ({
  onAppendNote,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAppended, setLastAppended] = useState<string | null>(null);

  const handleSelect = (prompt: string) => {
    onAppendNote(prompt);
    setLastAppended(prompt);
    setTimeout(() => setLastAppended(null), 2000);
  };

  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
          <span>Hostel Reflection Prompts (1-click insert)</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 flex flex-wrap gap-1.5 p-2 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#e4e1d6] dark:border-[#28362e] animate-in fade-in duration-150">
          {HOSTEL_PROMPTS.map((prompt, idx) => {
            const isAdded = lastAppended === prompt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(prompt)}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isAdded
                    ? 'bg-[#2d5641] dark:bg-[#7fc09d] border-[#2d5641] dark:border-[#7fc09d] text-white dark:text-[#0f1d15] font-medium'
                    : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#dedad0] dark:border-[#2b3a31] text-[#344339] dark:text-[#d3ded7] hover:bg-[#edeae0] dark:hover:bg-[#223128]'
                }`}
              >
                <span>{prompt}</span>
                {isAdded ? (
                  <Check className="w-3 h-3 text-white dark:text-[#0f1d15] shrink-0" />
                ) : (
                  <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275] font-mono">+Add</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
