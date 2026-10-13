'use client';

import { useState } from 'react';
import { PaperAirplaneIcon, ForwardIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { GroupImportItem, GroupImportItemInput, STAYS_URL, formatMoney } from '@/lib/admin/groupImports';

const STATUS_STYLES: Record<string, string> = {
  review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  queued: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  skipped: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};
const STATUS_LABELS: Record<string, string> = { review: 'To review', queued: 'Sending…', sent: 'Sent', skipped: 'Skipped', failed: 'Not sent' };
const PHONE_SOURCES: Record<string, string> = {
  contacts: 'from the group contacts list',
  admin: 'confirmed by an admin',
  sender: 'the sender’s number',
  'message-text': 'written in the message (may be an agent)',
};

const input = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500';

interface Props {
  item: GroupImportItem;
  busy: boolean;
  onSave: (input: GroupImportItemInput) => Promise<void>;
  onSend: () => void;
  onSkip: () => void;
}

export function GroupItemCard({ item, busy, onSave, onSend, onSkip }: Props) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(item.phone ? `+${item.phone}` : '');
  const [title, setTitle] = useState(item.draft?.title || '');
  const [area, setArea] = useState(item.draft?.area || '');
  const [rate, setRate] = useState(item.draft?.nightlyRate ? String(item.draft.nightlyRate) : '');
  const [currency, setCurrency] = useState(item.draft?.currency || 'TZS');
  const [summary, setSummary] = useState(item.request?.summary || '');
  const open = item.status === 'review' || item.status === 'failed';

  async function save() {
    const changes: GroupImportItemInput = {};
    if (phone.trim() && phone.replace(/\D/g, '') !== (item.phone || '')) changes.phone = phone.trim();
    if (item.kind === 'host') {
      if (title.trim() && title !== item.draft?.title) changes.title = title.trim();
      if (area.trim() && area !== item.draft?.area) changes.area = area.trim();
      if (rate && Number(rate) !== item.draft?.nightlyRate) Object.assign(changes, { nightlyRate: Number(rate), currency });
    } else if (summary.trim() && summary !== item.request?.summary) {
      changes.summary = summary.trim();
    }
    await onSave(changes);
    setEditing(false);
  }

  return (
    <article className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {item.kind === 'host' ? 'Host advert' : 'Guest request'} · {item.sender} · {item.postedAt.replace('T', ' ').slice(0, 16)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-white break-words">
            {item.kind === 'host' ? item.draft?.title : item.request?.summary}
          </h3>
          {item.kind === 'host' && item.draft && (
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
              {[item.draft.area || 'Area unknown', item.draft.bedrooms != null ? (item.draft.bedrooms ? `${item.draft.bedrooms} bedroom(s)` : 'Studio') : '', formatMoney(item.draft.nightlyRate, item.draft.currency) && `${formatMoney(item.draft.nightlyRate, item.draft.currency)} / night`].filter(Boolean).join(' · ')}
            </p>
          )}
          {item.kind === 'guest' && item.request && (
            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
              {[item.request.area, item.request.checkIn && `${item.request.checkIn} → ${item.request.checkOut || '?'}`, item.request.guests && `${item.request.guests} guest(s)`, formatMoney(item.request.budget, item.request.currency) && `budget ${formatMoney(item.request.budget, item.request.currency)}`].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status] || ''}`}>{STATUS_LABELS[item.status] || item.status}</span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <p className="whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3 text-sm text-gray-700 dark:text-gray-300 max-h-48 overflow-y-auto">{item.text}</p>
        <div className="space-y-3">
          {item.kind === 'guest' && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Recommended stays (sent with the message)</p>
              <ul className="space-y-1.5">
                {(item.matches || []).map((m) => (
                  <li key={m.propertyId} className="text-sm">
                    <a href={`${STAYS_URL}/property/${m.propertyId}`} target="_blank" rel="noreferrer" className="font-medium text-brand-600 hover:underline">{m.title}</a>
                    <span className="text-gray-500 dark:text-gray-400"> {[m.area, formatMoney(m.nightlyRate, m.currency)].filter(Boolean).join(' · ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-sm">
            {item.phone ? (
              <p className="text-gray-700 dark:text-gray-300">📱 +{item.phone} <span className="text-gray-500 dark:text-gray-400">{PHONE_SOURCES[item.phoneSource || ''] || ''}</span></p>
            ) : item.phoneCandidates?.length ? (
              <div>
                <p className="text-amber-700 dark:text-amber-400">This name matches {item.phoneCandidates.length} numbers in the group. Pick one:</p>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {item.phoneCandidates.map((p) => (
                    <button key={p} type="button" disabled={busy || !open} onClick={() => onSave({ phone: p })}
                      className="rounded-full border border-gray-200 dark:border-gray-700 px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">+{p}</button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-amber-700 dark:text-amber-400">No number yet: add it before sending.</p>
            )}
          </div>
          {item.sendError && <p className="text-sm text-red-600 dark:text-red-400">{item.sendError}</p>}
        </div>
      </div>

      {editing && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <label className="text-xs text-gray-500 dark:text-gray-400">Phone number<input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0712 345 678" /></label>
          {item.kind === 'host' ? (
            <>
              <label className="text-xs text-gray-500 dark:text-gray-400">Title<input className={input} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
              <label className="text-xs text-gray-500 dark:text-gray-400">Area<input className={input} value={area} onChange={(e) => setArea(e.target.value)} /></label>
              <div className="flex gap-2">
                <label className="flex-1 text-xs text-gray-500 dark:text-gray-400">Nightly rate<input className={input} type="number" min={1} value={rate} onChange={(e) => setRate(e.target.value)} /></label>
                <label className="text-xs text-gray-500 dark:text-gray-400">Currency
                  <select className={input} value={currency} onChange={(e) => setCurrency(e.target.value)}><option>TZS</option><option>USD</option></select>
                </label>
              </div>
            </>
          ) : (
            <label className="text-xs text-gray-500 dark:text-gray-400">Request summary (shown in the message)<input className={input} value={summary} onChange={(e) => setSummary(e.target.value)} /></label>
          )}
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">Cancel</button>
            <button type="button" disabled={busy} onClick={save} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">Save</button>
          </div>
        </div>
      )}

      {open && !editing && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button type="button" disabled={busy} onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <PencilSquareIcon className="h-4 w-4" /> Edit
          </button>
          <button type="button" disabled={busy} onClick={onSkip} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">
            <ForwardIcon className="h-4 w-4" /> Skip
          </button>
          <button type="button" disabled={busy || !item.phone} onClick={onSend} title={item.phone ? '' : 'Add a number first'} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            <PaperAirplaneIcon className="h-4 w-4" /> Send notification
          </button>
        </div>
      )}
    </article>
  );
}
