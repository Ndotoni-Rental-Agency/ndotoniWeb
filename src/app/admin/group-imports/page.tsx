'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpTrayIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { GroupImport, GroupImportsApi, GroupOutreachSettings } from '@/lib/admin/groupImports';

export const dynamic = 'force-dynamic';

const STATUS_STYLES: Record<string, string> = {
  queued: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};
const card = 'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5';
const field = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500';

export default function GroupImportsPage() {
  const [imports, setImports] = useState<GroupImport[]>([]);
  const [settings, setSettings] = useState<GroupOutreachSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [contactsGroup, setContactsGroup] = useState('');
  const exportInput = useRef<HTMLInputElement>(null);
  const contactsInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const [list, s] = await Promise.all([GroupImportsApi.list(), GroupImportsApi.settings()]);
      setImports(list);
      setSettings(s);
    } catch (err) {
      setNotice({ type: 'error', text: GroupImportsApi.errorText(err, 'Could not load imports.') });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // While an import is running, refresh every few seconds
  useEffect(() => {
    if (!imports.some((i) => i.status === 'queued' || i.status === 'processing')) return;
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [imports, load]);

  async function uploadExport(file?: File) {
    if (!file) return;
    setUploading(true);
    setNotice(null);
    try {
      await GroupImportsApi.upload(file, groupName.trim() || undefined);
      setNotice({ type: 'success', text: `${file.name} uploaded. Reading it now: new adverts and requests appear below in a minute or two.` });
      setGroupName('');
      await load();
    } catch (err) {
      setNotice({ type: 'error', text: GroupImportsApi.errorText(err, 'Upload failed.') });
    } finally {
      setUploading(false);
      if (exportInput.current) exportInput.current.value = '';
    }
  }

  async function uploadContacts(file?: File) {
    if (!file) return;
    setNotice(null);
    try {
      const r = await GroupImportsApi.importContacts(await file.text(), file.name, contactsGroup.trim() || undefined);
      setNotice({
        type: r.saved ? 'success' : 'error',
        text: r.saved
          ? `${r.saved} numbers saved${r.groups.length ? ` for ${r.groups.join(', ')}` : ''}.${r.skipped ? ` ${r.skipped} rows skipped (missing name, number or group).` : ''}${r.conflicts.length ? ` ${r.conflicts.length} names now match more than one number; you'll pick the right one when reviewing.` : ''}`
          : 'No numbers saved. Each row needs name, phone and group (or fill in the group name).',
      });
    } catch (err) {
      setNotice({ type: 'error', text: GroupImportsApi.errorText(err, 'Could not read the contacts file.') });
    } finally {
      if (contactsInput.current) contactsInput.current.value = '';
    }
  }

  async function toggleAutoSend() {
    if (!settings) return;
    const next = !settings.autoSend;
    if (next && !window.confirm('Turn on auto-send? Every advert and request with a number will be messaged right after each import, without review.')) return;
    try {
      setSettings(await GroupImportsApi.setAutoSend(next));
    } catch (err) {
      setNotice({ type: 'error', text: GroupImportsApi.errorText(err, 'Could not change auto-send.') });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">WhatsApp group imports</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Upload a group export (Export chat → Without media). We find host adverts and guest requests, recommend stays, and you send the first WhatsApp message after checking them.
        </p>
      </div>

      {notice && (
        <div role="status" className={`rounded-lg p-3 text-sm border ${notice.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
          {notice.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className={card}>
          <h2 className="font-semibold text-gray-900 dark:text-white">Upload an export</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The .zip or .txt WhatsApp makes. Only messages newer than the last import are read.</p>
          <label className="mt-3 block text-xs text-gray-500 dark:text-gray-400">Group name (optional, read from the export)
            <input className={field} value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Dalali Bookings" />
          </label>
          <input ref={exportInput} type="file" accept=".zip,.txt" hidden onChange={(e) => uploadExport(e.target.files?.[0])} />
          <button type="button" disabled={uploading} onClick={() => exportInput.current?.click()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            <ArrowUpTrayIcon className="h-4 w-4" /> {uploading ? 'Uploading…' : 'Choose export'}
          </button>
        </section>

        <section className={card}>
          <h2 className="font-semibold text-gray-900 dark:text-white">Group contacts</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The weekly name → number list (CSV with name, phone, group, or JSON). Used to find each sender’s number.</p>
          <label className="mt-3 block text-xs text-gray-500 dark:text-gray-400">Group name (if the file has no group column)
            <input className={field} value={contactsGroup} onChange={(e) => setContactsGroup(e.target.value)} />
          </label>
          <input ref={contactsInput} type="file" accept=".csv,.json" hidden onChange={(e) => uploadContacts(e.target.files?.[0])} />
          <button type="button" onClick={() => contactsInput.current?.click()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <UserGroupIcon className="h-4 w-4" /> Choose contacts file
          </button>
        </section>

        <section className={card}>
          <h2 className="font-semibold text-gray-900 dark:text-white">Sending</h2>
          {settings && (
            <>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{settings.sentToday} of {settings.dailyCap} sent today.</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Auto-send</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{settings.autoSend ? 'On: imports send without review.' : 'Off: you review and send.'}</p>
                </div>
                <button type="button" role="switch" aria-checked={settings.autoSend} onClick={toggleAutoSend}
                  className={`relative h-6 w-11 rounded-full transition-colors ${settings.autoSend ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${settings.autoSend ? 'left-[22px]' : 'left-0.5'}`} />
                </button>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">Imports</h2>
        {loading ? (
          [0, 1].map((i) => <div key={i} className="h-20 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />)
        ) : imports.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No imports yet.</p>
        ) : imports.map((i) => (
          <Link key={i.importId} href={`/admin/group-imports/${i.importId}`} className={`${card} block hover:border-brand-300 dark:hover:border-brand-700 transition-colors`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{i.groupName || i.filename}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(i.createdAt).toLocaleString()} · {i.filename}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[i.status] || ''}`}>{i.status === 'processing' ? 'reading…' : i.status}</span>
            </div>
            {i.status === 'failed' ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{i.error}</p>
            ) : (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {i.newMessages} new messages · {i.hosts} adverts · {i.guests} requests · {i.itemCount} to review{i.withoutPhone ? ` · ${i.withoutPhone} without a number` : ''}{i.refused ? ` · ${i.refused} unreadable` : ''}
              </p>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}
