'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { updateProperty } from '@/graphql/mutations';
import { Property, UpdatePropertyInput } from '@/API';
import { useAuth } from '@/contexts/AuthContext';
import { cleanGraphQLObject } from '@/lib/utils/graphql';
import PropertySectionEditor, { PropertyData } from '@/components/property/PropertySectionEditor';

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (propertyId && isAuthenticated) {
      fetchProperty();
    }
  }, [propertyId, isAuthenticated]);

  const fetchProperty = async () => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
        getProperty,
        { propertyId }
      );

      if (data.getProperty) {
        const p = data.getProperty;
        setProperty({
          propertyId: p.propertyId,
          title: p.title,
          description: p.description ?? undefined,
          propertyType: p.propertyType,
          status: p.status ?? undefined,
          address: p.address ? {
            region: p.address.region,
            district: p.address.district,
            ward: p.address.ward ?? undefined,
            street: p.address.street ?? undefined,
            postalCode: p.address.postalCode ?? undefined,
            coordinates: p.address.coordinates ? {
              latitude: p.address.coordinates.latitude ?? undefined,
              longitude: p.address.coordinates.longitude ?? undefined,
            } : undefined,
          } : undefined,
          pricing: p.pricing ? {
            monthlyRent: p.pricing.monthlyRent ?? undefined,
            currency: p.pricing.currency ?? undefined,
            deposit: p.pricing.deposit ?? undefined,
            serviceCharge: p.pricing.serviceCharge ?? undefined,
            utilitiesIncluded: p.pricing.utilitiesIncluded ?? undefined,
          } : undefined,
          specifications: p.specifications ? {
            bedrooms: p.specifications.bedrooms ?? undefined,
            bathrooms: p.specifications.bathrooms ?? undefined,
            squareMeters: p.specifications.squareMeters ?? undefined,
            floors: p.specifications.floors ?? undefined,
            parkingSpaces: p.specifications.parkingSpaces ?? undefined,
            furnished: p.specifications.furnished ?? undefined,
          } : undefined,
          availability: p.availability ? {
            available: p.availability.available ?? undefined,
            availableFrom: p.availability.availableFrom
              ? new Date(p.availability.availableFrom).toISOString().split('T')[0]
              : undefined,
            minimumLeaseTerm: p.availability.minimumLeaseTerm ?? undefined,
            maximumLeaseTerm: p.availability.maximumLeaseTerm ?? undefined,
          } : undefined,
          amenities: p.amenities?.filter((a): a is string => a !== null) ?? undefined,
          media: p.media ? {
            images: (p.media.images?.filter(Boolean) as string[]) || [],
            videos: (p.media.videos?.filter(Boolean) as string[]) || [],
            floorPlan: p.media.floorPlan ?? '',
            virtualTour: p.media.virtualTour ?? '',
          } : undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updates: Partial<PropertyData>) => {
    if (!user) throw new Error('Not authenticated');

    const input: UpdatePropertyInput = cleanGraphQLObject({
      ...updates,
      ...(updates.availability?.availableFrom && {
        availability: {
          ...updates.availability,
          availableFrom: new Date(updates.availability.availableFrom).toISOString(),
        },
      }),
    });

    await GraphQLClient.executeAuthenticated(updateProperty, { propertyId, input });
    setProperty((prev) => prev ? { ...prev, ...updates } : prev);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your property…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Property not found</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">The property you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <PropertySectionEditor property={property} onSave={handleSave} />
      <div className="max-w-3xl mx-auto mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          ← Back to Properties
        </button>
      </div>
    </div>
  );
}
