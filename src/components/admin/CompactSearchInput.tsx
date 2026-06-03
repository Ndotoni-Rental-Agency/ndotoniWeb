'use client';

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/common';

interface CompactSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CompactSearchInput({
  value,
  onChange,
  placeholder = 'Search listings...',
  className,
}: CompactSearchInputProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          'h-9 w-full min-h-[36px] rounded-full',
          'border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white',
          'placeholder:text-gray-500 dark:placeholder:text-gray-400',
          'pl-9 pr-9',
          'focus:outline-none focus:ring-2 focus:ring-brand-500',
          '[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
        )}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className={cn(
            'absolute right-1 top-1/2 -translate-y-1/2',
            'flex h-7 w-7 items-center justify-center rounded-full',
            'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
            'dark:hover:bg-gray-700 dark:hover:text-gray-300',
            'transition-colors'
          )}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
