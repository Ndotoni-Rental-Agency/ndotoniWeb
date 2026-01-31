import LocationSelector from '@/components/location/LocationSelector';
import LocationMapPicker from '@/components/location/LocationMapPicker';
import { getApproximateCoordinates } from '@/lib/geocoding';
import { FormData } from '@/hooks/useCreatePropertyForm';

interface LocationStepProps {
  formData: FormData;
  onUpdate: (data: Partial<FormData>) => void;
}

export function LocationStep({ formData, onUpdate }: LocationStepProps) {
  const handleLocationChange = async (location: {
    region: string;
    district: string;
    ward?: string;
    street?: string;
  }) => {
    // Auto-populate coordinates based on location
    const coordinates = await getApproximateCoordinates({
      region: location.region,
      district: location.district,
      ward: location.ward || '',
      street: location.street || ''
    });
    
    onUpdate({
      address: {
        ...formData.address,
        region: location.region,
        district: location.district,
        ward: location.ward || '',
        street: location.street || '',
        ...(coordinates && { coordinates })
      }
    });
  };

  const handleMapCoordinatesChange = (coords: { lat: number; lng: number }) => {
    onUpdate({
      address: {
        ...formData.address,
        coordinates: {
          latitude: coords.lat,
          longitude: coords.lng
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
          Where's your place located?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
          Your address is only shared with guests after they've made a reservation.
        </p>
        
        <LocationSelector
          value={{
            region: formData.address.region,
            district: formData.address.district,
            ward: formData.address.ward || '',
            street: formData.address.street || ''
          }}
          onChange={handleLocationChange}
          required={true}
        />
      </div>

      {/* Map Picker - only show when region and district are selected */}
      {formData.address.region && formData.address.district && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
            Pin your exact location
          </h4>
          <LocationMapPicker
            location={{
              region: formData.address.region,
              district: formData.address.district,
              ward: formData.address.ward ?? '',
              street: formData.address.street ?? ''
            }}
            onChange={handleMapCoordinatesChange}
          />
        </div>
      )}
    </div>
  );
}