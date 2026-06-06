'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { type ReferralStatus, type RewardStatus } from '@/data/admin/referrals';
import { GraphQLClient } from '@/lib/graphql-client';
import { listReferralSubmissions } from '@/graphql/queries';
import { updateReferralStatus, addReferralNote } from '@/graphql/mutations';
import { ReferralStatusBadge, RewardStatusBadge } from '@/components/admin/referrals/ReferralStatusBadge';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  PaperAirplaneIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/common';

export const dynamic = 'force-dynamic';

interface Referral {
  id: string;
  referrerName: string;
  referrerPhone: string;
  referrerNida?: string;
  landlordName: string;
  landlordPhone: string;
  area: string;
  notes: string;
  submittedAt: string;
  updatedAt: string;
  status: ReferralStatus;
  listingRewardStatus: RewardStatus;
  profitShareRewardStatus: RewardStatus;
  assignedTo?: string;
  adminNotes?: string[];
}

const STATUS_OPTIONS: { value: ReferralStatus; label: string }[] = [
  { value: 'SUBMITTED', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PROPERTY_LISTED', label: 'Listed' },
  { value: 'PROPERTY_RENTED', label: 'Rented' },
];

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
  // Format: [2026-06-06T16:36:18.709Z] cognitoId: note text
  // or: [2026-06-06T16:36:18.709Z] note text
  const match = raw.match(/^\[(\d{4}-\d{2}-\d{2}T[\d:.]+Z)\]\s*(.+)$/);
  if (match) {
    const date = new Date(match[1]);
    const time = date.toLocaleString('en-TZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    let text = match[2];
    // Strip UUID-style author prefix (e.g. "a8610370-8091-70cf-bf5b-a09e88058153: ")
    text = text.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:\s*/i, '');
    return { time, text };
  }
  // Fallback: strip UUID prefix even without timestamp
  const stripped = raw.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:\s*/i, '');
  return { time: '', text: stripped };
}

export default function AdminReferralsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const hasLoadedOnce = useRef(false);

  const loadReferrals = useCallback(async () => {
    if (!hasLoadedOnce.current) setIsLoading(true);
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        listReferralSubmissions: { submissions: any[]; count: number };
      }>(listReferralSubmissions, { limit: 100 });
      const submissions = data.listReferralSubmissions?.submissions || [];
      setReferrals(submissions.map((s: any) => ({
        id: s.referralId,
        referrerName: s.referrerName,
        referrerPhone: s.referrerPhone,
        referrerNida: s.referrerNida,
        landlordName: s.landlordName,
        landlordPhone: s.landlordPhone,
        area: s.landlordArea || '',
        notes: s.landlordNotes || '',
        submittedAt: s.createdAt,
        updatedAt: s.updatedAt || s.createdAt,
        status: s.status as ReferralStatus,
        listingRewardStatus: s.listingRewardStatus || 'PENDING',
        profitShareRewardStatus: s.profitShareRewardStatus || 'PENDING',
        assignedTo: s.assignedTo,
        adminNotes: s.adminNotes || [],
      })));
    } catch (err) {
      console.error('[Admin Referrals] Failed to load:', err);
    } finally {
      setIsLoading(false);
      hasLoadedOnce.current = true;
    }
  }, []);

  useEffect(() => { loadReferrals(); }, [loadReferrals]);

  // Poll every 10s for new submissions
  useEffect(() => {
    const interval = setInterval(() => { loadReferrals(); }, 10000);
    return () => clearInterval(interval);
  }, [loadReferrals]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: referrals.length };
    referrals.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return counts;
  }, [referrals]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return referrals.filter((r) => {
      const matchesSearch = !q ||
        r.id.toLowerCase().includes(q) ||
        r.referrerName.toLowerCase().includes(q) ||
        r.landlordName.toLowerCase().includes(q) ||
        r.referrerPhone.includes(q) ||
        r.landlordPhone.includes(q) ||
        r.area.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, referrals]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [filtered]);

  const selected = referrals.find(r => r.id === selectedId) || null;

  const handleStatusChange = async (referral: Referral, newStatus: ReferralStatus) => {
    setIsSaving(true);
    try {
      await GraphQLClient.executeAuthenticated(updateReferralStatus, {
        referralId: referral.id,
        createdAt: referral.submittedAt,
        status: newStatus,
      });
      setReferrals(prev => prev.map(r =>
        r.id === referral.id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r
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
      await GraphQLClient.executeAuthenticated(addReferralNote, {
        referralId: selected.id,
        createdAt: selected.submittedAt,
        note: newNote.trim(),
      });
      setReferrals(prev => prev.map(r =>
        r.id === selected.id
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Referrals</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {referrals.length} total submissions
            </p>
          </div>
          <Link
            href="/refer"
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowTopRightOnSquareIcon className="w-3 h-3" />
            Page
          </Link>
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
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="w-7 h-7 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No referrals found.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sorted.map((ref) => (
              <button
                key={ref.id}
                onClick={() => setSelectedId(ref.id)}
                className={cn(
                  'w-full text-left p-3.5 rounded-xl border transition-all',
                  selectedId === ref.id
                    ? 'border-brand-300 bg-brand-50/50 dark:bg-brand-900/10 dark:border-brand-700'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {ref.landlordName}
                      </p>
                      <ReferralStatusBadge
                        status={ref.status}
                        label={STATUS_OPTIONS.find(o => o.value === ref.status)?.label || ref.status}
                        size="sm"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {ref.area || ref.landlordPhone}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      by {ref.referrerName} · {formatTimeAgo(ref.submittedAt)}
                    </p>
                  </div>
                  <ChevronRightIcon className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
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
                <span className="text-[11px] font-mono text-gray-400">{selected.id}</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selected.landlordName}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{selected.area}</p>
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

              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Landlord</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{selected.landlordName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <PhoneIcon className="w-3.5 h-3.5" />
                      {selected.landlordPhone}
                    </p>
                    {selected.area && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        {selected.area}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${selected.landlordPhone.replace(/[\s\-+]/g, '')}?text=Habari%2C%20tunajishughulisha%20na%20nyumba%20za%20kupanga.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${selected.landlordPhone}`}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referrer</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">{selected.referrerName}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <PhoneIcon className="w-3.5 h-3.5" />
                      {selected.referrerPhone}
                    </p>
                    {selected.referrerNida && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5" />
                        NIDA: {selected.referrerNida}
                      </p>
                    )}
                  </div>
                  <a
                    href={`https://wa.me/${selected.referrerPhone.replace(/[\s\-+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Contact Referrer
                  </a>
                </div>
              </div>

              {/* Rewards */}
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Rewards</h3>
                <div className="flex gap-3">
                  <div className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-400 mb-1">Listing Reward</p>
                    <RewardStatusBadge status={selected.listingRewardStatus} label={selected.listingRewardStatus} size="sm" />
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-400 mb-1">Profit Share</p>
                    <RewardStatusBadge status={selected.profitShareRewardStatus} label={selected.profitShareRewardStatus} size="sm" />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-gray-400 mb-0.5">Submitted</p>
                  <p className="text-gray-700 dark:text-gray-300">{formatFullDate(selected.submittedAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-0.5">Last Updated</p>
                  <p className="text-gray-700 dark:text-gray-300">{formatFullDate(selected.updatedAt)}</p>
                </div>
                {selected.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-400 mb-0.5">Referrer Notes</p>
                    <p className="text-gray-700 dark:text-gray-300">{selected.notes}</p>
                  </div>
                )}
              </div>

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
            <p className="text-sm">Select a referral to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
