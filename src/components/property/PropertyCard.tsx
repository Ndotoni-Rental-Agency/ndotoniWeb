'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard as PropertyCardType } from '@/types';
import { Button } from '@/design-system/components/Button';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: PropertyCardType;
  className?: string;
  showFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  className,
  showFavorite = true,
  onFavoriteToggle,
  isFavorited = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(property.propertyId);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      APARTMENT: 'Apartment',
      HOUSE: 'House',
      STUDIO: 'Studio',
      ROOM: 'Room',
      COMMERCIAL: 'Commercial',
      LAND: 'Land',
    };
    return labels[type as keyof typeof labels] || type;
  };



  return (
    <Link href={`/property/${property.propertyId}`} className="block">
      <div className={cn('group cursor-pointer h-full flex flex-col', className)}>
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors">
          {!imageError && property.thumbnail ? (
            <Image
              src={property.thumbnail}
              alt={property.title}
              fill
              className={cn(
                'object-cover transition-all duration-300 md:group-hover:scale-105',
                isImageLoading && 'blur-sm'
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          

          
          {/* Favorite button */}
          {showFavorite && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-200',
                'opacity-100 md:opacity-0 md:group-hover:opacity-100'
              )}
              onClick={handleFavoriteClick}
            >
              <svg 
                className={cn(
                  'w-5 h-5 transition-colors',
                  isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                )} 
                fill={isFavorited ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          )}
          
          {/* Loading overlay */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse transition-colors" />
          )}
        </div>
        
        {/* Content */}
        <div className="pt-3 flex flex-col flex-1">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {property.ward ? `${property.ward}, ` : ''}{property.district}, {property.region}
            </span>
          </div>
          
          {/* Title - Fixed height with line clamp */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3 min-h-[3rem] flex items-start">
            {property.title}
          </h3>
          
          {/* Property details - Fixed height */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[1.5rem] transition-colors">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {getPropertyTypeLabel(property.propertyType)}
            </span>
            
            {property.bedrooms && property.bedrooms > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                </svg>
                {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {/* Price - Push to bottom */}
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                  {formatCurrency(property.monthlyRent, property.currency)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 transition-colors">/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;