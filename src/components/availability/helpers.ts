import { BusyBlock, PersonData, BusyStore, Meeting, BUSY_KEY, MEETINGS_KEY } from './types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function getWeekDates(ref: Date): Date[] {
  const d = new Date(ref); d.setHours(0,0,0,0);
  const mon = new Date(d);
  mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const x = new Date(mon); x.setDate(mon.getDate()+i); return x; });
}

export function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export function isToday(d: Date) {
  const t = new Date();
  return d.getDate()===t.getDate() && d.getMonth()===t.getMonth() && d.getFullYear()===t.getFullYear();
}

export function localTzName() { return Intl.DateTimeFormat().resolvedOptions().timeZone; }

/** Local time label for a UTC hour on a given local day */
export function localHourLabel(utcH: number, day: Date) {
  return new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), utcH))
    .toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(':00','');
}

export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
}

export function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
}

/** UTC ms for utcH on a local calendar day */
export function utcMsForHour(day: Date, utcH: number) {
  return Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), utcH);
}

/** Expand a potentially recurring block into individual occurrences for a given day */
export function expandBlockForDay(block: BusyBlock, day: Date): BusyBlock[] {
  const dayStr = toLocalDateStr(day);

  // Non-recurring (one-time) — just check if this day overlaps
  if (!block.recurrence || block.recurrence.type === 'once') {
    const dayStart = new Date(dayStr + 'T00:00:00').getTime();
    const dayEnd   = dayStart + 86400000;
    const bs = new Date(block.startUtc).getTime();
    const be = new Date(block.endUtc).getTime();
    if (bs < dayEnd && be > dayStart) return [block];
    return [];
  }

  // Check if day is within recurrence range
  const blockOrigDate = toLocalDateStr(new Date(block.startUtc));
  if (dayStr < blockOrigDate || dayStr > block.recurrence.endDate) return [];

  const dow = day.getDay(); // 0=Sun
  if (block.recurrence.type === 'weekly' && block.recurrence.days && !block.recurrence.days.includes(dow)) return [];

  // Build the occurrence for this day using the original time-of-day
  const origStart = new Date(block.startUtc);
  const origEnd   = new Date(block.endUtc);
  const startH = origStart.getHours(), startM = origStart.getMinutes();
  const endH   = origEnd.getHours(),   endM   = origEnd.getMinutes();

  const occStart = new Date(`${dayStr}T${String(startH).padStart(2,'0')}:${String(startM).padStart(2,'0')}:00`);
  const occEnd   = new Date(`${dayStr}T${String(endH).padStart(2,'0')}:${String(endM).padStart(2,'0')}:00`);

  return [{
    ...block,
    id: `${block.id}_${dayStr}`, // virtual ID per occurrence
    startUtc: occStart.toISOString(),
    endUtc: occEnd.toISOString(),
  }];
}

/** Get all effective blocks for a person on a given day (expands recurrences) */
export function effectiveBlocksForDay(data: PersonData, day: Date): BusyBlock[] {
  return data.blocks.flatMap(b => expandBlockForDay(b, day));
}

/** Does a block overlap a given UTC hour slot? */
export function blockOverlapsHour(b: BusyBlock, day: Date, utcH: number): boolean {
  const slotS = utcMsForHour(day, utcH);
  const slotE = slotS + 3600000;
  const bs = new Date(b.startUtc).getTime();
  const be = new Date(b.endUtc).getTime();
  return bs < slotE && be > slotS;
}

/** Meeting overlap check */
export function meetingsForDay(meetings: Meeting[], day: Date): Meeting[] {
  const s = utcMsForHour(day, 0);
  const e = s + 86400000;
  return meetings.filter(m => {
    const ms = new Date(m.startUtc).getTime();
    const me = new Date(m.endUtc).getTime();
    return ms < e && me > s;
  });
}

export function meetingOverlapsHour(m: Meeting, day: Date, utcH: number): boolean {
  const slotS = utcMsForHour(day, utcH);
  const slotE = slotS + 3600000;
  const ms = new Date(m.startUtc).getTime();
  const me = new Date(m.endUtc).getTime();
  return ms < slotE && me > slotS;
}

/**
 * For rendering: given a block and a UTC hour column, return
 * left% offset and width% within that column's 60-minute span.
 */
export function blockPortionInHour(b: BusyBlock, day: Date, utcH: number): { left: number; width: number } | null {
  const slotS = utcMsForHour(day, utcH);
  const slotE = slotS + 3600000;
  const bs = Math.max(new Date(b.startUtc).getTime(), slotS);
  const be = Math.min(new Date(b.endUtc).getTime(), slotE);
  if (be <= bs) return null;
  const left  = ((bs - slotS) / 3600000) * 100;
  const width = ((be - bs) / 3600000) * 100;
  return { left, width };
}

export function meetingPortionInHour(m: Meeting, day: Date, utcH: number): { left: number; width: number } | null {
  return blockPortionInHour({ id:'', startUtc: m.startUtc, endUtc: m.endUtc }, day, utcH);
}

export function loadBusy(): BusyStore    { try { return JSON.parse(localStorage.getItem(BUSY_KEY) ?? '{}'); } catch { return {}; } }
export function saveBusy(s: BusyStore)   { localStorage.setItem(BUSY_KEY, JSON.stringify(s)); }
export function loadMeetings(): Meeting[]{ try { return JSON.parse(localStorage.getItem(MEETINGS_KEY) ?? '[]'); } catch { return []; } }
export function saveMeetings(m: Meeting[]){ localStorage.setItem(MEETINGS_KEY, JSON.stringify(m)); }
