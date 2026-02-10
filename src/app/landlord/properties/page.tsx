'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cachedGraphQL } from '@/lib/cache';
import { Property, ShortTermProperty } from '@/API';
import LandlordPropertyCard from '@/components/property/LandlordPropertyCard';
import LandlordShortTermPropertyCard from '@/components/property/LandlordShortTermPropertyCard';
import { PropertyCardSkeletonGrid } from '@/components/property/PropertyCardSkeleton';
import { useDeleteProperty } from '@/hooks/useProperty';
import { useLandlordShortTermProperties } from '@/hooks/useLandlordShortTermProperties';
import { RentalTypeToggle } from '@/components/home/RentalTypeToggle';
import { RentalType, isFeatureEnabled } from '@/config/features';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

export default function PropertiesManagement() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const { deletePropertyById } = useDeleteProperty();
  const shortTermEnabled = isFeatureEnabled('shortTermStays');

  // Rental type toggle
  const [rentalType, setRentalType] = useState<RentalType>(RentalType.LONG_TERM);
  const isLongTerm = rentalType === RentalType.LONG_TERM;
  const isShortTerm = rentalType === RentalType.SHORT_TERM;

  // Long-term properties state
  const [longTermProperties, setLongTermProperties] = useState<Property[]>([]);
  const [longTermLoading, setLongTermLoading] = useState(true);
  const [longTermError, setLongTermError] = useState<string | null>(null);

  // Short-term properties state
  const {
    properties: shortTermProperties,
    loading: shortTermLoading,
    error: shortTermError,
    refetch: refetchShortTerm,
  } = useLandlordShortTermProperties(shortTermEnabled);

  // Filters
  const [filter, setFilter] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && isLongTerm) {
      fetchLongTermProperties();
    }
  }, [user, isLongTerm]);

  const fetchLongTermProperties = async () => {
    if (!user) return;

    try {
      setLongTermLoading(true);
      setLongTermError(null);

      const response = await cachedGraphQL.fetchLandlordProperties({
        limit: 100 // Get all properties for management
      });

      console.log("Long-term properties response:", response);

      setLongTermProperties(response.properties);
    } catch (err) {
      console.error('Error fetching long-term properties:', err);
      setLongTermError(t('landlord.properties.failedToLoadProperties'));
    } finally {
      setLongTermLoading(false);
    }
  };

  const handleDeleteLongTermProperty = async (propertyId: string) => {
    try {
      const response = await deletePropertyById(propertyId);

      console.log('Delete property response:', response);

      if (response.success) {
        setLongTermProperties(prev => prev.filter(p => p.propertyId !== propertyId));
        console.log('Property deleted successfully');
      } else {
        console.error('Failed to delete property:', response.message);
      }
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const handleDeleteShortTermProperty = async (propertyId: string) => {
    // TODO: Implement short-term property deletion
    console.log('Delete short-term property:', propertyId);
  };

  // Determine current data based on rental type
  const currentProperties = (isLongTerm || !shortTermEnabled) ? longTermProperties : shortTermProperties;
  const currentLoading = (isLongTerm || !shortTermEnabled) ? longTermLoading : shortTermLoading;
  const currentError = (isLongTerm || !shortTermEnabled) ? longTermError : shortTermError;
  const currentRefetch = (isLongTerm || !shortTermEnabled) ? fetchLongTermProperties : refetchShortTerm;

  const filteredProperties = currentProperties.filter(property => {
    const matchesFilter = filter === 'all' || property.status === filter;
    
    let matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (isLongTerm) {
      const longTermProp = property as Property;
      matchesSearch = matchesSearch ||
        longTermProp.address?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        longTermProp.address?.region?.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      const shortTermProp = property as ShortTermProperty;
      matchesSearch = matchesSearch ||
        shortTermProp.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shortTermProp.region?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return matchesFilter && matchesSearch;
  });

  if (currentLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('landlord.properties.errorLoadingProperties')}
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{currentError}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={currentRefetch}
                  className="bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white transition-colors">{t('landlord.properties.title')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">{filteredProperties.length} {filteredProperties.length !== 1 ? t('landlord.properties.listings') : t('landlord.properties.listing')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/landlord/properties/create/draft')}
            className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-emerald-900 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-emerald-800 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {t('landlord.properties.createProperty')}
          </button>
        </div>
      </div>

      {/* Rental Type Toggle */}
      {shortTermEnabled && (
        <div className="flex justify-center py-4 border-y border-gray-200 dark:border-gray-700">
          <RentalTypeToggle value={rentalType} onChange={setRentalType} />
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
          >
            <option value="all">{t('landlord.properties.allListings')}</option>
            <option value="AVAILABLE">{t('landlord.dashboard.available')}</option>
            <option value="ACTIVE">Active</option>
            <option value="RENTED">{t('landlord.properties.rented')}</option>
            <option value="MAINTENANCE">{t('landlord.properties.maintenance')}</option>
            <option value="DRAFT">{t('landlord.properties.draft')}</option>
          </select>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder={t('landlord.properties.searchListings')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Properties List */}
      {currentLoading ? (
        <PropertyCardSkeletonGrid count={6} />
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            isLongTerm ? (
              <LandlordPropertyCard
                key={property.propertyId}
                property={property as Property}
                onDelete={handleDeleteLongTermProperty}
              />
            ) : (
              <LandlordShortTermPropertyCard
                key={property.propertyId}
                property={property as ShortTermProperty}
                onDelete={handleDeleteShortTermProperty}
              />
            )
          ))}
        </div>
      )}

      {filteredProperties.length === 0 && !currentLoading && !currentError && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4 transition-colors">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">{t('landlord.properties.noPropertiesFound')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
            {searchTerm || filter !== 'all' 
              ? t('landlord.properties.adjustSearchFilter')
              : t('landlord.properties.getStartedAddProperty')
            }
          </p>
        </div>
      )}
    </div>
  );
}
