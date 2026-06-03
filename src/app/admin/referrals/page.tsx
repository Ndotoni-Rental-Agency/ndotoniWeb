'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { MOCK_REFERRALS, type AdminReferral, type ReferralStatus } from '@/data/admin/referrals';
import { ReferralStatusBadge, RewardStatusBadge } from '@/components/admin/referrals/ReferralStatusBadge';
import { ReferralMetricsGrid } from '@/components/admin/referrals/ReferralMetricsGrid';
import { ReferralTableSkeleton } from '@/components/admin/referrals/ReferralTableSkeleton';
import { CompactSearchInput, FilterChipSelect } from '@/components/admin';
import {
  EllipsisVerticalIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PencilSquareIcon,
  ChatBubbleLeftEllipsisIcon,
  CurrencyDollarIcon,
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
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
            <Link
              href={`/admin/referrals/${referralId}`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              <EyeIcon className="w-4 h-4 text-gray-400" />
              {t('adminReferrals.actions.viewDetails')}
            </Link>
            <Link
              href={`/admin/referrals/${referralId}#status`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              <PencilSquareIcon className="w-4 h-4 text-gray-400" />
              {t('adminReferrals.actions.editStatus')}
            </Link>
            <Link
              href={`/admin/referrals/${referralId}#notes`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setOpen(false)}
            >
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-gray-400" />
              {t('adminReferrals.actions.addNote')}
            </Link>
            <Link
              href={`/admin/referrals/${referralId}#rewards`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
              onClick={() => setOpen(false)}
            >
              <CurrencyDollarIcon className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {t('adminReferrals.actions.markRewardPaid')}
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

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
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-200 transition-colors group"
      onClick={() => onSort(field)}
    >
      {label}
      <span className={cn('transition-opacity', active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40')}>
        {active && sortDir === 'asc' ? (
          <ArrowUpIcon className="w-3 h-3" />
        ) : (
          <ArrowDownIcon className="w-3 h-3" />
        )}
      </span>
    </button>
  );
}

export default function AdminReferralsPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);

  const statusOptions = [
    { value: 'ALL' as const, label: t('adminReferrals.filters.allStatuses') },
    { value: 'SUBMITTED' as const, label: t('adminReferrals.status.SUBMITTED') },
    { value: 'IN_PROGRESS' as const, label: t('adminReferrals.status.IN_PROGRESS') },
    { value: 'PROPERTY_LISTED' as const, label: t('adminReferrals.status.PROPERTY_LISTED') },
    { value: 'PROPERTY_RENTED' as const, label: t('adminReferrals.status.PROPERTY_RENTED') },
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

  const handleFilterChange = (v: string) => {
    setStatusFilter(v as ReferralStatus | 'ALL');
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('adminReferrals.pageTitle')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {t('adminReferrals.pageSubtitle')}
          </p>
        </div>
        <Link
          href="/refer"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          View Referral Page ↗
        </Link>
      </div>

      {/* KPI metrics */}
      <ReferralMetricsGrid />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <CompactSearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder={t('adminReferrals.filters.searchPlaceholder')}
          className="flex-1 sm:max-w-xs"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <FilterChipSelect
            value={statusFilter}
            onChange={handleFilterChange}
            options={statusOptions}
            aria-label={t('adminReferrals.filters.statusFilter')}
          />
          {(search || statusFilter !== 'ALL') && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('ALL'); setPage(1); }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline underline-offset-2"
            >
              {t('adminReferrals.filters.clearFilters')}
            </button>
          )}
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">
          {t('adminReferrals.pagination.showing')} {paginated.length} {t('adminReferrals.pagination.of')} {sorted.length} {t('adminReferrals.pagination.results')}
        </span>
      </div>

      {/* Table */}
      {isLoading ? (
        <ReferralTableSkeleton />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 py-3 text-left">
                  <SortableHeader field="id" label={t('adminReferrals.table.referralId')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortableHeader field="referrerName" label={t('adminReferrals.table.referrer')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortableHeader field="landlordName" label={t('adminReferrals.table.landlord')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  <SortableHeader field="area" label={t('adminReferrals.table.area')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  <SortableHeader field="submittedAt" label={t('adminReferrals.table.submitted')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left">
                  <SortableHeader field="status" label={t('adminReferrals.table.status')} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                </th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('adminReferrals.table.reward')}
                  </span>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="sr-only">{t('adminReferrals.table.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t('adminReferrals.table.noResults')}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {t('adminReferrals.table.noResultsHint')}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((ref) => (
                  <tr
                    key={ref.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
                  >
                    {/* Referral ID */}
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/referrals/${ref.id}`}
                        className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 hover:text-[#00CD54] dark:hover:text-[#00CD54] transition-colors"
                      >
                        {ref.id}
                      </Link>
                    </td>

                    {/* Referrer */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                        {ref.referrerName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {ref.referrerPhone}
                      </p>
                    </td>

                    {/* Landlord */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                        {ref.landlordName}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {ref.landlordPhone}
                      </p>
                    </td>

                    {/* Area */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[140px] truncate">
                        {ref.area}
                      </p>
                    </td>

                    {/* Submitted */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(ref.submittedAt)}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <ReferralStatusBadge
                        status={ref.status}
                        label={t(`adminReferrals.status.${ref.status}`)}
                        size="sm"
                      />
                    </td>

                    {/* Reward */}
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <div className="flex flex-col gap-1">
                        <RewardStatusBadge
                          status={ref.listingRewardStatus}
                          label={t(`adminReferrals.rewardStatus.${ref.listingRewardStatus}`)}
                          size="sm"
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <ActionsMenu referralId={ref.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t('adminReferrals.pagination.previous')}
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'w-8 h-8 text-xs font-medium rounded-lg transition-colors',
                  p === page
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700',
                )}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t('adminReferrals.pagination.next')}
          </button>
        </div>
      )}
    </div>
  );
}
