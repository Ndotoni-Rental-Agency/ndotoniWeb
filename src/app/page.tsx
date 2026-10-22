'use client';

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
import styles from '@/components/home/HomeDesign.module.css';

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
  originalText?: string;
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

    if (filters.originalText) params.set('originalText', filters.originalText);
    if (filters.ward) params.set('ward', filters.ward);
    if (filters.bathrooms !== undefined) params.set('bathrooms', String(filters.bathrooms));
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
    <div className={styles.home}>
      <HeroSection onSearch={handleSearch} />

      <div className={styles.main}>
        {/* HomeListings manages its own loading state, so reveal is kept light. */}
        <Reveal>
          <HomeListings />
        </Reveal>
        <Reveal>
          <WhyNdotoni />
        </Reveal>
        <Reveal>
          <HomeBrowse />
        </Reveal>
        <Reveal>
          <NeedHelpBanner />
        </Reveal>
        <Reveal>
          <ForLandlords />
        </Reveal>
      </div>
    </div>
  );
}
