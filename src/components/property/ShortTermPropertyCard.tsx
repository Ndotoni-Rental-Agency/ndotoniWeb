'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShortTermProperty } from '@/API';
import { formatCurrency, cn } from '@/lib/utils/common';

interface ShortTermPropertyCardProps {
  property: ShortTermProperty;
  className?: string;
}

const ShortTermPropertyCard: React.FC<ShortTermPropertyCardProps> = memo(
  ({ property, className }) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const thumbnail = property.thumbnail || property.images?.[0]?.url;

    return (
      <Link
        href={`/short-property/${property.propertyId}`}
        className={cn(
          'group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow',
          className
        )}
      >
        {/* Image */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
          {!imageError && thumbnail ? (
            <Image
              src={thumbnail}
              alt={property.title}
              fill
              className={cn(
                'object-cover transition group-hover:scale-105',
                isImageLoading && 'blur-sm'
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
              quality={60}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          )}
          {isImageLoading && thumbnail && (
            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {property.district}, {property.region}
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {property.propertyType} • {property.maxGuests || 0} guests
          </div>

          {property.averageRating && property.averageRating > 0 && (
            <div className="flex items-center gap-1 text-sm mb-2">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-gray-900 dark:text-white">
                {property.averageRating.toFixed(1)}
              </span>
              {property.ratingSummary?.totalReviews && (
                <span className="text-gray-500 dark:text-gray-400">
                  ({property.ratingSummary.totalReviews})
                </span>
              )}
            </div>
          )}

          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatCurrency(property.nightlyRate || 0, property.currency || 'TZS')}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">/ night</span>
          </div>
        </div>
      </Link>
    );
  }
);

ShortTermPropertyCard.displayName = 'ShortTermPropertyCard';
export default ShortTermPropertyCard;
