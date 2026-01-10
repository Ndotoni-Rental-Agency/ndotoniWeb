'use client';

import React from 'react';
import { PAGINATION } from '@/constants/pagination';

interface ScrollArrowsProps {
  containerId: string;
  scrollAmount?: number;
  className?: string;
}

/**
 * Reusable scroll arrow buttons for horizontal scrolling containers
 * Automatically handles smooth scrolling behavior
 */
export const ScrollArrows: React.FC<ScrollArrowsProps> = ({ 
  containerId, 
  scrollAmount = PAGINATION.SCROLL_AMOUNT,
  className = ''
}) => {
  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(containerId);
    if (container) {
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <>
      {/* Left Arrow */}
      <button 
        onClick={() => handleScroll('left')}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center opacity-0 md:hover:opacity-100 transition-all duration-200 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 hidden md:flex ${className}`}
        aria-label="Scroll left"
        type="button"
      >
        <svg 
          className="w-5 h-5 text-gray-600 dark:text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
      
      {/* Right Arrow */}
      <button 
        onClick={() => handleScroll('right')}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 items-center justify-center scroll-arrow hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:flex ${className}`}
        aria-label="Scroll right"
        type="button"
      >
        <svg 
          className="w-5 h-5 text-gray-600 dark:text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </button>
    </>
  );
};
