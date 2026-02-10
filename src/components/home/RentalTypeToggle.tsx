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
      <div className="relative inline-flex bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full p-1 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        {/* Sliding background indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-emerald-700 dark:to-emerald-800 shadow-[0_2px_8px_rgba(0,0,0,0.15)] dark:shadow-[0_2px_8px_rgba(5,150,105,0.4)] transition-all duration-300 ease-out"
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
              relative z-10 px-8 py-2.5 text-sm font-semibold rounded-full transition-all duration-200
              ${
                value === option.value
                  ? 'text-white scale-[1.02]'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105'
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
      <div className="relative inline-flex bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full p-0.5 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div
          className="absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-emerald-700 dark:to-emerald-800 shadow-[0_1px_4px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_4px_rgba(5,150,105,0.4)] transition-all duration-300 ease-out"
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
              relative z-10 px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200
              ${
                value === option.value
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
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
