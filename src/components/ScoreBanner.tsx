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
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs mb-6 transition-all" id="score-banner-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Daily Execution Score
            </span>
            {scoreBreakdown.totalScore === 6 && (
              <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
                · All Points Earned
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight font-mono">
              {scoreBreakdown.totalScore}
              <span className="text-xl font-normal text-stone-400 dark:text-stone-500">/6</span>
            </span>
            <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
              {scoreBreakdown.verdict}
            </span>
          </div>
          {onOpenReport && (
            <button
              type="button"
              onClick={onOpenReport}
              className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-medium flex items-center gap-1.5 transition-colors group cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-200" />
              <span className="underline underline-offset-2">Full Diagnostic Report & Ways to Improve (PDF) →</span>
            </button>
          )}
        </div>

        {/* Scoring Scale Guide & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick status filters */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-750 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              All (6)
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                filter === 'pending'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <span>Pending</span>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                {pendingCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                filter === 'completed'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <span>Earned</span>
              <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                {completedCount}
              </span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-normal">
            <span>Scale: 6 Excellent · 5 Strong · 4 Acceptable · &lt;4 Reset</span>
          </div>
        </div>
      </div>

      {/* Progress Bar with markers */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-normal text-stone-500 dark:text-stone-400 mb-1.5">
          <span>Loop Progress ({percentage}%)</span>
          <span>{pendingCount > 0 ? `${pendingCount} points pending` : 'All 6 points completed'}</span>
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full bg-stone-800 dark:bg-stone-200 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(percentage, 2)}%` }}
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
              className={`group flex items-center justify-between p-2.5 rounded-lg border text-left transition-all hover:bg-stone-50 dark:hover:bg-stone-800/60 cursor-pointer ${
                item.passed
                  ? 'bg-stone-50/70 dark:bg-stone-850/80 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded transition-colors ${
                      item.passed
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {item.key}
                  </span>
                  <span className="text-xs font-medium truncate text-stone-900 dark:text-stone-100">
                    {item.label}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-1 flex items-center gap-0.5">
                  <span>{item.description}</span>
                </div>
              </div>
              <div>
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-stone-800 dark:text-stone-200 shrink-0" />
                ) : (
                  <CircleDashed className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
