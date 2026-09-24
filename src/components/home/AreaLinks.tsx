'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AREAS = [
  { name: 'Kinondoni', district: 'KINONDONI' },
  { name: 'Ilala', district: 'ILALA' },
  { name: 'Temeke', district: 'TEMEKE' },
  { name: 'Ubungo', district: 'UBUNGO' },
  { name: 'Kigamboni', district: 'KIGAMBONI' },
];

export function AreaLinks() {
  const { t } = useLanguage();

  return (
    <section className="py-8 sm:py-10" aria-labelledby="areas-title">
      <h2 id="areas-title" className="font-display text-2xl sm:text-3xl tracking-tight text-ink-900 dark:text-white mb-4">
        {t('home.areasTitle')}
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {AREAS.map((area) => (
          <li key={area.district}>
            <Link
              href={`/search?region=DAR%20ES%20SALAAM&district=${area.district}`}
              className="flex items-center justify-between min-h-12 px-4 rounded-xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base font-semibold text-ink-900 dark:text-white hover:border-brand-500 transition-colors"
            >
              {area.name}
              <ChevronRight className="w-4 h-4 text-ink-500" aria-hidden />
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/search?region=DAR%20ES%20SALAAM"
            className="flex items-center justify-between min-h-12 px-4 rounded-xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-base font-semibold text-ink-900 dark:text-white hover:border-brand-500 transition-colors"
          >
            {t('home.allDar')}
            <ChevronRight className="w-4 h-4 text-ink-500" aria-hidden />
          </Link>
        </li>
      </ul>
    </section>
  );
}
