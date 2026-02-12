'use client';

import React, { useState, useEffect } from 'react';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { Property } from '@/API';
import { toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { checkAvailability, getBlockedDates } from '@/graphql/queries';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';

type Props = {
  property: Property;
  formatPrice: (n: number, c?: string) => string;
  onContactAgent: () => void;
  isInitializingChat: boolean;
  region: string;
  district: string;
  ward?: string;
  street?: string;
};

export default function DetailsSidebar({
  property,
  formatPrice,
  onContactAgent,
  isInitializingChat,
  region,
  district,
  ward,
  street,
}: Props) {
  const { t } = useLanguage();
  const [moveInDate, setMoveInDate] = useState('');
  const [leaseDuration, setLeaseDuration] = useState(12);
  const [isChecking, setIsChecking] = useState(false);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [isLoadingBlockedDates, setIsLoadingBlockedDates] = useState(true);
  const [showAvailabilityChecker, setShowAvailabilityChecker] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    available: boolean;
    message?: string;
    unavailableDates?: string[];
    moveOutDate?: string;
    suggestedMoveInDate?: string;
    suggestedMoveOutDate?: string;
  } | null>(null);

  // Fetch blocked dates when component mounts
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        setIsLoadingBlockedDates(true);
        const today = new Date();
        const threeYearsLater = new Date(today);
        threeYearsLater.setFullYear(today.getFullYear() + 3);

        const response = await GraphQLClient.execute<{
          getBlockedDates: {
            propertyId: string;
            blockedRanges: Array<{
              startDate: string;
              endDate: string;
              reason?: string;
            }>;
          };
        }>(getBlockedDates, {
          propertyId: property.propertyId,
          startDate: today.toISOString().split('T')[0],
          endDate: threeYearsLater.toISOString().split('T')[0],
        });

        if (response.getBlockedDates?.blockedRanges) {
          const newBlockedDates = new Set<string>();

          response.getBlockedDates.blockedRanges.forEach(range => {
            const start = new Date(range.startDate);
            const end = new Date(range.endDate);

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              newBlockedDates.add(d.toISOString().split('T')[0]);
            }
          });

          setBlockedDates(newBlockedDates);
        }
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
      } finally {
        setIsLoadingBlockedDates(false);
      }
    };

    fetchBlockedDates();
  }, [property.propertyId]);

  const handleCheckAvailability = async () => {
    if (!moveInDate) return;

    setIsChecking(true);
    setAvailabilityResult(null);

    try {
      // Calculate move-out date
      const moveIn = new Date(moveInDate);
      const moveOut = new Date(moveIn);
      moveOut.setMonth(moveOut.getMonth() + leaseDuration);
      const calculatedCheckOut = moveOut.toISOString().split('T')[0];

      const response = await GraphQLClient.execute<{
        checkAvailability: {
          available: boolean;
          unavailableDates: string[];
        };
      }>(checkAvailability, {
        propertyId: property.propertyId,
        checkInDate: moveInDate,
        checkOutDate: calculatedCheckOut,
      });

      if (response.checkAvailability.available) {
        setAvailabilityResult({
          available: true,
          moveOutDate: calculatedCheckOut,
          message: `Property is available for a ${leaseDuration}-month lease!`,
        });
      } else {
        // Find the next available date after the blocked period
        const unavailableDates = response.checkAvailability.unavailableDates.sort();
        const lastBlockedDate = unavailableDates[unavailableDates.length - 1];
        const nextAvailable = new Date(lastBlockedDate);
        nextAvailable.setDate(nextAvailable.getDate() + 1);
        const nextAvailableStr = nextAvailable.toISOString().split('T')[0];

        // Calculate new move-out date from next available date
        const newMoveOut = new Date(nextAvailable);
        newMoveOut.setMonth(newMoveOut.getMonth() + leaseDuration);
        const newMoveOutStr = newMoveOut.toISOString().split('T')[0];

        setAvailabilityResult({
          available: false,
          unavailableDates: response.checkAvailability.unavailableDates,
          moveOutDate: calculatedCheckOut,
          message: `Property is not available from ${moveInDate}. Next available move-in date is ${nextAvailableStr} for a ${leaseDuration}-month lease.`,
          suggestedMoveInDate: nextAvailableStr,
          suggestedMoveOutDate: newMoveOutStr,
        });
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityResult({
        available: false,
        message: 'Failed to check availability. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6 lg:sticky lg:top-24">
      {/* Title */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
          {property.title}
        </h1>
      </div>

      {/* Location */}
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>

        <div className="min-w-0">
          {street && (
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {toTitleCase(street)}
            </div>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {toTitleCase([ward, district, region].filter(Boolean).join(' • '))}
          </div>
        </div>
      </div>

      {/* Price */}
      {property?.pricing && (
        <div className="pt-2 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {formatPrice(
              property.pricing.monthlyRent,
              property.pricing.currency
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('propertyDetails.perMonth')}
          </div>
        </div>
      )}

      {/* Contact Information */}
      {(property.landlord || property.agent) && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {(property.landlord || property.agent)?.firstName} {(property.landlord || property.agent)?.lastName}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {property.landlord ? t('propertyDetails.propertyLandlord') : t('propertyDetails.propertyAgent')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Actions */}
      <div className="space-y-3">
        <button
          onClick={onContactAgent}
          disabled={isInitializingChat}
          className="w-full rounded-full bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-100 border-2 border-gray-900 dark:border-white text-white dark:text-gray-900 py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializingChat ? t('propertyDetails.startingChat') : t('propertyDetails.contactAgent')}
        </button>

        {/* WhatsApp Contact Button */}
        {(property?.landlord?.whatsappNumber || property?.agent?.whatsappNumber) && (
          <button
            onClick={() => {
              const whatsappNumber = property?.landlord?.whatsappNumber || property?.agent?.whatsappNumber;
              if (whatsappNumber) {
                const whatsappUrl = generateWhatsAppUrl(whatsappNumber, property.title, property.propertyId);
                window.open(whatsappUrl, '_blank');
              }
            }}
            className="w-full rounded-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 font-semibold transition flex items-center justify-center gap-2"
            title={t('propertyDetails.contactViaWhatsApp')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            {t('propertyDetails.whatsAppContact')}
          </button>
        )}
      </div>

      {/* Availability Checker - Collapsible */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowAvailabilityChecker(!showAvailabilityChecker)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Check Availability
          </h3>
          <svg
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${
              showAvailabilityChecker ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAvailabilityChecker && (
          <div className="mt-4 space-y-4">
            {/* Move-in Date */}
            <div>
              <CalendarDatePicker
                label="Move-in Date"
                value={moveInDate}
                onChange={setMoveInDate}
                min={today}
                placeholder="Select move-in date"
                blockedDates={blockedDates}
                disabled={isLoadingBlockedDates}
              />
              {isLoadingBlockedDates && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Loading availability...
                </p>
              )}
            </div>

            {/* Lease Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Lease Duration
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
              {moveInDate && availabilityResult?.moveOutDate && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Move-out: {new Date(availabilityResult.moveOutDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Check Button */}
            <button
              onClick={handleCheckAvailability}
              disabled={isChecking || !moveInDate}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {isChecking ? 'Checking...' : 'Check Availability'}
            </button>

            {/* Result */}
            {availabilityResult && (
              <div
                className={`p-4 rounded-lg ${
                  availabilityResult.available
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  {availabilityResult.available ? (
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
                      className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        availabilityResult.available
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-yellow-800 dark:text-yellow-200'
                      }`}
                    >
                      {availabilityResult.message}
                    </p>
                    {!availabilityResult.available && availabilityResult.suggestedMoveInDate && (
                      <button
                        onClick={() => setMoveInDate(availabilityResult.suggestedMoveInDate!)}
                        className="mt-3 text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 underline"
                      >
                        Try {new Date(availabilityResult.suggestedMoveInDate).toLocaleDateString()} instead
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}