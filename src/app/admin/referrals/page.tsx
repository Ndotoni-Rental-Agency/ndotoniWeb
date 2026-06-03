'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_REFERRALS, type AdminReferral, type ReferralStatus } from '@/data/admin/referrals';
import { ReferralStatusBadge, RewardStatusBadge } from '@/components/admin/referrals/ReferralStatusBadge';
import { ReferralMetricsGrid } from '@/components/admin/referrals/ReferralMetricsGrid';
import { ReferralTableSkeleton } from '@/components/admin/referrals/ReferralTableSkeleton';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PencilSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  ArrowTopRightOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/common';

export const dynamic = 'force-dynamic';

type SortField = 'id' | 'referrerName' | 'landlordName' | 'area' | 'submittedAt' | 'status';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 8;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-TZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// ─── Prominent search bar ────────────────────────────────────────────────────
function ProminentSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'h-12 w-full rounded-xl',
          'border border-gray-200 dark:border-gray-700',
          'bg-white dark:bg-gray-800',
          'pl-11 pr-10',
          'text-xs text-gray-900 dark:text-white',
          'placeholder:text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-[#00CD54]/40 focus:border-[#00CD54]/60',
          'transition-all',
          '[&::-webkit-search-cancel-button]:hidden',
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─── Filter pill ─────────────────────────────────────────────────────────────
function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium border transition-all',
        active
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-gray-200',
      )}
    >
      {label}
    </button>
  );
}

