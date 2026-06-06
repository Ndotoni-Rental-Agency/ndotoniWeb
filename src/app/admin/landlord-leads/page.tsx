'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listLandlordRegistrations } from '@/graphql/queries';
import { updateLandlordRegistrationStatus, addLandlordRegistrationNote } from '@/graphql/mutations';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
  ChevronRightIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/common';

export const dynamic = 'force-dynamic';

type RegistrationStatus = 'SUBMITTED' | 'CONTACTED' | 'VISITED' | 'LISTED' | 'REJECTED';

interface LandlordRegistration {
  registrationId: string;
  createdAt: string;
  name: string;
  phone: string;
  area?: string;
  notes?: string;
  status: RegistrationStatus;
  assignedTo?: string;
  adminNotes?: string[];
  updatedAt?: string;
}

const STATUS_OPTIONS: { value: RegistrationStatus; label: string }[] = [
  { value: 'SUBMITTED', label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'VISITED', label: 'Visited' },
  { value: 'LISTED', label: 'Listed' },
  { value: 'REJECTED', label: 'Rejected' },
];

const STATUS_CONFIG: Record<RegistrationStatus, { color: string; dot: string }> = {
  SUBMITTED: { color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  CONTACTED: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  VISITED: { color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  LISTED: { color: 'bg-green-50 text-green-700 border-green-200', dot: 'bg-green-500' },
  REJECTED: { color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
};

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-TZ', { day: 'numeric', month: 'short' });
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleString('en-TZ', { dateStyle: 'medium', timeStyle: 'short' });
}

function parseNote(raw: string): { time: string; text: string } {
  const match = raw.match(/^\[(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\]\s*(.+)$/);
  if (match) {
    const date = new Date(match[1]);
    const time = date.toLocaleString('en-TZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    let text = match[2];
    // Strip UUID-style author prefix (e.g. "a8610370-8091-70cf-bf5b-a09e88058153: ")
    text = text.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:\s*/i, '');
    return { time, text };
  }
  const stripped = raw.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:\s*/i, '');
  return { time: '', text: stripped };
}

export default function LandlordLeadsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'ALL'>('ALL');
  const [registrations, setRegistrations] = useState<LandlordRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedOnce = useRef(false);

  const loadData = useCallback(async () => {
    if (!hasLoadedOnce.current) setLoading(true);
    setError(false);
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        listLandlordRegistrations: { registrations: LandlordRegistration[]; count: number };
      }>(listLandlordRegistrations, { limit: 100 });
      setRegistrations(data.listLandlordRegistrations?.registrations || []);
    } catch (err) {
      console.error('Failed to load landlord registrations:', err);
      setError(true);
    } finally {
      setLoading(false);
      hasLoadedOnce.current = true;
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Poll every 10s for new submissions
  useEffect(() => {
    const interval = setInterval(() => { loadData(); }, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: registrations.length };
    registrations.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return counts;
  }, [registrations]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return registrations.filter((r) => {
      const matchesSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.area || '').toLowerCase().includes(q) ||
        (r.notes || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filtered]);

  const selected = registrations.find(r => (r.registrationId + r.createdAt) === selectedId) || null;

  const handleStatusChange = async (reg: LandlordRegistration, newStatus: RegistrationStatus) => {
    setIsSaving(true);
    try {
      await GraphQLClient.executeAuthenticated(updateLandlordRegistrationStatus, {
        registrationId: reg.registrationId,
        createdAt: reg.createdAt,
        status: newStatus,
      });
      setRegistrations(prev => prev.map(r =>
        (r.registrationId + r.createdAt) === (reg.registrationId + reg.createdAt)
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = async () => {
    if (!selected || !newNote.trim()) return;
    setIsSaving(true);
    try {
      await GraphQLClient.executeAuthenticated(addLandlordRegistrationNote, {
        registrationId: selected.registrationId,
        createdAt: selected.createdAt,
        note: newNote.trim(),
      });
      setRegistrations(prev => prev.map(r =>
        (r.registrationId + r.createdAt) === selectedId
          ? { ...r, adminNotes: [...(r.adminNotes || []), `[${new Date().toISOString()}] ${newNote.trim()}`] }
          : r
      ));
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left: List */}
      <div className={cn('flex-1 space-y-5', selected && 'hidden lg:block lg:max-w-md')}>
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Landlord Leads</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {registrations.length} property owners registered or referred
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40 [&::-webkit-search-cancel-button]:hidden"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <XMarkIcon className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[{ value: 'ALL' as const, label: 'All' }, ...STATUS_OPTIONS].map((pill) => (
            <button
              key={pill.value}
              onClick={() => setStatusFilter(pill.value)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium border transition-all',
                statusFilter === pill.value
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                  : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300'
              )}
            >
              {pill.label} ({statusCounts[pill.value] || 0})
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-18 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm text-red-500">Failed to load.</p>
            <button onClick={loadData} className="mt-2 text-xs text-brand-600 hover:underline">Retry</button>
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-7 h-7 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No leads found.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((reg) => {
              const config = STATUS_CONFIG[reg.status];
              const itemId = reg.registrationId + reg.createdAt;
              return (
                <button
                  key={itemId}
                  onClick={() => setSelectedId(itemId)}
                  className={cn(
                    'w-full text-left p-3.5 rounded-xl border transition-all',
                    selectedId === itemId
                      ? 'border-brand-300 bg-brand-50/50 dark:bg-brand-900/10 dark:border-brand-700'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{reg.name}</p>
                        <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border', config.color)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
                          {STATUS_OPTIONS.find(o => o.value === reg.status)?.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {reg.area || reg.phone}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatTimeAgo(reg.createdAt)}</p>
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Detail panel */}
      {selected ? (
        <div className="flex-1 lg:flex-[1.5]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Panel header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden text-xs text-gray-500 hover:text-gray-700"
                >
                  ← Back to list
                </button>
                <span className="text-[11px] font-mono text-gray-400">{selected.registrationId}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selected.name}</h2>
              {selected.area && (
                <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {selected.area}
                </p>
              )}
            </div>

            {/* Panel body */}
            <div className="p-5 space-y-6">
              {/* Status change */}
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Status</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleStatusChange(selected, opt.value)}
                      disabled={isSaving}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        selected.status === opt.value
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-brand-300 hover:text-brand-700'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    {selected.phone}
                  </p>
                  {selected.area && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      {selected.area}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <ClockIcon className="w-3.5 h-3.5" />
                    Submitted {formatFullDate(selected.createdAt)}
                  </p>
                </div>

                {/* Quick action buttons */}
                <div className="flex gap-2 pt-1">
                  <a
                    href={`https://wa.me/${selected.phone.replace(/[\s\-+]/g, '')}?text=Habari%2C%20tumeona%20nyumba%20yako.%20Tungependa%20kukusaidia%20kupata%20wapangaji.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${selected.phone}`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Call
                  </a>
                </div>
              </div>

              {/* Original notes from the submission */}
              {selected.notes && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Submission Notes</h3>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                    <DocumentTextIcon className="w-3.5 h-3.5 inline mr-1.5 text-gray-400" />
                    {selected.notes}
                  </div>
                </div>
              )}

              {/* Admin notes */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Notes</h3>
                {selected.adminNotes && selected.adminNotes.length > 0 ? (
                  <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                    {selected.adminNotes.map((raw, i) => {
                      const { time, text } = parseNote(raw);
                      return (
                        <div key={i} className="p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                          <p className="text-xs text-gray-700 dark:text-gray-300">{text}</p>
                          {time && <p className="text-[10px] text-gray-400 mt-1">{time}</p>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-3">No notes yet.</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                    placeholder="Add a note..."
                    className="flex-1 h-9 px-3 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || isSaving}
                    className="h-9 px-3 bg-brand-500 text-white text-xs font-medium rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                  >
                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 lg:flex-[1.5] items-center justify-center">
          <div className="text-center text-gray-400">
            <ChatBubbleLeftEllipsisIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Select a lead to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
