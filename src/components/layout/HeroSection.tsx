'use client';

import SearchBar from '@/components/ui/SearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

// Define PropertyFilters interface here since it's frontend-specific
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
 * Airbnb/Zillow-inspired Hero Section
 * Clean, focused design that immediately communicates: "Find your home here"
 */
export default function HeroSection({ onSearch }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-[350px] md:min-h-[450px] lg:min-h-[500px] flex items-center overflow-visible">
      {/* Background Image - Cozy bedroom scene */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop"
          alt="Cozy bedroom - your perfect home awaits"
          fill
          priority
          quality={75}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        {/* Warm gradient overlay for better text readability and cozy feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/60 via-slate-900/50 to-blue-900/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Animated accent elements for depth */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline - Warm and Inviting */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-3 leading-tight animate-fade-in-up drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {t('hero.titleBefore')}{' '}
              <span className="text-red-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {t('hero.titleHighlight')}
              </span>{' '}
              {t('hero.titleAfter')}
            </h1>
            
            {/* Subheadline - Simple and Direct */}
            <p className="text-xl sm:text-2xl text-white mb-4 sm:mb-6 font-bold max-w-xl mx-auto animate-fade-in-up drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ animationDelay: '0.1s' }}>
              {t('hero.subtitle')}
            </p>

            {/* Large Prominent Search Bar */}
            <div className="max-w-3xl mx-auto relative z-[100] animate-fade-in-up mb-4" style={{ animationDelay: '0.2s' }}>
              <SearchBar onSearch={onSearch} variant="hero" />
            </div>

            {/* Quick Stats - Compact Design */}
            <div className="mt-4 flex flex-wrap justify-center gap-6 sm:gap-8 text-white animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-amber-200 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  500+
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">
                  {t('hero.stats.properties')}
                </div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-blue-200 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">
                  {t('hero.stats.locations')}
                </div>
              </div>
              <div className="text-center group">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-green-200 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">
                  24/7
                </div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">
                  {t('hero.stats.support')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
