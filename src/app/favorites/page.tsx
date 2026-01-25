"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategoryProperties } from '@/hooks/useCategorizedProperties';
import { usePropertyFavorites } from '@/hooks/useProperty';
import PropertyGrid from '@/components/property/PropertyGrid';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();

  // Fetch FAVORITES and RECENTLY_VIEWED categories
  const {
    properties: favoriteProperties,
    isLoading: isLoadingFavorites,
    error: favError,
    loadMore: loadMoreFavorites,
    hasMore: hasMoreFavorites,
  } = useCategoryProperties('FAVORITES', isAuthenticated);

  const {
    properties: recentProperties,
    isLoading: isLoadingRecent,
    error: recentError,
    loadMore: loadMoreRecent,
    hasMore: hasMoreRecent,
  } = useCategoryProperties('RECENTLY_VIEWED', isAuthenticated);

  // Local favorite management (syncs with backend when toggling)
  const { toggleFavorite, isFavorited } = usePropertyFavorites(favoriteProperties);

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Favorites</h1>
        <p className="text-sm text-gray-500 mt-1">Properties you have favorited.</p>
      </div>

      <section>
        {isLoadingFavorites ? (
          <div className="text-gray-500">Loading favorites...</div>
        ) : favError ? (
          <div className="text-red-500">{favError}</div>
        ) : (
          <>
            <PropertyGrid
              properties={favoriteProperties}
              onFavoriteToggle={toggleFavorite}
              isFavorited={(id: string) => isFavorited(id)}
            />
            {hasMoreFavorites && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => loadMoreFavorites()}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm"
                >
                  Load more favorites
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent activity</h2>
        <p className="text-sm text-gray-500 mt-1">Properties you recently viewed.</p>
      </div>

      <section>
        {isLoadingRecent ? (
          <div className="text-gray-500">Loading recent activity...</div>
        ) : recentError ? (
          <div className="text-red-500">{recentError}</div>
        ) : (
          <>
            <PropertyGrid
              properties={recentProperties}
              onFavoriteToggle={toggleFavorite}
              isFavorited={(id: string) => isFavorited(id)}
            />
            {hasMoreRecent && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => loadMoreRecent()}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm"
                >
                  Load more recent
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
