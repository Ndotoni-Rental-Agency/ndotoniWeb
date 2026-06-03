'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  ChevronLeftIcon, ChevronRightIcon,
  ClockIcon, PlusIcon,
} from '@heroicons/react/24/outline';

import { BusyBlock, BusyStore, Meeting, DAYS_SHORT } from '@/components/availability/types';
import {
  getWeekDates, toLocalDateStr, isToday, fmtTime,
  apiBlocksToPersonData,
} from '@/components/availability/helpers';
import { useCalendar } from '@/hooks/useCalendar';
import { useAdmin } from '@/hooks/useAdmin';
import { DayView } from '@/components/availability/DayView';
import { WeekView } from '@/components/availability/WeekView';
import { MyCalendarInline } from '@/components/availability/MyCalendarInline';
import { MeetingModal } from '@/components/availability/MeetingModal';
import { MeetingDetail } from '@/components/availability/MeetingDetail';

export const dynamic = 'force-dynamic';

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AvailabilityCalendarPage() {
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day'|'week'|'myCalendar'>('day');
  const [busy, setBusy] = useState<BusyStore>({});
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [prefillDate, setPrefillDate] = useState<string|undefined>();
  const [activeMeeting, setActiveMeeting] = useState<Meeting|null>(null);
  const [teamMembers, setTeamMembers] = useState<{userId:string;name:string;email?:string;role?:string}[]>([]);

  const { isLoading: calLoading, fetchTeamAvailability, addBlock, removeBlock, createMeeting, deleteMeeting } = useCalendar();
  const { listUsers } = useAdmin();

  useEffect(() => {
    const load = async () => {
      // Use the same listUsers that admin/users page uses — proven working
      const response = await listUsers(undefined, 1000);
      const admins = response.users
        .filter((u: any) => u.profile?.userType === 'ADMIN')
        .map((u: any) => ({
          userId: u.userId,
          name: `${u.profile?.firstName ?? ''} ${u.profile?.lastName ?? ''}`.trim() || u.userId,
          email: u.profile?.email,
          role: 'Admin',
        }));
      setTeamMembers(admins);

      const weekStart = getWeekDates(selectedDay)[0];
      const weekEnd = getWeekDates(selectedDay)[6];
      const startDate = toLocalDateStr(weekStart);
      const endDate = toLocalDateStr(weekEnd);

      const { busyBlocks, meetings: apiMeetings } = await fetchTeamAvailability(startDate, endDate);
      setBusy(apiBlocksToPersonData(busyBlocks, admins));
      setMeetings(apiMeetings.map(m => ({
        id: m.id, title: m.title, description: m.description ?? '', link: m.link ?? '',
        startUtc: m.startUtc, endUtc: m.endUtc, attendeeIds: m.attendeeIds,
        createdBy: m.createdBy, createdByName: m.createdByName, createdAt: m.createdAt,
      })));
    };
    load();
  }, []);

  const myEmail = (user as any)?.email ?? '';
  const myName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Me';
  
  // Find current user's ID from the team members list (match by email to get the proper userId)
  const myTeamEntry = teamMembers.find(m => m.email === myEmail);
  const myId = myTeamEntry?.userId ?? myEmail ?? 'guest';

  const peopleList = (() => {
    const store = { ...busy };
    if (!store[myId]) {
      store[myId] = { name: myName, blocks: [], updatedAt: '' };
    }
    // Deduplicate: only show each user once (by userId)
    const seen = new Set<string>();
    const me = { id: myId, data: store[myId] };
    seen.add(myId);
    const others = Object.entries(store)
      .filter(([id]) => id !== myId && !seen.has(id))
      .map(([id, data]) => { seen.add(id); return { id, data }; });
    return [me, ...others].map((p, i) => ({ ...p, colorIdx: i }));
  })();

  const people4Modal = peopleList.map(p => ({id:p.id, name:p.data.name}));
  const weekDates = getWeekDates(selectedDay);

  const addBusyBlock = useCallback(async (block: Omit<BusyBlock,'id'>) => {
    const result = await addBlock({
      startUtc: block.startUtc,
      endUtc: block.endUtc,
      title: block.title,
      recurrence: block.recurrence,
    });
    if (result) {
      // Refresh data
      const weekStart = getWeekDates(selectedDay)[0];
      const weekEnd = getWeekDates(selectedDay)[6];
      const { busyBlocks } = await fetchTeamAvailability(toLocalDateStr(weekStart), toLocalDateStr(weekEnd));
      setBusy(apiBlocksToPersonData(busyBlocks, teamMembers));
    }
  }, [addBlock, fetchTeamAvailability, selectedDay, teamMembers]);

  const removeBusyBlock = useCallback(async (blockId: string) => {
    // Recurring blocks get virtual IDs like "busy_123_2025-06-05" — strip the date suffix
    const realId = blockId.replace(/_\d{4}-\d{2}-\d{2}$/, '');
    
    // Find the original block to get its startUtc (needed by API)
    const allBlocks = Object.values(busy).flatMap(p => p.blocks);
    const block = allBlocks.find(b => b.id === realId);
    if (!block) return;

    const success = await removeBlock(realId, block.startUtc);
    if (success) {
      const weekStart = getWeekDates(selectedDay)[0];
      const weekEnd = getWeekDates(selectedDay)[6];
      const { busyBlocks } = await fetchTeamAvailability(toLocalDateStr(weekStart), toLocalDateStr(weekEnd));
      setBusy(apiBlocksToPersonData(busyBlocks, teamMembers));
    }
  }, [removeBlock, fetchTeamAvailability, selectedDay, teamMembers, busy]);

  const handleSaveMeeting = async (m: Meeting) => {
    const result = await createMeeting({
      title: m.title, description: m.description, link: m.link,
      startUtc: m.startUtc, endUtc: m.endUtc, attendeeIds: m.attendeeIds,
    });
    if (result) {
      setMeetings(prev => [...prev, { ...result, description: result.description ?? '', link: result.link ?? '' }]);
    }
    setShowMeetingModal(false);
  };

  const handleDeleteMeeting = async (id: string) => {
    const success = await deleteMeeting(id);
    if (success) {
      setMeetings(prev => prev.filter(m => m.id !== id));
    }
    setActiveMeeting(null);
  };

  const openSchedule = (date?: string) => {
    setPrefillDate(date); setShowMeetingModal(true);
  };

  const prevDay    = () => { const d=new Date(selectedDay); d.setDate(d.getDate()-1); setSelectedDay(d); };
  const nextDay    = () => { const d=new Date(selectedDay); d.setDate(d.getDate()+1); setSelectedDay(d); };
  const prevWeek   = () => { const d=new Date(selectedDay); d.setDate(d.getDate()-7); setSelectedDay(d); };
  const nextWeek   = () => { const d=new Date(selectedDay); d.setDate(d.getDate()+7); setSelectedDay(d); };

  const dayLabel = selectedDay.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const weekLabel = (() => {
    const s=weekDates[0], e=weekDates[6];
    return s.getMonth()===e.getMonth()
      ? `${s.toLocaleDateString('en-US',{month:'long'})} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
      : `${s.toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${e.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
  })();

  const thisViewMeetings = viewMode==='day'
    ? meetings.filter(m => toLocalDateStr(new Date(m.startUtc))===toLocalDateStr(selectedDay))
    : meetings.filter(m => weekDates.some(w => toLocalDateStr(w)===toLocalDateStr(new Date(m.startUtc))));

  const isMyCalendar = viewMode === 'myCalendar';

  return (
    <div className="space-y-4 select-none">
      {/* Header actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setViewMode(isMyCalendar ? 'day' : 'myCalendar')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            isMyCalendar
              ? 'bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          <ClockIcon className="w-4 h-4"/>
          {isMyCalendar ? 'Team Availability' : 'My Calendar'}
        </button>
        <button onClick={() => openSchedule()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4"/> Schedule Meeting
        </button>
      </div>

      {/* Team view controls — only shown when NOT in My Calendar */}
      {!isMyCalendar && (
        <>
          {/* View toggle + nav */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {([['day','Day'],['week','Week']] as const).map(([v,label]) => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode===v?'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm':'text-gray-600 dark:text-gray-400'}`}
                >{label}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={viewMode==='day'?prevDay:prevWeek} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 min-w-[220px] text-center">
                {viewMode==='day' ? dayLabel : weekLabel}
              </span>
              <button onClick={viewMode==='day'?nextDay:nextWeek} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
              </button>
              <button onClick={() => setSelectedDay(new Date())} className="text-xs px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">Today</button>
            </div>
          </div>

          {/* Day strip */}
          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((day,i) => (
              <button key={i} onClick={() => { setSelectedDay(day); setViewMode('day'); }}
                className={`rounded-xl py-2 text-center transition-colors border ${
                  viewMode==='day' && toLocalDateStr(day)===toLocalDateStr(selectedDay)
                    ? 'bg-green-600 border-green-600 text-white'
                    : isToday(day)
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <p className="text-xs font-medium">{DAYS_SHORT[i]}</p>
                <p className="text-sm font-bold">{day.getDate()}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Calendar content */}
      {isMyCalendar ? (
        <MyCalendarInline
          myData={busy[myId] ?? { name: myName, blocks: [], updatedAt: '' }}
          myName={myName}
          onAdd={addBusyBlock}
          onRemove={removeBusyBlock}
        />
      ) : viewMode==='day' ? (
        <DayView
          day={selectedDay}
          people={peopleList}
          meetings={meetings}
          myId={myId}
          onRemoveBusy={removeBusyBlock}
          onClickMeeting={setActiveMeeting}
          onScheduleAt={openSchedule}
        />
      ) : (
        <WeekView
          weekDates={weekDates}
          people={peopleList}
          meetings={meetings}
          onDayClick={day => { setSelectedDay(day); setViewMode('day'); }}
          onClickMeeting={setActiveMeeting}
        />
      )}

      {/* Meetings — only in team view */}
      {!isMyCalendar && thisViewMeetings.length > 0 && (
        <div className="space-y-1.5">
          {thisViewMeetings
            .sort((a,b) => new Date(a.startUtc).getTime()-new Date(b.startUtc).getTime())
            .map((m) => (
              <button key={m.id} onClick={() => setActiveMeeting(m)}
                className="w-full text-left px-3 py-2 rounded-lg border-l-4 text-sm hover:brightness-95 bg-teal-50 dark:bg-teal-900/30 border-teal-400 text-teal-900 dark:text-teal-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{m.title}</span>
                  <span className="text-xs opacity-70 flex-shrink-0">{fmtTime(m.startUtc)}–{fmtTime(m.endUtc)}</span>
                </div>
              </button>
            ))}
        </div>
      )}

      {/* Modals */}
      {showMeetingModal && (
        <MeetingModal initialDate={prefillDate} people={people4Modal} myId={myId} myName={myName}
          onSave={handleSaveMeeting} onClose={() => setShowMeetingModal(false)}/>
      )}
      {activeMeeting && (
        <MeetingDetail m={activeMeeting} people={people4Modal} myId={myId}
          onDelete={() => handleDeleteMeeting(activeMeeting.id)}
          onClose={() => setActiveMeeting(null)}/>
      )}
    </div>
  );
}
