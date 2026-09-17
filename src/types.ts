export type PriorityCategory = 'Coding' | 'Academics' | 'GATE' | 'Placement' | 'Project' | 'Other';

export interface PriorityItem {
  id: string;
  text: string;
  timeSlot: string;
  category: PriorityCategory;
  completed: boolean;
}

export interface HardStartData {
  wakeNoPhone: boolean;
  waterFreshen: boolean;
  aptitudeDone: boolean;
  aptitudeCount: number;
}

export interface OrganizeData {
  priorities: PriorityItem[];
  resourcesPrepared: boolean;
}

export interface SmallSessionsData {
  aptitudeBreakDone: boolean;
  aptitudeBreakCount: number;
  codingProblemRead: boolean;
  codingProblemTitle: string;
  csConceptRevised: boolean;
  csSubject: 'OS' | 'DBMS' | 'OOP' | 'CN' | 'General';
  csNotes: string;
}

export interface TargetedWorkData {
  codingMinutes: number;
  codingCompleted: boolean;
  projectMinutes: number;
  projectCompleted: boolean;
  gateMinutes: number;
  gateCompleted: boolean;
  notes: string;
}

export interface EntertainmentData {
  startedAfter930: boolean;
  under30Mins: boolean;
  noWeekdayBinge: boolean;
  entertainmentType: string;
  actualDurationMins: number;
}

export interface LightsOutData {
  screensOffEarly: boolean; // 20 mins before bed
  tomorrowTop3Written: boolean;
  sleptBetween11And12: boolean;
  bedOnlyForSleep: boolean; // strictly no studying, watching shows, or scrolling in bed
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  dailyFocusGoal?: string; // The single most important objective for the day
  hardStart: HardStartData;
  organize: OrganizeData;
  smallSessions: SmallSessionsData;
  targetedWork: TargetedWorkData;
  entertainment: EntertainmentData;
  lightsOut: LightsOutData;
  dailyNotes?: string;
}

export interface ScoreBreakdown {
  hardStart: boolean;
  organize: boolean;
  smallSessions: boolean;
  targetedWork: boolean;
  entertainment: boolean;
  lightsOut: boolean;
  totalScore: number;
  verdict: string;
  verdictColor: string;
}
