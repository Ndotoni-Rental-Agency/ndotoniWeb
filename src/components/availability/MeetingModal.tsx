'use client';

import { useState } from 'react';
import {
  CalendarDaysIcon, XMarkIcon,
  VideoCameraIcon, UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Meeting } from './types';
import { toLocalDateStr, localTzName } from './helpers';

export function MeetingModal({ initialDate, people, myId, myName, onSave, onClose }: {
  initialDate?: string; people:{id:string;name:string}[];
  myId:string; myName:string; onSave:(m:Meeting)=>void; onClose:()=>void;
}) {
  const [title,setTitle]=useState(''); const [desc,setDesc]=useState('');
  const [link,setLink]=useState(''); const [dateL,setDateL]=useState(initialDate ?? toLocalDateStr(new Date()));
  const [sh,setSh]=useState('09'); const [sm,setSm]=useState('00');
  const [eh,setEh]=useState('10'); const [em,setEm]=useState('00');
  const [att,setAtt]=useState<string[]>([myId]); const [err,setErr]=useState('');
  const mins=['00','15','30','45'];
  const hours=Array.from({length:24},(_,i)=>String(i).padStart(2,'0'));
  const tog=(id:string)=>setAtt(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const save=()=>{
    if(!title.trim()){setErr('Title required');return;}
    const startUtc=new Date(`${dateL}T${sh}:${sm}:00`).toISOString();
    const endUtc=new Date(`${dateL}T${eh}:${em}:00`).toISOString();
    if(new Date(endUtc)<=new Date(startUtc)){setErr('End must be after start');return;}
    if(!att.length){setErr('Select at least one attendee');return;}
    onSave({id:`mtg_${Date.now()}`,title:title.trim(),description:desc.trim(),link:link.trim(),
      startUtc,endUtc,attendeeIds:att,createdBy:myId,createdByName:myName,createdAt:new Date().toISOString()});
  };
  const tz=localTzName().split('/').pop()?.replace('_',' ')??'Local';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50"/>
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 text-sm">
            <CalendarDaysIcon className="w-4 h-4 text-green-600"/> Schedule Meeting
          </h2>
          <button onClick={onClose}><XMarkIcon className="w-5 h-5 text-gray-500"/></button>
        </div>
        <div className="px-5 py-4 space-y-4 max-h-[72vh] overflow-y-auto">
          {err&&<p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{err}</p>}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Weekly sync..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input type="date" value={dateL} onChange={e=>setDateL(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Start ({tz})</label>
              <div className="flex gap-1">
                <select value={sh} onChange={e=>setSh(e.target.value)} className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {hours.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
                <span className="flex items-center text-gray-400">:</span>
                <select value={sm} onChange={e=>setSm(e.target.value)} className="w-16 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {mins.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">End</label>
              <div className="flex gap-1">
                <select value={eh} onChange={e=>setEh(e.target.value)} className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {hours.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
                <span className="flex items-center text-gray-400">:</span>
                <select value={em} onChange={e=>setEm(e.target.value)} className="w-16 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
                  {mins.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"><VideoCameraIcon className="w-3.5 h-3.5"/> Meeting link</label>
            <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://zoom.us/j/..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Agenda</label>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} placeholder="What will be discussed..."
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><UserGroupIcon className="w-3.5 h-3.5"/> Attendees</label>
            <div className="space-y-1.5">
              {people.map(p=>(
                <button key={p.id} type="button" onClick={()=>tog(p.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors text-left ${
                    att.includes(p.id)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-600'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                    att.includes(p.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {att.includes(p.id) && <span className="text-xs font-bold">✓</span>}
                  </div>
                  <span className={`text-sm ${att.includes(p.id) ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                    {p.name}{p.id===myId&&<span className="text-xs text-gray-400 ml-1">(you)</span>}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={save} className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg">Schedule</button>
        </div>
      </div>
    </div>
  );
}
