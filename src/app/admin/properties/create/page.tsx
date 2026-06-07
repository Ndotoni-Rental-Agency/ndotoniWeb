'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { createProperty } from '@/graphql/mutations';
import { CreatePropertyWizard } from '@/components/property';
import { useAuth } from '@/contexts/AuthContext';
import { FormData } from '@/hooks/useCreatePropertyForm';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

function AdminCreatePropertyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { notification, showError, showWarning, closeNotification } = useNotification();
  const [duplicateData, setDuplicateData] = useState<Partial<FormData> | undefined>(undefined);
  const [loadingDuplicate, setLoadingDuplicate] = useState(false);

  const duplicateId = searchParams.get('duplicate');
  const isTemplate = searchParams.get('template') === 'true';

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/auth/signin');
      } else if (user && user.userType !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  useEffect(() => {
    const fetchDuplicateProperty = async () => {
      if (!user || user.userType !== 'ADMIN') return;

      if (isTemplate) {
        try {
          const templateData = sessionStorage.getItem('propertyTemplate');
          if (templateData) {
            setDuplicateData(JSON.parse(templateData));
            sessionStorage.removeItem('propertyTemplate');
          }
        } catch (error) {
          console.error('Error loading property template:', error);
        }
        return;
      }

      if (!duplicateId) return;

      setLoadingDuplicate(true);
      try {
        const data = await GraphQLClient.executeAuthenticated<{ getProperty: any }>(
          getProperty,
          { propertyId: duplicateId }
        );

        const property = data.getProperty;
        if (property) {
          setDuplicateData({
            title: `Copy of ${property.title}`,
            description: property.description,
            propertyType: property.propertyType,
            address: {
              region: property.address?.region || '',
              district: property.address?.district || '',
              ward: property.address?.ward || '',
              street: property.address?.street || '',
              coordinates: {
                latitude: property.address?.coordinates?.latitude || 0,
                longitude: property.address?.coordinates?.longitude || 0,
              },
            },
            specifications: {
              bedrooms: property.specifications?.bedrooms || 1,
              bathrooms: property.specifications?.bathrooms || 1,
              squareMeters: property.specifications?.squareMeters || 0,
              furnished: property.specifications?.furnished || false,
              parkingSpaces: property.specifications?.parkingSpaces || 0,
              floors: property.specifications?.floors || 1,
            },
            pricing: {
              monthlyRent: property.pricing?.monthlyRent || 0,
              deposit: property.pricing?.deposit || 0,
              currency: property.pricing?.currency || 'TZS',
              serviceCharge: property.pricing?.serviceCharge || 0,
              utilitiesIncluded: property.pricing?.utilitiesIncluded || false,
            },
            availability: {
              available: true,
              availableFrom: undefined,
              minimumLeaseTerm: property.availability?.minimumLeaseTerm || 12,
              maximumLeaseTerm: property.availability?.maximumLeaseTerm || 24,
            },
            amenities: property.amenities || [],
            media: {
              images: [],
              videos: [],
              floorPlan: '',
              virtualTour: '',
            },
          });
        }
      } catch (error) {
        console.error('Error fetching property for duplication:', error);
        showWarning('Could Not Load Property', 'Could not load property data for duplication. You can still create a new property.');
      } finally {
        setLoadingDuplicate(false);
      }
    };

    fetchDuplicateProperty();
  }, [duplicateId, isTemplate, user, showWarning]);

  const handleSubmit = async (formData: FormData) => {
    try {
      const processedFormData = {
        ...formData,
        availability: { ...formData.availability },
      };

      if (formData.availability?.availableFrom && formData.availability.availableFrom.trim() !== '') {
        const date = new Date(formData.availability.availableFrom);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format for availableFrom');
        }
        processedFormData.availability.availableFrom = date.toISOString();
      } else {
        delete processedFormData.availability.availableFrom;
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      await GraphQLClient.executeAuthenticated<{ createProperty: any }>(
        createProperty,
        { input: processedFormData }
      );

      router.push('/admin/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      showError('Creation Failed', 'Error creating property. Please try again.');
      throw error;
    }
  };

  if (authLoading || loadingDuplicate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.userType !== 'ADMIN') {
    return null;
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />

      {(duplicateId || isTemplate) && (
        <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
            <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 font-medium">
              Creating from template
            </p>
            <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300">
              This listing will be automatically verified when published.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <CreatePropertyWizard
          title={(duplicateId || isTemplate) ? 'Create Verified Property (from template)' : 'Create Verified Property'}
          subtitle="Admin-created listings are automatically verified."
          onSubmit={handleSubmit}
          submitButtonText="Create Property"
          loadingText="Creating..."
          initialData={duplicateData}
        />
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function AdminCreateProperty() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-600" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      }
    >
      <AdminCreatePropertyContent />
    </Suspense>
  );
}
