'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { NumberInput } from '../shared';

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
  placeholder,
  className = '',
}: PriceRangeFilterProps) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const pricePlaceholder = placeholder || {
    min: sw ? 'Bei ya chini' : 'Min price',
    max: sw ? 'Bei ya juu' : 'Max price',
  };
  const handleMinPriceChange = (value: number) => {
    // If value is 0 (which NumberInput returns when cleared), treat as undefined
    onMinPriceChange(value === 0 ? undefined : value);
  };

  const handleMaxPriceChange = (value: number) => {
    // If value is 0 (which NumberInput returns when cleared), treat as undefined
    onMaxPriceChange(value === 0 ? undefined : value);
  };

  return (
    <div className={className}>
      <div className="flex gap-3">
        <NumberInput
          value={minPrice ?? 0}
          onChange={handleMinPriceChange}
          label={sw ? `Bei ya chini (${currency})` : `Minimum rent (${currency})`}
          placeholder={pricePlaceholder.min}
        />
        <NumberInput
          value={maxPrice ?? 0}
          onChange={handleMaxPriceChange}
          label={sw ? `Bei ya juu (${currency})` : `Maximum rent (${currency})`}
          placeholder={pricePlaceholder.max}
        />
      </div>
    </div>
  );
}
