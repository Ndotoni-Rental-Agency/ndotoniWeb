'use client';

import { PropertyFilters } from '@/types/property';
import SearchBar from '@/components/ui/SearchBar';
import Image from 'next/image';

interface HeroSectionProps {
  onSearch: (filters: PropertyFilters) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
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
                  500+
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
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&crop=center"
                alt="Beautiful modern home in Tanzania"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
            <div className="absolute -top-6 -right-6 bg-red-500 text-white rounded-xl p-4 shadow-lg">
              <div className="text-lg font-bold">From TZS 800K</div>
              <div className="text-sm opacity-90">per month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}