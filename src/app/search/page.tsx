import { Suspense } from 'react';
import { fetchSearchFirstPage } from '@/lib/fetch-search';
import SearchPageContent from './SearchPageContent';

interface SearchPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') params.set(key, value);
  }
  // First page rendered on the server so results arrive with the HTML instead of after a spinner.
  const initial = await fetchSearchFirstPage(params);

  return (
    <Suspense fallback={
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
            <p className="mt-4 text-ink-500 dark:text-gray-400 transition-colors">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent initial={initial} />
    </Suspense>
  );
}
