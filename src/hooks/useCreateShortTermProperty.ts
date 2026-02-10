'use client';

import { useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { createShortTermPropertyDraft } from '@/graphql/mutations';
import { ShortTermPropertyType } from '@/API';

interface CreateShortTermPropertyDraftInput {
  title: string;
  region: string;
  district: string;
  propertyType: ShortTermPropertyType;
  nightlyRate: number;
  currency: string;
  cleaningFee?: number;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  minimumStay?: number;
  latitude?: number;
  longitude?: number;
  images?: string[];
  videos?: string[];
}

interface CreateDraftResult {
  success: boolean;
  propertyId?: string;
  message: string;
}

export function useCreateShortTermProperty() {
  const [isCreating, setIsCreating] = useState(false);

  const createDraft = async (
    input: CreateShortTermPropertyDraftInput
  ): Promise<CreateDraftResult> => {
    setIsCreating(true);

    try {
      console.log('[useCreateShortTermProperty] Creating draft with input:', {
        title: input.title,
        region: input.region,
        district: input.district,
        propertyType: input.propertyType,
        nightlyRate: input.nightlyRate,
        currency: input.currency,
      });

      const response = await GraphQLClient.executeAuthenticated(
        createShortTermPropertyDraft,
        {
          input: {
            title: input.title,
            region: input.region,
            district: input.district,
            propertyType: input.propertyType,
            nightlyRate: input.nightlyRate,
            currency: input.currency,
          },
        }
      );

      const result = response.createShortTermPropertyDraft;

      console.log('[useCreateShortTermProperty] Draft created successfully:', result);

      return {
        success: true,
        propertyId: result.propertyId || undefined,
        message: result.message || 'Short-term property draft created successfully',
      };
    } catch (error) {
      console.error('[useCreateShortTermProperty] Error creating draft:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create property draft',
      };
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createDraft,
    isCreating,
  };
}
