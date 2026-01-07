import { ApplicationFormData, FormErrors } from '@/types/application';
import { RELATIONSHIP_OPTIONS } from '@/constants/application';
import { FormField, getInputClassName } from './FormField';

interface EmergencyContactSectionProps {
  formData: ApplicationFormData;
  formErrors: FormErrors;
  onFieldChange: (field: keyof ApplicationFormData, value: any) => void;
}

export function EmergencyContactSection({
  formData,
  formErrors,
  onFieldChange,
}: EmergencyContactSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Emergency Contact
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          required
          error={formErrors.emergencyContactName}
        >
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) => onFieldChange('emergencyContactName', e.target.value)}
            className={getInputClassName(formErrors.emergencyContactName)}
            placeholder="Full name"
          />
        </FormField>

        <FormField
          label="Relationship"
          required
          error={formErrors.emergencyContactRelationship}
        >
          <select
            value={formData.emergencyContactRelationship}
            onChange={(e) => onFieldChange('emergencyContactRelationship', e.target.value)}
            className={getInputClassName(formErrors.emergencyContactRelationship)}
          >
            <option value="">Select relationship</option>
            {RELATIONSHIP_OPTIONS.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Phone Number"
          required
          error={formErrors.emergencyContactPhone}
        >
          <input
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={(e) => onFieldChange('emergencyContactPhone', e.target.value)}
            className={getInputClassName(formErrors.emergencyContactPhone)}
            placeholder="+255 XXX XXX XXX"
          />
        </FormField>

        <FormField label="Email (optional)">
          <input
            type="email"
            value={formData.emergencyContactEmail}
            onChange={(e) => onFieldChange('emergencyContactEmail', e.target.value)}
            className={getInputClassName()}
            placeholder="email@example.com"
          />
        </FormField>
      </div>
    </div>
  );
}


