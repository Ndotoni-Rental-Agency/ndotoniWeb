'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { ProxiedImg } from '@/components/property/ProxiedImg';
import { GraphQLClient } from '@/lib/graphql-client';

/** Slim listAllProperties; the backend returns up to `limit` per kind, with no next page. */
const listAllListingsForAdmin = /* GraphQL */ `
  query ListAllListingsForAdmin($propertyType: String, $status: PropertyStatus, $search: String, $limit: Int) {
    listAllProperties(propertyType: $propertyType, status: $status, search: $search, limit: $limit) {
      longTermProperties {
        propertyId
        title
        status
        address {
          ward
          district
          region
        }
        pricing {
          monthlyRent
          currency
        }
        media {
          images
        }
        unitLabel
        updatedAt
      }
      shortTermProperties {
        propertyId
        title
        status
        region
        district
        address {
          ward
        }
        nightlyRate
        currency
        thumbnail
        images
        managedBy
        unitLabel
        updatedAt
      }
    }
  }
`;

interface Row {
  propertyId: string;
  kind: 'LONG_TERM' | 'SHORT_TERM';
  title: string;
  status?: string | null;
  area: string;
  price?: string;
  thumbnail?: string | null;
  managed: boolean;
  unitLabel?: string | null;
  updatedAt?: string | null;
}

const LIMIT = 200;
const SEARCH_DELAY_MS = 400;
const STAYS_URL = process.env.NEXT_PUBLIC_STAYS_URL || 'https://www.ndotonistays.com';

const STATUSES = [
  { status: 'AVAILABLE', label: 'Live' },
  { status: 'DRAFT', label: 'Drafts' },
  { status: 'RENTED', label: 'Rented' },
  { status: 'INACTIVE', label: 'Taken down' },
] as const;
type StatusTab = (typeof STATUSES)[number]['status'];
type KindFilter = 'ALL' | 'LONG_TERM' | 'SHORT_TERM';

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  DRAFT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
};

const titleCase = (s?: string | null) =>
  (s || '').replace(/[-_]+/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const area = (...parts: Array<string | null | undefined>) => parts.filter(Boolean).map(titleCase).join(', ');

/** Rentals are edited here; stays on ndotonistays.com. Admins can edit any listing in both. */
const manageHref = (r: Row) =>
  r.kind === 'LONG_TERM' ? `/host/properties/${r.propertyId}/edit` : `${STAYS_URL}/host/property/${r.propertyId}/edit`;
const viewHref = (r: Row) => (r.kind === 'LONG_TERM' ? `/property/${r.propertyId}` : `${STAYS_URL}/property/${r.propertyId}`);

/**
 * Every listing on Ndotoni (admins), whoever owns it: the "All listings" view of Managed listings.
 * The owner stays the owner; admins can edit, publish, take down and manage any listing.
 */
export function AllListingsList() {
  const [kind, setKind] = useState<KindFilter>('ALL');
  const [status, setStatus] = useState<StatusTab>('AVAILABLE');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  // Search on the server, a moment after typing stops
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    try {
      const data = await GraphQLClient.executeAuthenticated<{ listAllProperties: { longTermProperties: any[]; shortTermProperties: any[] } }>(
        listAllListingsForAdmin,
        {
          ...(kind !== 'ALL' && { propertyType: kind }),
          // A search covers every status, so a listing is found whatever state it is in
          ...(query ? { search: query } : { status }),
          limit: LIMIT,
        },
      );
      if (id !== requestId.current) return; // a newer search or filter replaced this one
      const rentals: Row[] = (data.listAllProperties?.longTermProperties || []).map((p) => ({
        propertyId: p.propertyId,
        kind: 'LONG_TERM',
        title: p.title,
        status: p.status,
        area: area(p.address?.ward, p.address?.district, p.address?.region),
        price: p.pricing?.monthlyRent != null ? `${p.pricing.currency || 'TZS'} ${p.pricing.monthlyRent.toLocaleString()}/mo` : undefined,
        thumbnail: p.media?.images?.[0],
        managed: false,
        unitLabel: p.unitLabel,
        updatedAt: p.updatedAt,
      }));
      const stays: Row[] = (data.listAllProperties?.shortTermProperties || []).map((s) => ({
        propertyId: s.propertyId,
        kind: 'SHORT_TERM',
        title: s.title,
        status: s.status,
        area: area(s.address?.ward, s.district, s.region),
        price: s.nightlyRate != null ? `${s.currency || 'TZS'} ${s.nightlyRate.toLocaleString()}/night` : undefined,
        thumbnail: s.thumbnail || s.images?.[0],
        managed: s.managedBy === 'NDOTONI',
        unitLabel: s.unitLabel,
        updatedAt: s.updatedAt,
      }));
      setRows([...rentals, ...stays].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || '')));
      setError(null);
    } catch (err: any) {
      if (id !== requestId.current) return;
      setError(err?.errors?.[0]?.message || err?.message || 'Could not load listings.');
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [kind, status, query]);

  useEffect(() => {
    load();
  }, [load]);

  const pill = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${active
      ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Every listing on Ndotoni, whoever owns it. Open one to change details, price, photos or availability. The owner stays the owner.
      </p>

      <label className="relative block">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, area or property ID…"
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600"
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        {(['ALL', 'LONG_TERM', 'SHORT_TERM'] as KindFilter[]).map((k) => (
          <button key={k} type="button" onClick={() => setKind(k)} className={pill(kind === k)} aria-pressed={kind === k}>
            {k === 'ALL' ? 'Rentals & stays' : k === 'LONG_TERM' ? 'Rentals' : 'Stays'}
          </button>
        ))}
        {!query && <span className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" aria-hidden />}
        {!query && STATUSES.map((s) => (
          <button key={s.status} type="button" onClick={() => setStatus(s.status)} className={pill(status === s.status)} aria-pressed={status === s.status}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
          <p className="font-medium text-gray-900 dark:text-white">{query ? 'Nothing matches' : 'No listings here'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {query ? 'Try a shorter word, an area, or the property ID.' : 'Try another filter.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400">
            {rows.length}{rows.length >= LIMIT ? '+' : ''} {query ? 'found' : 'listings'}
            {rows.length >= LIMIT ? ' · search to find others' : ''}
          </p>
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={`${r.kind}:${r.propertyId}`} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {r.thumbnail ? (
                      <ProxiedImg src={r.thumbnail} width={64} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {r.title}{r.unitLabel ? ` · ${r.unitLabel}` : ''}
                        </p>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {r.kind === 'LONG_TERM' ? 'Rental' : 'Stay'}
                        </span>
                        {r.status && (
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[r.status] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {r.status === 'AVAILABLE' ? 'Live' : r.status === 'INACTIVE' ? 'Taken down' : titleCase(r.status)}
                          </span>
                        )}
                        {r.managed && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                            Managed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {r.area}{r.price ? ` · ${r.price}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    {r.kind === 'LONG_TERM' ? (
                      <Link href={manageHref(r)} className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors">
                        Manage
                      </Link>
                    ) : (
                      <a href={manageHref(r)} className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors">
                        Manage
                      </a>
                    )}
                    <a
                      href={viewHref(r)}
                      className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
