'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { Heart, MapPin } from 'lucide-react';
import { formatter, toTitleCase } from '@/lib/utils/common';

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
  priceLabel = 'per month',
  urlPath = '/property/',
}: PropertyCardProps) {
  const router = useRouter();

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
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-soft transition-shadow duration-300 md:group-hover:shadow-editorial">
        <Image
          src={property.thumbnail || '/placeholder-property.svg'}
          alt={`${property.district}, ${property.region}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16.666vw"
          className="object-cover transition-transform duration-500 md:group-hover:scale-[1.04]"
        />

        {/* Subtle bottom vignette for legibility if any badges land here later */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 via-transparent to-transparent pointer-events-none" />

        {/* Favorite */}
        {onFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(property.propertyId);
            }}
            className="absolute top-2.5 right-2.5 rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-soft hover:scale-110 transition-transform"
            aria-label="Toggle favorite"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited ? 'fill-brand-600 stroke-brand-600' : 'stroke-ink-700'
              }`}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* Text */}
      <div className="pt-3 px-0.5 space-y-1">
        {property.title && (
          <h3 className="text-ink-900 dark:text-white text-[15px] font-semibold leading-snug line-clamp-1 hidden sm:block">
            {property.title}
          </h3>
        )}

        <div className="flex items-start gap-1.5 min-w-0">
          <MapPin className="h-3.5 w-3.5 text-brand-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-ink-700 dark:text-gray-200 text-sm leading-snug min-w-0">
            <span className="font-medium">{toTitleCase(property.district)}</span>
            <span className="text-ink-500 dark:text-gray-400">, {toTitleCase(property.region)}</span>
          </p>
        </div>

        <div className="pt-0.5">
          <p className="text-ink-900 dark:text-white text-sm">
            <span className="font-semibold whitespace-nowrap">
              Tshs. {formatter.format(property.monthlyRent)}
            </span>
            <span className="text-ink-500 dark:text-gray-400 text-xs ml-1 whitespace-nowrap">
              {priceLabel}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
