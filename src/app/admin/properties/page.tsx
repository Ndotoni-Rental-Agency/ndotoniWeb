'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Property, PropertyStatus, ShortTermProperty } from '@/API';
import AdminPropertyCard from '@/components/property/AdminPropertyCard';
import { AdminPropertyListSkeleton } from '@/components/property/AdminPropertyCardSkeleton';
import { PropertyListToolbar } from '@/components/admin/PropertyListToolbar';
import { useAdmin } from '@/hooks/useAdmin';
import { normalizeAdminSearchTerm } from '@/lib/utils/admin-property-search';

export const dynamic = 'force-dynamic';

type PropertyTypeFilter = 'ALL' | 'LONG_TERM' | 'SHORT_TERM';
type StatusFilter = PropertyStatus | 'ALL';

const PROPERTY_TYPE_OPTIONS = [
  { value: 'ALL' as const, label: 'All Types' },
  { value: 'LONG_TERM' as const, label: 'Long-Term' },
  { value: 'SHORT_TERM' as const, label: 'Short-Term' },
];

const STATUS_OPTIONS = [
  { value: 'ALL' as const, label: 'All Status' },
  { value: PropertyStatus.AVAILABLE, label: 'Available' },
  { value: PropertyStatus.RENTED, label: 'Rented' },
  { value: PropertyStatus.MAINTENANCE, label: 'Maintenance' },
  { value: PropertyStatus.DRAFT, label: 'Draft' },
  { value: PropertyStatus.DELETED, label: 'Deleted' },
];

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const { listProperties } = useAdmin();
  const router = useRouter();

  const [longTermProperties, setLongTermProperties] = useState<Property[]>([]);
  const [shortTermProperties, setShortTermProperties] = useState<ShortTermProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>(PropertyStatus.AVAILABLE);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<PropertyTypeFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(normalizeAdminSearchTerm(searchTerm));
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const loadProperties = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await listProperties(
        filter === 'ALL' ? undefined : filter,
        propertyTypeFilter === 'ALL' ? undefined : propertyTypeFilter,
        debouncedSearch ? 100 : 500,
        undefined,
        debouncedSearch || undefined
      );
      setLongTermProperties(response.longTermProperties || []);
      setShortTermProperties(response.shortTermProperties || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [user, listProperties, filter, propertyTypeFilter, debouncedSearch]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const removeProperty = useCallback((propertyId: string) => {
    setLongTermProperties(prev => prev.filter(p => p.propertyId !== propertyId));
    setShortTermProperties(prev => prev.filter(p => p.propertyId !== propertyId));
  }, []);

  const updatePropertyVerified = useCallback((propertyId: string, verified: boolean) => {
    setLongTermProperties(prev =>
      prev.map(p =>
        p.propertyId === propertyId ? { ...p, verified } : p
      )
    );
  }, []);

  const updatePropertyStatus = useCallback((propertyId: string, newStatus: PropertyStatus) => {
    setLongTermProperties(prev =>
      prev.map(p =>
        p.propertyId === propertyId ? { ...p, status: newStatus } : p
      )
    );
    setShortTermProperties(prev =>
      prev.map(p => {
        if (p.propertyId === propertyId) {
          let mappedStatus: PropertyStatus;
          switch (newStatus) {
            case PropertyStatus.AVAILABLE:
              mappedStatus = PropertyStatus.AVAILABLE;
              break;
            case PropertyStatus.DRAFT:
              mappedStatus = PropertyStatus.DRAFT;
              break;
            case PropertyStatus.RENTED:
            case PropertyStatus.MAINTENANCE:
            case PropertyStatus.DELETED:
            default:
              mappedStatus = PropertyStatus.MAINTENANCE;
          }
          return { ...p, status: mappedStatus };
        }
        return p;
      })
    );
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 sm:max-w-[100px]" />
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 sm:max-w-[120px]" />
        </div>
        <div className="sticky top-16 z-20 -mx-4 space-y-2 border-b border-gray-200/80 bg-gray-50/95 px-4 py-2 dark:border-gray-700/80 dark:bg-gray-900/95 sm:mx-0 sm:rounded-lg sm:border sm:px-3 sm:py-3">
          <div className="flex gap-2">
            <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <AdminPropertyListSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={loadProperties}
            className="mt-2 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const displayProperties = [
    ...longTermProperties.map(property => ({ property, isShortTerm: false })),
    ...shortTermProperties.map(property => ({ property, isShortTerm: true })),
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <PropertyListToolbar
        propertyTypeFilter={propertyTypeFilter}
        onPropertyTypeChange={setPropertyTypeFilter}
        propertyTypeOptions={PROPERTY_TYPE_OPTIONS}
        statusFilter={filter}
        onStatusChange={setFilter}
        statusOptions={STATUS_OPTIONS}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        createHref="/admin/properties/create"
        onBulkImport={() => router.push('/admin/properties/bulk-import')}
        resultCount={displayProperties.length}
      />

      <div className="space-y-3">
        {displayProperties.map(({ property, isShortTerm }) => (
          <AdminPropertyCard
            key={property.propertyId}
            property={property as Property}
            isShortTerm={isShortTerm}
            onDeleteSuccess={() => removeProperty(property.propertyId)}
            onStatusChange={(newStatus: PropertyStatus) =>
              updatePropertyStatus(property.propertyId, newStatus)
            }
            onVerifiedChange={(verified: boolean) =>
              updatePropertyVerified(property.propertyId, verified)
            }
          />
        ))}
      </div>

      {displayProperties.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
          {debouncedSearch
            ? 'No properties matched your search. Try a shorter term, location, or property ID.'
            : 'No properties found.'}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-800 sm:gap-4 sm:p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">
            {longTermProperties.length}
          </div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-sm">
            {debouncedSearch ? 'Long-Term (results)' : 'Long-Term (loaded)'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">
            {shortTermProperties.length}
          </div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-sm">
            {debouncedSearch ? 'Short-Term (results)' : 'Short-Term (loaded)'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white sm:text-2xl">
            {displayProperties.length}
          </div>
          <div className="text-[10px] text-gray-600 dark:text-gray-400 sm:text-sm">Total</div>
        </div>
      </div>
    </div>
  );
}
