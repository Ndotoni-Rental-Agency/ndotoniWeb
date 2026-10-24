'use client';

import HomeSearchChoices from '@/components/home/HomeSearchChoices';

import { useState } from 'react';
import {
  ArrowRight,
  MapPin,
} from 'lucide-react';
import NaturalLanguageSearch from '@/components/ui/NaturalLanguageSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import DestinationPicker from '@/components/location/DestinationPicker';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/home/HomeDesign.module.css';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';

interface PropertyFilters {
  region?: string;
  district?: string;
  propertyType?: string;
  maxPrice?: number;
  minPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  ward?: string;
  originalText?: string;
}

export default function HeroSection({
  onSearch,
}: {
  onSearch: (filters: PropertyFilters) => void;
}) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [location, setLocation] = useState<FlattenedLocation>({
    type: 'region',
    name: 'DAR ES SALAAM',
    displayName: 'Dar es Salaam',
  });
  const [budget, setBudget] = useState('');
  const [propertyType, setPropertyType] = useState('');


  return (
    <section className={styles.hero}>
      <div className={styles.searchWrap} id="home-search">
        <NaturalLanguageSearch
          filters={{ region: location.type === 'region' ? location.name : location.regionName, district: location.type === 'district' ? location.name : undefined, maxPrice: budget ? Number(budget) : undefined, propertyType: propertyType || undefined }}
          onApply={(next) => onSearch(next)}
          onSearch={() => onSearch({ region: location.type === 'region' ? location.name : location.regionName, district: location.type === 'district' ? location.name : undefined, maxPrice: budget ? Number(budget) : undefined, propertyType: propertyType || undefined })}
        >
          <input type="hidden" name="region" value={location.type === 'region' ? location.name : location.regionName || ''} />
          {location.type === 'district' && <input type="hidden" name="district" value={location.name} />}
          <DestinationPicker variant="search-bar" selected={location} onSelect={setLocation} />
          <HomeSearchChoices propertyType={propertyType} budget={budget} onTypeChange={setPropertyType} onBudgetChange={setBudget} />
        </NaturalLanguageSearch>
      </div>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle}>
            {sw ? 'Nyumba nzuri.' : 'A place to love.'}
            <em>{sw ? 'Mwanzo mpya.' : 'A life to build.'}</em>
          </h1>
          <p className={styles.heroDescription}>
            {sw
              ? 'Pata sehemu ya kutulia. Nyumba za kupanga, kwa maisha yako yanayofuata.'
              : 'Find a place to settle in. Long-term homes for your next chapter.'}
          </p>

        </div>
        <Link href="/property/fXqFmtxthEYv" className={styles.heroPhoto} aria-label={sw ? 'Angalia nyumba hii Goba' : 'Explore this home in Goba'}>
          <Image src="/images/home-goba.webp" alt={sw ? 'Nyumba yenye bustani na mitende Goba, Dar es Salaam' : 'A home with a garden and palms in Goba, Dar es Salaam'} fill priority unoptimized sizes="(max-width: 767px) 100vw, 50vw" className={styles.heroImage} />
          <span className={styles.photoLabel}><MapPin size={14} /> Goba, Dar es Salaam <ArrowRight size={18} /></span>
        </Link>
      </div>

    </section>
  );
}
