'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { updateProperty } from '@/graphql/mutations';
import { Property, UpdatePropertyInput } from '@/API';
import { PropertyWizard } from '@/components/property';
import { FormData } from '@/hooks/useCreatePropertyForm';
import { useAuth } from '@/contexts/AuthContext';
import { cleanGraphQLObject } from '@/lib/utils/graphql';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

export default function EditProperty() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { notification, showError, closeNotification } = useNotification();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
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
        setProperty(data.getProperty);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      // Convert FormData to UpdatePropertyInput format and clean GraphQL metadata
      const updateInput: UpdatePropertyInput = cleanGraphQLObject({
        title: formData.title,
        description: formData.description || undefined, // Convert empty string to undefined
        propertyType: formData.propertyType,
        pricing: {
          ...formData.pricing,
          deposit: formData.pricing?.deposit || 0, // Ensure deposit has a value
        },
        specifications: {
          ...formData.specifications,
          squareMeters: formData.specifications?.squareMeters || undefined, // Make optional
        },
        address: formData.address,
        amenities: formData.amenities,
        availability: {
          available: formData.availability?.available ?? true,
          minimumLeaseTerm: formData.availability?.minimumLeaseTerm || undefined,
          maximumLeaseTerm: formData.availability?.maximumLeaseTerm || undefined,
        },
        // Handle media if needed
        ...(formData.media && {
          media: {
            images: formData.media.images || [],
            videos: formData.media.videos || [],
            floorPlan: formData.media.floorPlan || '',
            virtualTour: formData.media.virtualTour || ''
          }
        })
      });

      // Handle availableFrom date conversion with validation
      if (formData.availability?.availableFrom && formData.availability.availableFrom.trim() !== '') {
        const dateValue = formData.availability.availableFrom;
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format for availableFrom');
        }
        updateInput.availability!.availableFrom = date.toISOString();
      }
      // Note: If availableFrom is empty, we leave it undefined (don't explicitly delete)

      if (!user) {
        throw new Error('User not authenticated');
      }

      await GraphQLClient.executeAuthenticated<{ updateProperty: Property }>(
        updateProperty,
        {
          propertyId,
          input: updateInput
        }
      );
      
      router.push('/landlord/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      showError('Update Failed', 'Error updating property. Please try again.');
      throw error; // Re-throw to let the wizard handle loading state
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">Property not found</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Convert property data to FormData format for the wizard
  const initialData: Partial<FormData> = {
    title: property.title,
    description: property.description ?? '',
    propertyType: property.propertyType,
    pricing: property.pricing ?? undefined,
    specifications: property.specifications ?? undefined,
    address: property.address,
    amenities: property.amenities ? property.amenities.filter((a): a is string => a !== null) : undefined,
    availability: {
      available: property.availability?.available ?? false,
      availableFrom: property.availability?.availableFrom ?? undefined,
      minimumLeaseTerm: property.availability?.minimumLeaseTerm ?? undefined,
      maximumLeaseTerm: property.availability?.maximumLeaseTerm ?? undefined,
      // Convert ISO date to YYYY-MM-DD format for the DatePicker
      ...(property.availability?.availableFrom && {
        availableFrom: new Date(property.availability.availableFrom).toISOString().split('T')[0]
      })
    },
    // Handle media if it exists
    ...(property.media && {
      media: {
        images: property.media.images || [],
        videos: property.media.videos || [],
        floorPlan: property.media.floorPlan || '',
        virtualTour: property.media.virtualTour || ''
      }
    })
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
      
      <div className="max-w-6xl mx-auto">
        <PropertyWizard
          title="Edit your listing"
          subtitle="Update your property details and keep your listing current"
          onSubmit={handleSubmit}
          submitButtonText="Save Changes"
          loadingText="Saving..."
          initialData={initialData}
          mode="edit"
        />
        
        <div className="mt-4 sm:mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-600 rounded-full hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}