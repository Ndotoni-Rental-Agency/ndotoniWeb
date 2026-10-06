'use client';

import { MapPin } from 'lucide-react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { toTitleCase } from '@/lib/utils/common';
import VerifiedPropertyBadge from '@/components/property/VerifiedPropertyBadge';

export function PropertyHeader({ property }: { property: Property }) {
  const { t, language } = useLanguage();
  const sw = language === 'sw';
  const { street, ward, district, region } = property.address ?? {};
  const bedrooms = property.specifications?.bedrooms ?? 0;
  const bathrooms = property.specifications?.bathrooms ?? 0;

  const facts = [
    property.propertyType
      ? t(`properties.propertyTypes.${property.propertyType.toLowerCase()}`)
      : null,
    bedrooms > 0 ? `${bedrooms} ${t(bedrooms === 1 ? 'properties.bed' : 'properties.beds')}` : null,
    bathrooms > 0 ? `${bathrooms} ${sw ? 'bafu' : bathrooms === 1 ? 'bath' : 'baths'}` : null,
  ].filter(Boolean) as string[];

  const area = [ward, district, region].filter(Boolean).join(', ');

  return (
    <header>
      <h1
        className="max-w-4xl font-poster text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] text-ink-900 text-balance sm:text-5xl dark:text-white"
        style={{ fontStretch: '90%' }}
      >
        {property.title}
      </h1>
      {(street || area) && (
        <p className="mt-3 flex items-start gap-2 text-base text-ink-700 dark:text-gray-300">
          <MapPin size={18} strokeWidth={2.25} className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
          <span>
            {street && <span className="font-semibold">{toTitleCase(street)}, </span>}
            {toTitleCase(area)}
          </span>
        </p>
      )}
      {(facts.length > 0 || property.verified) && (
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {facts.map((fact) => (
            <li
              key={fact}
              className="rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {fact}
            </li>
          ))}
          {property.verified && (
            <li>
              <VerifiedPropertyBadge verified size="md" />
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
