import LocationSelector from '@/components/location/LocationSelector';
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

  return (
    <div className="space-y-6">
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
  );
}