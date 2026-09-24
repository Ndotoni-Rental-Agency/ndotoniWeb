import type { PropertyCard } from '@/API';
import { HomeSearch } from '@/components/home/HomeSearch';
import { AreaLinks } from '@/components/home/AreaLinks';
import { HomeListings } from '@/components/home/HomeListings';
import { NeedHelpBanner } from '@/components/home/NeedHelpBanner';
import { getHomepagePropertiesFromCache } from '@/lib/homepage-cache';

// Rebuild the listing rows at most every 30 minutes (matches the CloudFront feed's revalidate).
export const revalidate = 1800;

const LISTINGS_PER_ROW = 8;

async function getHomeListings(): Promise<{ newest: PropertyCard[]; lowest: PropertyCard[] }> {
  try {
    const cache = await getHomepagePropertiesFromCache();
    // A rent of 0 means the listing is incomplete; don't lead with it.
    const priced = (list?: PropertyCard[]) => (list ?? []).filter((p) => p.monthlyRent > 0).slice(0, LISTINGS_PER_ROW);
    return { newest: priced(cache.recent), lowest: priced(cache.lowestPrice) };
  } catch (error) {
    console.error('Homepage listings unavailable:', error);
    return { newest: [], lowest: [] };
  }
}

export default async function Home() {
  const { newest, lowest } = await getHomeListings();

  return (
    <div className="bg-white dark:bg-gray-900">
      <HomeSearch />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AreaLinks />
        <HomeListings titleKey="home.newestTitle" properties={newest} seeAllHref="/search?region=DAR%20ES%20SALAAM" />
        <HomeListings
          titleKey="home.lowestTitle"
          properties={lowest}
          seeAllHref="/search?region=DAR%20ES%20SALAAM"
        />
        <NeedHelpBanner />
      </div>
    </div>
  );
}
