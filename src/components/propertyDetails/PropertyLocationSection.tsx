'use client';

import { useState } from 'react';
import { Maximize2, X, MapPin } from 'lucide-react';
import LocationMapView from '../location/LocationMapView.client';

export function PropertyLocationSection({
  coords,
  title,
}: {
  coords: { lat: number; lng: number } | null;
  title?: string;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!coords) return null;

  return (
    <>
      {/* Inline map */}
      <div className="space-y-2 transition-colors">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Location
        </h3>

        <div
          className="relative h-[320px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 cursor-pointer group"
          onClick={() => setExpanded(true)}
        >
          <LocationMapView lat={coords.lat} lng={coords.lng} />

          {/* Expand hint */}
          <button
            className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 opacity-70 group-hover:opacity-100 transition-opacity z-[400]"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(true);
            }}
            aria-label="Expand map"
          >
            <Maximize2 size={16} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Approximate location shown for privacy
        </p>
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
