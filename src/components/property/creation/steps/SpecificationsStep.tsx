import { FormData } from '@/hooks/useCreatePropertyForm';
import { COMMON_AMENITIES } from '@/constants';
import { Counter, NumberInput, ToggleCard, CheckboxCard } from '@/components/shared/forms';
import { useState } from 'react';

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
  const [customAmenity, setCustomAmenity] = useState('');

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !formData.amenities?.includes(customAmenity.trim())) {
      onToggleAmenity(customAmenity.trim());
      setCustomAmenity('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomAmenity();
    }
  };

  // Get custom amenities (those not in COMMON_AMENITIES)
  const customAmenities = formData.amenities?.filter(amenity => 
    !COMMON_AMENITIES.includes(amenity)
  ) || [];
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
        
        {/* Common Amenities */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {COMMON_AMENITIES.map(amenity => (
            <CheckboxCard
              key={amenity}
              selected={formData.amenities?.includes(amenity) || false}
              onToggle={() => onToggleAmenity(amenity)}
              label={amenity}
            />
          ))}
        </div>

        {/* Custom Amenities */}
        {customAmenities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
              Custom Amenities
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customAmenities.map(amenity => (
                <CheckboxCard
                  key={amenity}
                  selected={true}
                  onToggle={() => onToggleAmenity(amenity)}
                  label={amenity}
                />
              ))}
            </div>
          </div>
        )}

        {/* Add Custom Amenity */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 transition-colors">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
            Add Custom Amenity
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Rooftop terrace, Wine cellar, etc."
              className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              disabled={!customAmenity.trim()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 transition-colors">
            Add unique amenities that make your property special
          </p>
        </div>
      </div>
    </div>
  );
}