'use client';

import React from 'react';

interface EmptyPropertiesStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyPropertiesState({ 
  title = "No properties available",
  description = "This landlord doesn't have any properties listed at the moment.",
  icon
}: EmptyPropertiesStateProps) {
  const defaultIcon = (
    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0h-4m-2 0H3" />
    </svg>
  );

  return (
    <div className="text-center py-12">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}