'use client';

import SimpleSearchBar from '@/components/ui/SimpleSearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import heroImage from '/public/images/hero3.avif';

interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  priceSort?: 'asc' | 'desc';
}

interface HeroSectionProps {
  onSearch: (filters: PropertyFilters) => void;
}

/**
 * Warm editorial hero: bold display headline, supporting copy,
 * and a focused search bar over a softened image with a warm wash.
 */
export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative isolate bg-cream-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 pb-8 sm:pb-12">
        <div className="relative overflow-hidden rounded-3xl shadow-editorial">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="A warm, lived-in home interior"
              fill
              priority
              quality={80}
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1200px"
              placeholder="blur"
            />
            {/* Warm editorial wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900/70 via-ink-900/45 to-brand-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
          </div>

          {/* Soft accent shapes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-16 w-72 h-72 bg-sand-400/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-10 w-96 h-96 bg-clay-500/15 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-5 sm:px-10 lg:px-16 py-12 sm:py-20 lg:py-28">
            <div className="max-w-3xl">
              <p className="eyebrow text-brand-300 mb-4 sm:mb-5 animate-fade-in-up-hero">
                <span className="inline-block w-6 h-px bg-sand-200/80" />
                Ndotoni · Tanzania
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-cream-50 text-balance leading-[1.05] animate-fade-in-up-hero">
                {t('hero.titleBefore')}{' '}
                <span className="italic text-brand-300">{t('hero.titleHighlight')}</span>{' '}
                {t('hero.titleAfter')}
              </h1>
              <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-cream-100/90 max-w-2xl leading-relaxed animate-fade-in-up-hero">
                {t('hero.subtitle')}
              </p>
            </div>

            {/* Search */}
            <div className="mt-8 sm:mt-12 max-w-4xl animate-fade-in-up-hero">
              <SimpleSearchBar variant="hero" />
            </div>

            {/* Trust strip */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-cream-100/80 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>Verified listings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>Across Tanzania</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>Long & short stays</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
