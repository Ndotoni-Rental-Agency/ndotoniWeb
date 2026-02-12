'use client';

import React from 'react';
import { ShortTermProperty } from '@/API';

interface ShortTermPropertyFeaturesProps {
  property: ShortTermProperty;
}

export function ShortTermPropertyFeatures({ property }: ShortTermPropertyFeaturesProps) {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Max Guests',
      value: property.maxGuests || 0,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Property Type',
      value: property.propertyType,
    },
  ];

  // House rules
  const houseRules = [
    { label: 'Pets Allowed', value: property.allowsPets, icon: '🐾' },
    { label: 'Children Allowed', value: property.allowsChildren, icon: '👶' },
    { label: 'Infants Allowed', value: property.allowsInfants, icon: '🍼' },
    { label: 'Smoking Allowed', value: property.allowsSmoking, icon: '🚬' },
  ].filter(rule => rule.value !== undefined);

  // Check-in/out times
  const hasCheckInOut = property.checkInTime || property.checkOutTime;

  return (
    <section className="border-t border-gray-200 dark:border-gray-700 pt-8">

      {/* Main Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="text-emerald-600 dark:text-emerald-400 mb-2">
              {feature.icon}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {feature.label}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
              {feature.value}
            </p>
          </div>
        ))}
      </div>

      {/* Check-in/out Times */}
      {hasCheckInOut && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Check-in & Check-out
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {property.checkInTime && (
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.checkInTime}</p>
                </div>
              </div>
            )}
            {property.checkOutTime && (
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{property.checkOutTime}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* House Rules */}
      {houseRules.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            House Rules
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {houseRules.map((rule, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-3 rounded-lg border ${
                  rule.value
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <span className="text-xl">{rule.icon}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    rule.value
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {rule.label}
                  </p>
                  <p className={`text-xs ${
                    rule.value
                      ? 'text-emerald-600 dark:text-emerald-500'
                      : 'text-red-600 dark:text-red-500'
                  }`}>
                    {rule.value ? 'Allowed' : 'Not allowed'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instant Book Badge */}
      {property.instantBookEnabled && (
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Instant Book Available</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Book this property instantly without waiting for host approval</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
