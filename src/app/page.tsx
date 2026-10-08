'use client';

import { EducationImpact } from '@/components/home/EducationImpact';
import React from 'react';
import { useEffect } from 'react';
import { HomeListings } from '@/components/home/HomeListings';
import HeroSection from '@/components/layout/HeroSection';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useScroll } from '@/contexts/ScrollContext';
import { useRouter } from 'next/navigation';
import { NeedHelpBanner } from '@/components/home/NeedHelpBanner';
import { HomeBrowse } from '@/components/home/HomeBrowse';
import { WhyNdotoni } from '@/components/home/WhyNdotoni';
import { ForLandlords } from '@/components/home/ForLandlords';
import { Reveal } from '@/components/motion';

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
        {/* HomeListings manages its own loading state, so reveal is kept light. */}
        <Reveal>
          <HomeListings />
        </Reveal>
        <Reveal>
          <HomeBrowse />
        </Reveal>
        <Reveal>
          <WhyNdotoni />
        </Reveal>
        <Reveal>
          <NeedHelpBanner />
        </Reveal>
        <Reveal>
          <EducationImpact />
        </Reveal>
        <Reveal>
          <ForLandlords />
        </Reveal>
      </main>
    </div>
  );
}
