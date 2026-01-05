'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFilters } from '@/types/property';
import { PropertyCard } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import Image from 'next/image';

interface HeroSectionProps {
  onSearch: (filters: PropertyFilters) => void;
  properties?: PropertyCard[];
  loading?: boolean;
}

export default function HeroSection({ onSearch, properties = [], loading = false }: HeroSectionProps) {
  const router = useRouter();

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

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white transition-colors">
              Find Your Perfect Home in <span className="text-red-500 dark:text-red-400">Tanzania</span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-gray-600 dark:text-gray-400 transition-colors">
              Discover quality properties across Dar es Salaam and beyond. Your dream home is just a search away.
            </p>
            <div className="mb-8">
              <SearchBar onSearch={onSearch} variant="hero" />
            </div>
            <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-1 transition-colors">
                  {properties.length > 0 ? `${properties.length}+` : '500+'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">Properties</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-1 transition-colors">
                  50+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">Locations</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-red-500 dark:text-red-400 mb-1 transition-colors">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">Support</div>
              </div>
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative">
            <div 
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
                featuredProperty 
                  ? 'cursor-pointer hover:shadow-3xl hover:scale-[1.02] group' 
                  : ''
              }`}
              onClick={handlePropertyClick}
            >
              <Image
                src={featuredProperty?.thumbnail || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center"}
                alt={featuredProperty?.title || "Beautiful modern home in Tanzania"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300"></div>
              
              {/* Click indicator overlay */}
              {featuredProperty && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              )}
              

            </div>
            
            {/* Floating stats card */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full md:animate-pulse"></div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white transition-colors">Available Now</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors">Ready to move in</div>
                </div>
              </div>
            </div>

            {/* Floating price card */}
            <div 
              className={`absolute -top-6 -right-6 bg-red-500 text-white rounded-xl p-4 shadow-lg transition-all duration-300 ${
                featuredProperty ? 'cursor-pointer hover:bg-red-600 hover:shadow-xl hover:scale-105' : ''
              }`}
              onClick={handlePropertyClick}
            >
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-5 bg-red-400 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-red-400 rounded w-16"></div>
                </div>
              ) : featuredProperty ? (
                <div className="text-lg font-bold">
                  {formatPrice(featuredProperty.monthlyRent || 0, featuredProperty.currency)}
                </div>
              ) : (
                <>
                  <div className="text-lg font-bold">From TZS 800K</div>
                  <div className="text-sm opacity-90">per month</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}