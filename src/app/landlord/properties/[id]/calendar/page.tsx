'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { blockDates, unblockDates } from '@/graphql/mutations';
import { getBlockedDates } from '@/graphql/queries';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';

export const dynamic = 'force-dynamic';

export default function PropertyCalendarPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [blockedDateReasons, setBlockedDateReasons] = useState<Map<string, string>>(new Map());

  // Fetch blocked dates for current month
  const fetchBlockedDates = async (month: Date) => {
    try {
      setIsLoading(true);
      
      // Get first and last day of the month
      const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
      const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const response = await GraphQLClient.executeAuthenticated<{
        getBlockedDates: {
          propertyId: string;
          blockedRanges: Array<{
            startDate: string;
            endDate: string;
            reason?: string;
          }>;
        };
      }>(getBlockedDates, {
        propertyId,
        startDate: firstDay.toISOString().split('T')[0],
        endDate: lastDay.toISOString().split('T')[0],
      });

      if (response.getBlockedDates?.blockedRanges) {
        // Convert blocked ranges to individual dates
        const newBlockedDates = new Set<string>();
        const newBlockedDateReasons = new Map<string, string>();
        
        response.getBlockedDates.blockedRanges.forEach(range => {
          const start = new Date(range.startDate);
          const end = new Date(range.endDate);
          const reason = range.reason || 'Blocked';
          
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            newBlockedDates.add(dateStr);
            newBlockedDateReasons.set(dateStr, reason);
          }
        });
        
        setBlockedDates(newBlockedDates);
        setBlockedDateReasons(newBlockedDateReasons);
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
      setMessage({ type: 'error', text: 'Failed to load blocked dates' });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blocked dates when month changes
  useEffect(() => {
    fetchBlockedDates(currentMonth);
  }, [propertyId, currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleBlockDates = async () => {
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Please select both start and end dates' });
      return;
    }

    setIsBlocking(true);
    setMessage(null);

    try {
      const response = await GraphQLClient.executeAuthenticated<{
        blockDates: { success: boolean; message?: string };
      }>(blockDates, {
        input: {
          propertyId,
          startDate,
          endDate,
        },
      });

      if (response.blockDates?.success) {
        setMessage({ type: 'success', text: 'Dates blocked successfully' });
        setStartDate('');
        setEndDate('');
        
        // Refresh blocked dates for current month
        await fetchBlockedDates(currentMonth);
      } else {
        setMessage({ type: 'error', text: response.blockDates?.message || 'Failed to block dates' });
      }
    } catch (error) {
      console.error('Error blocking dates:', error);
      setMessage({ type: 'error', text: 'Failed to block dates. Please try again.' });
    } finally {
      setIsBlocking(false);
    }
  };

  const handleUnblockDates = async () => {
    if (!startDate || !endDate) {
      setMessage({ type: 'error', text: 'Please select both start and end dates' });
      return;
    }

    setIsUnblocking(true);
    setMessage(null);

    try {
      const response = await GraphQLClient.executeAuthenticated<{
        unblockDates: { success: boolean; message?: string };
      }>(unblockDates, {
        input: {
          propertyId,
          startDate,
          endDate,
        },
      });

      if (response.unblockDates?.success) {
        setMessage({ type: 'success', text: 'Dates unblocked successfully' });
        setStartDate('');
        setEndDate('');
        
        // Refresh blocked dates for current month
        await fetchBlockedDates(currentMonth);
      } else {
        setMessage({ type: 'error', text: response.unblockDates?.message || 'Failed to unblock dates' });
      }
    } catch (error) {
      console.error('Error unblocking dates:', error);
      setMessage({ type: 'error', text: 'Failed to unblock dates. Please try again.' });
    } finally {
      setIsUnblocking(false);
    }
  };

  const renderMonth = () => {
    const date = currentMonth;
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isBlocked = blockedDates.has(dateStr);
      const isPast = new Date(dateStr) < new Date(today);
      const reason = blockedDateReasons.get(dateStr);
      
      days.push(
        <div
          key={day}
          title={isBlocked && reason ? reason : undefined}
          className={`h-10 flex items-center justify-center text-sm rounded-lg ${
            isPast
              ? 'text-gray-300 dark:text-gray-700'
              : isBlocked
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold cursor-help'
              : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {day}
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Manage Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Block or unblock dates for your property
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Date Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select Date Range
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <CalendarDatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              min={today}
              placeholder="Select start date"
              blockedDates={blockedDates}
              rangeStart={startDate}
              rangeEnd={endDate}
            />

            <CalendarDatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              min={startDate || today}
              placeholder="Select end date"
              blockedDates={blockedDates}
              rangeStart={startDate}
              rangeEnd={endDate}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleBlockDates}
              disabled={isBlocking || isUnblocking || !startDate || !endDate}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {isBlocking ? 'Blocking...' : 'Block Dates'}
            </button>

            <button
              onClick={handleUnblockDates}
              disabled={isBlocking || isUnblocking || !startDate || !endDate}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {isUnblocking ? 'Unblocking...' : 'Unblock Dates'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Block dates to prevent guests from booking during those periods</li>
                <li>Unblock dates to make them available again</li>
                <li>Hover over blocked dates to see the reason</li>
                <li>Blocked dates will not appear as available in search results</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Previous month"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                aria-label="Next month"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-700"></div>
                <span className="text-gray-600 dark:text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"></div>
                <span className="text-gray-600 dark:text-gray-400">Blocked</span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div>
              {renderMonth()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
