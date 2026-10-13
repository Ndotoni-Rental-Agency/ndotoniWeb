'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { GroupImportDetail, GroupImportItem, GroupImportItemInput, GroupImportsApi } from '@/lib/admin/groupImports';
import { GroupItemCard } from '@/components/admin/group-imports/GroupItemCard';

export const dynamic = 'force-dynamic';

type Tab = 'host' | 'guest';
type Filter = 'open' | 'sent' | 'all';

export default function GroupImportReviewPage() {
  const { importId } = useParams<{ importId: string }>();
  const [detail, setDetail] = useState<GroupImportDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [tab, setTab] = useState<Tab>('host');
  const [filter, setFilter] = useState<Filter>('open');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);

  const load = useCallback(async () => {
    try {
      setDetail(await GroupImportsApi.get(importId));
    } catch (err) {
      setError(GroupImportsApi.errorText(err, 'Could not load this import.'));
    }
  }, [importId]);

  useEffect(() => { load(); }, [load]);

  // Refresh while the import is running or messages are going out
  const pending = !!detail && (detail.status === 'queued' || detail.status === 'processing' || detail.items.some((i) => i.status === 'queued'));
  useEffect(() => {
    if (!pending) return;
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, [pending, load]);

  const replace = (updated: GroupImportItem[]) =>
    setDetail((d) => d && { ...d, items: d.items.map((i) => updated.find((u) => u.itemId === i.itemId) || i) });

  const shown = useMemo(() => (detail?.items || []).filter((i) => i.kind === tab && (
    filter === 'all' ? true : filter === 'sent' ? i.status === 'sent' || i.status === 'queued' : i.status === 'review' || i.status === 'failed'
  )), [detail, tab, filter]);
  const readyToSend = (detail?.items || []).filter((i) => i.status === 'review' && i.phone);
  const count = (kind: Tab) => (detail?.items || []).filter((i) => i.kind === kind && (i.status === 'review' || i.status === 'failed')).length;

  async function run(itemId: string, action: () => Promise<void>) {
    setBusyId(itemId);
    setNotice(null);
    try {
      await action();
    } catch (err) {
      setNotice({ type: 'error', text: GroupImportsApi.errorText(err, 'That didn’t work.') });
    } finally {
      setBusyId(null);
    }
  }

  const save = (item: GroupImportItem) => (input: GroupImportItemInput) =>
    run(item.itemId, async () => { if (Object.keys(input).length) replace([await GroupImportsApi.updateItem(item.itemId, input)]); });
  const skip = (item: GroupImportItem) => () => run(item.itemId, async () => replace(await GroupImportsApi.skip([item.itemId])));
  const send = (item: GroupImportItem) => () => run(item.itemId, async () => {
    const r = await GroupImportsApi.send([item.itemId]);
    if (!r.queued) throw new Error('Not sent: it was already handled or has no number.');
    replace([{ ...item, status: 'queued', sendError: null }]);
  });

  async function sendAll() {
    if (!detail || !readyToSend.length) return;
    if (!window.confirm(`Send the first WhatsApp message to ${readyToSend.length} people (adverts and requests with a number)?`)) return;
    setSendingAll(true);
    setNotice(null);
    try {
      const r = await GroupImportsApi.sendAll(detail.importId);
      setNotice({ type: 'success', text: `${r.queued} messages are going out. This page updates as they’re sent.` });
      await load();
    } catch (err) {
      setNotice({ type: 'error', text: GroupImportsApi.errorText(err, 'Could not send.') });
    } finally {
      setSendingAll(false);
    }
  }

  if (error) return <p className="text-sm text-red-600 dark:text-red-400">{error}</p>;
  if (!detail) return <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Link href="/admin/group-imports" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <ArrowLeftIcon className="h-4 w-4" /> Imports
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{detail.groupName || detail.filename}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {detail.status === 'done'
              ? `${detail.newMessages} new messages · ${detail.hosts} adverts · ${detail.guests} requests${detail.refused ? ` · ${detail.refused} unreadable` : ''}`
              : detail.status === 'failed' ? `Failed: ${detail.error}` : 'Reading the export…'}
          </p>
        </div>
        <button type="button" disabled={sendingAll || !readyToSend.length} onClick={sendAll}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
          <PaperAirplaneIcon className="h-4 w-4" /> Send all ({readyToSend.length})
        </button>
      </div>

      {notice && (
        <div role="status" className={`rounded-lg p-3 text-sm border ${notice.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}>
          {notice.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1" role="tablist">
          {([['host', 'Host adverts'], ['guest', 'Guest requests']] as const).map(([value, label]) => (
            <button key={value} type="button" role="tab" aria-selected={tab === value} onClick={() => setTab(value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === value ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {label} <span className="opacity-70">{count(value)}</span>
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
          {([['open', 'To review'], ['sent', 'Sent'], ['all', 'All']] as const).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setFilter(value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === value ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {shown.length === 0
          ? <p className="text-sm text-gray-500 dark:text-gray-400">Nothing here.</p>
          : shown.map((item) => (
            <GroupItemCard key={item.itemId} item={item} busy={busyId === item.itemId}
              onSave={save(item)} onSend={send(item)} onSkip={skip(item)} />
          ))}
      </div>
    </div>
  );
}
