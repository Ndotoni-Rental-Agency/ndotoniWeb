'use client';

import React from 'react';
import { useEffect } from 'react';
import HeroSection from '@/components/layout/HeroSection';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useScroll } from '@/contexts/ScrollContext';
import { useRouter } from 'next/navigation';
import { WhatAreYouLookingFor } from '@/components/home/WhatAreYouLookingFor';
import { NeedHelpBanner } from '@/components/home/NeedHelpBanner';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { HowItWorks } from '@/components/home/HowItWorks';
import { PopularLocations } from '@/components/home/PopularLocations';
import { ListYourPlaceCTA } from '@/components/home/ListYourPlaceCTA';
import { ReferAndEarn } from '@/components/home/ReferAndEarn';
import { ShortStaysBanner } from '@/components/home/ShortStaysBanner';

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

export default function Home() {
  const isScrolled = useScrollPosition(400);
  const { setIsScrolled } = useScroll();
  const router = useRouter();

  // Sync scroll state with context
  useEffect(() => {
    setIsScrolled(isScrolled);
  }, [isScrolled, setIsScrolled]);

  const handleSearch = (filters: PropertyFilters) => {
    const params = new URLSearchParams();

    if (filters.region) params.set('region', filters.region);
    if (filters.district) params.set('district', filters.district);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.bedrooms) params.set('bedrooms', String(filters.bedrooms));
    if (filters.moveInDate) params.set('moveInDate', filters.moveInDate);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <HeroSection onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Popular locations — first, visual and engaging */}
        <PopularLocations />

        {/* What are you looking for - category grid */}
        <WhatAreYouLookingFor />

        {/* Need help finding a place? */}
        <NeedHelpBanner />

        {/* Why choose us */}
        <WhyChooseUs />

        {/* How it works */}
        <HowItWorks />

        {/* Short stays — redirect to ndotonistays */}
        <ShortStaysBanner />

        {/* Refer & Earn */}
        <ReferAndEarn />

        {/* List your place CTA */}
        <ListYourPlaceCTA />
      </main>
    </div>
  );
}
