import React, { useState } from 'react';
import { ScoreBreakdown } from '../types';
import { Award, Zap, ChevronRight, FileText, Check, CircleDashed } from 'lucide-react';

interface ScoreBannerProps {
  scoreBreakdown: ScoreBreakdown;
  onJumpToSection?: (letter: string) => void;
  onOpenReport?: () => void;
  onLaunchFocus?: () => void;
}

export const ScoreBanner: React.FC<ScoreBannerProps> = ({
  scoreBreakdown,
  onJumpToSection,
  onOpenReport,
  onLaunchFocus,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const letters = [
    {
      key: 'H',
      label: 'Hard Start',
      passed: scoreBreakdown.hardStart,
      description: 'Morning Anchor',
      accentColor: 'text-amber-600 dark:text-amber-400',
      badgeBase: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
      activeCard: 'border-amber-400/70 dark:border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20 shadow-xs',
      checkColor: 'bg-amber-500 text-stone-950',
    },
    {
      key: 'O',
      label: 'Organize',
      passed: scoreBreakdown.organize,
      description: 'Top 3 Tasks',
      accentColor: 'text-sky-600 dark:text-sky-400',
      badgeBase: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
      activeCard: 'border-sky-400/70 dark:border-sky-500/40 bg-sky-50/40 dark:bg-sky-950/20 shadow-xs',
      checkColor: 'bg-sky-500 text-white',
    },
    {
      key: 'S',
      label: 'Small Sessions',
      passed: scoreBreakdown.smallSessions,
      description: 'College Breaks',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBase: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
      activeCard: 'border-emerald-400/70 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs',
      checkColor: 'bg-emerald-500 text-white',
    },
    {
      key: 'T',
      label: 'Targeted Work',
      passed: scoreBreakdown.targetedWork,
      description: 'Evening Deep Work',
      accentColor: 'text-indigo-600 dark:text-indigo-400',
      badgeBase: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
      activeCard: 'border-indigo-400/70 dark:border-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-xs',
      checkColor: 'bg-indigo-500 text-white',
    },
    {
      key: 'E',
      label: 'Entertainment',
      passed: scoreBreakdown.entertainment,
      description: 'Strict 30m Cutoff',
      accentColor: 'text-rose-600 dark:text-rose-400',
      badgeBase: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
      activeCard: 'border-rose-400/70 dark:border-rose-500/40 bg-rose-50/40 dark:bg-rose-950/20 shadow-xs',
      checkColor: 'bg-rose-500 text-white',
    },
    {
      key: 'L',
      label: 'Lights Out',
      passed: scoreBreakdown.lightsOut,
      description: 'Sleep Sanctuary',
      accentColor: 'text-purple-600 dark:text-purple-400',
      badgeBase: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25',
      activeCard: 'border-purple-400/70 dark:border-purple-500/40 bg-purple-50/40 dark:bg-purple-950/20 shadow-xs',
      checkColor: 'bg-purple-500 text-white',
    },
  ];

  const percentage = Math.round((scoreBreakdown.totalScore / 6) * 100);
  const pendingCount = letters.filter((l) => !l.passed).length;
  const completedCount = letters.filter((l) => l.passed).length;

  const filteredLetters = letters.filter((item) => {
    if (filter === 'completed') return item.passed;
    if (filter === 'pending') return !item.passed;
    return true;
  });

  const getStatusPill = () => {
    if (scoreBreakdown.totalScore === 6) {
      return {
        text: '🏆 Perfect 6/6 Day · Full Loop Executed',
        pillClass: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30',
      };
    }
    if (scoreBreakdown.totalScore >= 4) {
      return {
        text: `🎯 Target Secured (${scoreBreakdown.totalScore}/6) · Passing Mark Reached`,
        pillClass: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
      };
    }
    if (scoreBreakdown.totalScore > 0) {
      return {
        text: `⚡ In Progress (${scoreBreakdown.totalScore}/6) · ${4 - scoreBreakdown.totalScore} more to lock in passing baseline`,
        pillClass: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700',
      };
    }
    return {
      text: '🌅 Morning Setup · Execute Hard Start (H) first',
      pillClass: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700',
    };
  };

  const status = getStatusPill();

  return (
    <div
      className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-xl p-5 mb-5 shadow-2xs transition-all"
      id="score-banner-card"
    >
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
                Daily Execution Score
              </span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.pillClass}`}>
              {status.text}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-mono">
              {scoreBreakdown.totalScore}
              <span className="text-2xl font-light text-stone-400 dark:text-stone-500">/6</span>
            </span>
            <div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200 block">
                {scoreBreakdown.verdict}
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                {scoreBreakdown.totalScore >= 4 ? 'Baseline secured for the semester' : 'Aim for minimum 4/6 passing mark today'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {onOpenReport && (
            <button
              type="button"
              onClick={onOpenReport}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-750 bg-stone-50 hover:bg-stone-100 dark:bg-stone-850 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-stone-500" />
              <span>Diagnostic Report & PDF</span>
            </button>
          )}

          {/* Quick status filters */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-850 p-0.5 rounded-lg border border-stone-200 dark:border-stone-750 text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              All (6)
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'pending'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <span>Pending</span>
              <span className="text-[10px] font-mono font-bold">({pendingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'completed'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <span>Earned</span>
              <span className="text-[10px] font-mono font-bold">({completedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar with Milestones */}
      <div className="mt-4">
        <div className="flex justify-between items-center text-xs font-medium text-stone-500 dark:text-stone-400 mb-1.5">
          <span>Loop Progress ({percentage}%)</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className={scoreBreakdown.totalScore >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
              🎯 4/6 Passing Target
            </span>
            <span className={scoreBreakdown.totalScore === 6 ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}>
              👑 6/6 Perfect
            </span>
          </div>
        </div>
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2.5 overflow-hidden p-0.5 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              scoreBreakdown.totalScore === 6
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-xs'
                : scoreBreakdown.totalScore >= 4
                ? 'bg-gradient-to-r from-stone-900 to-emerald-600 dark:from-stone-100 dark:to-emerald-400'
                : 'bg-stone-800 dark:bg-stone-200'
            }`}
            style={{ width: `${Math.max(percentage, 4)}%` }}
          />
        </div>
      </div>

      {/* 6 Letter Cards with signature identities */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
        {filteredLetters.map((item) => {
          return (
            <button
              key={item.key}
              id={`badge-letter-${item.key.toLowerCase()}`}
              onClick={() => onJumpToSection?.(item.key)}
              title={`Click to jump to the ${item.label} section`}
              className={`group flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer ${
                item.passed
                  ? `${item.activeCard} ring-1 ring-current/10`
                  : 'bg-stone-50/70 dark:bg-stone-850/50 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md border ${
                      item.passed
                        ? `${item.badgeBase} font-extrabold`
                        : item.badgeBase
                    }`}
                  >
                    {item.key}
                  </span>
                  <span className="text-xs font-bold truncate text-stone-900 dark:text-stone-100">
                    {item.label}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-1">
                  {item.description}
                </div>
              </div>

              <div>
                {item.passed ? (
                  <div className={`w-5 h-5 rounded-full ${item.checkColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <CircleDashed className="w-4 h-4 text-stone-300 dark:text-stone-600 shrink-0 group-hover:text-stone-400 transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
