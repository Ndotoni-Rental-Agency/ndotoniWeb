import React from 'react';

function AdminPropertyCardSkeletonItem() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="aspect-[21/9] max-h-[120px] bg-gray-200 dark:bg-gray-700 sm:hidden" />
      <div className="flex flex-col sm:flex-row">
        <div className="hidden h-28 w-40 shrink-0 bg-gray-200 dark:bg-gray-700 sm:block" />
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="h-4 flex-1 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-5 w-16 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-1 flex items-center justify-between">
            <div className="h-5 w-28 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 sm:h-7 sm:w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPropertyListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <AdminPropertyCardSkeletonItem key={index} />
      ))}
    </div>
  );
}
