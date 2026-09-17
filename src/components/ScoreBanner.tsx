import React from 'react';
import { ScoreBreakdown } from '../types';
import { CheckCircle2, CircleDashed, Award } from 'lucide-react';

interface ScoreBannerProps {
  scoreBreakdown: ScoreBreakdown;
  onJumpToSection?: (letter: string) => void;
}

export const ScoreBanner: React.FC<ScoreBannerProps> = ({ scoreBreakdown, onJumpToSection }) => {
  const letters = [
    { key: 'H', label: 'Hard Start', passed: scoreBreakdown.hardStart, description: 'Morning Anchor' },
    { key: 'O', label: 'Organize', passed: scoreBreakdown.organize, description: 'Top 3 Tasks' },
    { key: 'S', label: 'Small Sessions', passed: scoreBreakdown.smallSessions, description: 'College Breaks' },
    { key: 'T', label: 'Targeted Work', passed: scoreBreakdown.targetedWork, description: 'Deep Evening' },
    { key: 'E', label: 'Entertainment', passed: scoreBreakdown.entertainment, description: 'Strict Limits' },
    { key: 'L', label: 'Lights Out', passed: scoreBreakdown.lightsOut, description: 'Sleep Discipline' },
  ];

  // Progress percentage
  const percentage = Math.round((scoreBreakdown.totalScore / 6) * 100);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs mb-6" id="score-banner-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Daily Execution Score
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {scoreBreakdown.totalScore}
              <span className="text-lg font-medium text-stone-400">/6</span>
            </span>
            <span className={`text-sm font-bold ${scoreBreakdown.verdictColor}`}>
              {scoreBreakdown.verdict}
            </span>
          </div>
        </div>

        {/* Scoring Scale Guide (From README) */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-stone-50 px-3 py-2 rounded-lg border border-stone-200/60 text-stone-600">
          <span className="font-semibold text-stone-800">Standard:</span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">6: Excellent</span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1 text-teal-700 font-medium">5: Strong</span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1 text-amber-700 font-medium">4: Acceptable</span>
          <span className="text-stone-300">|</span>
          <span className="flex items-center gap-1 text-rose-700 font-medium">0-3: Weak/Reset</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
              scoreBreakdown.totalScore === 6
                ? 'bg-emerald-600'
                : scoreBreakdown.totalScore >= 4
                ? 'bg-amber-600'
                : 'bg-rose-500'
            }`}
            style={{ width: `${Math.max(percentage, 5)}%` }}
          />
        </div>
      </div>

      {/* 6 Letter Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
        {letters.map((item) => {
          return (
            <button
              key={item.key}
              id={`badge-letter-${item.key.toLowerCase()}`}
              onClick={() => onJumpToSection?.(item.key)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                item.passed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 hover:bg-emerald-50'
                  : 'bg-stone-50/60 border-stone-200/80 text-stone-600 hover:bg-stone-100/60'
              }`}
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                      item.passed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.key}
                  </span>
                  <span className="text-xs font-semibold truncate text-stone-900">
                    {item.label}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 truncate mt-0.5">
                  {item.description}
                </div>
              </div>
              <div>
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-stone-300 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
