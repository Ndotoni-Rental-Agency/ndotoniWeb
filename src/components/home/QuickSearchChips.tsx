'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickChip {
  id: string;
  labelEn: string;
  labelSw: string;
  href: string;
  emoji: string;
}

const quickChips: QuickChip[] = [
  {
    id: 'affordable',
    labelEn: 'Budget Friendly',
    labelSw: 'Bei Nafuu',
    href: '/search?region=DAR ES SALAAM&maxPrice=300000',
    emoji: '💰',
  },
  {
    id: 'premium',
    labelEn: 'Premium',
    labelSw: 'Za Kifahari',
    href: '/search?region=DAR ES SALAAM&minPrice=1000000',
    emoji: '✨',
  },
  {
    id: 'kinondoni',
    labelEn: 'Kinondoni',
    labelSw: 'Kinondoni',
    href: '/search?region=DAR ES SALAAM&district=KINONDONI',
    emoji: '📍',
  },
  {
    id: 'ilala',
    labelEn: 'Ilala',
    labelSw: 'Ilala',
    href: '/search?region=DAR ES SALAAM&district=ILALA',
    emoji: '🏙️',
  },
  {
    id: 'temeke',
    labelEn: 'Temeke',
    labelSw: 'Temeke',
    href: '/search?region=DAR ES SALAAM&district=TEMEKE',
    emoji: '🏘️',
  },
  {
    id: 'ubungo',
    labelEn: 'Ubungo',
    labelSw: 'Ubungo',
    href: '/search?region=DAR ES SALAAM&district=UBUNGO',
    emoji: '🎓',
  },
];

export function QuickSearchChips() {
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {quickChips.map((chip) => (
        <Link
          key={chip.id}
          href={chip.href}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-500 text-sm font-semibold text-ink-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="text-base" aria-hidden="true">{chip.emoji}</span>
          <span>{language === 'sw' ? chip.labelSw : chip.labelEn}</span>
        </Link>
      ))}
    </div>
  );
}
