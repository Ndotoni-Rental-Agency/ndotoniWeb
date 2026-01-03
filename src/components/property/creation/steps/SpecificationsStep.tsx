import { FormData } from '@/hooks/useCreatePropertyForm';
import { COMMON_AMENITIES } from '@/constants';
import { Counter, NumberInput, ToggleCard, CheckboxCard } from '@/components/shared/forms';

interface SpecificationsStepProps {
  formData: FormData;
  onUpdateSection: <K extends keyof FormData>(section: K, value: Partial<FormData[K]>) => void;
  onToggleAmenity: (amenity: string) => void;
}

export function SpecificationsStep({ 
  formData, 
  onUpdateSection, 
  onToggleAmenity 
}: SpecificationsStepProps) {
  return (
    <div className="space-y-10">
      {/* Room Counts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          Share some basics about your place
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Counter
            value={formData.specifications.bedrooms || 0}
            onChange={(value) => onUpdateSection('specifications', { bedrooms: value })}
            label="Bedrooms"
            description="How many bedrooms can guests use?"
            min={0}
          />
          
          <Counter
            value={formData.specifications.bathrooms || 0}
            onChange={(value) => onUpdateSection('specifications', { bathrooms: value })}
            label="Bathrooms"
            description="How many bathrooms?"
            min={0}
          />
        </div>
      </div>

      {/* Additional Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          Additional details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NumberInput
            value={formData.specifications.squareMeters || 0}
            onChange={(value) => onUpdateSection('specifications', { squareMeters: value })}
            label="Square Meters"
            placeholder="e.g., 120"
            min={0}
          />

          <NumberInput
            value={formData.specifications.parkingSpaces || 0}
            onChange={(value) => onUpdateSection('specifications', { parkingSpaces: value })}
            label="Parking Spaces"
            placeholder="e.g., 2"
            min={0}
          />

          <NumberInput
            value={formData.specifications.floors || 1}
            onChange={(value) => onUpdateSection('specifications', { floors: value })}
            label="Number of Floors"
            placeholder="e.g., 1"
            min={1}
          />
        </div>
      </div>

      {/* Furnished Option */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          Is your place furnished?
        </h3>
        <ToggleCard
          selected={formData.specifications.furnished || false}
          onToggle={() => onUpdateSection('specifications', { furnished: !(formData.specifications.furnished || false) })}
          title="Furnished"
          description="Property comes with furniture and appliances"
        />
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          What amenities do you offer?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {COMMON_AMENITIES.map(amenity => (
            <CheckboxCard
              key={amenity}
              selected={formData.amenities?.includes(amenity) || false}
              onToggle={() => onToggleAmenity(amenity)}
              label={amenity}
            />
          ))}
        </div>
      </div>
    </div>
  );
}