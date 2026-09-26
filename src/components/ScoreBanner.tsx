import React, { useState } from 'react';
import { ScoreBreakdown } from '../types';
import { Award, FileText, Check, CircleDashed } from 'lucide-react';

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
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const letters = [
    {
      key: 'H',
      label: 'Hard Start',
      passed: scoreBreakdown.hardStart,
      description: 'Morning Anchor',
      accentColor: 'text-[#c06541] dark:text-[#e88d6a]',
      badgeBase: 'bg-[#c06541]/10 text-[#b25735] dark:text-[#f09a79] border-[#c06541]/25',
      activeCard: 'border-[#c06541]/50 dark:border-[#e88d6a]/40 bg-[#c06541]/5 dark:bg-[#e88d6a]/10 shadow-xs',
      checkColor: 'bg-[#c06541] text-white',
    },
    {
      key: 'O',
      label: 'Organize',
      passed: scoreBreakdown.organize,
      description: 'Top 3 Tasks',
      accentColor: 'text-[#376d75] dark:text-[#6db5c0]',
      badgeBase: 'bg-[#376d75]/10 text-[#29565d] dark:text-[#7fc4cf] border-[#376d75]/25',
      activeCard: 'border-[#376d75]/50 dark:border-[#6db5c0]/40 bg-[#376d75]/5 dark:bg-[#6db5c0]/10 shadow-xs',
      checkColor: 'bg-[#376d75] text-white',
    },
    {
      key: 'S',
      label: 'Small Sessions',
      passed: scoreBreakdown.smallSessions,
      description: 'College Breaks',
      accentColor: 'text-[#2d5641] dark:text-[#7fc09d]',
      badgeBase: 'bg-[#2d5641]/10 text-[#244b37] dark:text-[#88d2af] border-[#2d5641]/25',
      activeCard: 'border-[#2d5641]/50 dark:border-[#7fc09d]/40 bg-[#2d5641]/5 dark:bg-[#7fc09d]/10 shadow-xs',
      checkColor: 'bg-[#2d5641] text-white',
    },
    {
      key: 'T',
      label: 'Targeted Work',
      passed: scoreBreakdown.targetedWork,
      description: 'Evening Deep Work',
      accentColor: 'text-[#3a586d] dark:text-[#7da5c2]',
      badgeBase: 'bg-[#3a586d]/10 text-[#2a4557] dark:text-[#8cb3cf] border-[#3a586d]/25',
      activeCard: 'border-[#3a586d]/50 dark:border-[#7da5c2]/40 bg-[#3a586d]/5 dark:bg-[#7da5c2]/10 shadow-xs',
      checkColor: 'bg-[#3a586d] text-white',
    },
    {
      key: 'E',
      label: 'Entertainment',
      passed: scoreBreakdown.entertainment,
      description: 'Strict 30m Cutoff',
      accentColor: 'text-[#b25555] dark:text-[#e07a7a]',
      badgeBase: 'bg-[#b25555]/10 text-[#964242] dark:text-[#efa1a1] border-[#b25555]/25',
      activeCard: 'border-[#b25555]/50 dark:border-[#e07a7a]/40 bg-[#b25555]/5 dark:bg-[#e07a7a]/10 shadow-xs',
      checkColor: 'bg-[#b25555] text-white',
    },
    {
      key: 'L',
      label: 'Lights Out',
      passed: scoreBreakdown.lightsOut,
      description: 'Sleep Sanctuary',
      accentColor: 'text-[#6b5b7b] dark:text-[#ab9cc4]',
      badgeBase: 'bg-[#6b5b7b]/10 text-[#544662] dark:text-[#bfb2d4] border-[#6b5b7b]/25',
      activeCard: 'border-[#6b5b7b]/50 dark:border-[#ab9cc4]/40 bg-[#6b5b7b]/5 dark:bg-[#ab9cc4]/10 shadow-xs',
      checkColor: 'bg-[#6b5b7b] text-white',
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
        pillClass: 'bg-[#deb16d]/20 text-[#9c691c] dark:text-[#f2d08a] border-[#deb16d]/40',
      };
    }
    if (scoreBreakdown.totalScore >= 4) {
      return {
        text: `🎯 Target Secured (${scoreBreakdown.totalScore}/6) · Passing Mark Reached`,
        pillClass: 'bg-[#2d5641]/15 text-[#244b36] dark:text-[#88d2af] border-[#2d5641]/25 dark:border-[#7fc09d]/30',
      };
    }
    if (scoreBreakdown.totalScore > 0) {
      return {
        text: `⚡ In Progress (${scoreBreakdown.totalScore}/6) · ${4 - scoreBreakdown.totalScore} more to lock in passing baseline`,
        pillClass: 'bg-[#f4f2ea] dark:bg-[#1c2720] text-[#344339] dark:text-[#d3ded7] border-[#dedad0] dark:border-[#2b3a31]',
      };
    }
    return {
      text: '🌅 Morning Setup · Execute Hard Start (H) first',
      pillClass: 'bg-[#f4f2ea] dark:bg-[#1c2720] text-[#526357] dark:text-[#9bb0a2] border-[#dedad0] dark:border-[#2b3a31]',
    };
  };

  const status = getStatusPill();

  return (
    <div
      className="bg-[#fcfbfa] dark:bg-[#18221d] border border-[#e4e1d6] dark:border-[#28362e] rounded-xl p-5 mb-5 shadow-2xs transition-all"
      id="score-banner-card"
    >
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#344339] dark:text-[#d3ded7]">
                Daily Execution Score
              </span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.pillClass}`}>
              {status.text}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-black text-[#1b2620] dark:text-[#edf0ec] tracking-tight font-mono">
              {scoreBreakdown.totalScore}
              <span className="text-2xl font-light text-[#798b7f] dark:text-[#6e8275]">/6</span>
            </span>
            <div>
              <span className="text-sm font-bold text-[#1b2620] dark:text-[#edf0ec] block">
                {scoreBreakdown.verdict}
              </span>
              <span className="text-[11px] text-[#526357] dark:text-[#9bb0a2]">
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
              className="text-xs px-3 py-1.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] bg-[#f5f3ec] hover:bg-[#eae6db] dark:bg-[#1e2a22] dark:hover:bg-[#24342a] text-[#344339] dark:text-[#d3ded7] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
              <span>Diagnostic Report & PDF</span>
            </button>
          )}

          {/* Quick status filters */}
          <div className="flex items-center bg-[#f4f2ea] dark:bg-[#1c2720] p-0.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[#fcfbfa] dark:bg-[#26372d] text-[#1b2620] dark:text-[#edf0ec] shadow-2xs font-semibold'
                  : 'text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec]'
              }`}
            >
              All (6)
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                filter === 'pending'
                  ? 'bg-[#fcfbfa] dark:bg-[#26372d] text-[#1b2620] dark:text-[#edf0ec] shadow-2xs font-semibold'
                  : 'text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec]'
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
                  ? 'bg-[#fcfbfa] dark:bg-[#26372d] text-[#1b2620] dark:text-[#edf0ec] shadow-2xs font-semibold'
                  : 'text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec]'
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
        <div className="flex justify-between items-center text-xs font-medium text-[#526357] dark:text-[#9bb0a2] mb-1.5">
          <span>Loop Progress ({percentage}%)</span>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className={scoreBreakdown.totalScore >= 4 ? 'text-[#2d5641] dark:text-[#88d2af] font-semibold' : ''}>
              🎯 4/6 Passing Target
            </span>
            <span className={scoreBreakdown.totalScore === 6 ? 'text-[#9c691c] dark:text-[#f2d08a] font-semibold' : ''}>
              👑 6/6 Perfect
            </span>
          </div>
        </div>
        <div className="w-full bg-[#eae7dd] dark:bg-[#223027] rounded-full h-2.5 overflow-hidden p-0.5 relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              scoreBreakdown.totalScore === 6
                ? 'bg-gradient-to-r from-[#c06541] to-[#deb16d] shadow-xs'
                : scoreBreakdown.totalScore >= 4
                ? 'bg-gradient-to-r from-[#2d5641] to-[#4e8568] dark:from-[#3d7056] dark:to-[#7fc09d]'
                : 'bg-[#486353] dark:bg-[#607d6d]'
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
                  ? `${item.activeCard} ring-1 ring-current/15`
                  : 'bg-[#f5f3ec] dark:bg-[#1c2720] border-[#e4e1d6] dark:border-[#28362e] text-[#344339] dark:text-[#d3ded7] hover:border-[#dedad0] dark:hover:border-[#384a3f]'
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
                  <span className="text-xs font-bold truncate text-[#1b2620] dark:text-[#edf0ec]">
                    {item.label}
                  </span>
                </div>
                <div className="text-[10px] text-[#526357] dark:text-[#9bb0a2] truncate mt-1">
                  {item.description}
                </div>
              </div>

              <div>
                {item.passed ? (
                  <div className={`w-5 h-5 rounded-full ${item.checkColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <CircleDashed className="w-4 h-4 text-[#798b7f] dark:text-[#6e8275] shrink-0 group-hover:text-[#1b2620] dark:group-hover:text-[#edf0ec] transition-colors" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
