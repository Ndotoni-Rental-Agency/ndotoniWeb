'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DatePicker } from '@/components/shared/forms/DatePicker';
import { PriceRangeFilter, PriceSortToggle } from '@/components/ui';

// Define PropertyFilters interface here since it's frontend-specific
interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  priceSort?: 'asc' | 'desc';
}

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
}

export default function FiltersModal({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange,
  onClearFilters 
}: FiltersModalProps) {
  // Local state for modal filters - only applied when user clicks "Apply"
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters);

  // Update local filters when modal opens or external filters change
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const updateLocalFilter = (key: keyof PropertyFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    setLocalFilters({});
    onClearFilters();
    onClose();
  };

  const handleCancel = () => {
    // Reset local filters to current applied filters
    setLocalFilters(filters);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as={Fragment} onClose={onClose}>
        <div className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Filter Properties</h3>
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={handleCancel}
                    aria-label="Close filters"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Filters Content */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price Range */}
                    <PriceRangeFilter
                      minPrice={localFilters.minPrice}
                      maxPrice={localFilters.maxPrice}
                      onMinPriceChange={(value) => updateLocalFilter('minPrice', value)}
                      onMaxPriceChange={(value) => updateLocalFilter('maxPrice', value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bedrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Bedrooms
                      </label>
                      <select
                        value={localFilters.bedrooms || ''}
                        onChange={(e) => updateLocalFilter('bedrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-colors"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                      </select>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Bathrooms
                      </label>
                      <select
                        value={localFilters.bathrooms || ''}
                        onChange={(e) => updateLocalFilter('bathrooms', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-colors"
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional row for date and duration filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-gray-200 dark:border-gray-700">
                    {/* Move In Date */}
                    <div>
                      <DatePicker
                        value={localFilters.moveInDate || ''}
                        onChange={(value) => updateLocalFilter('moveInDate', value || undefined)}
                        label="Move In Date"
                        description="Select your preferred move-in date"
                        minDate={new Date().toISOString().split('T')[0]}
                        dropdownDirection="up"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    disabled={!hasActiveFilters}
                  >
                    Clear
                  </button>
                  
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyFilters}
                      className="px-6 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        </div>
      </Dialog>
    </Transition>
  );
}