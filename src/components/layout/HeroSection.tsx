'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyCard } from '@/API';

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
}
import SearchBar from '@/components/ui/SearchBar';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeroSectionProps {
  onSearch: (filters: PropertyFilters) => void;
  properties?: PropertyCard[];
  loading?: boolean;
}

export default function HeroSection({ onSearch, properties = [], loading = false }: HeroSectionProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // Find the cheapest available property from the provided properties
  const featuredProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    
    // Filter for available properties only
    const availableProperties = properties.filter(p => p.available);
    
    if (availableProperties.length === 0) return null;
    
    // Find the property with the lowest monthly rent
    return availableProperties.reduce((cheapest, current) => {
      return (current.monthlyRent || 0) < (cheapest.monthlyRent || 0) ? current : cheapest;
    });
  }, [properties]);

  const formatPrice = (monthlyRent: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(monthlyRent);
  };

  const handlePropertyClick = () => {
    if (featuredProperty) {
      router.push(`/property/${featuredProperty.propertyId}`);
    }
  };

  // Show loading state when no properties or still loading
  const showLoadingState = loading || !featuredProperty || !featuredProperty.thumbnail;

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white transition-colors">
              {t('hero.title')} <span className="text-red-500 dark:text-red-400">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-400 transition-colors">
              {t('hero.subtitle')}
            </p>
            <div className="mb-8">
              <SearchBar onSearch={onSearch} variant="hero" />
            </div>
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-1 transition-colors">
                  {properties.length > 0 ? `${properties.length}+` : '500+'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">{t('hero.stats.properties')}</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-1 transition-colors">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">{t('hero.stats.locations')}</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-1 transition-colors">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">{t('hero.stats.support')}</div>
              </div>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative">
            <div 
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ${
                showLoadingState 
                  ? 'bg-gray-200 dark:bg-gray-700 animate-pulse' 
                  : 'cursor-pointer hover:shadow-3xl hover:scale-[1.01] group'
              }`}
              onClick={!showLoadingState ? handlePropertyClick : undefined}
            >
              {showLoadingState ? (
                // Loading state - just a blur with loading text
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                    {t('common.loadingProperties')}
                  </div>
                </div>
              ) : (
                // Property image
                <>
                  <Image
                    src={featuredProperty.thumbnail || ''}
                    alt={featuredProperty.title || "Beautiful property in Tanzania"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                    quality={95}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
                </>
              )}
            </div>
            
            {/* Floating stats card - only show when not loading */}
            {!showLoadingState && (
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">{t('properties.availableNow')}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors">{t('properties.readyToMoveIn')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Floating price card */}
            <div 
              className={`absolute -top-6 -right-6 bg-red-500 text-white rounded-xl p-4 shadow-lg transition-all duration-300 ${
                !showLoadingState ? 'cursor-pointer hover:bg-red-600 hover:shadow-xl hover:scale-105' : ''
              }`}
              onClick={!showLoadingState ? handlePropertyClick : undefined}
            >
              {showLoadingState ? (
                <div className="animate-pulse">
                  <div className="h-5 bg-red-400 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-red-400 rounded w-16"></div>
                </div>
              ) : (
                <div className="text-lg font-bold">
                  {formatPrice(featuredProperty.monthlyRent, featuredProperty.currency)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}