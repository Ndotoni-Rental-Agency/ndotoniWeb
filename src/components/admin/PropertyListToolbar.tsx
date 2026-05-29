'use client';

import Link from 'next/link';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { FilterChipSelect, type FilterChipOption } from './FilterChipSelect';
import { CompactSearchInput } from './CompactSearchInput';
import { cn } from '@/lib/utils/common';

interface PropertyListToolbarProps<TType extends string, TStatus extends string> {
  propertyTypeFilter: TType;
  onPropertyTypeChange: (value: TType) => void;
  propertyTypeOptions: FilterChipOption<TType>[];
  statusFilter: TStatus;
  onStatusChange: (value: TStatus) => void;
  statusOptions: FilterChipOption<TStatus>[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  createHref: string;
  onBulkImport: () => void;
  resultCount?: number;
  className?: string;
}

export function PropertyListToolbar<TType extends string, TStatus extends string>({
  propertyTypeFilter,
  onPropertyTypeChange,
  propertyTypeOptions,
  statusFilter,
  onStatusChange,
  statusOptions,
  searchTerm,
  onSearchChange,
  createHref,
  onBulkImport,
  resultCount,
  className,
}: PropertyListToolbarProps<TType, TStatus>) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={createHref}
          className={cn(
            'inline-flex h-9 min-h-[36px] flex-1 items-center justify-center',
            'rounded-lg bg-red-600 px-4 text-sm font-medium text-white',
            'transition-colors hover:bg-red-700',
            'sm:flex-none sm:min-w-[100px]'
          )}
        >
          Create
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkImport}
          leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
          className={cn(
            'h-9 min-h-[36px] flex-1 rounded-lg sm:flex-none',
            '!rounded-lg'
          )}
        >
          <span className="hidden min-[360px]:inline">Bulk Import</span>
          <span className="min-[360px]:hidden">Import</span>
        </Button>
        {resultCount !== undefined && (
          <span className="w-full text-xs text-gray-500 dark:text-gray-400 sm:ml-auto sm:w-auto sm:text-sm">
            {resultCount} {resultCount === 1 ? 'listing' : 'listings'}
          </span>
        )}
      </div>

      {/* Sticky filters + search */}
      <div
        className={cn(
          'sticky top-16 z-20 -mx-4 px-4 py-2',
          'border-b border-gray-200/80 dark:border-gray-700/80',
          'bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm',
          'sm:mx-0 sm:rounded-lg sm:border sm:px-3 sm:py-3'
        )}
      >
        <div className="space-y-2">
          <div
            className={cn(
              'flex gap-2 overflow-x-auto pb-0.5',
              '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
            )}
          >
            <FilterChipSelect
              value={propertyTypeFilter}
              onChange={onPropertyTypeChange}
              options={propertyTypeOptions}
              aria-label="Filter by property type"
            />
            <FilterChipSelect
              value={statusFilter}
              onChange={onStatusChange}
              options={statusOptions}
              aria-label="Filter by status"
            />
          </div>
          <CompactSearchInput
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search listings..."
          />
        </div>
      </div>
    </div>
  );
}
