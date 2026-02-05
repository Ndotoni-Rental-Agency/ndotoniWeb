'use client';

import SimpleSearchBar from '@/components/ui/SimpleSearchBar';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';
import heroImage from '/public/images/hero3.avif';

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
    <div className="relative min-h-[280px] md:min-h-[350px] lg:min-h-[400px] flex items-center overflow-visible">
      {/* Background Image - Cozy bedroom scene */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Cozy bedroom - your perfect home awaits"
          fill
          priority
          quality={75}
          className="object-cover object-center"
          sizes="100vw"
          placeholder="blur"
        />
        {/* Enhanced overlay with vignette effect for better focus and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
      </div>

      {/* Animated accent elements for depth */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Large Prominent Search Bar - Clean and focused */}
            <div className="max-w-5xl mx-auto relative animate-fade-in-up-hero">
              <SimpleSearchBar variant="hero" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
