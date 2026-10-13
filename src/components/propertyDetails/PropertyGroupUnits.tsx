'use client';

import { ProxiedImg } from '@/components/property/ProxiedImg';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/utils/common';
import Link from 'next/link';
import { GraphQLClient } from '@/lib/graphql-client';
import { getLongTermPropertyGroupUnits } from '@/graphql/queries';

interface GroupUnit {
  propertyId: string;
  unitLabel: string | null;
  title: string;
  media?: { images?: string[] | null } | null;
  pricing?: { monthlyRent: number; currency: string } | null;
  specifications?: {
    bedrooms?: number | null;
    bathrooms?: number | null;
  } | null;
}

interface Props {
  groupId: string;
  currentPropertyId: string;
}

/** Lets a guest browsing one unit of an apartment complex see and switch to its sibling units. */
export function PropertyGroupUnits({ groupId, currentPropertyId }: Props) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [units, setUnits] = useState<GroupUnit[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await GraphQLClient.executePublic<{
          getLongTermPropertyGroupUnits: { properties: GroupUnit[] };
        }>(getLongTermPropertyGroupUnits, { groupId });
        if (!cancelled)
          setUnits(data.getLongTermPropertyGroupUnits?.properties || []);
      } catch (err) {
        console.error('Failed to load other units at this property:', err);
        if (!cancelled) setUnits([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  if (!units || units.length < 2) return null;

  return (
    <section className="border-t border-stone-200 dark:border-gray-700 pt-10">
      <div className="mb-6">
        <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-white transition-colors">
          {sw ? 'Nyumba nyingine hapa' : 'Other units at this property'}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {units.map((unit) => {
          const isCurrent = unit.propertyId === currentPropertyId;
          const thumbnail = unit.media?.images?.[0];
          const card = (
            <div
              className={`flex gap-3 rounded-2xl border p-3 transition-colors ${
                isCurrent
                  ? 'border-brand-700 dark:border-brand-300 bg-cream-100 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-700 dark:hover:border-brand-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                {thumbnail && (
                  <ProxiedImg
                    src={thumbnail}
                    width={240}
                    alt={unit.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {unit.unitLabel || unit.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {unit.pricing &&
                    `${formatCurrency(unit.pricing.monthlyRent, unit.pricing.currency)} / ${sw ? 'mwezi' : 'month'}`}
                  {unit.specifications?.bedrooms
                    ? ` · ${unit.specifications.bedrooms} ${sw ? 'vyumba' : 'bed'}`
                    : ''}
                </p>
                {isCurrent && (
                  <p className="text-xs font-medium text-brand-700 dark:text-brand-300 mt-1">
                    {sw ? 'Unayotazama sasa' : 'Currently viewing'}
                  </p>
                )}
              </div>
            </div>
          );

          return isCurrent ? (
            <div key={unit.propertyId}>{card}</div>
          ) : (
            <Link key={unit.propertyId} href={`/property/${unit.propertyId}`}>
              {card}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
