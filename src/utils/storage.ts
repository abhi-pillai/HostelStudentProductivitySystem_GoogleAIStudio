import { DailyRecord, ScoreBreakdown, PriorityItem } from '../types';

const STORAGE_KEY = 'hostel_student_productivity_records_v1';

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getDefaultRecord(date: string = getTodayDateString()): DailyRecord {
  return {
    date,
    hardStart: {
      wakeNoPhone: false,
      waterFreshen: false,
      aptitudeDone: false,
      aptitudeCount: 0
    },
    organize: {
      priorities: [
        { id: '1', text: 'DSA / LeetCode Problem Solving (Tree & Graphs)', timeSlot: '05:30 PM - 06:30 PM', category: 'Coding', completed: false },
        { id: '2', text: 'College Capstone / Academic Project Module', timeSlot: '06:45 PM - 07:30 PM', category: 'Project', completed: false },
        { id: '3', text: 'GATE / Core CS Concepts (OS & DBMS MCQs)', timeSlot: '07:45 PM - 08:30 PM', category: 'GATE', completed: false }
      ],
      resourcesPrepared: false
    },
    smallSessions: {
      aptitudeBreakDone: false,
      aptitudeBreakCount: 0,
      codingProblemRead: false,
      codingProblemTitle: '',
      csConceptRevised: false,
      csSubject: 'OS',
      csNotes: ''
    },
    targetedWork: {
      codingMinutes: 0,
      codingCompleted: false,
      projectMinutes: 0,
      projectCompleted: false,
      gateMinutes: 0,
      gateCompleted: false,
      notes: ''
    },
    entertainment: {
      startedAfter930: false,
      under30Mins: true,
      noWeekdayBinge: true,
      entertainmentType: '',
      actualDurationMins: 0
    },
    lightsOut: {
      screensOffEarly: false,
      tomorrowTop3Written: false,
      sleptBetween11And12: false,
      bedOnlyForSleep: true
    },
    dailyNotes: ''
  };
}

export function getAllRecords(): Record<string, DailyRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default today's record
      const today = getTodayDateString();
      const initial: Record<string, DailyRecord> = {
        [today]: getDefaultRecord(today)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse local records', err);
    return {};
  }
}

export function saveRecord(record: DailyRecord): void {
  try {
    const records = getAllRecords();
    records[record.date] = record;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save record', err);
  }
}

export function getRecordForDate(date: string): DailyRecord {
  const records = getAllRecords();
  if (records[date]) {
    return records[date];
  }
  return getDefaultRecord(date);
}

export function calculateScore(record: DailyRecord): ScoreBreakdown {
  // H: Hard Start -> Wake no phone + water/freshen + aptitude practice (either checkbox or count >= 15)
  const hardStartPassed = 
    record.hardStart.wakeNoPhone && 
    record.hardStart.waterFreshen && 
    (record.hardStart.aptitudeDone || record.hardStart.aptitudeCount >= 15);

  // O: Organize -> At least 3 priorities defined with content
  const validPriorities = record.organize.priorities.filter(p => p.text.trim().length > 0);
  const organizePassed = validPriorities.length >= 3 && record.organize.resourcesPrepared;

  // S: Small Sessions -> Either solved break aptitude, read coding problem, or revised CS concept
  const smallSessionsPassed = 
    record.smallSessions.aptitudeBreakDone || 
    record.smallSessions.codingProblemRead || 
    record.smallSessions.csConceptRevised;

  // T: Targeted Evening Work -> Completed core coding practice + project or GATE
  const targetedWorkPassed = 
    (record.targetedWork.codingCompleted || record.targetedWork.codingMinutes >= 45) &&
    (record.targetedWork.projectCompleted || record.targetedWork.gateCompleted || 
     record.targetedWork.projectMinutes >= 30 || record.targetedWork.gateMinutes >= 20);

  // E: Entertainment Control -> Started strictly after 9:30 PM & under 30 mins & no weekday binge
  const entertainmentPassed = 
    record.entertainment.startedAfter930 && 
    record.entertainment.under30Mins && 
    record.entertainment.noWeekdayBinge;

  // L: Lights Out Discipline -> Screens off 20m before bed, planned tomorrow, slept between 11-12, bed only for sleep
  const lightsOutPassed = 
    record.lightsOut.screensOffEarly && 
    record.lightsOut.tomorrowTop3Written && 
    record.lightsOut.bedOnlyForSleep;

  let totalScore = 0;
  if (hardStartPassed) totalScore += 1;
  if (organizePassed) totalScore += 1;
  if (smallSessionsPassed) totalScore += 1;
  if (targetedWorkPassed) totalScore += 1;
  if (entertainmentPassed) totalScore += 1;
  if (lightsOutPassed) totalScore += 1;

  let verdict = 'System reset required';
  let verdictColor = 'text-rose-600 dark:text-rose-400';

  if (totalScore === 6) {
    verdict = '6 — Excellent execution';
    verdictColor = 'text-emerald-700 dark:text-emerald-400';
  } else if (totalScore === 5) {
    verdict = '5 — Strong day';
    verdictColor = 'text-teal-700 dark:text-teal-400';
  } else if (totalScore === 4) {
    verdict = '4 — Acceptable progress';
    verdictColor = 'text-amber-700 dark:text-amber-400';
  } else if (totalScore === 3) {
    verdict = '3 — Weak execution';
    verdictColor = 'text-orange-700 dark:text-orange-400';
  } else {
    verdict = `${totalScore} — System reset required`;
    verdictColor = 'text-rose-700 dark:text-rose-400';
  }

  return {
    hardStart: hardStartPassed,
    organize: organizePassed,
    smallSessions: smallSessionsPassed,
    targetedWork: targetedWorkPassed,
    entertainment: entertainmentPassed,
    lightsOut: lightsOutPassed,
    totalScore,
    verdict,
    verdictColor
  };
}

export function calculateStreak(): { currentStreak: number; bestStreak: number; totalLoggedDays: number } {
  const records = getAllRecords();
  const dates = Object.keys(records).sort();
  if (dates.length === 0) return { currentStreak: 0, bestStreak: 0, totalLoggedDays: 0 };

  let currentStreak = 0;
  let bestStreak = 0;
  let running = 0;

  // Check from today backwards
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const record = records[dateStr];
    if (record) {
      const score = calculateScore(record).totalScore;
      if (score >= 4) {
        if (i === 0 || currentStreak === i) {
          currentStreak++;
        }
      } else {
        if (i > 0) break;
      }
    } else {
      if (i > 0) break;
    }
  }

  // Calculate best overall
  dates.forEach(dateStr => {
    const score = calculateScore(records[dateStr]).totalScore;
    if (score >= 4) {
      running++;
      if (running > bestStreak) bestStreak = running;
    } else {
      running = 0;
    }
  });

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    totalLoggedDays: dates.length
  };
}
