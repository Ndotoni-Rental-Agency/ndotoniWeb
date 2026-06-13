import LocationSelector from '@/components/location/LocationSelector';
import LocationMapPicker from '@/components/location/LocationMapPicker';
import { PropertyDraftFormData, FormErrors } from './types';

interface StepLocationProps {
  formData: PropertyDraftFormData;
  errors: FormErrors;
  onFormChange: (updates: Partial<PropertyDraftFormData>) => void;
  onCoordsChange: (coords: { lat: number; lng: number }) => void;
}

export function StepLocation({ formData, errors, onFormChange, onCoordsChange }: StepLocationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Where is your property located?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Help tenants find your property by providing an accurate location.
        </p>
      </div>

      <LocationSelector
        value={{
          region: formData.region,
          district: formData.district,
          ward: formData.ward || '',
          street: formData.street || '',
        }}
        onChange={(loc) => onFormChange(loc)}
        required
      />

      {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
      {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}

      {formData.region && formData.district && (
        <LocationMapPicker
          location={formData}
          onChange={onCoordsChange}
        />
      )}
    </div>
  );
}
