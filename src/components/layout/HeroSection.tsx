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

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { t } = useLanguage();
  const { isOpen, openModal, closeModal, titleId } = useHousingRequestModal();

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://d3qiuw9agheakm.cloudfront.net/image/28214330-80c1-7048-64a8-0e745f9e5c39/dgyZmIWNX3kA-hero3.jpg"
            alt=""
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          {/* Dark overlay for text readability, lighter at edges to let image breathe */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 container py-16 sm:py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1] mb-5">
              {t('hero.titleBefore')}{' '}
              <span className="text-brand-300">{t('hero.titleHighlight')}</span>{' '}
              {t('hero.titleAfter')}
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-8">
              {t('hero.subtitle')}
            </p>

            {/* Search bar */}
            <div className="max-w-lg mx-auto mb-6">
              <SimpleSearchBar variant="hero" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-6">
              <a
                href="https://wa.me/255790720329?text=Habari%2C%20natafuta%20nyumba%20Dar%20es%20salaam"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-3.5 sm:h-10 sm:px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shadow-sm"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                {t('hero.sendWhatsApp')}
              </a>

              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center gap-1.5 h-9 px-3.5 sm:h-10 sm:px-5 bg-white/90 text-ink-700 text-xs sm:text-sm font-semibold rounded-full hover:bg-white transition-colors shadow-sm"
              >
                {t('hero.cantFind')}
              </button>
            </div>

            {/* Trust stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 mt-10 pt-8 border-t border-white/20">
              {(['properties', 'locations', 'support'] as const).map((key) => (
                <div key={key} className="text-center">
                  <p className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {key === 'properties' ? '1,000+' : key === 'locations' ? '25+' : '24/7'}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">{t(`hero.stats.${key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HousingRequestModal isOpen={isOpen} onClose={closeModal} titleId={titleId} />
    </>
  );
}
