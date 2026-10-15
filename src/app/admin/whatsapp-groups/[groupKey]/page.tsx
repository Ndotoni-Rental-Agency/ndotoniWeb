'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, CheckBadgeIcon, PaperAirplaneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { GroupImportItem, GroupImportItemInput, GroupImportsApi, WhatsAppGroupDetail, postedLabel, timeAgo } from '@/lib/admin/groupImports';
import { ReviewItem } from '@/components/admin/whatsapp-groups/ReviewItem';
import { UploadExportButton } from '@/components/admin/whatsapp-groups/UploadExportButton';

export const dynamic = 'force-dynamic';

type Tab = 'review' | 'sent' | 'imports' | 'contacts';
type Kind = 'host' | 'guest';
type Notice = { tone: 'success' | 'error'; text: string } | null;

const isOpen = (i: GroupImportItem) => i.status === 'review' || i.status === 'failed';
const panel = 'overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800';
const IMPORT_STATUS: Record<string, string> = { queued: 'Waiting', processing: 'Reading…', done: 'Done', failed: 'Failed' };

export default function WhatsAppGroupPage() {
  const { groupKey } = useParams<{ groupKey: string }>();
  const [detail, setDetail] = useState<WhatsAppGroupDetail | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [tab, setTab] = useState<Tab>('review');
  const [kind, setKind] = useState<Kind>('host');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const contactsInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setDetail(await GroupImportsApi.getGroup(groupKey));
      setLoadError(null);
    } catch (err) {
      setLoadError(GroupImportsApi.errorText(err, 'Couldn’t load this group.'));
    }
  }, [groupKey]);

  useEffect(() => { load(); }, [load]);

  const items = useMemo(() => detail?.items || [], [detail]);
  const pendingWork = !!detail && (items.some((i) => i.status === 'queued') || detail.imports.some((i) => i.status === 'queued' || i.status === 'processing'));
  useEffect(() => {
    if (!pendingWork) return;
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [pendingWork, load]);

  const openItems = items.filter(isOpen);
  const sentItems = items.filter((i) => i.status === 'sent' || i.status === 'queued');
  const readyToSend = items.filter((i) => i.status === 'review' && i.phone && !i.contactBlockReason);
  const counts = { host: openItems.filter((i) => i.kind === 'host').length, guest: openItems.filter((i) => i.kind === 'guest').length };
  const shownReview = openItems.filter((i) => i.kind === kind);
  const contacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase().replace(/^\+/, '');
    return (detail?.contacts || []).filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q.replace(/\D/g, '') || '§'));
  }, [detail, contactSearch]);

  const replace = (updated: GroupImportItem[]) =>
    setDetail((d) => d && { ...d, items: d.items.map((i) => updated.find((u) => u.itemId === i.itemId) || i) });

  async function run(itemId: string, action: () => Promise<void>) {
    setBusyId(itemId);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      setNotice({ tone: 'error', text: GroupImportsApi.errorText(err, 'That didn’t work. Try again.') });
    } finally {
      setBusyId(null);
    }
  }

  const save = (item: GroupImportItem) => (input: GroupImportItemInput) =>
    run(item.itemId, async () => replace([await GroupImportsApi.updateItem(item.itemId, input)]));
  const skip = (item: GroupImportItem) => () =>
    run(item.itemId, async () => { await GroupImportsApi.skip([item.itemId]); setDetail((d) => d && { ...d, items: d.items.filter((i) => i.itemId !== item.itemId) }); });
  const send = (item: GroupImportItem) => (overrideReason?: string) => run(item.itemId, async () => {
    const r = await GroupImportsApi.send([item.itemId], overrideReason);
    if (!r.queued) throw new Error('This one was already handled or has no number.');
    replace([{ ...item, status: 'queued', sendError: null }]);
  });

  async function sendAll() {
    if (!readyToSend.length) return;
    if (!window.confirm(`Send the first WhatsApp message to ${readyToSend.length} ${readyToSend.length === 1 ? 'person' : 'people'} with a number?`)) return;
    setSendingAll(true);
    setNotice(null);
    try {
      const r = await GroupImportsApi.send(readyToSend.map((i) => i.itemId));
      setNotice({ tone: 'success', text: `${r.queued} ${r.queued === 1 ? 'message is' : 'messages are'} going out. They move to Sent as they’re delivered.` });
      await load();
    } catch (err) {
      setNotice({ tone: 'error', text: GroupImportsApi.errorText(err, 'Couldn’t send.') });
    } finally {
      setSendingAll(false);
    }
  }

  async function uploadContacts(file?: File) {
    if (!file || !detail) return;
    setNotice(null);
    try {
      const r = await GroupImportsApi.importContacts(await file.text(), file.name, detail.group.groupName);
      setNotice(r.saved
        ? { tone: 'success', text: `${r.saved} numbers saved.${r.skipped ? ` ${r.skipped} rows skipped (no name or number).` : ''}${r.conflicts.length ? ` ${r.conflicts.length} names now match more than one number; you’ll pick the right one when reviewing.` : ''}` }
        : { tone: 'error', text: 'No numbers found. The file needs a name and a phone column.' });
      await load();
    } catch (err) {
      setNotice({ tone: 'error', text: GroupImportsApi.errorText(err, 'Couldn’t read that file.') });
    } finally {
      if (contactsInput.current) contactsInput.current.value = '';
    }
  }

  if (loadError && !detail) {
    return (
      <div className="mx-auto max-w-5xl">
        <div role="alert" className="rounded-xl border border-gray-200 bg-white p-5 text-sm dark:border-gray-700 dark:bg-gray-800">
          {loadError} <button type="button" onClick={load} className="font-medium text-brand-700 underline dark:text-brand-400">Try again</button>
        </div>
      </div>
    );
  }
  if (!detail) {
    return (
      <div className="mx-auto max-w-5xl space-y-4" aria-busy>
        <div className="h-7 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
      </div>
    );
  }

  const g = detail.group;
  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: 'review', label: 'To review', count: openItems.length },
    { id: 'sent', label: 'Sent', count: sentItems.length },
    { id: 'imports', label: 'Imports', count: detail.imports.length },
    { id: 'contacts', label: 'Contacts', count: detail.contacts.length },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-3">
        <Link href="/admin/whatsapp-groups" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
          <ArrowLeftIcon className="h-4 w-4" aria-hidden /> WhatsApp groups
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 [text-wrap:balance] dark:text-white">{g.groupName}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {[g.lastMessageAt ? `Read up to ${postedLabel(g.lastMessageAt)}` : null, `${g.imports} import${g.imports === 1 ? '' : 's'}`, `${g.contacts} numbers known`].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <UploadExportButton variant="secondary" groupName={g.groupName}
              onUploaded={(text) => { setNotice({ tone: 'success', text }); load(); }}
              onError={(text) => setNotice({ tone: 'error', text })} />
            <button type="button" onClick={sendAll} disabled={sendingAll || !readyToSend.length}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <PaperAirplaneIcon className="h-4 w-4" aria-hidden />{sendingAll ? 'Sending…' : `Send all${readyToSend.length ? ` (${readyToSend.length})` : ''}`}
            </button>
          </div>
        </div>
      </header>

      {notice && (
        <p role="status" className={`rounded-lg px-4 py-3 text-sm ${notice.tone === 'success' ? 'bg-brand-50 text-brand-800 dark:bg-brand-900/20 dark:text-brand-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'}`}>
          {notice.text}
        </p>
      )}

      <nav className="flex gap-6 border-b border-gray-200 dark:border-gray-700" role="tablist" aria-label="Group sections">
        {tabs.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors focus:outline-none focus-visible:text-gray-900 ${tab === t.id
              ? 'border-brand-600 text-gray-900 dark:text-white'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'}`}>
            {t.label}{t.count !== undefined && <span className="ml-1.5 tabular-nums text-gray-400">{t.count}</span>}
          </button>
        ))}
      </nav>

      {tab === 'review' && (
        <section className="space-y-4">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
            {([['host', 'Host adverts'], ['guest', 'Guest requests']] as const).map(([value, label]) => (
              <button key={value} type="button" onClick={() => setKind(value)} aria-pressed={kind === value}
                className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${kind === value ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>
                {label}<span className="ml-1.5 tabular-nums opacity-60">{counts[value]}</span>
              </button>
            ))}
          </div>
          {shownReview.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center dark:border-gray-600">
              <p className="font-medium text-gray-900 dark:text-white">Nothing to review</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {kind === 'host' ? 'New host adverts' : 'Fresh guest requests with stays to recommend'} show up here after the next upload.
              </p>
            </div>
          ) : (
            <ul className={`${panel} divide-y divide-gray-100 dark:divide-gray-700`}>
              {shownReview.map((item) => (
                <ReviewItem key={item.itemId} item={item} busy={busyId === item.itemId} onSave={save(item)} onSend={send(item)} onSkip={skip(item)} />
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === 'sent' && (
        sentItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">No messages sent from this group yet.</p>
        ) : (
          <ul className={`${panel} divide-y divide-gray-100 dark:divide-gray-700`}>
            {sentItems.map((item) => (
              <ReviewItem key={item.itemId} item={item} busy={false} onSave={save(item)} onSend={send(item)} onSkip={skip(item)} />
            ))}
          </ul>
        )
      )}

      {tab === 'imports' && (
        <div className={`${panel} overflow-x-auto`}>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 dark:bg-gray-900/40 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-5 py-3">Uploaded</th>
                <th scope="col" className="px-5 py-3">File</th>
                <th scope="col" className="px-5 py-3">Status</th>
                <th scope="col" className="px-5 py-3 text-right">New messages</th>
                <th scope="col" className="px-5 py-3 text-right">Adverts</th>
                <th scope="col" className="px-5 py-3 text-right">Requests</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {detail.imports.map((i) => (
                <tr key={i.importId} className="text-gray-700 dark:text-gray-300">
                  <td className="whitespace-nowrap px-5 py-3">{timeAgo(i.createdAt)}</td>
                  <td className="max-w-[16rem] truncate px-5 py-3" title={i.filename}>{i.filename}</td>
                  <td className="px-5 py-3">
                    <span className={i.status === 'failed' ? 'text-red-700 dark:text-red-400' : i.status === 'done' ? '' : 'text-gray-500'}>{IMPORT_STATUS[i.status] || i.status}</span>
                    {i.status === 'failed' && i.error && <span className="block text-xs text-gray-500">{i.error}</span>}
                    {i.refused > 0 && <span className="block text-xs text-gray-500">{i.refused} message{i.refused === 1 ? '' : 's'} couldn’t be read</span>}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">{i.newMessages}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{i.hosts}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{i.guests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'contacts' && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block sm:w-72">
              <span className="sr-only">Search contacts</span>
              <input value={contactSearch} onChange={(e) => setContactSearch(e.target.value)} placeholder="Search name or number"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
            </label>
            <div>
              <input ref={contactsInput} type="file" accept=".csv,.json" hidden onChange={(e) => uploadContacts(e.target.files?.[0])} />
              <button type="button" onClick={() => contactsInput.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                <UserGroupIcon className="h-4 w-4" aria-hidden /> Upload contact list
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Names and numbers of the group’s members (a CSV with name and phone columns). Each sender’s number is looked up here. Numbers you add while reviewing are marked confirmed.
          </p>
          {contacts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
              {detail.contacts.length ? 'No contact matches that search.' : 'No numbers yet. Upload the group’s contact list to fill in senders’ numbers automatically.'}
            </p>
          ) : (
            <div className={`${panel} overflow-x-auto`}>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 dark:bg-gray-900/40 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-5 py-3">Name</th>
                    <th scope="col" className="px-5 py-3">Number</th>
                    <th scope="col" className="px-5 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {contacts.map((c) => (
                    <tr key={c.phone} className="text-gray-700 dark:text-gray-300">
                      <td className="px-5 py-3">
                        <span className="font-medium text-gray-900 dark:text-white">{c.name.replace(/^~\s*/, '')}</span>
                        {c.names.length > 1 && <span className="block text-xs text-gray-500">Also seen as {c.names.filter((n) => n !== c.name.replace(/^~\s*/, '').toLowerCase()).join(', ')}</span>}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums">
                        +{c.phone}
                        {c.confirmed && <span className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-brand-700 dark:text-brand-400"><CheckBadgeIcon className="h-4 w-4" aria-hidden />Confirmed</span>}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-500">{timeAgo(c.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
