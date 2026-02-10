'use client';

import { useState, useCallback, useEffect } from 'react';
import { RentalType } from '@/config/features';

const STORAGE_KEY = 'ndotoni_rental_type';

/**
 * Hook to manage rental type selection (Monthly vs Nightly)
 * 
 * Persists selection to localStorage for better UX
 */
export function useRentalType() {
  const [rentalType, setRentalTypeState] = useState<RentalType>(RentalType.LONG_TERM);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && Object.values(RentalType).includes(stored as RentalType)) {
        setRentalTypeState(stored as RentalType);
      }
    } catch (error) {
      console.error('Failed to load rental type from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Update rental type and persist to localStorage
  const setRentalType = useCallback((type: RentalType) => {
    setRentalTypeState(type);
    try {
      localStorage.setItem(STORAGE_KEY, type);
    } catch (error) {
      console.error('Failed to save rental type to localStorage:', error);
    }
  }, []);

  const isLongTerm = rentalType === RentalType.LONG_TERM;
  const isShortTerm = rentalType === RentalType.SHORT_TERM;

  return {
    rentalType,
    setRentalType,
    isLongTerm,
    isShortTerm,
    isLoaded, // Use this to prevent flash of wrong content
  };
}
