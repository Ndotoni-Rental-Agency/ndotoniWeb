'use client';

/**
 * PriceSortToggle Component
 * 
 * A reusable component for toggling price sort order (ascending/descending).
 * Cycles through three states: none → ascending → descending → none
 * 
 * @example
 * // Basic usage
 * <PriceSortToggle
 *   sortOrder={filters.priceSort}
 *   onSortChange={(order) => setFilters({...filters, priceSort: order})}
 * />
 * 
 * @example
 * // With custom styling
 * <PriceSortToggle
 *   sortOrder={filters.priceSort}
 *   onSortChange={(order) => updateFilter('priceSort', order)}
 *   className="ml-2"
 *   showLabel={false}
 * />
 */

interface PriceSortToggleProps {
  /** Current sort order */
  sortOrder?: 'asc' | 'desc';
  /** Callback when sort order changes */
  onSortChange: (order: 'asc' | 'desc' | undefined) => void;
  /** Whether to show the "Price" label */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceSortToggle({
  sortOrder,
  onSortChange,
  showLabel = true,
  className = '',
  size = 'md'
}: PriceSortToggleProps) {
  const handleToggle = () => {
    if (!sortOrder) {
      onSortChange('asc');
    } else if (sortOrder === 'asc') {
      onSortChange('desc');
    } else {
      onSortChange(undefined);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-4 h-4';
    }
  };

  const renderIcon = () => {
    const iconClasses = `${getIconSize()} transition-colors`;
    
    if (!sortOrder) {
      // No sort - show neutral sort icon
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    } else if (sortOrder === 'asc') {
      // Ascending - show up arrow
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      // Descending - show down arrow
      return (
        <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  const getAriaLabel = () => {
    if (!sortOrder) {
      return 'Sort by price';
    } else if (sortOrder === 'asc') {
      return 'Price: Low to High';
    } else {
      return 'Price: High to Low';
    }
  };

  const getButtonClasses = () => {
    const baseClasses = `${getSizeClasses()} bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-full font-medium hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none  transition-colors flex items-center space-x-2`;
    
    // Add active state styling when sorting is applied
    if (sortOrder) {
      return `${baseClasses} border-gray-400 dark:border-gray-500 bg-gray-50 dark:bg-gray-700`;
    }
    
    return baseClasses;
  };

  return (
    <button
      onClick={handleToggle}
      className={`${getButtonClasses()} ${className}`}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
    >
      {renderIcon()}
      {showLabel && <span>Price</span>}
    </button>
  );
}