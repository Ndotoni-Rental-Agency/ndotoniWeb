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
  currency?: string;
  amenities?: string[];
}

interface UseAIGenerationReturn {
  isGeneratingTitle: boolean;
  handleGenerateTitle: () => Promise<void>;
  titleError: string | null;
  isGeneratingPrice: boolean;
  handleSuggestPrice: () => Promise<void>;
  priceError: string | null;
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
  onFieldChange: (field: string, value: any) => void
): UseAIGenerationReturn {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<PriceSuggestion | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  const handleGenerateTitle = useCallback(async () => {
    if (!input.district) return;
    setIsGeneratingTitle(true);
    setTitleError(null);
    try {
      const title = await AIService.generateTitle({
        propertyType: input.propertyType,
        district: input.district,
        region: input.region,
        bedrooms: input.bedrooms,
        monthlyRent: input.monthlyRent,
        currency: input.currency,
      });
      if (title) {
        onFieldChange('title', title);
      } else {
        setTitleError("Couldn't suggest a title. Try writing your own.");
      }
    } catch (err) {
      console.error('Title generation failed:', err);
      setTitleError("Couldn't reach the AI. Try again, or write your own title.");
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [input, onFieldChange]);

  const handleSuggestPrice = useCallback(async () => {
    if (!input.district) return;
    setIsGeneratingPrice(true);
    setPriceError(null);
    setPriceSuggestion(null);
    try {
      const prediction = await AIService.predictPrice({
        propertyType: input.propertyType,
        district: input.district,
        region: input.region,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        amenities: input.amenities,
      });
      if (prediction?.suggestedPrice) {
        setPriceSuggestion(prediction);
      } else {
        setPriceError("Couldn't estimate a price for this area yet.");
      }
    } catch (err) {
      console.error('Price prediction failed:', err);
      setPriceError("Couldn't reach the AI. Set your price manually for now.");
    } finally {
      setIsGeneratingPrice(false);
    }
  }, [input]);

  const applyPriceSuggestion = useCallback(() => {
    if (!priceSuggestion) return;
    onFieldChange('monthlyRent', priceSuggestion.suggestedPrice);
    setPriceSuggestion(null);
  }, [priceSuggestion, onFieldChange]);

  return {
    isGeneratingTitle,
    handleGenerateTitle,
    titleError,
    isGeneratingPrice,
    handleSuggestPrice,
    priceError,
    priceSuggestion,
    applyPriceSuggestion,
  };
}
