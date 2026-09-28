'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { GraphQLClient } from '@/lib/graphql-client';

// Force dynamic rendering for pages using AuthGuard
export const dynamic = 'force-dynamic';

const listManagedListings = /* GraphQL */ `
  query ListManagedListings($kind: String) {
    listManagedListings(kind: $kind) {
      propertyId
      kind
      title
      status
      region
      district
      ward
      price
      currency
      thumbnail
      ownerName
      ownerPhone
      listedByAdminName
      listedAt
    }
  }
`;

interface ManagedListing {
  propertyId: string;
  kind: 'LONG_TERM' | 'SHORT_TERM';
  title: string;
  status?: string;
  region?: string;
  district?: string;
  ward?: string;
  price?: number;
  currency?: string;
  thumbnail?: string;
  ownerName?: string;
  ownerPhone?: string;
  listedByAdminName?: string;
  listedAt?: string;
}

type KindFilter = 'ALL' | 'LONG_TERM' | 'SHORT_TERM';

const STAYS_URL = process.env.NEXT_PUBLIC_STAYS_URL || 'https://www.ndotonistays.com';

const titleCase = (s?: string) =>
  (s || '').replace(/[-_]+/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

/** Rentals are edited here; stays are edited on ndotonistays.com, where admins can manage stays Ndotoni runs. */
function manageHref(l: ManagedListing) {
  return l.kind === 'LONG_TERM' ? `/host/properties/${l.propertyId}/edit` : `${STAYS_URL}/host/property/${l.propertyId}/edit`;
}

function viewHref(l: ManagedListing) {
  return l.kind === 'LONG_TERM' ? `/property/${l.propertyId}` : `${STAYS_URL}/property/${l.propertyId}`;
}

export default function ManagedListingsPage() {
  const [listings, setListings] = useState<ManagedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<KindFilter>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    GraphQLClient.executeAuthenticated<{ listManagedListings: ManagedListing[] }>(listManagedListings, {})
      .then((data) => setListings(data.listManagedListings || []))
      .catch((err) => setError(err?.errors?.[0]?.message || err?.message || 'Could not load managed listings.'))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      if (kind !== 'ALL' && l.kind !== kind) return false;
      if (!q) return true;
      return [l.title, l.ownerName, l.ownerPhone, l.ward, l.district, l.region, l.propertyId]
        .some((v) => v?.toLowerCase().includes(q));
    });
  }, [listings, kind, search]);

  const counts = {
    ALL: listings.length,
    LONG_TERM: listings.filter((l) => l.kind === 'LONG_TERM').length,
    SHORT_TERM: listings.filter((l) => l.kind === 'SHORT_TERM').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Managed listings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Properties we listed for owners without an account. Open one to add details, change the price, or update photos.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href="/managed/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" /> List a rental
          </Link>
          <a
            href={`${STAYS_URL}/managed/new`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" /> List a stay
          </a>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
          {([['ALL', 'All'], ['LONG_TERM', 'Rentals'], ['SHORT_TERM', 'Stays']] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                kind === value
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {label} <span className="opacity-70">{counts[value]}</span>
            </button>
          ))}
        </div>
        <label className="relative flex-1">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, owner, phone, area…"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-10 text-center">
          <p className="text-gray-900 dark:text-white font-medium">
            {listings.length === 0 ? 'No managed listings yet' : 'Nothing matches'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {listings.length === 0 ? 'List a property for an owner and it will show up here.' : 'Try another search or filter.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {shown.map((l) => (
            <li
              key={l.propertyId}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {l.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={l.thumbnail} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{l.title}</p>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      {l.kind === 'LONG_TERM' ? 'Rental' : 'Stay'}
                    </span>
                    {l.status && (
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[l.status] || 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}>
                        {titleCase(l.status)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {[l.ward, l.district, l.region].filter(Boolean).map(titleCase).join(', ')}
                    {l.price != null && ` · ${l.currency || 'TZS'} ${l.price.toLocaleString()}${l.kind === 'LONG_TERM' ? '/mo' : '/night'}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    Owner: {l.ownerName || 'Unknown'}{l.ownerPhone && ` · ${l.ownerPhone}`}
                    {l.listedAt && ` · Listed ${new Date(l.listedAt).toLocaleDateString()}`}
                    {l.listedByAdminName && ` by ${l.listedByAdminName}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <a
                  href={manageHref(l)}
                  className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors"
                >
                  Manage
                </a>
                <a
                  href={viewHref(l)}
                  className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  View
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
