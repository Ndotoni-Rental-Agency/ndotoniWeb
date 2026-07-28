'use client';

import Link from 'next/link';
import { Banknote, Sparkles, MapPin, Building, Landmark, GraduationCap, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickChip {
  id: string;
  labelEn: string;
  labelSw: string;
  href: string;
  icon: LucideIcon;
}

const quickChips: QuickChip[] = [
  {
    id: 'affordable',
    labelEn: 'Budget Friendly',
    labelSw: 'Bei Nafuu',
    href: '/search?region=DAR ES SALAAM&minPrice=50000&maxPrice=300000',
    icon: Banknote,
  },
  {
    id: 'premium',
    labelEn: 'Premium',
    labelSw: 'Za Kifahari',
    href: '/search?region=DAR ES SALAAM&minPrice=1000000&maxPrice=5000000',
    icon: Sparkles,
  },
  {
    id: 'kinondoni',
    labelEn: 'Kinondoni',
    labelSw: 'Kinondoni',
    href: '/search?region=DAR ES SALAAM&district=KINONDONI',
    icon: MapPin,
  },
  {
    id: 'ilala',
    labelEn: 'Ilala',
    labelSw: 'Ilala',
    href: '/search?region=DAR ES SALAAM&district=ILALA',
    icon: Building,
  },
  {
    id: 'temeke',
    labelEn: 'Temeke',
    labelSw: 'Temeke',
    href: '/search?region=DAR ES SALAAM&district=TEMEKE',
    icon: Landmark,
  },
  {
    id: 'ubungo',
    labelEn: 'Ubungo',
    labelSw: 'Ubungo',
    href: '/search?region=DAR ES SALAAM&district=UBUNGO',
    icon: GraduationCap,
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
          <chip.icon className="w-4 h-4" aria-hidden="true" />
          <span>{language === 'sw' ? chip.labelSw : chip.labelEn}</span>
        </Link>
      ))}
    </div>
  );
}
