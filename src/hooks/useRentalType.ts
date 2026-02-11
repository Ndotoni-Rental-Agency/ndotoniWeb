'use client';

import { useState, useCallback, useEffect } from 'react';
import { RentalType } from '@/config/features';

const STORAGE_KEY = 'ndotoni_rental_type';

/**
 * Hook to manage rental type selection (Monthly vs Nightly)
 * 
 * Persists selection to localStorage for better UX
 * Listens for changes across components
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

  // Listen for storage changes (when other components update the rental type)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        if (Object.values(RentalType).includes(e.newValue as RentalType)) {
          setRentalTypeState(e.newValue as RentalType);
        }
      }
    };

    // Listen for custom event (for same-window updates)
    const handleCustomEvent = (e: CustomEvent<RentalType>) => {
      setRentalTypeState(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rentalTypeChange' as any, handleCustomEvent as any);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rentalTypeChange' as any, handleCustomEvent as any);
    };
  }, []);

  // Update rental type and persist to localStorage
  const setRentalType = useCallback((type: RentalType) => {
    setRentalTypeState(type);
    try {
      localStorage.setItem(STORAGE_KEY, type);
      // Dispatch custom event for same-window updates
      window.dispatchEvent(new CustomEvent('rentalTypeChange', { detail: type }));
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
