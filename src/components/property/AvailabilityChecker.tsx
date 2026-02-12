'use client';

import { useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { checkAvailability } from '@/graphql/queries';

interface AvailabilityCheckerProps {
  propertyId: string;
  propertyType: 'short-term' | 'long-term';
  className?: string;
}

export default function AvailabilityChecker({ 
  propertyId, 
  propertyType,
  className = '' 
}: AvailabilityCheckerProps) {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState(12);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    available: boolean;
    message?: string;
    unavailableDates?: string[];
    moveOutDate?: string;
  } | null>(null);

  const handleCheck = async () => {
    if (propertyType === 'short-term' && (!checkInDate || !checkOutDate)) {
      return;
    }
    if (propertyType === 'long-term' && !checkInDate) {
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      let response;
      
      if (propertyType === 'short-term') {
        response = await GraphQLClient.execute<{
          checkAvailability: {
            available: boolean;
            unavailableDates: string[];
          };
        }>(checkAvailability, {
          propertyId,
          checkInDate,
          checkOutDate,
        });

        setResult({
          available: response.checkAvailability.available,
          unavailableDates: response.checkAvailability.unavailableDates,
          message: response.checkAvailability.available
            ? 'Property is available for your selected dates!'
            : `Property is not available. ${response.checkAvailability.unavailableDates.length} blocked date(s).`,
        });
      } else {
        // Long-term: Calculate check-out date based on lease duration
        const moveIn = new Date(checkInDate);
        const moveOut = new Date(moveIn);
        moveOut.setMonth(moveOut.getMonth() + leaseDuration);
        const calculatedCheckOut = moveOut.toISOString().split('T')[0];

        response = await GraphQLClient.execute<{
          checkAvailability: {
            available: boolean;
            unavailableDates: string[];
          };
        }>(checkAvailability, {
          propertyId,
          checkInDate,
          checkOutDate: calculatedCheckOut,
        });

        setResult({
          available: response.checkAvailability.available,
          unavailableDates: response.checkAvailability.unavailableDates,
          moveOutDate: calculatedCheckOut,
          message: response.checkAvailability.available
            ? `Property is available for a ${leaseDuration}-month lease starting ${checkInDate}!`
            : `Property has ${response.checkAvailability.unavailableDates.length} blocked date(s) during your lease period.`,
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setResult({
        available: false,
        message: 'Failed to check availability. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Check Availability
      </h3>

      <div className="space-y-4">
        {/* Move-in / Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {propertyType === 'short-term' ? 'Check-in Date' : 'Move-in Date'}
          </label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {propertyType === 'short-term' ? (
          /* Short-term: Check-out date */
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate || today}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        ) : (
          /* Long-term: Lease duration */
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lease Duration (months)
            </label>
            <select
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={18}>18 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
            </select>
            {checkInDate && result?.moveOutDate && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Move-out date: {new Date(result.moveOutDate).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Check Button */}
        <button
          onClick={handleCheck}
          disabled={isChecking || !checkInDate || (propertyType === 'short-term' && !checkOutDate)}
          className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
        >
          {isChecking ? 'Checking...' : 'Check Availability'}
        </button>

        {/* Result */}
        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.available
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.available ? (
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    result.available
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}
                >
                  {result.message}
                </p>
                {!result.available && result.unavailableDates && result.unavailableDates.length > 0 && (
                  <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                    Blocked dates: {result.unavailableDates.slice(0, 5).join(', ')}
                    {result.unavailableDates.length > 5 && ` and ${result.unavailableDates.length - 5} more`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
