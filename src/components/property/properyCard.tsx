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
      className="group cursor-pointer focus:outline-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleNavigate();
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-stone-100 transition-all duration-300 md:group-hover:shadow-editorial md:group-hover:scale-[1.02]">
        <Image
          src={property.thumbnail || '/placeholder-property.svg'}
          alt={`${property.district}, ${property.region}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover"
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
            className="absolute top-2 right-2 sm:top-3 sm:right-3 rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-soft hover:scale-110 active:scale-95 transition-transform"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                isFavorited ? 'fill-brand-500 stroke-brand-500' : 'stroke-ink-700'
              }`}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Card info */}
      <div className="pt-2.5 sm:pt-3 space-y-0.5">
        {/* Title — hidden on mobile for cleaner look */}
        {property.title && (
          <h3 className="text-ink-900 dark:text-white text-sm sm:text-[15px] font-bold leading-snug line-clamp-1 hidden sm:block">
            {property.title}
          </h3>
        )}

        {/* Location */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-brand-500 flex-shrink-0" strokeWidth={2.5} />
          <p className="text-ink-700 dark:text-gray-200 text-xs sm:text-sm leading-snug min-w-0 truncate">
            <span className="font-semibold">{toTitleCase(property.district)}</span>
            <span className="text-ink-400">, {toTitleCase(property.region)}</span>
          </p>
        </div>

        {/* Price + label together */}
        <p className="text-ink-900 dark:text-white text-xs sm:text-sm">
          <span className="font-bold">
            {formatCurrency(property.monthlyRent, property.currency)}
          </span>
          <span className="text-ink-400 font-normal"> / {label}</span>
        </p>
      </div>
    </div>
  );
}
