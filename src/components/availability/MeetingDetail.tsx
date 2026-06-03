'use client';

import {
  ClockIcon, XMarkIcon,
  VideoCameraIcon, UserGroupIcon, TrashIcon,
} from '@heroicons/react/24/outline';
import { Meeting } from './types';
import { fmtTime, fmtDateShort, localTzName } from './helpers';

export function MeetingDetail({ m, people, myId, onDelete, onClose }: {
  m:Meeting; people:{id:string;name:string}[]; myId:string; onDelete:()=>void; onClose:()=>void;
}) {
  const tz=localTzName().split('/').pop()?.replace('_',' ')??'';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40"/>
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-5 space-y-3" onClick={e=>e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white">{m.title}</h3>
          <button onClick={onClose}><XMarkIcon className="w-4 h-4 text-gray-500"/></button>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
          <ClockIcon className="w-4 h-4"/> {fmtDateShort(m.startUtc)} · {fmtTime(m.startUtc)} – {fmtTime(m.endUtc)}
          <span className="text-xs text-gray-400">({tz})</span>
        </div>
        {m.link&&<a href={m.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-green-600 hover:underline"><VideoCameraIcon className="w-4 h-4"/> Join</a>}
        {m.description&&<p className="text-sm text-gray-700 dark:text-gray-300">{m.description}</p>}
        <div className="flex items-start gap-1.5 text-sm text-gray-500">
          <UserGroupIcon className="w-4 h-4 mt-0.5"/>
          {m.attendeeIds.map(id=>people.find(p=>p.id===id)?.name??id).join(', ')}
        </div>
        <p className="text-xs text-gray-400">By {m.createdByName}</p>
        {m.createdBy===myId&&<button onClick={onDelete} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700"><TrashIcon className="w-4 h-4"/> Delete</button>}
      </div>
    </div>
  );
}
