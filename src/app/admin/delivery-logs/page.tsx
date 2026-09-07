'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { CompactSearchInput } from '@/components/admin/CompactSearchInput';
import { FilterChipSelect } from '@/components/admin/FilterChipSelect';
import { DeliveryLogStatusBadge } from '@/components/admin/communication/DeliveryLogStatusBadge';
import { useCommunicationAdmin } from '@/hooks/useCommunicationAdmin';
import {
  COMMON_EVENT_TYPES,
  DELIVERY_STATUSES,
  type DeliveryLog,
  type DeliveryStatus,
} from '@/types/communication-admin';
import { cn } from '@/lib/utils/common';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-TZ', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export default function DeliveryLogsPage() {
  const {
    logs,
    logsLoading,
    logsError,
    logsNextToken,
    loadDeliveryLogs,
  } = useCommunicationAdmin();

  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'ALL'>('ALL');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refreshLogs = useCallback(() => {
    loadDeliveryLogs({
      eventType: eventTypeFilter === 'ALL' ? undefined : eventTypeFilter,
    });
  }, [eventTypeFilter, loadDeliveryLogs]);

  useEffect(() => {
    refreshLogs();
  }, [refreshLogs]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
      const matchesSearch =
        !q ||
        log.messageId.toLowerCase().includes(q) ||
        log.userId.toLowerCase().includes(q) ||
        log.eventType.toLowerCase().includes(q) ||
        (log.templateId ?? '').toLowerCase().includes(q) ||
        (log.error ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [logs, search, statusFilter]);

  const selected = filtered.find((l) => l.messageId === selectedId) ?? filtered[0] ?? null;

  useEffect(() => {
    if (filtered.length > 0 && !filtered.some((l) => l.messageId === selectedId)) {
      setSelectedId(filtered[0].messageId);
    }
  }, [filtered, selectedId]);

  return (
    <div className="flex flex-col h-full min-h-0 gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Delivery Logs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse sent, failed, and suppressed messages across all channels.
          </p>
        </div>
        <button
          type="button"
          onClick={refreshLogs}
          disabled={logsLoading}
          className="inline-flex items-center gap-1.5 self-start rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          <ArrowPathIcon className={cn('h-4 w-4', logsLoading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {logsError && (
        <div className="rounded-xl bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 px-4 py-3 text-sm shrink-0">
          {logsError}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <CompactSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search user, event, error…"
          className="min-w-[200px] flex-1 max-w-md"
        />
        <FilterChipSelect
          aria-label="Filter by event type"
          value={eventTypeFilter}
          onChange={setEventTypeFilter}
          options={[
            { value: 'ALL', label: 'All events' },
            ...COMMON_EVENT_TYPES.map((e) => ({ value: e, label: e.replace(/_/g, ' ') })),
          ]}
        />
        <FilterChipSelect
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as DeliveryStatus | 'ALL')}
          options={[
            { value: 'ALL', label: 'All statuses' },
            ...DELIVERY_STATUSES.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>

      <div className="flex flex-1 min-h-0 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
        <div className="w-full max-w-md border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
            {filtered.length} log{filtered.length === 1 ? '' : 's'}
          </div>
          <div className="flex-1 overflow-y-auto">
            {logsLoading && logs.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">Loading logs…</p>
            ) : filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No delivery logs match your filters.</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((log) => (
                  <LogListItem
                    key={log.messageId}
                    log={log}
                    selected={selected?.messageId === log.messageId}
                    onSelect={() => setSelectedId(log.messageId)}
                  />
                ))}
              </ul>
            )}
          </div>
          {logsNextToken && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() =>
                  loadDeliveryLogs({
                    append: true,
                    eventType: eventTypeFilter === 'ALL' ? undefined : eventTypeFilter,
                  })
                }
                disabled={logsLoading}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {logsLoading ? 'Loading…' : 'Load more'}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6">
          {selected ? (
            <LogDetail log={selected} />
          ) : (
            <p className="text-sm text-gray-500">Select a log entry to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function LogListItem({
  log,
  selected,
  onSelect,
}: {
  log: DeliveryLog;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'w-full text-left px-4 py-3 transition-colors',
          selected
            ? 'bg-brand-50 dark:bg-brand-900/20'
            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
            {log.eventType}
          </span>
          <DeliveryLogStatusBadge status={log.status} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
          {log.channel} · {log.userId.slice(0, 8)}…
        </p>
        <p className="text-[11px] text-gray-400 mt-1">{formatTimeAgo(log.sentAt)}</p>
      </button>
    </li>
  );
}

function LogDetail({ log }: { log: DeliveryLog }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Message ID', value: log.messageId },
    { label: 'User ID', value: log.userId },
    { label: 'Event type', value: log.eventType },
    { label: 'Channel', value: log.channel },
    { label: 'Status', value: log.status },
    { label: 'Sent at', value: formatDate(log.sentAt) },
  ];

  if (log.templateId) rows.push({ label: 'Template ID', value: log.templateId });
  if (log.provider) rows.push({ label: 'Provider', value: log.provider });
  if (log.providerMessageId) rows.push({ label: 'Provider message ID', value: log.providerMessageId });
  if (log.error) rows.push({ label: 'Error / reason', value: log.error });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{log.eventType}</h2>
        <DeliveryLogStatusBadge status={log.status} />
      </div>

      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="grid gap-1 sm:grid-cols-[140px_1fr]">
            <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {row.label}
            </dt>
            <dd className="text-sm text-gray-900 dark:text-white break-all font-mono">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
