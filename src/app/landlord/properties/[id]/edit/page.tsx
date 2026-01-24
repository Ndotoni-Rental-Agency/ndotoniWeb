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
        description: formData.description,
        propertyType: formData.propertyType,
        pricing: formData.pricing,
        specifications: formData.specifications,
        address: formData.address,
        amenities: formData.amenities,
        availability: {
          ...formData.availability
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
      } else {
        // Remove the field if it's empty to avoid validation errors
        delete updateInput.availability!.availableFrom;
      }

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
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
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
    <div className="p-6">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
      
      <PropertyWizard
        title="Edit your listing"
        subtitle="Update your property details and keep your listing current"
        onSubmit={handleSubmit}
        submitButtonText="Save Changes"
        loadingText="Saving..."
        initialData={initialData}
        mode="edit"
      />
      
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}