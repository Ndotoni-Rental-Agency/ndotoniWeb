'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { listLandlordRegistrations } from '@/graphql/queries';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
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

const STATUS_COLORS: Record<RegistrationStatus, string> = {
  SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
  CONTACTED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  VISITED: 'bg-purple-50 text-purple-700 border-purple-200',
  LISTED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  SUBMITTED: 'New',
  CONTACTED: 'Contacted',
  VISITED: 'Visited',
  LISTED: 'Listed',
  REJECTED: 'Rejected',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-TZ', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export default function LandlordLeadsPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'ALL'>('ALL');

  // Fetch data from GraphQL
  const [registrations, setRegistrations] = useState<LandlordRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
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
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return registrations.filter((r) => {
      const matchesSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.area || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const statusPills: { value: RegistrationStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'SUBMITTED', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'VISITED', label: 'Visited' },
    { value: 'LISTED', label: 'Listed' },
    { value: 'REJECTED', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Landlord Leads
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Property owners who registered interest via the website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statusPills.filter(p => p.value !== 'ALL').map((pill) => {
          const count = registrations.filter(r => r.status === pill.value).length;
          return (
            <div key={pill.value} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{pill.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, or area..."
            className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-400" />
          {statusPills.map((pill) => (
            <button key={pill.value} onClick={() => setStatusFilter(pill.value)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                statusFilter === pill.value
                  ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300')}>
              {pill.label}
            </button>
          ))}
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} results</span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p className="text-sm">Failed to load data. Please refresh.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <MagnifyingGlassIcon className="w-8 h-8 text-gray-300 mx-auto" />
          <p className="text-sm text-gray-500">No landlord leads found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((reg) => (
            <div key={reg.registrationId + reg.createdAt}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-brand-200 dark:hover:border-brand-800 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{reg.name}</p>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-semibold border', STATUS_COLORS[reg.status])}>
                      {STATUS_LABELS[reg.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <PhoneIcon className="w-3 h-3" />
                      <a href={`tel:${reg.phone}`} className="hover:text-brand-600">{reg.phone}</a>
                    </span>
                    {reg.area && (
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {reg.area}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {formatTimeAgo(reg.createdAt)}
                    </span>
                  </div>
                  {reg.notes && (
                    <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{reg.notes}</p>
                  )}
                </div>
                <a href={`https://wa.me/${reg.phone.replace(/[\s\-+]/g, '')}?text=Habari%2C%20tumeona%20nyumba%20yako%20kwenye%20Ndotoni`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
