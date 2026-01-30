'use client';

import React from 'react';

type Props = {
  amenities: string[];
};

export default function Amenities({ amenities }: Props) {
  if (!amenities || amenities.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Amenities</h3>
      <div className="grid grid-cols-2 gap-3">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
            <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {amenity}
          </div>
        ))}
      </div>
    </div>
  );
}
