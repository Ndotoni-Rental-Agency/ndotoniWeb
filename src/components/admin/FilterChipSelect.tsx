'use client';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils/common';

export interface FilterChipOption<T extends string = string> {
  value: T;
  label: string;
}

interface FilterChipSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: FilterChipOption<T>[];
  'aria-label': string;
  className?: string;
}

export function FilterChipSelect<T extends string = string>({
  value,
  onChange,
  options,
  'aria-label': ariaLabel,
  className,
}: FilterChipSelectProps<T>) {
  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={ariaLabel}
        className={cn(
          'appearance-none h-8 min-h-[32px] pl-3 pr-7',
          'text-xs font-medium leading-none',
          'rounded-full border border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1',
          'dark:focus:ring-offset-gray-900',
          'cursor-pointer transition-colors',
          'hover:border-gray-400 dark:hover:border-gray-500'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500 dark:text-gray-400"
        aria-hidden
      />
    </div>
  );
}
