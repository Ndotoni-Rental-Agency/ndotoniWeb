'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { GroupImport, GroupImportsApi, GroupOutreachSettings, WhatsAppGroup, timeAgo } from '@/lib/admin/groupImports';
import { UploadExportButton } from '@/components/admin/whatsapp-groups/UploadExportButton';

export const dynamic = 'force-dynamic';

type Notice = { tone: 'success' | 'error'; text: string } | null;

export default function WhatsAppGroupsPage() {
  const [groups, setGroups] = useState<WhatsAppGroup[] | null>(null);
  const [pending, setPending] = useState<GroupImport[]>([]);
  const [settings, setSettings] = useState<GroupOutreachSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const load = useCallback(async () => {
    try {
      const [overview, s] = await Promise.all([GroupImportsApi.listGroups(), GroupImportsApi.settings()]);
      setGroups(overview.groups);
      setPending(overview.pendingUploads);
      setSettings(s);
      setLoadError(null);
    } catch (err) {
      setLoadError(GroupImportsApi.errorText(err, 'Couldn’t load your WhatsApp groups.'));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Keep refreshing while an upload is being read or messages are going out
  const busy = pending.some((p) => p.status === 'queued' || p.status === 'processing') || !!groups?.some((g) => g.sending > 0);
  useEffect(() => {
    if (!busy) return;
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [busy, load]);

  async function toggleAutoSend() {
    if (!settings) return;
    const next = !settings.autoSend;
    if (next && !window.confirm('Turn on auto-send? After every import, each advert and request with a number gets its first WhatsApp message straight away, without review.')) return;
    try {
      setSettings(await GroupImportsApi.setAutoSend(next));
    } catch (err) {
      setNotice({ tone: 'error', text: GroupImportsApi.errorText(err, 'Couldn’t change auto-send.') });
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">WhatsApp groups</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
            Hosts and guests posting in the groups we’re in. Upload a group’s chat export, check what was found, and send each person their first message.
          </p>
        </div>
        <UploadExportButton
          onUploaded={(text) => { setNotice({ tone: 'success', text }); load(); }}
          onError={(text) => setNotice({ tone: 'error', text })}
        />
      </header>

      {settings && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
          <DailyLimit settings={settings} onChange={setSettings} onError={(text) => setNotice({ tone: 'error', text })} />
          <label className="inline-flex cursor-pointer items-center gap-2">
            <button type="button" role="switch" aria-checked={settings.autoSend} onClick={toggleAutoSend}
              className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ${settings.autoSend ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-150 ${settings.autoSend ? 'left-[18px]' : 'left-0.5'}`} />
            </button>
            <span>Auto-send {settings.autoSend ? 'on: imports send without review' : 'off: you review before sending'}</span>
          </label>
        </div>
      )}

      {notice && (
        <p role="status" className={`rounded-lg px-4 py-3 text-sm ${notice.tone === 'success' ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/20 dark:text-brand-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
          {notice.text}
        </p>
      )}

      {pending.length > 0 && (
        <ul className="space-y-1 text-sm">
          {pending.map((p) => (
            <li key={p.importId} className={p.status === 'failed' ? 'flex gap-1.5 text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
              {p.status === 'failed'
                ? <><ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{p.filename} couldn’t be read: {p.error}</>
                : <>Reading {p.filename}…</>}
            </li>
          ))}
        </ul>
      )}

      {loadError ? (
        <div role="alert" className="rounded-xl border border-gray-200 bg-white p-5 text-sm dark:border-gray-700 dark:bg-gray-800">
          {loadError} <button type="button" onClick={load} className="font-medium text-brand-700 underline dark:text-brand-400">Try again</button>
        </div>
      ) : !groups ? (
        <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800" aria-busy>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="ml-auto h-4 w-24 animate-pulse rounded bg-gray-100 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center dark:border-gray-600 dark:bg-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">No groups yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            In WhatsApp, open a group, tap its name, then Export chat → Without media. Upload the file here, or send it to the Ndotoni WhatsApp number from an admin account.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {groups.map((g) => (
            <li key={g.groupKey}>
              <Link href={`/admin/whatsapp-groups/${g.groupKey}`}
                className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50 dark:hover:bg-gray-700/40 dark:focus-visible:bg-gray-700/40">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900 dark:text-white">{g.groupName}</p>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {[g.lastImportAt ? `Imported ${timeAgo(g.lastImportAt)}` : null, `${g.hosts} adverts`, `${g.guests} requests`, `${g.contacts} numbers known`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium tabular-nums ${g.toReview
                  ? 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800'
                  : 'text-gray-500 dark:text-gray-400'}`}>
                  {g.sending ? `Sending ${g.sending}…` : g.toReview ? `${g.toReview} to review` : 'All caught up'}
                </span>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** "12 of 50 messages sent today", and changing the 50 (1 to Meta's 250 a day for the number) */
function DailyLimit({ settings, onChange, onError }: {
  settings: GroupOutreachSettings;
  onChange: (settings: GroupOutreachSettings) => void;
  onError: (text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(settings.dailyCap));
  const [saving, setSaving] = useState(false);
  const cap = Number(value);
  const valid = Number.isInteger(cap) && cap >= 1 && cap <= 250;

  async function save() {
    if (!valid) return;
    setSaving(true);
    try {
      onChange(await GroupImportsApi.setDailyCap(cap));
      setEditing(false);
    } catch (err) {
      onError(GroupImportsApi.errorText(err, 'Couldn’t change the daily limit.'));
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="tabular-nums">{settings.sentToday} of {settings.dailyCap} messages sent today</span>
        <button type="button" onClick={() => { setValue(String(settings.dailyCap)); setEditing(true); }}
          className="font-medium text-brand-700 hover:underline focus:outline-none focus-visible:underline dark:text-brand-400">Change limit</button>
      </span>
    );
  }
  return (
    <form className="inline-flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <label htmlFor="daily-limit">Send at most</label>
      <input id="daily-limit" type="number" min={1} max={250} inputMode="numeric" value={value} onChange={(e) => setValue(e.target.value)} autoFocus
        aria-describedby="daily-limit-hint" aria-invalid={!valid}
        className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm tabular-nums text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
      <span id="daily-limit-hint">a day (1–250)</span>
      <button type="submit" disabled={!valid || saving} className="rounded-lg bg-gray-900 px-3 py-1 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50 dark:bg-white dark:text-gray-900">{saving ? 'Saving…' : 'Save'}</button>
      <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-2 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
    </form>
  );
}
