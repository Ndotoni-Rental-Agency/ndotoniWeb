'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { Heart, MapPin } from 'lucide-react';
import { formatCurrency, toTitleCase } from '@/lib/utils/common';
import { useLanguage } from '@/contexts/LanguageContext';
import VerifiedPropertyBadge from './VerifiedPropertyBadge';

interface PropertyCardProps {
  property: PropertyCardType;
  isFavorited?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  priceLabel?: string;
  urlPath?: string;
}

export default function PropertyCard({
  property,
  isFavorited,
  onFavoriteToggle,
  priceLabel,
  urlPath = '/property/',
}: PropertyCardProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const label = priceLabel || t('properties.perMonth');

  const handleNavigate = () => {
    router.push(`${urlPath}${property.propertyId}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer focus:outline-none rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-editorial hover:border-stone-200 dark:hover:border-gray-600"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleNavigate();
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-gray-700">
        <Image
          src={property.thumbnail || '/placeholder-property.svg'}
          alt={`${property.district}, ${property.region}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {property.verified && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <VerifiedPropertyBadge verified={property.verified} size="sm" />
          </div>
        )}

        {/* Favorite button */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(property.propertyId);
            }}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-transform"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? 'fill-brand-500 stroke-brand-500' : 'stroke-ink-700 dark:stroke-gray-200'
              }`}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Card content */}
      <div className="p-3 sm:p-4 space-y-1">
        {/* Title */}
        {property.title && (
          <h3 className="text-ink-900 dark:text-white text-sm font-semibold leading-snug line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {property.title}
          </h3>
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="h-3.5 w-3.5 text-brand-500 flex-shrink-0" strokeWidth={2.5} />
          <p className="text-ink-500 dark:text-gray-400 text-xs sm:text-sm leading-snug min-w-0 truncate">
            {toTitleCase(property.district)}, {toTitleCase(property.region)}
          </p>
        </div>

        {/* Price */}
        <p className="text-ink-900 dark:text-white text-sm pt-1">
          <span className="font-bold">
            {formatCurrency(property.monthlyRent, property.currency)}
          </span>
          <span className="text-ink-400 dark:text-gray-500 font-normal"> / {label}</span>
        </p>
      </div>
    </div>
  );
}
