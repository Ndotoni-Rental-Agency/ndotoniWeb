'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cachedGraphQL } from '@/lib/cache';
import { GraphQLClient } from '@/lib/graphql-client';
import { Property, ShortTermProperty } from '@/API';
import { checkListingEntitlement } from '@/graphql/queries';
import LandlordPropertyCard from '@/components/property/LandlordPropertyCard';
import LandlordShortTermPropertyCard from '@/components/property/LandlordShortTermPropertyCard';
import { useDeleteProperty } from '@/hooks/useProperty';
import { useLandlordShortTermProperties } from '@/hooks/useLandlordShortTermProperties';
import { RentalTypeToggle } from '@/components/home/RentalTypeToggle';
import { RentalType, isFeatureEnabled } from '@/config/features';
import { deactivateShortTermProperty } from '@/graphql/mutations';

export const dynamic = 'force-dynamic';

export default function LandlordDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const { deletePropertyById } = useDeleteProperty();
  const shortTermEnabled = isFeatureEnabled('shortTermStays');

  // Rental type toggle
  const [rentalType, setRentalType] = useState<RentalType>(RentalType.LONG_TERM);
  const isLongTerm = rentalType === RentalType.LONG_TERM;

  // Long-term properties
  const [longTermProperties, setLongTermProperties] = useState<Property[]>([]);
  const [longTermLoading, setLongTermLoading] = useState(true);

  // Short-term properties
  const {
    properties: shortTermProperties,
    loading: shortTermLoading,
    refetch: refetchShortTerm,
  } = useLandlordShortTermProperties(shortTermEnabled);

  useEffect(() => {
    if (user && isLongTerm) {
      fetchLongTermProperties();
    }
  }, [user, isLongTerm]);

  const fetchLongTermProperties = async () => {
    if (!user) return;
    try {
      setLongTermLoading(true);
      const response = await cachedGraphQL.fetchLandlordProperties({ limit: 100 });
      setLongTermProperties(response.properties);
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setLongTermLoading(false);
    }
  };

  const handleDeleteLongTerm = async (propertyId: string) => {
    const response = await deletePropertyById(propertyId);
    if (response.success) {
      setLongTermProperties(prev => prev.filter(p => p.propertyId !== propertyId));
    }
  };

  const handleDeleteShortTerm = async (propertyId: string) => {
    try {
      const response = await GraphQLClient.executeAuthenticated<{
        deactivateShortTermProperty: { success: boolean };
      }>(deactivateShortTermProperty, { propertyId });
      if (response.deactivateShortTermProperty?.success) {
        await refetchShortTerm();
      }
    } catch (err) {
      console.error('Error deactivating property:', err);
    }
  };

  const handleCreateProperty = async () => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        checkListingEntitlement: { canList: boolean };
      }>(checkListingEntitlement);
      if (data.checkListingEntitlement.canList) {
        router.push('/host/properties/create/draft');
      } else {
        router.push('/host/subscription');
      }
    } catch {
      router.push('/host/properties/create/draft');
    }
  };

  // Current data based on rental type
  const currentProperties = (isLongTerm || !shortTermEnabled) ? longTermProperties : shortTermProperties;
  const currentLoading = (isLongTerm || !shortTermEnabled) ? longTermLoading : shortTermLoading;

  // Stats
  const totalProperties = currentProperties.length;
  const availableProperties = currentProperties.filter(p => (p.status as string) === 'AVAILABLE' || (p.status as string) === 'ACTIVE').length;
  const occupiedProperties = currentProperties.filter(p => (p.status as string) === 'RENTED').length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t('landlord.properties.title') || 'My Properties'}
        </h1>
        <button
          onClick={handleCreateProperty}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Rental type toggle */}
      {shortTermEnabled && (
        <div className="flex justify-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <RentalTypeToggle value={rentalType} onChange={setRentalType} />
        </div>
      )}

      {/* Share your page banner */}
      {user?.whatsappNumber && (
        <div className="bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="w-9 h-9 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-4.5 h-4.5 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-secondary-800 dark:text-secondary-300 text-sm">Share your public page with customers</p>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5 truncate">
              ndotoni.com/agent/{user.whatsappNumber.replace(/\D/g, '')}
            </p>
          </div>
          <button
            onClick={() => {
              const url = `https://ndotoni.com/agent/${user.whatsappNumber!.replace(/\D/g, '')}`;
              navigator.clipboard.writeText(url);
            }}
            className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0"
          >
            Copy Link
          </button>
        </div>
      )}

      {/* Stats row */}
      {!currentLoading && totalProperties > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalProperties}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{availableProperties}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">Rented</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{occupiedProperties}</p>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      {currentLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : currentProperties.length === 0 ? (
        <div className="text-center py-16">
          <svg className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No properties yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">List your first property and start earning.</p>
          <button
            onClick={handleCreateProperty}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Your First Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProperties.map((property) =>
            isLongTerm ? (
              <LandlordPropertyCard
                key={property.propertyId}
                property={property as Property}
                onDelete={handleDeleteLongTerm}
              />
            ) : (
              <LandlordShortTermPropertyCard
                key={property.propertyId}
                property={property as ShortTermProperty}
                onDelete={handleDeleteShortTerm}
              />
            )
          )}
        </div>
      )}
    </>
  );
}
