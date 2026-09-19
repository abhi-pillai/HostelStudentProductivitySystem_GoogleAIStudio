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
        ? 'text-amber-400 drop-shadow-sm'
        : rarity === 'Epic'
        ? 'text-purple-400'
        : rarity === 'Rare'
        ? 'text-sky-400'
        : 'text-amber-500'
      : 'text-stone-400 dark:text-stone-600';

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
        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400">
          Locked
        </span>
      );
    }
    switch (rarity) {
      case 'Legendary':
        return (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            Legendary
          </span>
        );
      case 'Epic':
        return (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            Epic
          </span>
        );
      case 'Rare':
        return (
          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            Rare
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded bg-stone-200/60 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300">
            Common
          </span>
        );
    }
  };

  if (compact) {
    // Compact preview row (for user card or header preview)
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-1.5 no-scrollbar" id="badges-compact-list">
        {badges.map((b) => (
          <div
            key={b.id}
            title={`${b.title} (${b.unlocked ? 'Unlocked' : `${b.progress}%`}) - ${b.description}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs shrink-0 transition-all ${
              b.unlocked
                ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'bg-stone-100/50 dark:bg-stone-800/40 border-stone-200/60 dark:border-stone-700/40 text-stone-400 dark:text-stone-500 opacity-70'
            }`}
          >
            {renderIcon(b.iconName, b.unlocked, b.rarity)}
            <span className="font-semibold text-[11px] truncate max-w-[110px]">{b.title}</span>
            {b.unlocked ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0 ml-0.5" />
            ) : (
              <Lock className="w-2.5 h-2.5 text-stone-400 dark:text-stone-500 shrink-0 ml-0.5" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full" id="badges-component-view">
      {/* Header with overall milestone progress */}
      <div className="p-3.5 rounded-xl bg-linear-to-r from-amber-50 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/80 dark:border-amber-800/50 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
              Hostel Milestone Badges
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
            {unlockedCount} / {totalCount} Unlocked ({completionPercentage}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-stone-200 dark:bg-stone-700/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 text-xs no-scrollbar">
        <div className="flex items-center gap-1 text-stone-400 dark:text-stone-500 pr-1 text-[11px] font-semibold">
          <Filter className="w-3 h-3" />
        </div>
        {(['all', 'streak', 'perfection', 'discipline', 'milestone'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
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
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-xs ring-1 ring-amber-400'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700 shadow-2xs'
                  : 'bg-stone-50/70 dark:bg-stone-850/60 border-stone-200/60 dark:border-stone-800/60 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {/* Icon Box */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    badge.unlocked
                      ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30'
                      : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {renderIcon(badge.iconName, badge.unlocked, badge.rarity)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h4
                      className={`text-xs font-bold truncate ${
                        badge.unlocked
                          ? 'text-stone-900 dark:text-stone-100'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {badge.title}
                    </h4>
                    {getRarityBadge(badge.rarity, badge.unlocked)}
                  </div>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>

                  {/* Progress or unlocked banner */}
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    {badge.unlocked ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked & Achieved
                      </span>
                    ) : (
                      <>
                        <span className="text-stone-500 dark:text-stone-400 font-mono">
                          {badge.currentValue} / {badge.targetValue}{' '}
                          {badge.category === 'discipline' ? 'mins' : 'days'}
                        </span>
                        <span className="font-semibold text-stone-500 dark:text-stone-400">
                          {badge.progress}%
                        </span>
                      </>
                    )}
                  </div>

                  {!badge.unlocked && (
                    <div className="w-full h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-stone-400 dark:bg-stone-500 rounded-full"
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
        <div className="mt-3 p-3 rounded-xl bg-stone-100/90 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              {renderIcon(selectedBadge.iconName, selectedBadge.unlocked, selectedBadge.rarity)}
              {selectedBadge.title}
            </span>
            {selectedBadge.unlocked ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                Milestone Cleared
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                In Progress ({selectedBadge.progress}%)
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
            {selectedBadge.description}
          </p>
        </div>
      )}
    </div>
  );
};
