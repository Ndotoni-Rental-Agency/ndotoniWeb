'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryProperties } from '@/hooks/useCategorizedProperties';
import { usePropertyFavorites } from '@/hooks/useProperty';
import PropertyGrid from '@/components/property/PropertyGrid';
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

  const { toggleFavorite, isFavorited } = usePropertyFavorites(favoriteProperties);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-20">

      {/* Favorites */}
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="poster-heading">
            {sw ? 'Vipendwa' : 'Favorites'}
          </h1>
          <p className="text-sm text-gray-500">
            {sw ? 'Nyumba ulizohifadhi kwa baadaye.' : 'Homes you’ve saved for later.'}
          </p>
        </header>

        {favoriteProperties.length === 0 ? (
          <EmptyState
            title={sw ? 'Bado huna vipendwa' : 'No favorites yet'}
            description={sw ? 'Gusa alama ya moyo kwenye nyumba kuihifadhi hapa.' : 'Tap the heart icon on a listing to save it here.'}
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

        {recentProperties.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Listings you view will appear here."
          />
        ) : (
          <>
            <PropertyGrid
              properties={recentProperties}
              onFavoriteToggle={toggleFavorite}
              isFavorited={(id) => isFavorited(id)}
            />

            {hasMoreRecent && (
              <LoadMoreButton onClick={loadMoreRecent} />
            )}
          </>
        )}
      </section>
    </main>
  );
}

/* ---------------- helpers ---------------- */

function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center pt-6">
      <button
        onClick={onClick}
        className="rounded-full border border-gray-300 dark:border-gray-600 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Load more
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
    <div className="py-24 text-center space-y-3">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}
