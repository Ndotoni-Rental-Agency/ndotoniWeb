// ─── Storage keys ─────────────────────────────────────────────────────────────
export const BUSY_KEY     = 'ndotoni_busy_v4';
export const MEETINGS_KEY = 'ndotoni_meetings_v4';
export const DAYS_SHORT   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// All 24 UTC hours — grid scrolls horizontally
export const UTC_HOURS = Array.from({ length: 24 }, (_, i) => i); // UTC 00–23

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BusyBlock {
  id: string;
  startUtc: string;
  endUtc:   string;
  title?:   string; // optional reason e.g. "Doctor appointment", "School pickup"
  recurrence?: {
    type: 'once' | 'daily' | 'weekly';
    days?: number[];      // for weekly: 0=Sun,1=Mon...6=Sat
    endDate: string;      // local YYYY-MM-DD — block repeats until this date
  };
}

export interface PersonData {
  name: string;
  role?: string;
  blocks: BusyBlock[];
  updatedAt: string;
}

export interface BusyStore { [userId: string]: PersonData }

export interface Meeting {
  id: string; title: string; description: string; link: string;
  startUtc: string; endUtc: string;
  attendeeIds: string[]; createdBy: string; createdByName: string; createdAt: string;
}

// ─── Colors ───────────────────────────────────────────────────────────────────
export const PERSON_COLORS = [
  { col: 'bg-green-500',  light: 'bg-green-50 dark:bg-green-900/20',   busy: 'bg-red-400 dark:bg-red-600' },
  { col: 'bg-blue-500',   light: 'bg-blue-50 dark:bg-blue-900/20',     busy: 'bg-red-400 dark:bg-red-600' },
  { col: 'bg-purple-500', light: 'bg-purple-50 dark:bg-purple-900/20', busy: 'bg-red-400 dark:bg-red-600' },
  { col: 'bg-orange-500', light: 'bg-orange-50 dark:bg-orange-900/20', busy: 'bg-red-400 dark:bg-red-600' },
  { col: 'bg-pink-500',   light: 'bg-pink-50 dark:bg-pink-900/20',     busy: 'bg-red-400 dark:bg-red-600' },
];

export const MTG_COLORS = [
  'bg-teal-400',
  'bg-indigo-400',
  'bg-amber-400',
  'bg-rose-400',
];
