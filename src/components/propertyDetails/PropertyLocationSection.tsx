import LocationMapView from '../location/LocationMapView.client';

export function PropertyLocationSection({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  if (!coords) return null;

  return (
    <div className="space-y-2 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Location
      </h3>

      <div className="h-[280px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <LocationMapView lat={coords.lat} lng={coords.lng} />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Approximate location shown
      </p>
    </div>
  );
}
