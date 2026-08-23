'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import { cachedGraphQL } from '@/lib/cache';
import UnitCard from '@/components/host/dashboard/UnitCard';
import AddUnitModal from '@/components/host/dashboard/AddUnitModal';
import { HostProperty } from '@/components/host/dashboard/types';
import { useDeleteProperty } from '@/hooks/useProperty';

export const dynamic = 'force-dynamic';

export default function PropertyGroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const { deletePropertyById } = useDeleteProperty();

  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUnitSourceId, setAddUnitSourceId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      setLoading(true);
      const response = await cachedGraphQL.fetchLandlordProperties({ limit: 100, forceRefresh: true });
      setProperties(response.properties as HostProperty[]);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(propertyId: string) {
    const response = await deletePropertyById(propertyId);
    if (response.success) {
      setProperties(prev => prev.filter(p => p.propertyId !== propertyId));
    }
  }

  const units = properties.filter(p => p.groupId === groupId);
  const primary = units.find(u => u.isPrimaryUnit) || units[0];

  if (loading) {
    return <div className="animate-pulse text-gray-400 dark:text-gray-500 py-16 text-center">Loading...</div>;
  }

  return (
    <>
      <Link href="/host/properties" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to properties
      </Link>

      {primary && (
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 mb-6">
          <MapPinIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 shrink-0" />
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{primary.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {units.length} unit{units.length !== 1 ? 's' : ''} at {primary.address?.district}, {primary.address?.region}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map((unit, i) => (
          <div key={unit.propertyId} className="rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden bg-white dark:bg-gray-800">
            <UnitCard property={unit} label={unit.unitLabel || `Unit ${i + 1}`} onDelete={handleDelete} />
          </div>
        ))}
      </div>

      {primary && (
        <button
          type="button"
          onClick={() => setAddUnitSourceId(primary.propertyId)}
          className="w-full flex items-center justify-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 rounded-xl py-3 text-sm font-semibold transition-colors mt-4"
        >
          <PlusIcon className="h-4 w-4" />
          Add another unit here
        </button>
      )}

      <AddUnitModal
        sourcePropertyId={addUnitSourceId}
        onClose={() => setAddUnitSourceId(null)}
        onSuccess={() => { setAddUnitSourceId(null); fetchProperties(); }}
      />
    </>
  );
}
