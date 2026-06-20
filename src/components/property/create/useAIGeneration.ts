'use client';

import { useState, useCallback } from 'react';
import { AIService } from '@/lib/ai/AIService';
import { PriceSuggestion } from './types';

interface AIGenerationInput {
  propertyType: string;
  district: string;
  region: string;
  bedrooms?: number;
  bathrooms?: number;
  monthlyRent?: number;
  nightlyRate?: number;
  currency?: string;
  amenities?: string[];
}

interface UseAIGenerationReturn {
  isGeneratingTitle: boolean;
  handleGenerateTitle: () => Promise<void>;
  isGeneratingPrice: boolean;
  handleSuggestPrice: () => Promise<void>;
  priceSuggestion: PriceSuggestion | null;
  applyPriceSuggestion: () => void;
}

/**
 * Hook for AI generation features (title + price suggestion).
 * Accepts formData-like input and an `onFieldChange` callback so it works
 * in both the create flow and the edit flow.
 */
export function useAIGeneration(
  input: AIGenerationInput,
  isShortTerm: boolean,
  onFieldChange: (field: string, value: any) => void
): UseAIGenerationReturn {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);

  const handleGenerateTitle = useCallback(async () => {
    if (!input.district) return;
    setIsGeneratingTitle(true);
    try {
      const title = await AIService.generateTitle({
        propertyType: input.propertyType,
        district: input.district,
        region: input.region,
        bedrooms: input.bedrooms,
        monthlyRent: input.monthlyRent,
        nightlyRate: input.nightlyRate,
        currency: input.currency,
        rentalType: isShortTerm ? 'short-term' : 'long-term',
      });
      if (title) {
        onFieldChange('title', title);
      }
    } catch (err) {
      console.error('Title generation failed:', err);
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [input, isShortTerm, onFieldChange]);

  const handleSuggestPrice = useCallback(async () => {
    if (!input.district) return;
    setIsGeneratingPrice(true);
    setPriceSuggestion(null);
    try {
      const prediction = await AIService.predictPrice({
        propertyType: input.propertyType,
        district: input.district,
        region: input.region,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        amenities: input.amenities,
        rentalType: isShortTerm ? 'short-term' : 'long-term',
      });
      if (prediction?.suggestedPrice) {
        setPriceSuggestion(prediction);
      }
    } catch (err) {
      console.error('Price prediction failed:', err);
    } finally {
      setIsGeneratingPrice(false);
    }
  }, [input, isShortTerm]);

  const applyPriceSuggestion = useCallback(() => {
    if (!priceSuggestion) return;
    if (isShortTerm) {
      onFieldChange('nightlyRate', priceSuggestion.suggestedPrice);
    } else {
      onFieldChange('monthlyRent', priceSuggestion.suggestedPrice);
    }
    setPriceSuggestion(null);
  }, [priceSuggestion, isShortTerm, onFieldChange]);

  return {
    isGeneratingTitle,
    handleGenerateTitle,
    isGeneratingPrice,
    handleSuggestPrice,
    priceSuggestion,
    applyPriceSuggestion,
  };
}
