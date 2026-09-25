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
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span>Hostel Reflection Prompts (1-click insert)</span>
          {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 flex flex-wrap gap-1.5 p-2 rounded-lg bg-stone-50/70 dark:bg-stone-850/60 border border-stone-200 dark:border-stone-800 animate-in fade-in duration-150">
          {HOSTEL_PROMPTS.map((prompt, idx) => {
            const isAdded = lastAppended === prompt;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(prompt)}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  isAdded
                    ? 'bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900 font-medium'
                    : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>{prompt}</span>
                {isAdded ? (
                  <Check className="w-3 h-3 text-white dark:text-stone-900 shrink-0" />
                ) : (
                  <span className="text-[10px] text-stone-400 font-mono">+Add</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
