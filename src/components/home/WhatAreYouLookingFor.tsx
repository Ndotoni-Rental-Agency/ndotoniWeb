'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Building2, KeyRound, LayoutGrid, Banknote, Sparkles, ArrowRight } from 'lucide-react';
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
    id: 'premium',
    titleEn: 'Premium',
    titleSw: 'Za Kifahari',
    descriptionEn: 'Luxury homes from TZS 1M/month',
    descriptionSw: 'Nyumba za kifahari kuanzia TZS 1M/mwezi',
    icon: Sparkles,
    href: '/search?region=DAR ES SALAAM&minPrice=1000000&maxPrice=5000000',
    gradient: 'from-brand-500 to-brand-600',
    iconColor: 'text-brand-500',
  },
];

export function WhatAreYouLookingFor() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 border-t border-stone-200/70 dark:border-gray-800">
      <div className="mb-8 sm:mb-10">
        <h2 className="poster-heading">
          {language === 'sw' ? 'Unatafuta nini?' : 'What are you looking for?'}
        </h2>
        <p className="mt-2 text-ink-500 dark:text-gray-400 text-base sm:text-lg max-w-xl">
          {language === 'sw'
            ? 'Kila nafasi ina madhumuni yake. Pata yako.'
            : 'Every space has a purpose. Find yours.'}
        </p>
      </div>

      <ul className="grid grid-cols-1 border-t-2 border-ink-900 sm:grid-cols-2 sm:gap-x-10 dark:border-white">
        {searchCategories.map((category) => {
          const Icon = category.icon;
          const title = language === 'sw' ? category.titleSw : category.titleEn;
          const description = language === 'sw' ? category.descriptionSw : category.descriptionEn;

          return (
            <li key={category.id} className="border-b border-stone-200 dark:border-gray-700">
              <Link
                href={category.href}
                className="group flex min-h-[5.5rem] items-center gap-4 py-4 transition-colors hover:bg-brand-50 sm:px-3 dark:hover:bg-gray-800"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-sand-300 transition-transform duration-300 ease-out group-hover:-rotate-6 dark:bg-white dark:text-ink-900">
                  <Icon size={21} strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-poster text-xl sm:text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-500 dark:text-gray-400 line-clamp-1">
                    {description}
                  </span>
                </span>
                <ArrowRight
                  size={22}
                  strokeWidth={2.5}
                  className="shrink-0 text-ink-900 transition-transform duration-300 ease-out group-hover:translate-x-1 dark:text-white"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
