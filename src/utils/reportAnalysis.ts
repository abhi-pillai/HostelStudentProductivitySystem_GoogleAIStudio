import { DailyRecord, ScoreBreakdown } from '../types';
import { calculateScore, formatDateDisplay } from './storage';

export type ReportTimeframe = 'last7' | 'last14' | 'last30' | 'all';

export interface PillarStat {
  letter: 'H' | 'O' | 'S' | 'T' | 'E' | 'L';
  title: string;
  subtitle: string;
  passedDays: number;
  totalDays: number;
  successRate: number; // 0 to 100
  status: 'Mastered' | 'Solid' | 'Inconsistent' | 'Needs Work';
  subMetrics: { label: string; value: string; passRate?: number }[];
}

export interface ImprovementRecommendation {
  id: string;
  pillar: 'H' | 'O' | 'S' | 'T' | 'E' | 'L' | 'GENERAL';
  title: string;
  category: 'Morning Routine' | 'Evening Focus' | 'Environment & Distractions' | 'Sleep & Recovery' | 'Hostel Socials' | 'Routine Optimization';
  severity: 'Critical' | 'Important' | 'Optimization';
  whyItMatters: string;
  concreteSteps: string[];
  expectedImpact: string;
}

export interface DetailedReportAnalysis {
  timeframe: ReportTimeframe;
  startDate: string;
  endDate: string;
  totalDaysInRange: number;
  daysLoggedCount: number;
  completionRate: number; // percentage of days logged
  averageScore: number;
  productivityGrade: {
    grade: string;
    description: string;
    color: string;
    bgBadge: string;
  };
  scoreDistribution: {
    perfect6: number;
    strong5: number;
    acceptable4: number;
    subparUnder4: number;
  };
  pillarStats: PillarStat[];
  topStrengths: string[];
  criticalBottlenecks: string[];
  distractionSummary: { name: string; count: number; percentage: number }[];
  studyTimeMetrics: {
    totalCodingMinutes: number;
    avgDailyCodingMinutes: number;
    totalProjectMinutes: number;
    totalGateMinutes: number;
    totalDeepWorkHours: number;
  };
  entertainmentMetrics: {
    totalEntertainmentMinutes: number;
    avgDailyMinutes: number;
    compliantDays: number;
    complianceRate: number;
  };
  sleepHygieneMetrics: {
    screensOffRate: number;
    tomorrowPlannedRate: number;
    bedOnlyForSleepRate: number;
    onTimeSleepRate: number;
  };
  recommendations: ImprovementRecommendation[];
  actionBlueprint: {
    primaryFocusPillar: string;
    secondaryFocusPillar: string;
    goldenRuleToEnforce: string;
    weeklyTargetScore: number;
    dailyChecklistReminder: string[];
  };
}

