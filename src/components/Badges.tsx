import React, { useState } from 'react';
import {
  Flame,
  Sun,
  Award,
  Zap,
  Crown,
  Target,
  Star,
  Shield,
  Trophy,
  Sparkles,
  Lock,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Badge } from '../types';

interface BadgesProps {
  badges: Badge[];
  compact?: boolean;
}

export const Badges: React.FC<BadgesProps> = ({ badges, compact = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'perfection' | 'discipline' | 'milestone'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.category === selectedCategory;
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const renderIcon = (iconName: Badge['iconName'], isUnlocked: boolean, rarity: Badge['rarity']) => {
    const iconClass = isUnlocked
      ? rarity === 'Legendary'
        ? 'text-[#deb16d] drop-shadow-xs'
        : rarity === 'Epic'
        ? 'text-[#ab9cc4]'
        : rarity === 'Rare'
        ? 'text-[#6db5c0]'
        : 'text-[#7fc09d] dark:text-[#7fc09d]'
      : 'text-[#798b7f] dark:text-[#6e8275]';

    switch (iconName) {
      case 'flame':
        return <Flame className={`w-5 h-5 ${iconClass} ${isUnlocked ? 'fill-current' : ''}`} />;
      case 'sun':
        return <Sun className={`w-5 h-5 ${iconClass}`} />;
      case 'award':
        return <Award className={`w-5 h-5 ${iconClass}`} />;
      case 'zap':
        return <Zap className={`w-5 h-5 ${iconClass} ${isUnlocked ? 'fill-current' : ''}`} />;
      case 'crown':
        return <Crown className={`w-5 h-5 ${iconClass} ${isUnlocked ? 'fill-current' : ''}`} />;
      case 'target':
        return <Target className={`w-5 h-5 ${iconClass}`} />;
      case 'star':
        return <Star className={`w-5 h-5 ${iconClass} ${isUnlocked ? 'fill-current' : ''}`} />;
      case 'shield':
        return <Shield className={`w-5 h-5 ${iconClass}`} />;
      case 'trophy':
        return <Trophy className={`w-5 h-5 ${iconClass}`} />;
      case 'sparkles':
        return <Sparkles className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Award className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getRarityBadge = (rarity: Badge['rarity'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return (
        <span className="text-[9px] font-medium uppercase px-1.5 py-0.5 rounded bg-[#dedad0]/60 dark:bg-[#25352b] text-[#798b7f] dark:text-[#6e8275] font-mono">
          Locked
        </span>
      );
    }
    return (
      <span className="text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 text-[#244b36] dark:text-[#88d2af] border border-[#2d5641]/20 dark:border-[#7fc09d]/25 font-mono">
        {rarity}
      </span>
    );
  };

  if (compact) {
    // Compact preview row
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-1.5 no-scrollbar" id="badges-compact-list">
        {badges.map((b) => (
          <div
            key={b.id}
            title={`${b.title} (${b.unlocked ? 'Unlocked' : `${b.progress}%`}) - ${b.description}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs shrink-0 transition-all ${
              b.unlocked
                ? 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#dedad0] dark:border-[#2c3d33] text-[#1b2620] dark:text-[#edf0ec] shadow-2xs'
                : 'bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 border-[#e4e1d6]/60 dark:border-[#28362e]/60 text-[#798b7f] dark:text-[#6e8275] opacity-60'
            }`}
          >
            {renderIcon(b.iconName, b.unlocked, b.rarity)}
            <span className="font-medium text-[11px] truncate max-w-[110px]">{b.title}</span>
            {b.unlocked ? (
              <CheckCircle2 className="w-3 h-3 text-[#2d5641] dark:text-[#7fc09d] shrink-0 ml-0.5" />
            ) : (
              <Lock className="w-2.5 h-2.5 text-[#798b7f] dark:text-[#6e8275] shrink-0 ml-0.5" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full" id="badges-component-view">
      {/* Header with overall milestone progress */}
      <div className="p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
            <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Hostel Milestone Badges
            </span>
          </div>
          <span className="text-xs font-mono font-medium text-[#2d5641] dark:text-[#7fc09d]">
            {unlockedCount} / {totalCount} Unlocked ({completionPercentage}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#eae7dd] dark:bg-[#223027] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2d5641] to-[#4e8568] dark:from-[#3d7056] dark:to-[#7fc09d] transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 text-xs no-scrollbar">
        <div className="flex items-center gap-1 text-[#798b7f] dark:text-[#6e8275] pr-1 text-[11px] font-semibold">
          <Filter className="w-3 h-3" />
        </div>
        {(['all', 'streak', 'perfection', 'discipline', 'milestone'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors shrink-0 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] shadow-2xs'
                : 'bg-[#f5f3ec] dark:bg-[#1c2720] text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] border border-[#dedad0] dark:border-[#2c3d33]'
            }`}
          >
            {cat === 'all' ? 'All Milestones' : cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredBadges.map((badge) => {
          const isSelected = selectedBadge?.id === badge.id;
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                badge.unlocked
                  ? isSelected
                    ? 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#2d5641] dark:border-[#7fc09d] ring-1 ring-[#2d5641]/20 dark:ring-[#7fc09d]/30 shadow-2xs'
                    : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#dedad0] dark:border-[#2c3d33] hover:border-[#2d5641]/40 dark:hover:border-[#7fc09d]/40 shadow-2xs'
                  : 'bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 border-[#e4e1d6]/60 dark:border-[#28362e]/60 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Icon Box */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                    badge.unlocked
                      ? 'bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 border-[#2d5641]/25 dark:border-[#7fc09d]/30 text-[#244b37] dark:text-[#88d2af]'
                      : 'bg-[#f5f3ec] dark:bg-[#1c2720] border-[#dedad0] dark:border-[#2c3d33] text-[#798b7f] dark:text-[#6e8275]'
                  }`}
                >
                  {renderIcon(badge.iconName, badge.unlocked, badge.rarity)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4
                      className={`text-xs font-semibold truncate ${
                        badge.unlocked
                          ? 'text-[#1b2620] dark:text-[#edf0ec]'
                          : 'text-[#798b7f] dark:text-[#6e8275]'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    {getRarityBadge(badge.rarity, badge.unlocked)}
                  </div>

                  <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] line-clamp-2 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>

                  {/* Progress or unlocked banner */}
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    {badge.unlocked ? (
                      <span className="font-medium text-[#2d5641] dark:text-[#7fc09d] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2d5641] dark:text-[#7fc09d]" /> Unlocked
                      </span>
                    ) : (
                      <>
                        <span className="text-[#526357] dark:text-[#9bb0a2] font-mono">
                          {badge.currentValue} / {badge.targetValue}{' '}
                          {badge.category === 'discipline' ? 'mins' : 'days'}
                        </span>
                        <span className="font-semibold text-[#526357] dark:text-[#9bb0a2]">
                          {badge.progress}%
                        </span>
                      </>
                    )}
                  </div>

                  {!badge.unlocked && (
                    <div className="w-full h-1 bg-[#eae7dd] dark:bg-[#223027] rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#798b7f] dark:text-[#6e8275] rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected badge details spotlight */}
      {selectedBadge && (
        <div className="mt-3 p-3 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center gap-1.5">
              {renderIcon(selectedBadge.iconName, selectedBadge.unlocked, selectedBadge.rarity)}
              {selectedBadge.title}
            </span>
            {selectedBadge.unlocked ? (
              <span className="text-[#2d5641] dark:text-[#7fc09d] font-medium text-[11px]">
                Milestone Cleared
              </span>
            ) : (
              <span className="text-[#526357] dark:text-[#9bb0a2] font-medium text-[11px]">
                In Progress ({selectedBadge.progress}%)
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] mt-1 leading-relaxed">
            {selectedBadge.description}
          </p>
        </div>
      )}
    </div>
  );
};
