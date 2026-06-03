'use client';

import { useCallback, useEffect, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { searchLandlordProfiles, listPropertyOwners } from '@/graphql/queries';
import {
  PhoneIcon,
  MapPinIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

interface LandlordProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  region?: string;
  district?: string;
  operatingRegions: string[];
  operatingDistricts: string[];
  propertyTypes: string[];
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  propertyCount: number;
}

export default function PropertyOwnersPage() {
  const [owners, setOwners] = useState<LandlordProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<LandlordProfile | null>(null);

  const loadOwners = useCallback(async () => {
    setLoading(true);
    try {
      const query = regionFilter ? searchLandlordProfiles : listPropertyOwners;
      const variables = regionFilter
        ? { region: regionFilter, limit: 100 }
        : { limit: 100 };

      const data = await GraphQLClient.executeAuthenticated<any>(query, variables);
      const result = data.listPropertyOwners || data.searchLandlordProfiles;
      setOwners(result?.landlords || []);
    } catch (error) {
      console.error('Failed to load property owners', error);
    } finally {
      setLoading(false);
    }
  }, [regionFilter]);

  useEffect(() => { loadOwners(); }, [loadOwners]);

  const filteredOwners = search
    ? owners.filter((o) => {
        const q = search.toLowerCase();
        return (
          (o.firstName || '').toLowerCase().includes(q) ||
          (o.lastName || '').toLowerCase().includes(q) ||
          (o.phoneNumber || '').includes(q) ||
          (o.whatsappNumber || '').includes(q) ||
          o.operatingDistricts.some((d) => d.toLowerCase().includes(q))
        );
      })
    : owners;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* List Panel */}
      <div className="w-full lg:w-[420px] border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
        {/* Search & Filter */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
          >
            <option value="">All Regions</option>
            <option value="Dar es Salaam">Dar es Salaam</option>
            <option value="Arusha">Arusha</option>
            <option value="Mwanza">Mwanza</option>
            <option value="Dodoma">Dodoma</option>
          </select>
        </div>

        {/* Owner List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : filteredOwners.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No property owners found</div>
          ) : (
            filteredOwners.map((owner) => (
              <button
                key={owner.userId}
                onClick={() => setSelectedOwner(owner)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                  selectedOwner?.userId === owner.userId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {owner.firstName} {owner.lastName}
                  </span>
                  <span className="text-xs text-gray-400">{owner.propertyCount} properties</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  {owner.operatingDistricts.slice(0, 3).map((d) => (
                    <span key={d} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">{d}</span>
                  ))}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`${selectedOwner ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 lg:relative lg:inset-auto lg:z-auto' : 'hidden lg:flex'} flex-1 flex-col overflow-y-auto`}>
        {!selectedOwner ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select an owner to view profile</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <button
                onClick={() => setSelectedOwner(null)}
                className="lg:hidden text-sm text-blue-600 mb-2"
              >
                ← Back
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedOwner.firstName} {selectedOwner.lastName}
              </h2>
              <p className="text-sm text-gray-500">{selectedOwner.propertyCount} properties</p>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-[11px] text-gray-400 uppercase">Phone</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOwner.phoneNumber || '—'}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <PhoneIcon className="w-4 h-4 text-green-500" />
                  <span className="text-[11px] text-gray-400 uppercase">WhatsApp</span>
                </div>
                {selectedOwner.whatsappNumber ? (
                  <a
                    href={`https://wa.me/${selectedOwner.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-green-600 hover:underline"
                  >
                    {selectedOwner.whatsappNumber}
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">—</p>
                )}
              </div>
            </div>

            {/* Operating Areas */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" /> Operating Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedOwner.operatingDistricts.map((d) => (
                  <span key={d} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Property Types */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <HomeIcon className="w-4 h-4" /> Property Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedOwner.propertyTypes.map((t) => (
                  <span key={t} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Price Range</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedOwner.currency || 'TZS'} {(selectedOwner.minPrice || 0).toLocaleString()} — {(selectedOwner.maxPrice || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
