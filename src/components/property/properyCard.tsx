'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { Heart, MapPin, Tag } from 'lucide-react';

interface PropertyCardProps {
  property: PropertyCardType;
  isFavorited?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
}

export default function PropertyCard({
  property,
  isFavorited,
  onFavoriteToggle,
}: PropertyCardProps) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/property/${property.propertyId}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="
      group 
      cursor-pointer 
      rounded-xl 
      overflow-hidden 
      focus:outline-none 
      focus:ring-2 
      focus:ring-black/20
      focus:outline-none 
      focus:ring-0 
      "
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleNavigate();
      }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <Image
          src={property.thumbnail || '/placeholder.jpg'}
          alt={`${property.district}, ${property.region}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(property.propertyId);
            }}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow-sm hover:scale-110 transition"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited
                  ? 'fill-rose-500 stroke-rose-500'
                  : 'stroke-gray-700'
              }`}
            />
          </button>
        )}
      </div>

      {/* Text */}
      <div className="p-2 space-y-1">
        {/* Location with pin icon */}
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-rose-500 flex-shrink-0" />
          <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
            {property.district}, {property.region}
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-1">
          <Tag className="h-3 w-3 text-rose-500 flex-shrink-0" />
          <p className="text-black-500 dark:text-white text-sm font-medium truncate">
            Tshs. {property.monthlyRent}{' '}
            <span className="font-normal text-gray-500">per month</span>
          </p>
        </div>
      </div>
    </div>
  );
}
