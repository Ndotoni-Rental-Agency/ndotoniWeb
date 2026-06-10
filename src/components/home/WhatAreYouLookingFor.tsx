'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Building2, KeyRound, LayoutGrid, MapPin, Banknote } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SearchCategory {
  id: string;
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
  iconColor: string;
}

const searchCategories: SearchCategory[] = [
  {
    id: 'apartments',
    titleEn: 'Apartments',
    titleSw: 'Apartments',
    descriptionEn: 'Modern flats in convenient locations',
    descriptionSw: 'Nyumba za kisasa katika maeneo mazuri',
    icon: Building2,
    href: '/search?region=DAR ES SALAAM&propertyType=APARTMENT',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
  {
    id: 'houses',
    titleEn: 'Houses',
    titleSw: 'Nyumba',
    descriptionEn: 'Standalone homes for families',
    descriptionSw: 'Nyumba za familia',
    icon: Home,
    href: '/search?region=DAR ES SALAAM&propertyType=HOUSE',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
  {
    id: 'rooms',
    titleEn: 'Single Rooms',
    titleSw: 'Vyumba',
    descriptionEn: 'Affordable rooms for individuals',
    descriptionSw: 'Vyumba vya bei nafuu',
    icon: KeyRound,
    href: '/search?region=DAR ES SALAAM&propertyType=ROOM',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
  {
    id: 'studios',
    titleEn: 'Studios',
    titleSw: 'Studio',
    descriptionEn: 'Compact spaces for young professionals',
    descriptionSw: 'Nafasi ndogo kwa vijana wa kazi',
    icon: LayoutGrid,
    href: '/search?region=DAR ES SALAAM&propertyType=STUDIO',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
  {
    id: 'cheap',
    titleEn: 'Budget Friendly',
    titleSw: 'Bei Nafuu',
    descriptionEn: 'Quality homes under TZS 300K/month',
    descriptionSw: 'Nyumba nzuri chini ya TZS 300K/mwezi',
    icon: Banknote,
    href: '/search?region=DAR ES SALAAM&minPrice=50000&maxPrice=300000',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
  {
    id: 'kinondoni',
    titleEn: 'Kinondoni',
    titleSw: 'Kinondoni',
    descriptionEn: 'Popular residential area in Dar',
    descriptionSw: 'Eneo maarufu la makazi Dar',
    icon: MapPin,
    href: '/search?region=DAR ES SALAAM&district=KINONDONI',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
];

export function WhatAreYouLookingFor() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20">
      <div className="text-center mb-10 sm:mb-12">
        <p className="text-sm font-bold tracking-wide uppercase text-brand-500 mb-3">
          {language === 'sw' ? 'Chagua aina' : 'Browse by category'}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink-900 dark:text-white">
          {language === 'sw' ? 'Unatafuta nini?' : 'What are you looking for?'}
        </h2>
        <p className="mt-4 text-ink-500 dark:text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
          {language === 'sw'
            ? 'Kila nafasi ina madhumuni yake. Pata yako.'
            : 'Every space has a purpose. Find yours.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {searchCategories.map((category) => {
          const Icon = category.icon;
          const title = language === 'sw' ? category.titleSw : category.titleEn;
          const description = language === 'sw' ? category.descriptionSw : category.descriptionEn;

          return (
            <Link
              key={category.id}
              href={category.href}
              className="group relative flex items-start gap-4 p-5 sm:p-6 rounded-2xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-sm`}>
                <Icon size={22} className="text-white" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-ink-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {title}
                </h3>
                <p className="mt-1 text-sm text-ink-500 dark:text-gray-400 line-clamp-2">
                  {description}
                </p>
              </div>
              <svg
                className="flex-shrink-0 w-5 h-5 text-ink-300 dark:text-gray-500 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
