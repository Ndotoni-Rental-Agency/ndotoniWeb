'use client';

import SimpleSearchBar from '@/components/ui/SimpleSearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';
import { HousingRequestModal } from '@/components/housing/HousingRequestModal';
import Image from 'next/image';

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
 * Full-bleed hero image with overlay text, search bar front-and-center,
 * and inline action buttons (WhatsApp + Housing Request) replacing floaters.
 */
export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { t } = useLanguage();
  const { isOpen, openModal, closeModal, titleId } = useHousingRequestModal();

  return (
    <>
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="https://d3qiuw9agheakm.cloudfront.net/image/28214330-80c1-7048-64a8-0e745f9e5c39/dgyZmIWNX3kA-hero3.jpg"
          alt=""
          fill
          priority
          unoptimized
          className="object-cover object-center"
        />
        {/* Green-tinted overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-brand-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-800/40 via-transparent to-transparent" />
      </div>

      {/* Decorative "+" crosses */}
      <span className="absolute top-8 right-8 text-white/30 text-sm select-none hidden sm:block">+</span>
      <span className="absolute top-20 left-[10%] text-white/20 text-xs select-none hidden sm:block">+</span>
      <span className="absolute bottom-28 right-[15%] text-white/20 text-xs select-none hidden lg:block">+</span>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="max-w-2xl">
          {/* Tagline */}
          <p className="text-brand-300 text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4">
            {t('hero.tagline')}
          </p>

          {/* Headline */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] mb-4 sm:mb-5">
            {t('hero.titleBefore')}{' '}
            <span className="text-brand-300">{t('hero.titleHighlight')}</span>{' '}
            {t('hero.titleAfter')}
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg leading-relaxed mb-6 sm:mb-8">
            {t('hero.subtitle')}
          </p>

          {/* SEARCH BAR — prominent */}
          <div className="max-w-xl">
            <SimpleSearchBar variant="hero" />
          </div>

          {/* Action buttons — side by side, same size */}
          <div className="flex items-center gap-2 sm:gap-3 mt-5 sm:mt-6">
            {/* WhatsApp button */}
            <a
              href="https://wa.me/255790720329?text=Habari%2C%20natafuta%20nyumba%20Dar%20es%20salaam"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 sm:px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shadow-sm flex-1 sm:flex-none"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              {t('hero.sendWhatsApp')}
            </a>

            {/* Housing request button */}
            <button
              type="button"
              onClick={openModal}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 sm:px-5 bg-white hover:bg-stone-50 text-ink-900 text-xs sm:text-sm font-bold rounded-full shadow-sm transition-colors flex-1 sm:flex-none"
            >
              {t('hero.cantFind')}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/60 mt-5 sm:mt-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              {t('homeAbout.trust.verified')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              {t('homeAbout.trust.acrossTanzania')}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              10,000+ {t('hero.stats.properties')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom green accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-500" />
    </section>

    {/* Housing Request Modal — rendered outside section to avoid stacking context issues */}
    <HousingRequestModal isOpen={isOpen} onClose={closeModal} titleId={titleId} />
    </>
  );
}
