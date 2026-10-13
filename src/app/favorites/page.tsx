'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { PageHeader } from '@/components/marketing/PageHeader';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryProperties } from '@/hooks/useCategorizedProperties';
import { usePropertyFavorites } from '@/hooks/useProperty';
import PropertyGrid from '@/components/property/SearchPropertyGrid';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const sw = language === 'sw';

  const {
    properties: favoriteProperties,
    isLoading: isLoadingFavorites,
    loadMore: loadMoreFavorites,
    hasMore: hasMoreFavorites,
  } = useCategoryProperties('FAVORITES', isAuthenticated);

  const {
    properties: recentProperties,
    isLoading: isLoadingRecent,
    loadMore: loadMoreRecent,
    hasMore: hasMoreRecent,
  } = useCategoryProperties('RECENTLY_VIEWED', isAuthenticated);

  const { toggleFavorite, isFavorited } =
    usePropertyFavorites(favoriteProperties);

  return (
    <>
      <PageHeader
        title={sw ? 'Vipendwa' : 'Your saved homes'}
        subtitle={
          sw
            ? 'Nyumba ulizohifadhi kwa baadaye. Linganisha na uchague inayokufaa.'
            : 'Your shortlist, all in one place. Compare homes and find the one that fits.'
        }
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Favorites */}
        <section className="space-y-6">
          {isLoadingFavorites ? (
            <LoadingHomes />
          ) : favoriteProperties.length === 0 ? (
            <EmptyState
              title={sw ? 'Bado huna vipendwa' : 'No favorites yet'}
              description={
                sw
                  ? 'Gusa alama ya moyo kwenye nyumba kuihifadhi hapa.'
                  : 'Tap the heart icon on a listing to save it here.'
              }
            />
          ) : (
            <>
              <PropertyGrid
                properties={favoriteProperties}
                onFavoriteToggle={toggleFavorite}
                isFavorited={(id) => isFavorited(id)}
              />

              {hasMoreFavorites && (
                <LoadMoreButton onClick={loadMoreFavorites} />
              )}
            </>
          )}
        </section>

        {/* Recently viewed */}
        <section className="space-y-6 pt-10 border-t border-gray-200 dark:border-gray-800">
          <header className="space-y-1">
            <h2 className="poster-heading">
              {sw ? 'Ulizoangalia karibuni' : 'Recently viewed'}
            </h2>
            <p className="text-sm text-gray-500">
              {sw ? 'Endelea ulipoachia.' : 'Pick up where you left off.'}
            </p>
          </header>

          {isLoadingRecent ? (
            <LoadingHomes />
          ) : recentProperties.length === 0 ? (
            <EmptyState
              title={sw ? 'Bado hujaangalia nyumba' : 'No recent activity'}
              description={
                sw
                  ? 'Nyumba unazoangalia zitaonekana hapa.'
                  : 'Listings you view will appear here.'
              }
            />
          ) : (
            <>
              <PropertyGrid
                properties={recentProperties}
                onFavoriteToggle={toggleFavorite}
                isFavorited={(id) => isFavorited(id)}
              />

              {hasMoreRecent && <LoadMoreButton onClick={loadMoreRecent} />}
            </>
          )}
        </section>
      </main>
    </>
  );
}

/* ---------------- helpers ---------------- */

function LoadMoreButton({ onClick }: { onClick: () => void }) {
  const { language } = useLanguage();
  return (
    <div className="flex justify-center pt-6">
      <button
        onClick={onClick}
        className="rounded-full border border-gray-300 dark:border-gray-600 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {language === 'sw' ? 'Angalia nyumba zaidi' : 'Load more'}
      </button>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-cream-100 px-6 py-14 text-center space-y-3 dark:border-gray-700 dark:bg-gray-800">
      <Heart
        size={28}
        className="mx-auto mb-5 text-brand-700 dark:text-brand-300"
        aria-hidden="true"
      />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-500">{description}</p>
      <BrowseLink />
    </div>
  );
}

function BrowseLink() {
  const { language } = useLanguage();
  return (
    <Link
      href="/search"
      className="!mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-900 px-6 text-sm font-bold text-white hover:bg-brand-800"
    >
      {language === 'sw' ? 'Tafuta nyumba' : 'Explore homes'}
    </Link>
  );
}

function LoadingHomes() {
  const { language } = useLanguage();
  return (
    <div className="search-property-grid" role="status">
      <span className="sr-only">
        {language === 'sw' ? 'Inapakia nyumba…' : 'Loading homes…'}
      </span>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          aria-hidden="true"
          className="h-72 animate-pulse rounded-2xl bg-stone-100 dark:bg-gray-800 motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}
