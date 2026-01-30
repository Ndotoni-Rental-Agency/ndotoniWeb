
import LocationMapView from '../location/LocationMapView.client';


export function PropertyLocationSection({
  coords,
}: {
  coords: { lat: number; lng: number } | null;
}) {
  if (!coords) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Location</h3>

      <div className="h-[280px] rounded-lg overflow-hidden border">
        <LocationMapView lat={coords.lat} lng={coords.lng} />
      </div>

      <p className="text-sm text-gray-500">
        Approximate location shown 
      </p>
    </div>
  );
}
