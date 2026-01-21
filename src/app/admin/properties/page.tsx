'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Property, PropertyStatus } from '@/API';
import AdminPropertyCard from '@/components/property/AdminPropertyCard';
import { PropertyCardSkeletonGrid } from '@/components/property/PropertyCardSkeleton';
import { useAdmin } from '@/hooks/useAdmin';

export const dynamic = 'force-dynamic';

export default function AdminPropertiesPage() {
  const { user } = useAuth();
  const admin = useAdmin();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<PropertyStatus>(PropertyStatus.AVAILABLE);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProperties = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await admin.listProperties(filter);
      setProperties(response.properties || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [user, admin, filter]);

  useEffect(() => {
    loadProperties();
  }, [filter]);

  // ────────────────────────────────────────────────
  //  Local update helpers – prevent full list refresh
  // ────────────────────────────────────────────────

  const removeProperty = useCallback((propertyId: string) => {
    setProperties(prev => prev.filter(p => p.propertyId !== propertyId));
  }, []);

  const updatePropertyStatus = useCallback((propertyId: string, newStatus: PropertyStatus) => {
    setProperties(prev =>
      prev.map(p =>
        p.propertyId === propertyId ? { ...p, status: newStatus } : p
      )
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

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address?.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <Link
          href="/landlord/properties/create"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Create
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as PropertyStatus)}
          className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value={PropertyStatus.AVAILABLE}>Available</option>
          <option value={PropertyStatus.RENTED}>Rented</option>
          <option value={PropertyStatus.MAINTENANCE}>Maintenance</option>
          <option value={PropertyStatus.DRAFT}>Draft</option>
          <option value={PropertyStatus.DELETED}>Deleted</option>
        </select>

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
            property={property}
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
    </div>
  );
}