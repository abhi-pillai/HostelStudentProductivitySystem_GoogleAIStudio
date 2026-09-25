import React, { useState } from 'react';
import { Lightbulb, RotateCw, Copy, Check } from 'lucide-react';

const HOSTEL_WISDOM_QUOTES = [
  {
    quote: "The bed is strictly for sleeping. The study desk is where placements, internships, and deep knowledge are earned.",
    principle: "Physical Boundary Law"
  },
  {
    quote: "15 aptitude questions before checking your phone locks in your morning win. Never trade your first cognitive hour for someone else's social feed.",
    principle: "Hard Start Momentum"
  },
  {
    quote: "College breaks are 20-minute gift cards. Spend them on one DSA problem or revising Operating Systems paging formulas.",
    principle: "Small Sessions Principle"
  },
  {
    quote: "When your hostel corridor is loud with chatter and video games, put on earphones or head straight to the library reading room. Protect your evening Targeted Work block.",
    principle: "Environmental Armor"
  },
  {
    quote: "Capping entertainment to 30 minutes after 9:30 PM keeps you refreshed without sacrificing tomorrow morning's cognitive sharpness.",
    principle: "Leisure Boundary Law"
  },
  {
    quote: "The easiest day to skip is the day after a perfect day. True hostel discipline is showing up when energy is merely average.",
    principle: "Continuity Over Heroics"
  },
  {
    quote: "If roommates bring unexpected guests, don't argue—grab your laptop and relocate immediately to the library or common study room.",
    principle: "Zero Drama Rule"
  },
  {
    quote: "Solving 2 LeetCode problems every day for 6 months = 360 problems. You don't need all-nighters, you need the daily loop.",
    principle: "Compounding Math"
  },
  {
    quote: "Watching YouTube in bed rewires your brain to associate the mattress with stimulation. Keep screens off the bed to fall asleep in 10 minutes.",
    principle: "Bed Quarantine"
  },
  {
    quote: "Even during college fest week or exam chaos, hitting 4 out of 6 points keeps your mental momentum and habit streak alive.",
    principle: "Zero Zero-Days"
  },
  {
    quote: "Write down tomorrow's Top 3 priorities before shutting your laptop. Your subconscious plans the execution while you sleep.",
    principle: "Nightly Blueprint"
  },
  {
    quote: "Hostel life is a four-year window. The students who protect their 6-point daily loop leave with the best offers, top GPAs, and zero regrets.",
    principle: "The Long Game"
  }
];

export const DailyMotivation: React.FC = () => {
  const [index, setIndex] = useState(() => {
    // Default to day of year mod length so each day has a default quote
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % HOSTEL_WISDOM_QUOTES.length;
  });

  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % HOSTEL_WISDOM_QUOTES.length);
  };

  const handleCopy = () => {
    const item = HOSTEL_WISDOM_QUOTES[index];
    navigator.clipboard?.writeText?.(`"${item.quote}" — ${item.principle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const item = HOSTEL_WISDOM_QUOTES[index];

  return (
    <div
      className="bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-500/25 rounded-xl p-3.5 sm:p-4 mb-5 shadow-2xs transition-all flex items-start justify-between gap-3"
      id="daily-hostel-wisdom-card"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
          <Lightbulb className="w-4 h-4 fill-amber-500/20" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-mono">
              Hostel Principle #{index + 1}
            </span>
            <span className="text-[10px] text-stone-400 dark:text-stone-500">·</span>
            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
              {item.principle}
            </span>
          </div>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-relaxed italic">
            "{item.quote}"
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors"
          title={copied ? "Copied to clipboard!" : "Copy principle"}
          aria-label="Copy wisdom quote"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors"
          title="Shuffle next hostel principle"
          aria-label="Next hostel wisdom"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
