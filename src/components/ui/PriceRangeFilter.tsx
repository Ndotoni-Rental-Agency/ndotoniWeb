'use client';

import { NumberInput } from "../shared";

/**
 * PriceRangeFilter Component
 * 
 * A reusable component for filtering properties by price range.
 * Can be used in modals, search pages, or any other filtering interface.
 * 
 * @example
 * // Basic usage
 * <PriceRangeFilter
 *   minPrice={filters.minPrice}
 *   maxPrice={filters.maxPrice}
 *   onMinPriceChange={(value) => setFilters({...filters, minPrice: value})}
 *   onMaxPriceChange={(value) => setFilters({...filters, maxPrice: value})}
 * />
 * 
 * @example
 * // With custom currency and placeholders
 * <PriceRangeFilter
 *   minPrice={filters.minPrice}
 *   maxPrice={filters.maxPrice}
 *   onMinPriceChange={(value) => updateFilter('minPrice', value)}
 *   onMaxPriceChange={(value) => updateFilter('maxPrice', value)}
 *   currency="USD"
 *   placeholder={{ min: "From", max: "To" }}
 *   className="mb-4"
 * />
 */

interface PriceRangeFilterProps {
  /** Current minimum price value */
  minPrice?: number;
  /** Current maximum price value */
  maxPrice?: number;
  /** Callback when minimum price changes */
  onMinPriceChange: (value: number | undefined) => void;
  /** Callback when maximum price changes */
  onMaxPriceChange: (value: number | undefined) => void;
  /** Currency symbol to display (default: 'TZS') */
  currency?: string;
  /** Custom placeholder text for inputs */
  placeholder?: {
    min?: string;
    max?: string;
  };
  /** Additional CSS classes */
  className?: string;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  currency = 'TZS',
  placeholder = {
    min: 'Min price',
    max: 'Max price'
  },
  className = ''
}: PriceRangeFilterProps) {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMinPriceChange(value ? parseInt(value) : undefined);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onMaxPriceChange(value ? parseInt(value) : undefined);
  };

  return (
    <div className={className}>
      <div className="flex gap-3">
        <NumberInput
          value={minPrice ?? 0}
          onChange={(value: number) => onMinPriceChange(value)}
          label="Min Monthly price"
        />
         <NumberInput
          value={maxPrice ?? 0}
          onChange={(value: number) => onMaxPriceChange(value)}
          label="Max Monthly price"
        />
      </div>
    </div>
  );
}