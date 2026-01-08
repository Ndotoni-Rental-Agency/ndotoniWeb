import { ApplicationFormData, FormErrors } from '@/lib/utils/application';
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
          <div className="relative">
            <select
              value={formData.emergencyContactRelationship}
              onChange={(e) => onFieldChange('emergencyContactRelationship', e.target.value)}
              className={`${getInputClassName(formErrors.emergencyContactRelationship)} appearance-none pr-10`}
            >
              <option value="">Select relationship</option>
              {RELATIONSHIP_OPTIONS.map((rel) => (
                <option key={rel} value={rel}>
                  {rel}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
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


