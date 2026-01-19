'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { cachedGraphQL } from '@/lib/cache';
import { Property, Landlord } from '@/API';
import PropertyGrid from '@/components/property/PropertyGrid';
import EmptyPropertiesState from '@/components/property/EmptyPropertiesState';
import LandlordProfileHeader from '@/components/landlord/LandlordProfileHeader';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { useLandlordProperties } from '@/hooks/useLandlordProperties';
import ClientOnly from '@/components/ui/ClientOnly';
import { Button } from '@/components/ui/Button';
import { PropertyCardSkeletonGrid } from '@/components/property/PropertyCardSkeleton';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface LandlordProfilePageProps {}

export default function LandlordProfilePage({}: LandlordProfilePageProps) {
  const params = useParams();
  const landlordId = params.landlordId as string;
  
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [landlordLoading, setLandlordLoading] = useState(true);
  const [landlordError, setLandlordError] = useState<string | null>(null);

  const { 
    properties, 
    loading: propertiesLoading, 
    error: propertiesError,
    hasMore,
    loadingMore,
    fetchProperties,
    loadMoreProperties
  } = useLandlordProperties();

  const { toggleFavorite, isFavorited } = usePropertyFavorites();

  useEffect(() => {
    if (landlordId) {
      fetchLandlordInfo();
      fetchProperties(landlordId, 12);
    }
  }, [landlordId, fetchProperties]);

  const fetchLandlordInfo = async () => {
    try {
      setLandlordLoading(true);
      setLandlordError(null);

    } catch (err) {
      console.error('Error fetching landlord info:', err);
      setLandlordError('Failed to load landlord information');
    } finally {
      setLandlordLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadMoreProperties(landlordId, 12);
  };

  const formatPropertyForCard = (property: Property) => ({
    propertyId: property.propertyId,
    title: property.title,
    monthlyRent: property.pricing?.monthlyRent || 0,
    currency: property.pricing?.currency || 'TZS',
    propertyType: property.propertyType,
    bedrooms: property.specifications?.bedrooms || 0,
    district: property.address?.district || '',
    region: property.address?.region || '',
    thumbnail: property.media?.images?.[0] || '',
    available: property.availability?.available || false,
    __typename: 'PropertyCard' as const
  });

  const loading = landlordLoading || propertiesLoading;
  const error = landlordError || propertiesError;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Landlords', href: '/search' },
              { label: 'Loading...' }
            ]}
            className="mb-6"
          />

          {/* Landlord Header Skeleton */}
          <LandlordProfileHeader 
            landlord={{} as Landlord} 
            propertyCount={0} 
            loading={true} 
          />

          {/* Properties Grid Skeleton */}
          <PropertyCardSkeletonGrid count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error}
          </h1>
          <Button onClick={() => {
            fetchLandlordInfo();
            fetchProperties(landlordId, 12);
          }} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Landlords', href: '/search' },
            { 
              label: landlord 
                ? (landlord.businessName || `${landlord.firstName} ${landlord.lastName}`)
                : 'Landlord Profile'
            }
          ]}
          className="mb-6"
        />

        {/* Landlord Header */}
        {landlord && (
          <LandlordProfileHeader 
            landlord={landlord} 
            propertyCount={properties.length} 
          />
        )}

        {/* Properties Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Available Properties
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {properties.length} {properties.length === 1 ? 'property' : 'properties'} available
              </p>
            </div>
          </div>

          {properties.length > 0 ? (
            <ClientOnly fallback={
              <div className="property-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <PropertyGrid
                properties={properties.map(formatPropertyForCard)}
                onFavoriteToggle={toggleFavorite}
                isFavorited={isFavorited}
              />
            </ClientOnly>
          ) : (
            <EmptyPropertiesState />
          )}

          {/* Load More Button */}
          {hasMore && properties.length > 0 && (
            <div className="text-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                className="px-8 py-3"
              >
                {loadingMore ? 'Loading...' : 'Load More Properties'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}