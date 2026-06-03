'use client';

import { PersonData, Meeting, PERSON_COLORS, DAYS_SHORT } from './types';
import {
  isToday, toLocalDateStr, utcMsForHour,
  effectiveBlocksForDay, meetingsForDay,
} from './helpers';

export function WeekView({ weekDates, people, meetings, onDayClick, onClickMeeting }: {
  weekDates: Date[];
  people: {id:string; data:PersonData; colorIdx:number}[];
  meetings: Meeting[];
  onDayClick: (d:Date) => void;
  onClickMeeting: (m:Meeting) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-36 text-left px-3 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">Person</th>
            {weekDates.map((day,i) => (
              <th key={i} onClick={() => onDayClick(day)}
                className={`px-2 py-3 text-center border-b border-l cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors
                  ${isToday(day)
                    ? 'bg-green-50 dark:bg-green-900/20 border-gray-200 dark:border-gray-700 text-green-700 dark:text-green-400'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <div className="font-medium">{DAYS_SHORT[i]}</div>
                <div className="font-bold text-sm">{day.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                <div className="text-[10px] opacity-50">tap for detail</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {people.map(({ id, data, colorIdx }) => {
            const c = PERSON_COLORS[colorIdx % PERSON_COLORS.length];
            return (
              <tr key={id} className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="px-3 py-2.5 border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${c.col} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{data.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-[7rem]">{data.name}</p>
                      {data.role && <p className="text-[10px] text-gray-400">{data.role}</p>}
                    </div>
                  </div>
                </td>
                {weekDates.map((day,di) => {
                  const blocks = effectiveBlocksForDay(data, day);
                  const dayMtgs = meetingsForDay(meetings, day).filter(m => m.attendeeIds.includes(id));
                  // total busy minutes
                  const busyMs = blocks.reduce((acc,b) => {
                    const s = Math.max(new Date(b.startUtc).getTime(), utcMsForHour(day,0));
                    const e = Math.min(new Date(b.endUtc).getTime(), utcMsForHour(day,0)+86400000);
                    return acc + Math.max(0, e-s);
                  }, 0);
                  const busyH = busyMs / 3600000;
                  return (
                    <td key={di} onClick={() => onDayClick(day)}
                      className={`px-2 py-2 border-l border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 align-top min-w-[90px]
                        ${isToday(day) ? 'bg-green-50/30 dark:bg-green-900/10' : ''}`}
                    >
                      {/* Mini timeline bar */}
                      <div className="relative h-2 rounded-full bg-green-100 dark:bg-green-900/30 overflow-hidden mb-1">
                        {blocks.map(b => {
                          const dayS = utcMsForHour(day,0);
                          const dayLen = 86400000;
                          const bs = Math.max(new Date(b.startUtc).getTime()-dayS, 0);
                          const be = Math.min(new Date(b.endUtc).getTime()-dayS, dayLen);
                          return (
                            <div key={b.id} className="absolute top-0 bottom-0 bg-red-400"
                              style={{ left: `${(bs/dayLen)*100}%`, width: `${((be-bs)/dayLen)*100}%` }}/>
                          );
                        })}
                      </div>
                      {busyH > 0 && <p className="text-[10px] text-red-600 dark:text-red-400">{busyH.toFixed(1)}h busy</p>}
                      {dayMtgs.map(m => (
                        <button key={m.id} onClick={e=>{e.stopPropagation();onClickMeeting(m);}}
                          className="w-full text-left rounded px-1 py-0.5 mb-0.5 text-[10px] font-semibold bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-l-2 border-teal-400 truncate"
                        >
                          📅 {m.title}
                        </button>
                      ))}
                      {busyH===0 && dayMtgs.length===0 && <span className="text-[10px] text-green-600 dark:text-green-400 font-medium">✓ Free</span>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
