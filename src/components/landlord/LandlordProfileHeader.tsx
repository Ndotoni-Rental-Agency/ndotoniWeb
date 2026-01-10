'use client';

import React from 'react';
import { Landlord } from '@/API';

interface LandlordProfileHeaderProps {
  landlord: Landlord;
  propertyCount: number;
  loading?: boolean;
}

export default function LandlordProfileHeader({ 
  landlord, 
  propertyCount, 
  loading = false 
}: LandlordProfileHeaderProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
          </div>
          <div className="text-right">
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 transition-colors">
      <div className="flex items-center space-x-6">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {landlord.profileImage ? (
            <img
              src={landlord.profileImage}
              alt={`${landlord.firstName} ${landlord.lastName}`}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {landlord.firstName?.[0]}{landlord.lastName?.[0]}
              </span>
            </div>
          )}
        </div>

        {/* Landlord Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {landlord.businessName || `${landlord.firstName} ${landlord.lastName}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Property Owner
          </p>
          {landlord.businessName && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {landlord.firstName} {landlord.lastName}
            </p>
          )}
          
          {/* Verification Badge */}
          {landlord.isEmailVerified && (
            <div className="flex items-center mt-2">
              <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-600 dark:text-green-400">Verified</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {propertyCount}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {propertyCount === 1 ? 'Property' : 'Properties'}
          </div>
        </div>
      </div>
    </div>
  );
}