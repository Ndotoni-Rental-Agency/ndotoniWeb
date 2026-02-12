'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/common';

interface CalendarDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  label: string;
  placeholder?: string;
  blockedDates?: Set<string>;
  className?: string;
  disabled?: boolean;
}

export default function CalendarDatePicker({
  value,
  onChange,
  min,
  label,
  placeholder = 'Select date',
  blockedDates = new Set(),
  className,
  disabled = false,
}: CalendarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDateSelect = (dateStr: string) => {
    if (!isDateDisabled(dateStr)) {
      onChange(dateStr);
      setIsOpen(false);
    }
  };

  const isDateDisabled = (dateStr: string): boolean => {
    if (blockedDates.has(dateStr)) return true;
    if (min && dateStr < min) return true;
    return false;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const today = new Date().toISOString().split('T')[0];

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = value === dateStr;
      const isDisabled = isDateDisabled(dateStr);
      const isPast = dateStr < today;
      const isToday = dateStr === today;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(dateStr)}
          disabled={isDisabled}
          className={cn(
            'h-10 flex items-center justify-center text-sm rounded-lg transition-colors',
            isSelected && 'bg-emerald-600 text-white font-semibold',
            !isSelected && !isDisabled && !isPast && 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-900 dark:text-white',
            isDisabled && 'bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-600 cursor-not-allowed line-through',
            isPast && !isDisabled && 'text-gray-300 dark:text-gray-700',
            isToday && !isSelected && 'ring-2 ring-emerald-500'
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      {/* Display Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800',
          'hover:border-emerald-500 dark:hover:border-emerald-500 transition-all',
          'flex items-center justify-between',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn('text-sm', value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500')}>
          {formatDisplayDate(value)}
        </span>
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Calendar Dropdown - Centered Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 z-[100]" onClick={() => setIsOpen(false)} />

          {/* Calendar - Centered */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-80 max-w-[calc(100vw-2rem)]">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-emerald-600"></div>
                <span className="text-gray-600 dark:text-gray-400">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200"></div>
                <span className="text-gray-600 dark:text-gray-400">Unavailable</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
