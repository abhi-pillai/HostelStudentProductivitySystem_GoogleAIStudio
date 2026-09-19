import { Badge, DailyRecord, StreakStats } from '../types';
import { calculateScore } from './storage';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'perfection' | 'discipline' | 'milestone';
  targetDays: number;
  iconName: Badge['iconName'];
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  // evaluator receives streak stats, all records, and returns { unlocked, currentValue, targetValue }
  evaluate: (
    streak: StreakStats,
    records: Record<string, DailyRecord>
  ) => { unlocked: boolean; currentValue: number; targetValue: number; unlockedAt?: string };
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-step',
    title: 'First Flame',
    description: 'Complete your first successful execution day (Score ≥ 4)',
    category: 'milestone',
    targetDays: 1,
    iconName: 'flame',
    rarity: 'Common',
    evaluate: (streak, records) => {
      const successfulDays = Object.values(records).filter(r => calculateScore(r).totalScore >= 4);
      const effective = Math.max(successfulDays.length, streak.currentStreak, streak.bestStreak);
      return {
        unlocked: effective >= 1,
        currentValue: Math.min(effective, 1),
        targetValue: 1,
      };
    },
  },
  {
    id: '3-day-momentum',
    title: '3-Day Momentum',
    description: 'Maintain 3 consecutive days of disciplined hostel execution',
    category: 'streak',
    targetDays: 3,
    iconName: 'zap',
    rarity: 'Common',
    evaluate: (streak) => {
      const highest = Math.max(streak.currentStreak, streak.bestStreak);
      return {
        unlocked: highest >= 3,
        currentValue: Math.min(highest, 3),
        targetValue: 3,
      };
    },
  },
  {
    id: '7-day-consistent',
    title: '7-Day Consistent Performer',
    description: 'Hit a 7-day uninterrupted execution streak. The hostel habits take root!',
    category: 'streak',
    targetDays: 7,
    iconName: 'award',
    rarity: 'Rare',
    evaluate: (streak) => {
      const highest = Math.max(streak.currentStreak, streak.bestStreak);
      return {
        unlocked: highest >= 7,
        currentValue: Math.min(highest, 7),
        targetValue: 7,
      };
    },
  },
  {
    id: 'early-bird-14',
    title: 'Early Bird 14-Day',
    description: '2 weeks of continuous consistency and Hard Start mornings without phone scrolling',
    category: 'streak',
    targetDays: 14,
    iconName: 'sun',
    rarity: 'Epic',
    evaluate: (streak, records) => {
      // Calculate streak of days with hardStart passed
      const dates = Object.keys(records).sort();
      let maxEarlyBirdStreak = 0;
      let currentRun = 0;
      for (const d of dates) {
        const rec = records[d];
        if (rec && rec.hardStart?.wakeNoPhone && calculateScore(rec).totalScore >= 4) {
          currentRun++;
          if (currentRun > maxEarlyBirdStreak) maxEarlyBirdStreak = currentRun;
        } else {
          currentRun = 0;
        }
      }
      // Also credit general streak if high
      const value = Math.max(maxEarlyBirdStreak, streak.bestStreak >= 14 ? 14 : streak.currentStreak);
      return {
        unlocked: value >= 14,
        currentValue: Math.min(value, 14),
        targetValue: 14,
      };
    },
  },
  {
    id: '21-day-habit',
    title: '21-Day Habit Master',
    description: 'Achieve 21 consecutive days of the H.O.S.T.E.L. execution loop. Neural pathways rewired.',
    category: 'streak',
    targetDays: 21,
    iconName: 'target',
    rarity: 'Epic',
    evaluate: (streak) => {
      const highest = Math.max(streak.currentStreak, streak.bestStreak);
      return {
        unlocked: highest >= 21,
        currentValue: Math.min(highest, 21),
        targetValue: 21,
      };
    },
  },
  {
    id: '30-day-zenith',
    title: '30-Day Iron Will',
    description: 'A full month of unbroken high-output student consistency in the hostel environment',
    category: 'streak',
    targetDays: 30,
    iconName: 'shield',
    rarity: 'Legendary',
    evaluate: (streak) => {
      const highest = Math.max(streak.currentStreak, streak.bestStreak);
      return {
        unlocked: highest >= 30,
        currentValue: Math.min(highest, 30),
        targetValue: 30,
      };
    },
  },
  {
    id: 'perfect-6',
    title: 'Flawless 6/6 Day',
    description: 'Score a complete 6/6 on every single H.O.S.T.E.L. execution rule in a single day',
    category: 'perfection',
    targetDays: 1,
    iconName: 'sparkles',
    rarity: 'Rare',
    evaluate: (_, records) => {
      const perfectCount = Object.values(records).filter(r => calculateScore(r).totalScore === 6).length;
      return {
        unlocked: perfectCount >= 1,
        currentValue: Math.min(perfectCount, 1),
        targetValue: 1,
      };
    },
  },
  {
    id: 'deep-work-century',
    title: 'Century Focus Club',
    description: 'Log over 100 total deep work & coding minutes in a single day',
    category: 'discipline',
    targetDays: 100,
    iconName: 'trophy',
    rarity: 'Rare',
    evaluate: (_, records) => {
      let maxDayMinutes = 0;
      for (const rec of Object.values(records)) {
        const total = (rec.targetedWork?.codingMinutes || 0) + 
                      (rec.targetedWork?.projectMinutes || 0) + 
                      (rec.targetedWork?.gateMinutes || 0);
        if (total > maxDayMinutes) maxDayMinutes = total;
      }
      return {
        unlocked: maxDayMinutes >= 100,
        currentValue: Math.min(maxDayMinutes, 100),
        targetValue: 100,
      };
    },
  },
  {
    id: 'hostel-legend-50',
    title: 'Hostel Legend (50-Day)',
    description: 'Unstoppable 50-day streak. Top 0.1% tier student discipline across campus.',
    category: 'streak',
    targetDays: 50,
    iconName: 'crown',
    rarity: 'Legendary',
    evaluate: (streak) => {
      const highest = Math.max(streak.currentStreak, streak.bestStreak);
      return {
        unlocked: highest >= 50,
        currentValue: Math.min(highest, 50),
        targetValue: 50,
      };
    },
  },
];

export function computeBadges(
  streak: StreakStats,
  records: Record<string, DailyRecord>
): Badge[] {
  return BADGE_DEFINITIONS.map((def) => {
    const { unlocked, currentValue, targetValue, unlockedAt } = def.evaluate(streak, records);
    const progress = Math.min(100, Math.round((currentValue / targetValue) * 100));

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      category: def.category,
      targetDays: def.targetDays,
      iconName: def.iconName,
      rarity: def.rarity,
      unlocked,
      unlockedAt,
      progress,
      currentValue,
      targetValue,
    };
  });
}
