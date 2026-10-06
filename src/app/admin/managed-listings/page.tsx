'use client';

import { ProxiedImg } from '@/components/property/ProxiedImg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon, PhotoIcon, ChevronDownIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { GraphQLClient } from '@/lib/graphql-client';
import { publishProperty, publishShortTermProperty } from '@/graphql/mutations';
import AddUnitModal from '@/components/host/dashboard/AddUnitModal';

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
      groupId
      isPrimaryUnit
      unitLabel
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
  groupId?: string | null;
  isPrimaryUnit?: boolean | null;
  unitLabel?: string | null;
}

/** One property: a standalone listing, or every unit of a multi-unit property (primary first). */
interface ManagedGroup {
  key: string;
  kind: ManagedListing['kind'];
  primary: ManagedListing;
  units: ManagedListing[];
}

type KindFilter = 'ALL' | 'LONG_TERM' | 'SHORT_TERM';

const STAYS_URL = process.env.NEXT_PUBLIC_STAYS_URL || 'https://www.ndotonistays.com';

const titleCase = (s?: string) =>
  (s || '').replace(/[-_]+/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

const STATUS_STYLES: Record<string, string> = {
  AVAILABLE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  DRAFT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
};

const isDraft = (l: ManagedListing) => l.status === 'DRAFT';

/** Rentals are edited here; stays are edited on ndotonistays.com, where admins can manage stays Ndotoni runs. */
function manageHref(l: ManagedListing) {
  return l.kind === 'LONG_TERM' ? `/host/properties/${l.propertyId}/edit` : `${STAYS_URL}/host/property/${l.propertyId}/edit`;
}

function viewHref(l: ManagedListing) {
  return l.kind === 'LONG_TERM' ? `/property/${l.propertyId}` : `${STAYS_URL}/property/${l.propertyId}`;
}

function groupListings(listings: ManagedListing[]): ManagedGroup[] {
  const groups = new Map<string, ManagedListing[]>();
  for (const l of listings) {
    const key = `${l.kind}:${l.groupId || l.propertyId}`;
    groups.set(key, [...(groups.get(key) || []), l]);
  }
  return Array.from(groups.entries()).map(([key, units]) => {
    const groupId = units[0].groupId;
    const primary = units.find((u) => u.isPrimaryUnit) || units.find((u) => u.propertyId === groupId) || units[0];
    return { key, kind: primary.kind, primary, units: [primary, ...units.filter((u) => u !== primary)] };
  });
}

export default function ManagedListingsPage() {
  const [listings, setListings] = useState<ManagedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [kind, setKind] = useState<KindFilter>('ALL');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [publishingKey, setPublishingKey] = useState<string | null>(null);
  const [addUnitSourceId, setAddUnitSourceId] = useState<string | null>(null);

  const load = useCallback(() => {
    GraphQLClient.executeAuthenticated<{ listManagedListings: ManagedListing[] }>(listManagedListings, {})
      .then((data) => setListings(data.listManagedListings || []))
      .catch((err) => setError(err?.errors?.[0]?.message || err?.message || 'Could not load managed listings.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => groupListings(listings), [listings]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groups.filter((g) => {
      if (kind !== 'ALL' && g.kind !== kind) return false;
      if (!q) return true;
      return g.units.some((l) =>
        [l.title, l.unitLabel, l.ownerName, l.ownerPhone, l.ward, l.district, l.region, l.propertyId]
          .some((v) => v?.toLowerCase().includes(q))
      );
    });
  }, [groups, kind, search]);

  const counts = {
    ALL: groups.length,
    LONG_TERM: groups.filter((g) => g.kind === 'LONG_TERM').length,
    SHORT_TERM: groups.filter((g) => g.kind === 'SHORT_TERM').length,
  };

  /** Publishes every draft unit of the property in one go. */
  async function publishGroup(group: ManagedGroup) {
    const mutation = group.kind === 'LONG_TERM' ? publishProperty : publishShortTermProperty;
    const published: string[] = [];
    setPublishingKey(group.key);
    setNotice(null);
    try {
      for (const unit of group.units.filter(isDraft)) {
        await GraphQLClient.executeAuthenticated(mutation, { propertyId: unit.propertyId });
        published.push(unit.propertyId);
      }
      setNotice({ type: 'success', text: `Published ${group.primary.title}.` });
    } catch (err: any) {
      setNotice({
        type: 'error',
        text: err?.errors?.[0]?.message || err?.message || 'Could not publish. Check the listing has photos and try again.',
      });
    } finally {
      setListings((prev) => prev.map((l) => (published.includes(l.propertyId) ? { ...l, status: 'AVAILABLE' } : l)));
      setPublishingKey(null);
    }
  }

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Managed listings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Properties we listed for owners without an account. Publish drafts, add units, or open one to change details, price, or photos.
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

      {notice && (
        <div
          role="status"
          className={`rounded-lg p-3 text-sm border ${notice.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'}`}
        >
          {notice.text}
        </div>
      )}

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
          {shown.map((g) => {
            const { primary: l, units } = g;
            const drafts = units.filter(isDraft);
            const draftMissingPhotos = drafts.find((u) => !u.thumbnail);
            const multi = units.length > 1;
            const open = expanded.has(g.key);
            const thumbnail = l.thumbnail || units.find((u) => u.thumbnail)?.thumbnail;
            const perUnit = l.kind === 'LONG_TERM' ? '/mo' : '/night';
            // All live, all drafts, or a mix ("2 drafts")
            const groupStatus = drafts.length === 0 ? l.status : 'DRAFT';
            const groupStatusLabel = drafts.length > 0 && drafts.length < units.length
              ? `${drafts.length} draft${drafts.length === 1 ? '' : 's'}`
              : titleCase(groupStatus);
            return (
              <li key={g.key} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <ProxiedImg src={thumbnail} width={64} alt="" className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
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
                        {multi && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                            <Squares2X2Icon className="h-3 w-3" /> {units.length} units
                          </span>
                        )}
                        {groupStatus && (
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[groupStatus] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {groupStatusLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {[l.ward, l.district, l.region].filter(Boolean).map(titleCase).join(', ')}
                        {l.price != null && ` · ${l.currency || 'TZS'} ${l.price.toLocaleString()}${perUnit}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        Owner: {l.ownerName || 'Unknown'}{l.ownerPhone && ` · ${l.ownerPhone}`}
                        {l.listedAt && ` · Listed ${new Date(l.listedAt).toLocaleDateString()}`}
                        {l.listedByAdminName && ` by ${l.listedByAdminName}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-shrink-0 sm:justify-end">
                    {drafts.length > 0 && (draftMissingPhotos ? (
                      <a
                        href={manageHref(draftMissingPhotos)}
                        className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 transition-colors"
                      >
                        Add photos to publish
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => publishGroup(g)}
                        disabled={publishingKey === g.key}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors disabled:opacity-50"
                      >
                        {publishingKey === g.key ? 'Publishing…' : drafts.length > 1 ? `Publish ${drafts.length} units` : 'Publish'}
                      </button>
                    ))}
                    <a
                      href={manageHref(l)}
                      className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-lg text-sm transition-colors ${drafts.length > 0
                        ? 'font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        : 'font-semibold text-white bg-brand-600 hover:bg-brand-700'}`}
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
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-4 py-2.5">
                  {/* Stay units are added on ndotonistays.com, which has the stay unit form */}
                  {l.kind === 'LONG_TERM' ? (
                    <button
                      type="button"
                      onClick={() => setAddUnitSourceId(l.propertyId)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                      <PlusIcon className="h-4 w-4" /> Add a unit
                    </button>
                  ) : (
                    <a href={`${STAYS_URL}/host/managed`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
                      <PlusIcon className="h-4 w-4" /> Add a unit on ndotonistays.com
                    </a>
                  )}
                  {multi && (
                    <button
                      type="button"
                      onClick={() => toggle(g.key)}
                      aria-expanded={open}
                      className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {open ? 'Hide units' : 'Show units'}
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>

                {multi && open && (
                  <ul className="border-t border-gray-100 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
                    {units.map((u) => (
                      <li key={u.propertyId} className="flex items-center gap-3 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{u.unitLabel || u.title}</p>
                            {u.status && (
                              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[u.status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                {titleCase(u.status)}
                              </span>
                            )}
                          </div>
                          {u.price != null && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.currency || 'TZS'} {u.price.toLocaleString()}{perUnit}</p>
                          )}
                        </div>
                        <a href={manageHref(u)} className="text-sm font-medium text-brand-600 hover:underline">Manage</a>
                        <a href={viewHref(u)} className="text-sm text-gray-500 dark:text-gray-400 hover:underline">View</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <AddUnitModal
        sourcePropertyId={addUnitSourceId}
        onClose={() => setAddUnitSourceId(null)}
        onSuccess={() => { setAddUnitSourceId(null); load(); }}
      />
    </div>
  );
}
