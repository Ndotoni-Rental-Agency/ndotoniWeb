/**
 * Example usage of PriceRangeFilter component
 * This file shows different ways to integrate the PriceRangeFilter
 */

'use client';

import { useState } from 'react';
import PriceRangeFilter from './PriceRangeFilter';

// Example 1: Basic usage in a search page
export function SearchPageExample() {
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Search Properties</h2>
      
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onMinPriceChange={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
        onMaxPriceChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
        className="mb-6"
      />
      
      {/* Other search filters would go here */}
    </div>
  );
}

// Example 2: Usage in a sidebar filter
export function SidebarFilterExample() {
  const [priceRange, setPriceRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  return (
    <div className="w-64 p-4 bg-gray-50 dark:bg-gray-800">
      <h3 className="text-md font-medium mb-4">Filter Properties</h3>
      
      <PriceRangeFilter
        minPrice={priceRange.min}
        maxPrice={priceRange.max}
        onMinPriceChange={(value) => setPriceRange(prev => ({ ...prev, min: value }))}
        onMaxPriceChange={(value) => setPriceRange(prev => ({ ...prev, max: value }))}
        placeholder={{
          min: "From",
          max: "To"
        }}
      />
    </div>
  );
}

// Example 3: Usage with different currency
export function InternationalExample() {
  const [filters, setFilters] = useState<{
    minPrice?: number;
    maxPrice?: number;
  }>({});

  return (
    <div className="p-4">
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onMinPriceChange={(value) => setFilters(prev => ({ ...prev, minPrice: value }))}
        onMaxPriceChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
        currency="USD"
        placeholder={{
          min: "Min budget",
          max: "Max budget"
        }}
      />
    </div>
  );
}

// Example 4: Integration with existing PropertyFilters interface
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

export function PropertyFiltersExample() {
  const [filters, setFilters] = useState<PropertyFilters>({});

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-4">
      <PriceRangeFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onMinPriceChange={(value) => updateFilter('minPrice', value)}
        onMaxPriceChange={(value) => updateFilter('maxPrice', value)}
      />
    </div>
  );
}