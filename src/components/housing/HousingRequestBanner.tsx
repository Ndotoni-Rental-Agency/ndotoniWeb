'use client';

import { useState } from 'react';
import { HousingRequestForm } from './HousingRequestForm';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * Inline banner that expands into the housing request form.
 * Use this instead of a FAB to avoid clashing with WhatsApp button.
 */
export function HousingRequestBanner({ className = '' }: { className?: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    return (
      <div className={className}>
        <HousingRequestForm onClose={() => setIsExpanded(false)} />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className={`w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-left hover:shadow-md transition-all group ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <MagnifyingGlassIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
            Hukupata unachotaka?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Tuambie unataka nini hasa — timu yetu itakutafutia nyumba inayofaa.
          </p>
        </div>
        <div className="flex-shrink-0 text-blue-600 dark:text-blue-400 font-medium text-sm hidden sm:block">
          Eleza →
        </div>
      </div>
    </button>
  );
}
