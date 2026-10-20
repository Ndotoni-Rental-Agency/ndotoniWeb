'use client';

import { MapPin } from 'lucide-react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import { toTitleCase, formatCurrency } from '@/lib/utils/common';
import VerifiedPropertyBadge from '@/components/property/VerifiedPropertyBadge';
import design from '@/components/design/Brand.module.css';

export function PropertyHeader({ property }: { property: Property }) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const { street, ward, district, region } = property.address ?? {};
  const area = [ward, district, region].filter(Boolean).join(', ');

  return (
    <header className={design.propertyHeading}>
      <div className="min-w-0">
        <div className={design.propertyMeta}>
          <p className={design.eyebrow}>{sw ? 'MAKAZI YA MUDA MREFU' : 'LONG-TERM HOME'}</p>
          {property.verified && <VerifiedPropertyBadge verified size="md" />}
        </div>
        <h1 className={design.title}>{property.title}</h1>
        {(street || area) && (
          <p className={design.propertyLocation}>
            <MapPin size={17} className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
            <span>{street && <span>{toTitleCase(street)}, </span>}{toTitleCase(area)}</span>
          </p>
        )}
      </div>
      {property.pricing && (
        <div className={design.rentSummary}>
          <p>{sw ? 'Kodi ya kila mwezi' : 'Monthly rent'}</p>
          <p>{formatCurrency(property.pricing.monthlyRent, property.pricing.currency)}</p>
        </div>
      )}
    </header>
  );
}
