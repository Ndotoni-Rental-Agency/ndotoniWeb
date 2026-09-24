import { Suspense } from 'react';
import { PropertySearchCardSkeletonGrid } from '@/components/property/PropertySearchSkeleton';
import { fetchSearchFirstPage } from '@/lib/fetch-search';
import { filtersFromParams } from '@/lib/search/params';
import SearchPageContent from './SearchPageContent';

interface SearchPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') params.set(key, value);
  }
  const initial = await fetchSearchFirstPage(filtersFromParams(params));

  return (
    <Suspense
      fallback={
        <div className="py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PropertySearchCardSkeletonGrid count={8} />
          </div>
        </div>
      }
    >
      <SearchPageContent initial={initial} />
    </Suspense>
  );
}
