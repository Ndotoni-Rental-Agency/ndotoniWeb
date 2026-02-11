'use client';

import React, { useState } from 'react';
import { generateWhatsAppUrl } from '@/lib/utils/whatsapp';
import { ShortTermProperty } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import ClickableDateInput from '@/components/ui/ClickableDateInput';

type Props = {
  property: ShortTermProperty;
  formatPrice: (n: number, c?: string) => string;
  onContactHost: () => void;
  isInitializingChat: boolean;
};

export default function ShortTermDetailsSidebar({
  property,
  formatPrice,
  onContactHost,
  isInitializingChat,
}: Props) {
  const { t } = useLanguage();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1; // Default to 1 night for display
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    
    const subtotal = property.nightlyRate * nights;
    const cleaningFee = property.cleaningFee || 0;
    const serviceFee = subtotal * ((property.serviceFeePercentage || 10) / 100);
    // Tax is included in the nightly rate, not added separately
    
    return subtotal + cleaningFee + serviceFee;
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (guests > (property.maxGuests || 1)) {
      alert(`Maximum ${property.maxGuests} guests allowed`);
      return;
    }
    
    // TODO: Implement booking flow
    alert('Booking functionality coming soon!');
  };

  const nights = calculateNights();
  const total = calculateTotal();
  const hasSelectedDates = checkIn && checkOut;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 space-y-6 sticky top-24">
      {/* Price Header */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatPrice(property.nightlyRate, property.currency)}
          </span>
          <span className="text-gray-600 dark:text-gray-400">per night</span>
        </div>
        {property.averageRating && property.averageRating > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-gray-900 dark:text-white">
                {property.averageRating.toFixed(1)}
              </span>
            </div>
            {property.ratingSummary?.totalReviews && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({property.ratingSummary.totalReviews} {property.ratingSummary.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Instruction Text */}
        {!hasSelectedDates && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Select your check-in and check-out dates to see availability and final pricing
              </p>
            </div>
          </div>
        )}

        {/* Check-in / Check-out */}
        <div className="grid grid-cols-2 gap-3">
          <ClickableDateInput
            label="Check-in"
            value={checkIn}
            onChange={setCheckIn}
            min={new Date().toISOString().split('T')[0]}
            placeholder="Add date"
          />
          <ClickableDateInput
            label="Check-out"
            value={checkOut}
            onChange={setCheckOut}
            min={checkIn || new Date().toISOString().split('T')[0]}
            placeholder="Add date"
          />
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {Array.from({ length: property.maxGuests || 1 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        {/* Price Breakdown - Always visible */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {formatPrice(property.nightlyRate, property.currency)} × {nights} {nights === 1 ? 'night' : 'nights'}
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatPrice(property.nightlyRate * nights, property.currency)}
            </span>
          </div>
          {property.cleaningFee && property.cleaningFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Cleaning fee</span>
              <span className="text-gray-900 dark:text-white">
                {formatPrice(property.cleaningFee, property.currency)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Service fee</span>
            <span className="text-gray-900 dark:text-white">
              {formatPrice((property.nightlyRate * nights) * ((property.serviceFeePercentage || 10) / 100), property.currency)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 font-semibold">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">
              {formatPrice(total, property.currency)}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            Prices include all applicable taxes
          </p>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!hasSelectedDates}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 font-semibold transition"
        >
          {hasSelectedDates ? 'Reserve' : 'Check availability'}
        </button>

        {hasSelectedDates && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            You won't be charged yet
          </p>
        )}
      </div>

      {/* Contact Host */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        {property.host && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {property.host.firstName[0]}{property.host.lastName[0]}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {property.host.firstName} {property.host.lastName}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Host
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onContactHost}
          disabled={isInitializingChat}
          className="w-full rounded-lg border-2 border-gray-900 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-3 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isInitializingChat ? 'Starting chat...' : 'Contact Host'}
        </button>

        {/* WhatsApp Contact Button */}
        {property.host?.whatsappNumber && (
          <button
            onClick={() => {
              const whatsappUrl = generateWhatsAppUrl(
                property.host!.whatsappNumber!,
                property.title,
                property.propertyId
              );
              window.open(whatsappUrl, '_blank');
            }}
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white py-3 font-semibold transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp Host
          </button>
        )}
      </div>
    </div>
  );
}
