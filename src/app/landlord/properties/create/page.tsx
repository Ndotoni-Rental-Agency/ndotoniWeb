'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { createProperty } from '@/graphql/mutations';
import { CreatePropertyWizard } from '@/components/property';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormData } from '@/hooks/useCreatePropertyForm';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

function CreatePropertyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { notification, showError, showWarning, closeNotification } = useNotification();
  const [duplicateData, setDuplicateData] = useState<Partial<FormData> | undefined>(undefined);
  const [loadingDuplicate, setLoadingDuplicate] = useState(false);
  
  const duplicateId = searchParams.get('duplicate');
  const isTemplate = searchParams.get('template') === 'true';

  // Fetch property data for duplication or load from template
  useEffect(() => {
    const fetchDuplicateProperty = async () => {
      if (!user) return;
      
      // Check if we're using a template from sessionStorage
      if (isTemplate) {
        try {
          const templateData = sessionStorage.getItem('propertyTemplate');
          if (templateData) {
            const parsedTemplate = JSON.parse(templateData);
            setDuplicateData(parsedTemplate);
            // Clear the template data after loading
            sessionStorage.removeItem('propertyTemplate');
          }
        } catch (error) {
          console.error('Error loading property template:', error);
        }
        return;
      }
      
      // Otherwise, fetch from API if duplicateId exists
      if (!duplicateId) return;
      
      setLoadingDuplicate(true);
      try {
        const data = await GraphQLClient.executeAuthenticated<{ getProperty: any }>(
          getProperty,
          { propertyId: duplicateId }
        );
        
        const property = data.getProperty;
        if (property) {
          // Transform the property data to match FormData structure
          const duplicateFormData: Partial<FormData> = {
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
                longitude: property.address?.coordinates?.longitude || 0
              }
            },
            specifications: {
              bedrooms: property.specifications?.bedrooms || 1,
              bathrooms: property.specifications?.bathrooms || 1,
              squareMeters: property.specifications?.squareMeters || 0,
              furnished: property.specifications?.furnished || false,
              parkingSpaces: property.specifications?.parkingSpaces || 0,
              floors: property.specifications?.floors || 1
            },
            pricing: {
              monthlyRent: property.pricing?.monthlyRent || 0,
              deposit: property.pricing?.deposit || 0,
              currency: property.pricing?.currency || 'TZS',
              serviceCharge: property.pricing?.serviceCharge || 0,
              utilitiesIncluded: property.pricing?.utilitiesIncluded || false
            },
            availability: {
              available: true, // Always set to available for new property
              availableFrom: undefined, // Clear the date for new property
              minimumLeaseTerm: property.availability?.minimumLeaseTerm || 12,
              maximumLeaseTerm: property.availability?.maximumLeaseTerm || 24
            },
            amenities: property.amenities || [],
            media: {
              images: [], // Don't copy images for legal reasons
              videos: [], // Don't copy videos for legal reasons
              floorPlan: '', // Don't copy floor plan
              virtualTour: '' // Don't copy virtual tour
            }
          };
          
          setDuplicateData(duplicateFormData);
        }
      } catch (error) {
        console.error('Error fetching property for duplication:', error);
        showWarning('Could Not Load Property', 'Could not load property data for duplication. You can still create a new property.');
      } finally {
        setLoadingDuplicate(false);
      }
    };

    fetchDuplicateProperty();
  }, [duplicateId, isTemplate, user]);

  const handleSubmit = async (formData: any) => {
    try {
      
      // Convert date format for AWS AppSync
      const processedFormData = {
        ...formData,
        availability: {
          ...formData.availability
        }
      };

      // Handle availableFrom date conversion with validation
      if (formData.availability?.availableFrom && formData.availability.availableFrom.trim() !== '') {
        const dateValue = formData.availability.availableFrom;
        console.log('Original availableFrom:', dateValue);
        
        // Check if it's already a valid date string
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format for availableFrom');
        }
        
        processedFormData.availability.availableFrom = date.toISOString();
        console.log('Converted availableFrom:', processedFormData.availability.availableFrom);
      } else {
        // Remove the field if it's empty to avoid validation errors
        delete processedFormData.availability.availableFrom;
        console.log('Removed empty availableFrom field');
      }

      console.log('Processed form data:', processedFormData);

      if (!user) {
        throw new Error('User not authenticated');
      }

      await GraphQLClient.executeAuthenticated<{ createProperty: any }>(
        createProperty,
        {
          input: processedFormData
        }
      );

      console.log('Property created successfully');
      router.push('/landlord/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      showError('Creation Failed', 'Error creating property. Please try again.');
      throw error; // Re-throw to let the wizard handle loading state
    }
  };

  if (loadingDuplicate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('common.loadingProperties')}
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
      
      {(duplicateId || isTemplate) && (
        <div className="max-w-6xl mx-auto mb-4 sm:mb-6 px-2 sm:px-0">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 transition-colors">
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 font-medium transition-colors">
                  {t('landlord.createProperty.duplicatingTitle')}
                </p>
                <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-300 transition-colors">
                  {t('landlord.createProperty.duplicatingMessage')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <CreatePropertyWizard
          title={(duplicateId || isTemplate) ? t('landlord.createProperty.titleDuplicate') : t('landlord.createProperty.title')}
          subtitle={(duplicateId || isTemplate) ? t('landlord.createProperty.subtitleDuplicate') : t('landlord.createProperty.subtitle')}
          onSubmit={handleSubmit}
          submitButtonText={t('landlord.createProperty.publishButton')}
          loadingText={t('landlord.createProperty.creating')}
          initialData={duplicateData}
        />
      </div>
    </div>
  );
}

// Force dynamic rendering for pages using useSearchParams
export const dynamic = 'force-dynamic';

export default function CreateProperty() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Loading...
        </p>
      </div>
    }>
      <CreatePropertyContent />
    </Suspense>
  );
}
