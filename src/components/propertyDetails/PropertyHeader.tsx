'use client';

import { KangaBand } from '@/components/ui/KangaBand';
import { MapPin } from 'lucide-react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { toTitleCase, formatCurrency } from '@/lib/utils/common';
import VerifiedPropertyBadge from '@/components/property/VerifiedPropertyBadge';

export function PropertyHeader({ property }: { property: Property }) {
  const { t, language } = useLanguage();
  const sw = language === 'sw';
  const { street, ward, district, region } = property.address ?? {};
  const area = [ward, district, region].filter(Boolean).join(', ');

  return (
    <header className="relative flex h-full flex-col justify-center overflow-hidden rounded-3xl bg-brand-900 p-6 text-white sm:p-8">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
        {sw ? 'PATA MAKAZI YAKO' : 'FIND YOUR PLACE'}
      </p>
      <h1
        className="max-w-4xl font-poster text-3xl font-bold leading-[1.02] tracking-[-0.03em] text-white text-balance sm:text-5xl lg:text-[2.65rem]"
        style={{ fontStretch: '90%' }}
      >
        {property.title}
      </h1>
      {(street || area) && (
        <p className="mt-3 flex items-start gap-2 text-base text-white/75">
          <MapPin
            size={18}
            strokeWidth={2.25}
            className="mt-0.5 shrink-0 text-white"
            aria-hidden="true"
          />
          <span>
            {street && (
              <span className="font-semibold">{toTitleCase(street)}, </span>
            )}
            {toTitleCase(area)}
          </span>
        </p>
      )}
      {property.verified && (
        <div className="mt-4">
          <VerifiedPropertyBadge verified size="md" />
        </div>
      )}
      {property.pricing && (
        <div className="mt-7 border-t border-white/15 pt-5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/70">
            {sw ? 'Kodi ya kila mwezi' : 'Monthly rent'}
          </p>
          <p className="mt-1 font-poster text-3xl font-bold tracking-tight text-white">
            {formatCurrency(
              property.pricing.monthlyRent,
              property.pricing.currency,
            )}
          </p>
        </div>
      )}
      <KangaBand variant="thin" className="mt-8 w-28 bg-transparent" />
    </header>
  );
}
