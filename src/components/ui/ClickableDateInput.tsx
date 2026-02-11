'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils/common';

interface ClickableDateInputProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  label: string | React.ReactNode;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'large';
}

export default function ClickableDateInput({
  value,
  onChange,
  min,
  max,
  label,
  placeholder = 'Select date',
  className,
  disabled = false,
  variant = 'default',
}: ClickableDateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch (error) {
        // Fallback for browsers that don't support showPicker
        inputRef.current.focus();
        inputRef.current.click();
      }
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isLarge = variant === 'large';

  return (
    <div className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={handleClick}
          className={cn(
            'w-full border bg-white dark:bg-gray-800 cursor-pointer transition-all duration-200',
            isLarge ? 'px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl' : 'px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
            'hover:border-emerald-500 dark:hover:border-emerald-500',
            isLarge && 'focus-within:ring-4 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/50 focus-within:border-emerald-500 dark:focus-within:border-emerald-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center justify-between">
            <span 
              className={cn(
                isLarge ? 'text-lg' : 'text-sm',
                value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {formatDisplayDate(value)}
            </span>
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        {/* Native date input - positioned over the custom input for mobile compatibility */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
