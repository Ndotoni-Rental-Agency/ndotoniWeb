'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Maximize2, X, MapPin } from 'lucide-react';

const LocationMapView = dynamic(
  () => import('../location/LocationMapView.client'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    ),
  }
);

export function PropertyLocationSection({
  coords,
  title,
}: {
  coords: { lat: number; lng: number } | null;
  title?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showMap, setShowMap] = useState(false);

  if (!coords) return null;

  return (
    <>
      {/* The map library and tiles are heavy on slow data, so load them only when asked. */}
      <div className="space-y-2 transition-colors">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-white">Location</h3>

        {showMap ? (
          <div
            className="relative h-[320px] rounded-lg overflow-hidden border border-stone-200 dark:border-gray-700 cursor-pointer group"
            onClick={() => setExpanded(true)}
          >
            <LocationMapView lat={coords.lat} lng={coords.lng} />
            <button
              className="absolute bottom-3 right-3 w-11 h-11 inline-flex items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md border border-stone-200 dark:border-gray-700 z-[400]"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(true);
              }}
              aria-label="Expand map"
            >
              <Maximize2 size={16} className="text-ink-700 dark:text-gray-300" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-base font-semibold text-ink-900 dark:text-white hover:border-brand-500 transition-colors"
          >
            <MapPin size={18} className="text-brand-700 dark:text-brand-300" aria-hidden />
            Show on map
          </button>
        )}

        <p className="text-sm text-ink-600 dark:text-gray-400">Approximate location shown for privacy</p>
      </div>

      {/* Fullscreen modal */}
      {expanded && (
        <div className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex flex-col">
          {/* Map */}
          <div className="flex-1 relative">
            <LocationMapView lat={coords.lat} lng={coords.lng} />

            {/* Close button */}
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-4 left-4 p-2.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors z-[400]"
              aria-label="Close map"
            >
              <X size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-2 px-5 py-3.5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <MapPin size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {title || 'Property Location'} — approximate location
            </span>
          </div>
        </div>
      )}
    </>
  );
}