export function generateReportAnalysis(
  records: Record<string, DailyRecord>,
  timeframe: ReportTimeframe = 'last7',
  customEndDate: string = new Date().toISOString().split('T')[0]
): DetailedReportAnalysis {
  // Determine date bounds
  const end = new Date(customEndDate);
  const datesInRange: string[] = [];

  let daysBack = 7;
  if (timeframe === 'last14') daysBack = 14;
  else if (timeframe === 'last30') daysBack = 30;
  else if (timeframe === 'all') daysBack = 90;

  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    datesInRange.push(`${yyyy}-${mm}-${dd}`);
  }

  const startDate = datesInRange[0];
  const endDate = datesInRange[datesInRange.length - 1];

  // Filter records that exist in this range
  const relevantRecords: { date: string; record: DailyRecord; score: ScoreBreakdown }[] = [];
  datesInRange.forEach((dateStr) => {
    const rec = records[dateStr];
    if (rec) {
      relevantRecords.push({
        date: dateStr,
        record: rec,
        score: calculateScore(rec),
      });
    }
  });

  const totalDaysInRange = datesInRange.length;
  const daysLoggedCount = relevantRecords.length;
  const completionRate = totalDaysInRange > 0 ? Math.round((daysLoggedCount / totalDaysInRange) * 100) : 0;

  // Calculate scores and metrics
  let totalScoreSum = 0;
  let perfect6 = 0;
  let strong5 = 0;
  let acceptable4 = 0;
  let subparUnder4 = 0;

  // Study & Work time
  let totalCodingMinutes = 0;
  let totalProjectMinutes = 0;
  let totalGateMinutes = 0;
  let totalEntertainmentMinutes = 0;
  let entertainmentCompliantDays = 0;

  // Sleep metrics
  let screensOffDays = 0;
  let tomorrowPlannedDays = 0;
  let bedOnlySleepDays = 0;
  let sleptOnTimeDays = 0;

  // Pillar tracking
  const pillarSuccess = {
    H: 0,
    O: 0,
    S: 0,
    T: 0,
    E: 0,
    L: 0,
  };

  // Sub-metric counters
  let h_wakeNoPhone = 0;
  let h_waterFreshen = 0;
  let h_aptitude = 0;

  let o_resources = 0;
  let o_prioritiesCompletedTotal = 0;
  let o_prioritiesCountTotal = 0;

  let s_aptitudeBreak = 0;
  let s_codingRead = 0;
  let s_csConcept = 0;

  let t_codingDone = 0;
  let t_projectOrGateDone = 0;

  let e_after930 = 0;
  let e_under30 = 0;
  let e_noBinge = 0;

  // Distraction counts
  const distractionMap: Record<string, number> = {};

  relevantRecords.forEach(({ record, score }) => {
    totalScoreSum += score.totalScore;
    if (score.totalScore === 6) perfect6++;
    else if (score.totalScore === 5) strong5++;
    else if (score.totalScore === 4) acceptable4++;
    else subparUnder4++;

    // Pillars
    if (score.hardStart) pillarSuccess.H++;
    if (score.organize) pillarSuccess.O++;
    if (score.smallSessions) pillarSuccess.S++;
    if (score.targetedWork) pillarSuccess.T++;
    if (score.entertainment) pillarSuccess.E++;
    if (score.lightsOut) pillarSuccess.L++;

    // Hard start submetrics
    if (record.hardStart.wakeNoPhone) h_wakeNoPhone++;
    if (record.hardStart.waterFreshen) h_waterFreshen++;
    if (record.hardStart.aptitudeDone || record.hardStart.aptitudeCount >= 15) h_aptitude++;

    // Organize submetrics
    if (record.organize.resourcesPrepared) o_resources++;
    const prList = record.organize.priorities || [];
    o_prioritiesCountTotal += prList.length;
    o_prioritiesCompletedTotal += prList.filter((p) => p.completed).length;

    // Small sessions
    if (record.smallSessions.aptitudeBreakDone) s_aptitudeBreak++;
    if (record.smallSessions.codingProblemRead) s_codingRead++;
    if (record.smallSessions.csConceptRevised) s_csConcept++;

    // Targeted work
    totalCodingMinutes += record.targetedWork.codingMinutes || 0;
    totalProjectMinutes += record.targetedWork.projectMinutes || 0;
    totalGateMinutes += record.targetedWork.gateMinutes || 0;
    if (record.targetedWork.codingCompleted || (record.targetedWork.codingMinutes || 0) >= 45) t_codingDone++;
    if (
      record.targetedWork.projectCompleted ||
      record.targetedWork.gateCompleted ||
      (record.targetedWork.projectMinutes || 0) >= 30 ||
      (record.targetedWork.gateMinutes || 0) >= 20
    ) {
      t_projectOrGateDone++;
    }

    // Entertainment
    totalEntertainmentMinutes += record.entertainment.actualDurationMins || 0;
    if (record.entertainment.startedAfter930) e_after930++;
    if (record.entertainment.under30Mins) e_under30++;
    if (record.entertainment.noWeekdayBinge) e_noBinge++;
    if (score.entertainment) entertainmentCompliantDays++;

    // Lights out
    if (record.lightsOut.screensOffEarly) screensOffDays++;
    if (record.lightsOut.tomorrowTop3Written) tomorrowPlannedDays++;
    if (record.lightsOut.bedOnlyForSleep) bedOnlySleepDays++;
    if (record.lightsOut.sleptBetween11And12) sleptOnTimeDays++;

    // Distractions
    if (record.distractions && Array.isArray(record.distractions)) {
      record.distractions.forEach((dist) => {
        distractionMap[dist] = (distractionMap[dist] || 0) + 1;
      });
    }
  });

  const divisor = daysLoggedCount > 0 ? daysLoggedCount : 1;
  const averageScore = daysLoggedCount > 0 ? Number((totalScoreSum / daysLoggedCount).toFixed(2)) : 0;

  // Grade determination
  let productivityGrade = {
    grade: 'A+',
    description: 'Elite Hostel Execution — Consistent Top Tier',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgBadge: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  };

  if (averageScore >= 5.5) {
    productivityGrade = {
      grade: 'A+',
      description: 'Elite Execution — You are dominating the hostel environment',
      color: 'text-emerald-700 dark:text-emerald-400',
      bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    };
  } else if (averageScore >= 4.8) {
    productivityGrade = {
      grade: 'A',
      description: 'Strong & Consistent — High placement & academic readiness',
      color: 'text-teal-700 dark:text-teal-400',
      bgBadge: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
    };
  } else if (averageScore >= 4.0) {
    productivityGrade = {
      grade: 'B+',
      description: 'Good Baseline — Minor leakages in evening boundaries or mornings',
      color: 'text-amber-700 dark:text-amber-400',
      bgBadge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    };
  } else if (averageScore >= 3.0) {
    productivityGrade = {
      grade: 'C',
      description: 'Vulnerable to Room Distractions — System reset advised',
      color: 'text-orange-700 dark:text-orange-400',
      bgBadge: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800',
    };
  } else {
    productivityGrade = {
      grade: 'D',
      description: 'Critical Leakage — Hostel noise & phone scrolling taking over',
      color: 'text-rose-700 dark:text-rose-400',
      bgBadge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    };
  }

  // Pillar statistics
  const pillarStats: PillarStat[] = [
    {
      letter: 'H',
      title: 'Hard Start Protocol',
      subtitle: 'Morning momentum & phone resistance',
      passedDays: pillarSuccess.H,
      totalDays: daysLoggedCount,
      successRate: Math.round((pillarSuccess.H / divisor) * 100),
      status:
        pillarSuccess.H / divisor >= 0.85
          ? 'Mastered'
          : pillarSuccess.H / divisor >= 0.65
          ? 'Solid'
          : pillarSuccess.H / divisor >= 0.45
          ? 'Inconsistent'
          : 'Needs Work',
      subMetrics: [
        { label: 'No Phone at Wakeup', value: `${Math.round((h_wakeNoPhone / divisor) * 100)}%` },
        { label: 'Water & Freshen Up', value: `${Math.round((h_waterFreshen / divisor) * 100)}%` },
        { label: 'Morning Aptitude (15+ Qs)', value: `${Math.round((h_aptitude / divisor) * 100)}%` },
      ],
    },
    {
      letter: 'O',
      title: 'Organize Daily Priorities',
      subtitle: 'Top 3 objectives & resource preparation',
      passedDays: pillarSuccess.O,
      totalDays: daysLoggedCount,
      successRate: Math.round((pillarSuccess.O / divisor) * 100),
      status:
        pillarSuccess.O / divisor >= 0.85
          ? 'Mastered'
          : pillarSuccess.O / divisor >= 0.65
          ? 'Solid'
          : pillarSuccess.O / divisor >= 0.45
          ? 'Inconsistent'
          : 'Needs Work',
      subMetrics: [
        { label: 'Resources Pre-staged', value: `${Math.round((o_resources / divisor) * 100)}%` },
        {
          label: 'Priority Task Completion',
          value: `${o_prioritiesCountTotal > 0 ? Math.round((o_prioritiesCompletedTotal / o_prioritiesCountTotal) * 100) : 0}%`,
        },
      ],
    },
    {
      letter: 'S',
      title: 'Small Sessions (Micro-learning)',
      subtitle: 'College break aptitude, coding & CS theory',
      passedDays: pillarSuccess.S,
      totalDays: daysLoggedCount,
      successRate: Math.round((pillarSuccess.S / divisor) * 100),
      status:
        pillarSuccess.S / divisor >= 0.85
          ? 'Mastered'
          : pillarSuccess.S / divisor >= 0.65
          ? 'Solid'
          : pillarSuccess.S / divisor >= 0.45
          ? 'Inconsistent'
          : 'Needs Work',
      subMetrics: [
        { label: 'Break Aptitude Solved', value: `${Math.round((s_aptitudeBreak / divisor) * 100)}%` },
        { label: 'Coding Problem Analyzed', value: `${Math.round((s_codingRead / divisor) * 100)}%` },
        { label: 'Core CS Concept Revised', value: `${Math.round((s_csConcept / divisor) * 100)}%` },
      ],
    },
    {
      letter: 'T',
      title: 'Targeted Evening Deep Work',
      subtitle: 'Coding, capstone project & GATE blocks',
      passedDays: pillarSuccess.T,
      totalDays: daysLoggedCount,
      successRate: Math.round((pillarSuccess.T / divisor) * 100),
      status:
        pillarSuccess.T / divisor >= 0.85
          ? 'Mastered'
          : pillarSuccess.T / divisor >= 0.65
          ? 'Solid'
          : pillarSuccess.T / divisor >= 0.45
          ? 'Inconsistent'
          : 'Needs Work',
      subMetrics: [
        { label: 'Deep Coding Practice', value: `${Math.round((t_codingDone / divisor) * 100)}%` },
        { label: 'Project or GATE Block', value: `${Math.round((t_projectOrGateDone / divisor) * 100)}%` },
        { label: 'Avg Daily Deep Work', value: `${Math.round((totalCodingMinutes + totalProjectMinutes + totalGateMinutes) / divisor)} min` },
      ],
    },
    {
      letter: 'E',
      title: 'Entertainment Firewall',
      subtitle: 'Post-9:30 PM rule, <30m cap, zero binge',
      passedDays: pillarSuccess.E,
      totalDays: daysLoggedCount,
      successRate: Math.round((pillarSuccess.E / divisor) * 100),
      status:
        pillarSuccess.E / divisor >= 0.85
          ? 'Mastered'
          : pillarSuccess.E / divisor >= 0.65
          ? 'Solid'
          : pillarSuccess.E / divisor >= 0.45
          ? 'Inconsistent'
          : 'Needs Work',
      subMetrics: [
        { label: 'Strict Post-9:30 PM Start', value: `${Math.round((e_after930 / divisor) * 100)}%` },
        { label: 'Capped Under 30 Minutes', value: `${Math.round((e_under30 / divisor) * 100)}%` },
        { label: 'Zero Weekday Binge', value: `${Math.round((e_noBinge / divisor) * 100)}%` },
      ],
    },
    {
      letter: 'L',
      title: 'Lights Out & Sleep Discipline',
      subtitle: 'Screens off early, prep tomorrow, bed-only-for-sleep',
      passedDays: pillarSuccess.L,
      totalDays: daysLoggedCount,
      successRate: Math.round((pillarSuccess.L / divisor) * 100),
      status:
        pillarSuccess.L / divisor >= 0.85
          ? 'Mastered'
          : pillarSuccess.L / divisor >= 0.65
          ? 'Solid'
          : pillarSuccess.L / divisor >= 0.45
          ? 'Inconsistent'
          : 'Needs Work',
      subMetrics: [
        { label: 'Screens Off 20m Early', value: `${Math.round((screensOffDays / divisor) * 100)}%` },
        { label: 'Tomorrow Top 3 Staged', value: `${Math.round((tomorrowPlannedDays / divisor) * 100)}%` },
        { label: 'Bed Exclusively For Sleep', value: `${Math.round((bedOnlySleepDays / divisor) * 100)}%` },
        { label: 'Slept 11 PM - 12 AM', value: `${Math.round((sleptOnTimeDays / divisor) * 100)}%` },
      ],
    },
  ];

  // Identify Strengths & Bottlenecks
  const sortedPillars = [...pillarStats].sort((a, b) => b.successRate - a.successRate);
  const topStrengths: string[] = [];
  const criticalBottlenecks: string[] = [];

  sortedPillars.slice(0, 2).forEach((p) => {
    if (p.successRate >= 60) {
      topStrengths.push(`${p.title} (${p.successRate}% compliance): High execution reliability.`);
    }
  });
  if (topStrengths.length === 0) {
    topStrengths.push('Consistent logging habit initialized. Continued tracking builds data precision.');
  }

  sortedPillars.slice(-2).reverse().forEach((p) => {
    if (p.successRate < 75) {
      criticalBottlenecks.push(`${p.title} (${p.successRate}% compliance): Point leakage area.`);
    }
  });
  if (criticalBottlenecks.length === 0) {
    criticalBottlenecks.push('All 6 pillars are currently meeting strong baseline thresholds. Focus on sustaining streak integrity.');
  }

  // Distraction summary
  const totalDistractions = Object.values(distractionMap).reduce((a, b) => a + b, 0);
  const distractionSummary = Object.entries(distractionMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalDistractions > 0 ? Math.round((count / totalDistractions) * 100) : 0,
    }));

  // Recommendations Generation
  const recommendations: ImprovementRecommendation[] = [];

  // Check H
  const hStat = pillarStats.find((p) => p.letter === 'H')!;
  if (hStat.successRate < 70) {
    recommendations.push({
      id: 'rec-hard-start',
      pillar: 'H',
      title: 'The Morning Hostel Phone Trap Elimination',
      category: 'Morning Routine',
      severity: 'Critical',
      whyItMatters:
        'Checking notifications or social media right when waking in a hostel bunk floods your dopamine receptors, delaying your morning study momentum by 45 to 90 minutes.',
      concreteSteps: [
        'Place your phone at least 2 meters away from your bed (on your study desk or shelf) before going to sleep.',
        'Keep a full 1-liter water bottle on your desk. Down 500ml immediately upon feet hitting the floor.',
        'Set an explicit 15-minute timer to solve 15 quantitative/logical aptitude questions before opening WhatsApp or Instagram.',
      ],
      expectedImpact: '+0.9 daily score boost & 45 minutes saved before college departure',
    });
  }

  // Check E
  const eStat = pillarStats.find((p) => p.letter === 'E')!;
  if (eStat.successRate < 70) {
    recommendations.push({
      id: 'rec-entertainment',
      pillar: 'E',
      title: 'Hostel Evening Entertainment Firewall',
      category: 'Evening Focus',
      severity: 'Critical',
      whyItMatters:
        'Unchecked evening streaming or casual gaming in the hostel room bleeds past 10 PM, ruining tomorrow morning’s wakeup and diluting deep coding blocks.',
      concreteSteps: [
        'Enforce the 9:30 PM Rule: Zero YouTube/Netflix/Gaming allowed prior to 9:30 PM under any circumstance.',
        'Use the "1-Episode Only" contract: Pick only content that finishes within 25–30 minutes, never multi-hour queues.',
        'Set a physical alarm at 10:00 PM labeled "Hostel Entertainment Hard Cutoff" and shut your laptop screen immediately when it rings.',
      ],
      expectedImpact: '+1.0 daily score boost & eliminates next-day sleep debt',
    });
  }

  // Check T
  const tStat = pillarStats.find((p) => p.letter === 'T')!;
  if (tStat.successRate < 70) {
    recommendations.push({
      id: 'rec-targeted-work',
      pillar: 'T',
      title: 'Targeted Evening Deep Coding Lock-In',
      category: 'Evening Focus',
      severity: 'Important',
      whyItMatters:
        'Evening hours (6:00 PM – 9:00 PM) are prime placement and skill acquisition hours. When wasted on corridor chat or idle browsing, technical progress halts.',
      concreteSteps: [
        'Use the Active Focus Mode timer: Start with one 45-minute unbroken sprint before dinner.',
        'Wear headphones or study in the hostel reading hall / library during peak room socializing hours (7 PM to 8:30 PM).',
        'Have your IDE and LeetCode/project folder open before you sit down, removing friction.',
      ],
      expectedImpact: '+45 to 90 minutes of verified coding practice per day',
    });
  }

  // Check L
  const lStat = pillarStats.find((p) => p.letter === 'L')!;
  if (lStat.successRate < 70) {
    recommendations.push({
      id: 'rec-lights-out',
      pillar: 'L',
      title: 'Bed Partitioning & Sleep Sanctuary Protocol',
      category: 'Sleep & Recovery',
      severity: 'Critical',
      whyItMatters:
        'Studying or scrolling in bed trains your brain to treat the mattress as an active workspace, causing insomnia, late sleep, and groggy college mornings.',
      concreteSteps: [
        'Strict Law: Mattress is for sleep only. Never study, code, or watch shows under the blankets.',
        'At 10:30 PM, spend 3 minutes writing tomorrow’s top 3 priority objectives in the Organize section.',
        'Turn screens off 20 minutes before lights out; let eyes readjust away from blue light.',
      ],
      expectedImpact: 'Higher cognitive retention and effortless 6:30 AM wakeups without alarm exhaustion',
    });
  }

  // Check O & S
  const sStat = pillarStats.find((p) => p.letter === 'S')!;
  if (sStat.successRate < 70) {
    recommendations.push({
      id: 'rec-small-sessions',
      pillar: 'S',
      title: 'Leveraging In-Between College Gaps',
      category: 'Routine Optimization',
      severity: 'Optimization',
      whyItMatters:
        'College timetables contain 15–30 minute dead gaps (between lectures, lab prep, hostel lunch return) that add up to 2.5 hours per week if captured.',
      concreteSteps: [
        'Read 1 LeetCode problem description during lunch break and brainstorm edge cases in your head.',
        'Review one core CS card (OS paging, DBMS indexing, OOP polymorphism, TCP handshake) on your phone while waiting.',
        'Log it in the Small Sessions section immediately to bank your daily S point.',
      ],
      expectedImpact: 'Mastery of core placement subjects without sacrificing evening coding time',
    });
  }

  // Distraction intervention if frequent distractions recorded
  if (distractionSummary.length > 0 && distractionSummary[0].count >= 2) {
    const topDistraction = distractionSummary[0].name;
    recommendations.push({
      id: 'rec-distractions',
      pillar: 'GENERAL',
      title: `Neutralizing Top Distraction: ${topDistraction}`,
      category: 'Environment & Distractions',
      severity: 'Important',
      whyItMatters: `Logged ${distractionSummary[0].count} times during this period, making it the #1 source of focus interruptions in your hostel routine.`,
      concreteSteps: [
        'Set up a "Hostel Study Pact": Tell roommates politely: "I am in a 60-min deep coding block until 8:00 PM, let\'s catch up right after for tea/canteen".',
        'Use physical visual cues: Put on over-ear headphones as a polite universal signal of deep concentration.',
        'If the hostel room is too chaotic, relocate to the college library or quiet study room for the targeted work window.',
      ],
      expectedImpact: 'Recovers an estimated 3.5 hours of interrupted attention every week',
    });
  }

  // Always ensure at least 2 strong recommendations
  if (recommendations.length < 2) {
    recommendations.push({
      id: 'rec-streak-protection',
      pillar: 'GENERAL',
      title: 'Compound Streak Momentum & Never-Miss-Twice Rule',
      category: 'Routine Optimization',
      severity: 'Optimization',
      whyItMatters: 'Your system discipline is strong. The biggest risk now is complacency following a single off-day.',
      concreteSteps: [
        'Adopt the "Never Miss Twice" rule: If college exams or events cause a 3/6 score today, guarantee a minimum 5/6 tomorrow.',
        'Use prefilled priority templates on busy lab days so you don\'t skip the organize pillar.',
      ],
      expectedImpact: 'Protects streak continuity and ensures permanent habit crystallization',
    });
  }

  // Action Blueprint
  const weakestPillar = sortedPillars[sortedPillars.length - 1];
  const secondWeakest = sortedPillars[sortedPillars.length - 2] || weakestPillar;

  const actionBlueprint = {
    primaryFocusPillar: `${weakestPillar.letter} — ${weakestPillar.title} (${weakestPillar.successRate}% compliance)`,
    secondaryFocusPillar: `${secondWeakest.letter} — ${secondWeakest.title} (${secondWeakest.successRate}% compliance)`,
    goldenRuleToEnforce: 'Bed strictly for sleep. No phone at morning wakeup. Evening entertainment locked until 9:30 PM.',
    weeklyTargetScore: Math.min(6.0, Number((Math.max(4.5, averageScore + 0.6)).toFixed(1))),
    dailyChecklistReminder: [
      'Morning: 500ml water + 15 aptitude questions before phone unlocks',
      'Afternoon: Read 1 coding problem during college gap',
      'Evening: 45–60 mins unbroken coding block in Active Focus Mode',
      'Night: Cut off all shows by 10:00 PM; prep tomorrow’s Top 3 items',
    ],
  };

  return {
    timeframe,
    startDate,
    endDate,
    totalDaysInRange,
    daysLoggedCount,
    completionRate,
    averageScore,
    productivityGrade,
    scoreDistribution: {
      perfect6,
      strong5,
      acceptable4,
      subparUnder4,
    },
    pillarStats,
    topStrengths,
    criticalBottlenecks,
    distractionSummary,
    studyTimeMetrics: {
      totalCodingMinutes,
      avgDailyCodingMinutes: Math.round(totalCodingMinutes / divisor),
      totalProjectMinutes,
      totalGateMinutes,
      totalDeepWorkHours: Number(((totalCodingMinutes + totalProjectMinutes + totalGateMinutes) / 60).toFixed(1)),
    },
    entertainmentMetrics: {
      totalEntertainmentMinutes,
      avgDailyMinutes: Math.round(totalEntertainmentMinutes / divisor),
      compliantDays: entertainmentCompliantDays,
      complianceRate: Math.round((entertainmentCompliantDays / divisor) * 100),
    },
    sleepHygieneMetrics: {
      screensOffRate: Math.round((screensOffDays / divisor) * 100),
      tomorrowPlannedRate: Math.round((tomorrowPlannedDays / divisor) * 100),
      bedOnlyForSleepRate: Math.round((bedOnlySleepDays / divisor) * 100),
      onTimeSleepRate: Math.round((sleptOnTimeDays / divisor) * 100),
    },
    recommendations,
    actionBlueprint,
  };
}
