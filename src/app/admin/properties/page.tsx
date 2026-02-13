'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Property, PropertyStatus, ShortTermProperty } from '@/API';
import AdminPropertyCard from '@/components/property/AdminPropertyCard';
import { PropertyCardSkeletonGrid } from '@/components/property/PropertyCardSkeleton';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

type CombinedProperty = Property | ShortTermProperty;

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const admin = useAdmin();
  const router = useRouter();

  const [longTermProperties, setLongTermProperties] = useState<Property[]>([]);
  const [shortTermProperties, setShortTermProperties] = useState<ShortTermProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PropertyStatus | 'ALL'>(PropertyStatus.AVAILABLE);
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<'ALL' | 'LONG_TERM' | 'SHORT_TERM'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const loadProperties = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await admin.listProperties(
        filter === 'ALL' ? undefined : filter,
        propertyTypeFilter === 'ALL' ? undefined : propertyTypeFilter
      );
      setLongTermProperties(response.longTermProperties || []);
      setShortTermProperties(response.shortTermProperties || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [user, admin, filter, propertyTypeFilter]);

  useEffect(() => {
    loadProperties();
  }, [filter, propertyTypeFilter]);

  // ────────────────────────────────────────────────
  //  Local update helpers – prevent full list refresh
  // ────────────────────────────────────────────────

  const removeProperty = useCallback((propertyId: string) => {
    setLongTermProperties(prev => prev.filter(p => p.propertyId !== propertyId));
    setShortTermProperties(prev => prev.filter(p => p.propertyId !== propertyId));
  }, []);

  const updatePropertyStatus = useCallback((propertyId: string, newStatus: PropertyStatus) => {
    setLongTermProperties(prev =>
      prev.map(p =>
        p.propertyId === propertyId ? { ...p, status: newStatus } : p
      )
    );
    // Note: Short-term properties use PropertyStatus enum
    setShortTermProperties(prev =>
      prev.map(p => {
        if (p.propertyId === propertyId) {
          // Map to appropriate PropertyStatus value
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
              // Map other statuses to MAINTENANCE for short-term
              mappedStatus = PropertyStatus.MAINTENANCE;
          }
          return { ...p, status: mappedStatus };
        }
        return p;
      })
    );
  }, []);

  if (loading) return <PropertyCardSkeletonGrid count={6} />;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={loadProperties}
            className="mt-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Combine and filter properties
  const allProperties: CombinedProperty[] = [...longTermProperties, ...shortTermProperties];
  const filteredProperties = allProperties.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ('address' in p && p.address?.district?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ('address' in p && p.address?.region?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/landlord/properties/create"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Create
          </Link>
          <Button
            variant="outline"
            onClick={() => router.push('/admin/properties/bulk-import')}
            className="inline-flex items-center gap-2"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            Bulk Import
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 gap-4">
        <div className="flex gap-3">
          <select
            value={propertyTypeFilter}
            onChange={e => setPropertyTypeFilter(e.target.value as 'ALL' | 'LONG_TERM' | 'SHORT_TERM')}
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="ALL">All Types</option>
            <option value="LONG_TERM">Long-Term</option>
            <option value="SHORT_TERM">Short-Term</option>
          </select>

          <select
            value={filter}
            onChange={e => setFilter(e.target.value as PropertyStatus | 'ALL')}
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="ALL">All Status</option>
            <option value={PropertyStatus.AVAILABLE}>Available</option>
            <option value={PropertyStatus.RENTED}>Rented</option>
            <option value={PropertyStatus.MAINTENANCE}>Maintenance</option>
            <option value={PropertyStatus.DRAFT}>Draft</option>
            <option value={PropertyStatus.DELETED}>Deleted</option>
          </select>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProperties.map(property => (
          <AdminPropertyCard
            key={property.propertyId}
            property={property as Property}
            onDeleteSuccess={() => removeProperty(property.propertyId)}
            onStatusChange={(newStatus: PropertyStatus) =>
              updatePropertyStatus(property.propertyId, newStatus)
            }
          />
        ))}
      </div>

      {filteredProperties.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          No properties found.
        </div>
      )}

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {longTermProperties.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Long-Term Properties</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {shortTermProperties.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Short-Term Properties</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {allProperties.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Properties</div>
        </div>
      </div>
    </div>
  );
}