// ─── Actions dropdown ─────────────────────────────────────────────────────────
function ActionsMenu({ referralId }: { referralId: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
        aria-label="Actions"
      >
        <EllipsisVerticalIcon className="w-4 h-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden py-1">
            <Link
              href={`/admin/referrals/${referralId}`}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
              onClick={() => setOpen(false)}
            >
              <EyeIcon className="w-4 h-4 text-gray-400" />
              {t('adminReferrals.actions.viewDetails')}
            </Link>
            <Link
              href={`/admin/referrals/${referralId}#status`}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
              onClick={() => setOpen(false)}
            >
              <PencilSquareIcon className="w-4 h-4 text-gray-400" />
              {t('adminReferrals.actions.editStatus')}
            </Link>
            <Link
              href={`/admin/referrals/${referralId}#notes`}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
              onClick={() => setOpen(false)}
            >
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-gray-400" />
              {t('adminReferrals.actions.addNote')}
            </Link>
            <div className="my-1 border-t border-gray-100 dark:border-gray-700/60" />
            <Link
              href={`/admin/referrals/${referralId}#rewards`}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors"
              onClick={() => setOpen(false)}
            >
              <CurrencyDollarIcon className="w-4 h-4 text-[#00CD54]" />
              <span className="text-[#00CD54] font-medium">
                {t('adminReferrals.actions.markRewardPaid')}
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Sortable column header ───────────────────────────────────────────────────
function SortableHeader({
  field,
  label,
  sortField,
  sortDir,
  onSort,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <button
      className="group inline-flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      onClick={() => onSort(field)}
    >
      {label}
      <span
        className={cn(
          'transition-opacity',
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-30',
        )}
      >
        {active && sortDir === 'asc' ? (
          <ArrowUpIcon className="w-3 h-3" />
        ) : (
          <ArrowDownIcon className="w-3 h-3" />
        )}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminReferralsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);

  const statusPills: { value: ReferralStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: t('adminReferrals.filters.allStatuses') },
    { value: 'SUBMITTED', label: t('adminReferrals.status.SUBMITTED') },
    { value: 'IN_PROGRESS', label: t('adminReferrals.status.IN_PROGRESS') },
    { value: 'PROPERTY_LISTED', label: t('adminReferrals.status.PROPERTY_LISTED') },
    { value: 'PROPERTY_RENTED', label: t('adminReferrals.status.PROPERTY_RENTED') },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_REFERRALS.filter((r) => {
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.referrerName.toLowerCase().includes(q) ||
        r.landlordName.toLowerCase().includes(q) ||
        r.referrerPhone.includes(q) ||
        r.landlordPhone.includes(q);

      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField as keyof AdminReferral] as string;
      let bVal = b[sortField as keyof AdminReferral] as string;
      aVal = aVal?.toString() ?? '';
      bVal = bVal?.toString() ?? '';
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilters = search.length > 0 || statusFilter !== 'ALL';

  return (
    <div className="space-y-8">

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t('adminReferrals.pageTitle')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('adminReferrals.pageSubtitle')}
          </p>
        </div>
        <Link
          href="/refer"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors flex-shrink-0 self-start"
        >
          <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          View Referral Page
        </Link>
      </div>

      {/* ── KPI metrics ───────────────────────────────────────────────────── */}
      <ReferralMetricsGrid />

      {/* ── Search + filters ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* Primary search */}
        <ProminentSearch
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search by referral ID, referrer name, landlord name, phone number…"
        />

        {/* Secondary filter row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex items-center gap-1.5 flex-wrap">
              {statusPills.map((pill) => (
                <FilterPill
                  key={pill.value}
                  label={pill.label}
                  active={statusFilter === pill.value}
                  onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                />
              ))}
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('ALL'); setPage(1); }}
                className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors ml-1"
              >
                {t('adminReferrals.filters.clearFilters')}
              </button>
            )}
          </div>

          {/* Result count */}
          <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{sorted.length}</span>{' '}
            {t('adminReferrals.pagination.results')}
          </p>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <ReferralTableSkeleton />
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700/60 text-sm">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-gray-900/40">
                  <th className="px-5 py-3.5 text-left">
                    <SortableHeader field="id" label={t('adminReferrals.table.referralId')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-5 py-3.5 text-left">
                    <SortableHeader field="referrerName" label={t('adminReferrals.table.referrer')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-5 py-3.5 text-left">
                    <SortableHeader field="landlordName" label={t('adminReferrals.table.landlord')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-5 py-3.5 text-left hidden md:table-cell">
                    <SortableHeader field="area" label={t('adminReferrals.table.area')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-5 py-3.5 text-left hidden lg:table-cell">
                    <SortableHeader field="submittedAt" label={t('adminReferrals.table.submitted')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-5 py-3.5 text-left">
                    <SortableHeader field="status" label={t('adminReferrals.table.status')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  </th>
                  <th className="px-5 py-3.5 text-left hidden sm:table-cell">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('adminReferrals.table.reward')}
                    </span>
                  </th>
                  <th className="px-5 py-3.5 text-right">
                    <span className="sr-only">{t('adminReferrals.table.actions')}</span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100/80 dark:divide-gray-700/40">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-20 text-center">
                      <div className="max-w-xs mx-auto space-y-2">
                        <MagnifyingGlassIcon className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto" />
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {t('adminReferrals.table.noResults')}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {t('adminReferrals.table.noResultsHint')}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={() => { setSearch(''); setStatusFilter('ALL'); setPage(1); }}
                            className="mt-2 text-xs font-medium text-[#00CD54] hover:underline underline-offset-2"
                          >
                            {t('adminReferrals.filters.clearFilters')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((ref) => (
                    <tr
                      key={ref.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/20 transition-colors group"
                    >
                      {/* Referral ID */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/referrals/${ref.id}`}
                          className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400 hover:text-[#00CD54] dark:hover:text-[#00CD54] transition-colors"
                        >
                          {ref.id}
                        </Link>
                      </td>

                      {/* Referrer */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                          {ref.referrerName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                          {ref.referrerPhone}
                        </p>
                      </td>

                      {/* Landlord */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
                          {ref.landlordName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                          {ref.landlordPhone}
                        </p>
                      </td>

                      {/* Area */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[140px] truncate">
                          {ref.area}
                        </p>
                      </td>

                      {/* Submitted */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap tabular-nums">
                          {formatDate(ref.submittedAt)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <ReferralStatusBadge
                          status={ref.status}
                          label={t(`adminReferrals.status.${ref.status}`)}
                          size="sm"
                        />
                      </td>

                      {/* Reward */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <RewardStatusBadge
                          status={ref.listingRewardStatus}
                          label={t(`adminReferrals.rewardStatus.${ref.listingRewardStatus}`)}
                          size="sm"
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <ActionsMenu referralId={ref.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer — always visible when there are results */}
          {paginated.length > 0 && (
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/20">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('adminReferrals.pagination.showing')}{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)}
                </span>{' '}
                {t('adminReferrals.pagination.of')}{' '}
                <span className="font-semibold text-gray-600 dark:text-gray-300">{sorted.length}</span>{' '}
                {t('adminReferrals.pagination.results')}
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'w-7 h-7 text-xs font-medium rounded-md transition-colors',
                        p === page
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600',
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center justify-center w-7 h-7 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
