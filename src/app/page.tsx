import { Suspense } from 'react';
import { showcase } from '@/lib/homepage-showcase';
import HomePageClient from '@/components/home/HomePageClient';
import { HomeListings } from '@/components/home/HomeListings';
import { getHomepagePropertiesFromCache } from '@/lib/homepage-cache';

async function Listings() {
  const data = await getHomepagePropertiesFromCache().catch(() => null);
  return <HomeListings initialData={data ? showcase(data) : null} />;
}

export default function Home() {
  return <HomePageClient listings={<Suspense fallback={<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading homes">{[0,1,2].map(key => <div key={key} className="aspect-[4/3] animate-pulse rounded-2xl bg-stone-100 motion-reduce:animate-none" />)}</div>}><Listings /></Suspense>} />;
}
