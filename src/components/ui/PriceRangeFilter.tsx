'use client';

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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Price Range ({currency})
      </label>
      <div className="flex gap-3">
        <input
          type="number"
          placeholder={placeholder.min}
          value={minPrice || ''}
          onChange={handleMinPriceChange}
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
        />
        <input
          type="number"
          placeholder={placeholder.max}
          value={maxPrice || ''}
          onChange={handleMaxPriceChange}
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-colors"
        />
      </div>
    </div>
  );
}