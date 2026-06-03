'use client';

import { PlusIcon, ClockIcon } from '@heroicons/react/24/outline';
import { PersonData, Meeting, PERSON_COLORS, MTG_COLORS, UTC_HOURS } from './types';
import {
  localHourLabel, fmtTime, toLocalDateStr,
  blockOverlapsHour, meetingsForDay, meetingOverlapsHour,
  blockPortionInHour, meetingPortionInHour, effectiveBlocksForDay,
} from './helpers';

export function DayView({ day, people, meetings, myId, onRemoveBusy, onClickMeeting, onScheduleAt }: {
  day: Date;
  people: {id:string; data:PersonData; colorIdx:number}[];
  meetings: Meeting[];
  myId: string;
  onRemoveBusy: (blockId: string) => void;
  onClickMeeting: (m: Meeting) => void;
  onScheduleAt: (date: string) => void;
}) {
  const CELL_W = 52; // px per hour column

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="border-collapse" style={{ minWidth: `${160 + UTC_HOURS.length * CELL_W}px`, width: `${160 + UTC_HOURS.length * CELL_W}px` }}>
          <thead>
            <tr>
              {/* Name col header */}
              <th className="w-40 min-w-[160px] text-left px-3 py-3 bg-gray-50 dark:bg-gray-900 border-b border-r border-gray-200 dark:border-gray-700 sticky left-0 z-20">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Team member</p>
              </th>
              {/* Hour headers */}
              {UTC_HOURS.map(utcH => (
                <th key={utcH} style={{ width: CELL_W, minWidth: CELL_W }}
                  className="px-0 py-2 text-center bg-gray-50 dark:bg-gray-900 border-b border-l border-gray-200 dark:border-gray-700">
                  <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{localHourLabel(utcH, day)}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {people.map(({ id, data, colorIdx }) => {
              const c = PERSON_COLORS[colorIdx % PERSON_COLORS.length];
              const isMe = id === myId;
              const myDayBlocks = effectiveBlocksForDay(data, day);
              const dayMeetings = meetingsForDay(meetings, day).filter(m => m.attendeeIds.includes(id));

              return (
                <tr key={id} className="border-b border-gray-100 dark:border-gray-700/50 last:border-0">
                  {/* Name cell */}
                  <td className="px-3 py-2 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${c.col} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                        {data.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{data.name}</p>
                        {data.role && <p className="text-[10px] text-gray-400">{data.role}</p>}
                        {isMe && <p className="text-[10px] text-green-500 dark:text-green-400 font-medium">you</p>}
                      </div>
                    </div>
                  </td>

                  {/* Hour cells */}
                  {UTC_HOURS.map(utcH => {
                    const busyInHour = myDayBlocks.filter(b => blockOverlapsHour(b, day, utcH));
                    const mtgsInHour = dayMeetings.filter(m => meetingOverlapsHour(m, day, utcH));

                    return (
                      <td key={utcH} style={{ width: CELL_W, minWidth: CELL_W }}
                        className={`relative border-l border-gray-100 dark:border-gray-700/40 h-11 p-0 ${c.light}`}
                      >
                        {/* Busy blocks — proportionally positioned */}
                        {busyInHour.map(block => {
                          const portion = blockPortionInHour(block, day, utcH);
                          if (!portion) return null;
                          return (
                            <div key={block.id}
                              className="absolute top-0 bottom-0 bg-red-400 dark:bg-red-600 opacity-80 cursor-pointer hover:opacity-100 transition-opacity group"
                              style={{ left: `${portion.left}%`, width: `${portion.width}%` }}
                              title={`Busy ${fmtTime(block.startUtc)}–${fmtTime(block.endUtc)} · click to remove`}
                              onClick={() => isMe && onRemoveBusy(block.id)}
                            >
                              {/* Show label only if wide enough */}
                              {portion.width > 40 && (
                                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white pointer-events-none">✕</span>
                              )}
                            </div>
                          );
                        })}

                        {/* Meetings — proportionally positioned */}
                        {mtgsInHour.map(mtg => {
                          const portion = meetingPortionInHour(mtg, day, utcH);
                          if (!portion) return null;
                          const ci = meetings.indexOf(mtg) % MTG_COLORS.length;
                          return (
                            <div key={mtg.id}
                              className={`absolute top-0.5 bottom-0.5 ${MTG_COLORS[ci]} opacity-90 rounded cursor-pointer hover:opacity-100 transition-opacity flex items-center overflow-hidden px-0.5`}
                              style={{ left: `${portion.left}%`, width: `${portion.width}%` }}
                              title={mtg.title}
                              onClick={() => onClickMeeting(mtg)}
                            >
                              {portion.width > 35 && (
                                <span className="text-[9px] font-bold text-white truncate leading-tight">{mtg.title}</span>
                              )}
                            </div>
                          );
                        })}

                        {/* Empty: click to schedule meeting (my row) */}
                        {isMe && busyInHour.length === 0 && mtgsInHour.length === 0 && (
                          <button
                            onClick={() => onScheduleAt(toLocalDateStr(day))}
                            className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center text-green-600 transition-opacity"
                            title="Schedule meeting"
                          >
                            <PlusIcon className="w-3.5 h-3.5"/>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* All-free indicator row */}
            <tr className="border-t-2 border-green-200 dark:border-green-700">
              <td className="px-3 py-1.5 sticky left-0 z-10 bg-green-50 dark:bg-green-900/20 border-r border-gray-200 dark:border-gray-700">
                <p className="text-[10px] font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
                  <ClockIcon className="w-3 h-3"/> All free
                </p>
              </td>
              {UTC_HOURS.map(utcH => {
                const allFree = people.every(p => {
                  const busy = effectiveBlocksForDay(p.data, day).some(b => blockOverlapsHour(b, day, utcH));
                  const hasMtg = meetingsForDay(meetings, day).some(m => m.attendeeIds.includes(p.id) && meetingOverlapsHour(m, day, utcH));
                  return !busy && !hasMtg;
                });
                return (
                  <td key={utcH} style={{ width: CELL_W }}
                    className={`border-l border-gray-100 dark:border-gray-700/40 h-7 text-center transition-colors
                      ${allFree ? 'bg-green-100 dark:bg-green-900/40 cursor-pointer hover:bg-green-200' : 'bg-green-50/30 dark:bg-green-900/10'}
                    `}
                    onClick={() => allFree && onScheduleAt(toLocalDateStr(day))}
                    title={allFree ? 'Everyone free — schedule meeting' : ''}
                  >
                    {allFree && <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">✓</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400 opacity-80 inline-block"/>Busy (click to remove your own)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-teal-400 inline-block"/>Meeting</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 inline-block"/>Available</span>
        <span className="ml-auto italic">Click &quot;Add busy&quot; on your row to block any time range</span>
      </div>
    </div>
  );
}
