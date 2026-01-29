// PropertyCardSkeleton.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils/common';

export function PropertySearchCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      <div className="flex">
        {/* Image skeleton */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-l-lg" />

        {/* Content skeleton */}
        <div className="flex-1 p-3 sm:p-4 min-h-[6rem] sm:min-h-[8rem] flex flex-col justify-between">
          <div className="space-y-2">
            {/* Location */}
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Title (2 lines) */}
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Property type */}
            <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between mt-3">
            {/* Price */}
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertySearchCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <PropertySearchCardSkeleton key={i} />
      ))}
    </div>
  );
}
