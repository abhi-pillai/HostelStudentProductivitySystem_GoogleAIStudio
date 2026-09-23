import React, { useState } from 'react';
import { ScoreBreakdown } from '../types';
import { CheckCircle2, CircleDashed, Award, Sparkles, Filter, ChevronRight, FileText } from 'lucide-react';

interface ScoreBannerProps {
  scoreBreakdown: ScoreBreakdown;
  onJumpToSection?: (letter: string) => void;
  onOpenReport?: () => void;
}

export const ScoreBanner: React.FC<ScoreBannerProps> = ({ scoreBreakdown, onJumpToSection, onOpenReport }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

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
  const pendingCount = letters.filter(l => !l.passed).length;
  const completedCount = letters.filter(l => l.passed).length;

  const filteredLetters = letters.filter((item) => {
    if (filter === 'completed') return item.passed;
    if (filter === 'pending') return !item.passed;
    return true;
  });

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-xs mb-6 transition-all" id="score-banner-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Daily Execution Score
            </span>
            {scoreBreakdown.totalScore === 6 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full animate-pulse border border-emerald-300 dark:border-emerald-700">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Flawless Execution!
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {scoreBreakdown.totalScore}
              <span className="text-lg font-medium text-stone-400 dark:text-stone-500">/6</span>
            </span>
            <span className={`text-sm font-bold ${scoreBreakdown.verdictColor}`}>
              {scoreBreakdown.verdict}
            </span>
          </div>
          {onOpenReport && (
            <button
              type="button"
              onClick={onOpenReport}
              className="mt-1 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3 h-3" />
              <span>Full Diagnostic Report & Ways to Improve (PDF) →</span>
            </button>
          )}
        </div>

        {/* Scoring Scale Guide & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick status filters */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200/80 dark:border-stone-700/80 text-[11px]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              All (6)
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'pending'
                  ? 'bg-white dark:bg-stone-700 text-amber-700 dark:text-amber-400 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span>Pending</span>
              <span className="px-1 rounded-full bg-stone-200 dark:bg-stone-600 text-[10px] font-mono">
                {pendingCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'completed'
                  ? 'bg-white dark:bg-stone-700 text-emerald-700 dark:text-emerald-400 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <span>Earned</span>
              <span className="px-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono">
                {completedCount}
              </span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2.5 text-xs bg-stone-50 dark:bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-200/60 dark:border-stone-700/60 text-stone-600 dark:text-stone-300">
            <span className="font-semibold text-stone-800 dark:text-stone-200">Scale:</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium">6: Excellent</span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="text-teal-700 dark:text-teal-400 font-medium">5: Strong</span>
            <span className="text-stone-300 dark:text-stone-600">•</span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">4: Acceptable</span>
          </div>
        </div>
      </div>

      {/* Progress Bar with markers */}
      <div className="mt-4">
        <div className="flex justify-between text-[11px] font-medium text-stone-400 mb-1">
          <span>Loop Progress ({percentage}%)</span>
          <span>{pendingCount > 0 ? `${pendingCount} points left to earn` : 'All 6 points locked!'}</span>
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden">
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

      {/* 6 Letter Badges with interactive jumps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
        {filteredLetters.map((item) => {
          return (
            <button
              key={item.key}
              id={`badge-letter-${item.key.toLowerCase()}`}
              onClick={() => onJumpToSection?.(item.key)}
              title={`Click to jump straight to the ${item.label} section`}
              className={`group flex items-center justify-between p-2.5 rounded-lg border text-left transition-all hover:scale-[1.02] cursor-pointer ${
                item.passed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 hover:border-emerald-400'
                  : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-700/60 text-stone-600 dark:text-stone-400 hover:bg-stone-100/80 dark:hover:bg-stone-800/80 hover:border-stone-400'
              }`}
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded transition-colors ${
                      item.passed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 group-hover:bg-amber-500 group-hover:text-stone-950'
                    }`}
                  >
                    {item.key}
                  </span>
                  <span className="text-xs font-semibold truncate text-stone-900 dark:text-stone-100">
                    {item.label}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5 flex items-center gap-0.5">
                  <span>{item.description}</span>
                  <ChevronRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400" />
                </div>
              </div>
              <div>
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0 group-hover:text-amber-500 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
