'use client';

import React from 'react';
import { RentalType, rentalTypeLabels, isFeatureEnabled } from '@/config/features';
import { useLanguage } from '@/contexts/LanguageContext';

interface RentalTypeToggleProps {
  value: RentalType;
  onChange: (type: RentalType) => void;
  className?: string;
}

/**
 * Airbnb-style toggle for switching between rental types
 * 
 * Shows "Monthly" vs "Nightly" options with smooth animation
 * Only shows if short-term stays feature is enabled
 */
export function RentalTypeToggle({ value, onChange, className = '' }: RentalTypeToggleProps) {
  const { language } = useLanguage();
  
  // Don't render if short-term stays are disabled
  if (!isFeatureEnabled('shortTermStays')) {
    return null;
  }

  const options = [
    { value: RentalType.LONG_TERM, label: rentalTypeLabels[RentalType.LONG_TERM][language] },
    { value: RentalType.SHORT_TERM, label: rentalTypeLabels[RentalType.SHORT_TERM][language] },
  ];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="relative inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1 transition-colors">
        {/* Sliding background indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-full bg-white dark:bg-gray-700 shadow-sm transition-all duration-300 ease-in-out"
          style={{
            left: value === RentalType.LONG_TERM ? '4px' : '50%',
            right: value === RentalType.LONG_TERM ? '50%' : '4px',
          }}
        />

        {/* Toggle buttons */}
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200
              ${
                value === option.value
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }
            `}
            aria-pressed={value === option.value}
            aria-label={`Switch to ${option.label} rentals`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Compact version for mobile/smaller screens
 */
export function RentalTypeToggleCompact({ value, onChange, className = '' }: RentalTypeToggleProps) {
  const { language } = useLanguage();
  
  if (!isFeatureEnabled('shortTermStays')) {
    return null;
  }

  const options = [
    { value: RentalType.LONG_TERM, label: rentalTypeLabels[RentalType.LONG_TERM][language] },
    { value: RentalType.SHORT_TERM, label: rentalTypeLabels[RentalType.SHORT_TERM][language] },
  ];

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="relative inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-0.5 transition-colors">
        <div
          className="absolute top-0.5 bottom-0.5 rounded-full bg-white dark:bg-gray-700 shadow-sm transition-all duration-300 ease-in-out"
          style={{
            left: value === RentalType.LONG_TERM ? '2px' : '50%',
            right: value === RentalType.LONG_TERM ? '50%' : '2px',
          }}
        />

        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative z-10 px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-200
              ${
                value === option.value
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }
            `}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
