'use client';

import { useState } from 'react';
import {
  ChevronLeftIcon, ChevronRightIcon,
  XMarkIcon, PlusIcon, TrashIcon,
} from '@heroicons/react/24/outline';
import { BusyBlock, PersonData, DAYS_SHORT, UTC_HOURS } from './types';
import {
  getWeekDates, toLocalDateStr, isToday, localTzName, localHourLabel,
  fmtTime, fmtDateShort, blockOverlapsHour, blockPortionInHour, effectiveBlocksForDay,
} from './helpers';

export function MyCalendarInline({ myData, myName, onAdd, onRemove }: {
  myData: PersonData;
  myName: string;
  onAdd: (block: Omit<BusyBlock,'id'>) => void;
  onRemove: (blockId: string) => void;
}) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUtcH, setModalUtcH] = useState(9);

  const weekDates = getWeekDates(selectedDay);
  const todayStr = toLocalDateStr(new Date());

  const isPastDay = (day: Date) => toLocalDateStr(day) < todayStr;
  const isPastSlot = (utcH: number) => {
    const d = selectedDay;
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), utcH)).getTime() < Date.now();
  };

  const openBlockModal = (utcH: number) => {
    if (isPastSlot(utcH)) return;
    setModalUtcH(utcH);
    setModalOpen(true);
  };

  const prevDay = () => { const d = new Date(selectedDay); d.setDate(d.getDate()-1); setSelectedDay(d); };
  const nextDay = () => { const d = new Date(selectedDay); d.setDate(d.getDate()+1); setSelectedDay(d); };

  const dayLabel = selectedDay.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
  const dayBlocks = effectiveBlocksForDay(myData, selectedDay);

  return (
    <div className="space-y-4">
      {/* Day nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={prevDay} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
          </button>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[180px] text-center">{dayLabel}</span>
          <button onClick={nextDay} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
          </button>
        </div>
        <button onClick={() => setSelectedDay(new Date())}
          className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
          Today
        </button>
      </div>

      {/* Week strip */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((day, i) => {
          const past = isPastDay(day);
          const hasBlocks = effectiveBlocksForDay(myData, day).length > 0;
          const selected = toLocalDateStr(day) === toLocalDateStr(selectedDay);
          return (
            <button key={i} onClick={() => !past && setSelectedDay(day)} disabled={past}
              className={`rounded-lg py-2 text-center transition-colors ${
                past ? 'opacity-30 cursor-not-allowed' :
                selected ? 'bg-red-500 text-white' :
                isToday(day) ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-700' :
                'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <p className="text-[10px] font-medium">{DAYS_SHORT[i]}</p>
              <p className="text-sm font-bold">{day.getDate()}</p>
              {hasBlocks && <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-auto mt-0.5"/>}
            </button>
          );
        })}
      </div>

      {/* 24hr scrollable grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto p-3">
          <div className="flex gap-1.5" style={{ width: `${UTC_HOURS.length * 64}px`, minWidth: '100%' }}>
            {UTC_HOURS.map(utcH => {
              const past = isPastSlot(utcH);
              const busyInHour = dayBlocks.filter(b => blockOverlapsHour(b, selectedDay, utcH));
              const hasBusy = busyInHour.length > 0;
              return (
                <div key={utcH} style={{ width: 60, minWidth: 60 }}
                  className={`relative rounded-xl flex-shrink-0 transition-all duration-150
                    ${past
                      ? 'h-20 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 opacity-50'
                      : hasBusy
                        ? 'h-20'
                        : 'h-20 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:scale-105 hover:shadow-md cursor-pointer active:scale-95'
                    }`}
                  onClick={() => { if (!past && !hasBusy) openBlockModal(utcH); }}
                >
                  {/* Hour label */}
                  <p className={`text-[10px] font-semibold text-center pt-1.5 ${
                    past ? 'text-gray-300 dark:text-gray-600' :
                    hasBusy ? 'text-red-400 dark:text-red-500' :
                    'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {localHourLabel(utcH, selectedDay)}
                  </p>

                  {/* Available state — obvious "+" */}
                  {!past && !hasBusy && (
                    <div className="absolute inset-0 top-5 flex flex-col items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-emerald-200 dark:bg-emerald-800/60 flex items-center justify-center">
                        <PlusIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-300"/>
                      </div>
                      <span className="text-[8px] text-emerald-500 dark:text-emerald-400 font-medium mt-0.5">Block</span>
                    </div>
                  )}

                  {/* Busy blocks */}
                  {hasBusy && busyInHour.map(block => {
                    const p = blockPortionInHour(block, selectedDay, utcH);
                    if (!p) return null;
                    return (
                      <div key={block.id}
                        className="absolute left-0.5 right-0.5 top-5 bottom-1 rounded-lg bg-gradient-to-b from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-sm cursor-pointer hover:from-red-600 hover:to-red-700 active:scale-95 transition-all"
                        style={p.width < 100 ? { left: `${p.left + 2}%`, width: `${p.width - 4}%` } : undefined}
                        onClick={e => { e.stopPropagation(); onRemove(block.id); }}
                        title={`${block.title || 'Busy'} · ${fmtTime(block.startUtc)}–${fmtTime(block.endUtc)} · tap to remove`}
                      >
                        <div className="flex flex-col items-center justify-center h-full px-0.5">
                          <span className="text-[9px] font-bold text-white/90 truncate w-full text-center">
                            {block.title || 'Busy'}
                          </span>
                          <span className="text-[8px] text-white/60">tap ✕</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Past state */}
                  {past && (
                    <div className="absolute inset-0 top-4 flex items-center justify-center">
                      <span className="text-[9px] text-gray-300 dark:text-gray-600">—</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Existing blocks list */}
      {dayBlocks.length > 0 && (
        <div className="space-y-1.5">
          {dayBlocks
            .sort((a,b) => new Date(a.startUtc).getTime()-new Date(b.startUtc).getTime())
            .map(block => (
              <div key={block.id} className="flex items-center justify-between px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {fmtTime(block.startUtc)} – {fmtTime(block.endUtc)}
                  </p>
                  {block.title && <p className="text-xs text-gray-500">{block.title}</p>}
                  {block.recurrence && block.recurrence.type !== 'once' && (
                    <p className="text-[10px] text-red-500">🔄 Repeats {block.recurrence.type} until {block.recurrence.endDate}</p>
                  )}
                </div>
                <button onClick={() => onRemove(block.id)} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30">
                  <TrashIcon className="w-4 h-4"/>
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Block time modal */}
      {modalOpen && (
        <BlockTimeModal
          date={toLocalDateStr(selectedDay)}
          initialUtcH={modalUtcH}
          day={selectedDay}
          onSave={(block) => { onAdd(block); setModalOpen(false); }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Block Time Modal ──────────────────────────────────────────────────────────
function BlockTimeModal({ date, initialUtcH, day, onSave, onClose }: {
  date: string;
  initialUtcH: number;
  day: Date;
  onSave: (block: Omit<BusyBlock,'id'>) => void;
  onClose: () => void;
}) {
  // Convert UTC hour to local for initial values
  const initLocalH = new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate(), initialUtcH)).getHours();

  const [title, setTitle] = useState('');
  const [sh, setSh] = useState(String(initLocalH).padStart(2,'0'));
  const [sm, setSm] = useState('00');
  const [eh, setEh] = useState(String(Math.min(initLocalH+1,23)).padStart(2,'0'));
  const [em, setEm] = useState('00');
  const [recType, setRecType] = useState<'once'|'weekly'>('once');
  const [recEndDate, setRecEndDate] = useState(() => {
    // Default: 3 months from now
    const d = new Date(); d.setMonth(d.getMonth() + 3);
    return toLocalDateStr(d);
  });
  const [recDays, setRecDays] = useState<number[]>([day.getDay()]); // default = same day of week
  const [err, setErr] = useState('');

  const mins = ['00','15','30','45'];
  const hours = Array.from({length:24},(_,i)=>String(i).padStart(2,'0'));
  const tz = localTzName().split('/').pop()?.replace('_',' ') ?? 'Local';
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const toggleRecDay = (d: number) =>
    setRecDays(prev => prev.includes(d) ? prev.filter(x=>x!==d) : [...prev, d]);

  const save = () => {
    const start = new Date(`${date}T${sh}:${sm}:00`);
    const end   = new Date(`${date}T${eh}:${em}:00`);
    if (end <= start) { setErr('End must be after start'); return; }
    if (start.getTime() < Date.now()) { setErr('Cannot block time in the past'); return; }
    if (recType === 'weekly' && recDays.length === 0) { setErr('Select at least one day'); return; }

    const block: Omit<BusyBlock,'id'> = {
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      title: title.trim() || undefined,
      recurrence: recType === 'once' ? undefined : {
        type: recType,
        days: recDays,
        endDate: recEndDate,
      },
    };
    onSave(block);
  };

  const dayLabel = day.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50"/>
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Block time</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{dayLabel}</p>
          </div>
          <button onClick={onClose}><XMarkIcon className="w-5 h-5 text-gray-500"/></button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {err && <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{err}</p>}

          {/* Reason */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Reason (optional)</label>
            <input value={title} onChange={e=>setTitle(e.target.value)}
              placeholder="e.g. School, Doctor, Gym..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Time ({tz})</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <select value={sh} onChange={e=>setSh(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {hours.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
                <span className="text-gray-400">:</span>
                <select value={sm} onChange={e=>setSm(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {mins.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <span className="text-sm text-gray-400">to</span>
              <div className="flex items-center gap-1">
                <select value={eh} onChange={e=>setEh(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {hours.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
                <span className="text-gray-400">:</span>
                <select value={em} onChange={e=>setEm(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  {mins.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Repeats</label>
            <select value={recType} onChange={e=>setRecType(e.target.value as 'once'|'weekly')}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="once">Only this day</option>
              <option value="weekly">Every week</option>
            </select>
          </div>

          {recType === 'weekly' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Which days?</label>
              <div className="flex gap-1.5">
                {dayNames.map((name,i) => (
                  <button key={i} onClick={() => toggleRecDay(i)}
                    className={`w-9 h-9 rounded-full text-xs font-medium transition-colors ${
                      recDays.includes(i)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {name.charAt(0)}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Until</label>
                <input type="date" value={recEndDate} onChange={e=>setRecEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={save} className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg">Block Time</button>
        </div>
      </div>
    </div>
  );
}
