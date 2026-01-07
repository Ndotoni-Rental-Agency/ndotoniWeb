import { ApplicationFormData, FormErrors, ReferenceFormData } from '@/types/application';
import { RELATIONSHIP_OPTIONS } from '@/constants/application';
import { FormField, getInputClassName } from './FormField';

interface ReferencesSectionProps {
  formData: ApplicationFormData;
  formErrors: FormErrors;
  onFieldChange: (field: keyof ApplicationFormData, value: any) => void;
  onReferenceChange: (index: number, field: keyof ReferenceFormData, value: string) => void;
  onAddReference: () => void;
  onRemoveReference: (index: number) => void;
}

export function ReferencesSection({
  formData,
  formErrors,
  onFieldChange,
  onReferenceChange,
  onAddReference,
  onRemoveReference,
}: ReferencesSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={formData.includeReferences}
            onChange={(e) => onFieldChange('includeReferences', e.target.checked)}
            className="w-5 h-5 text-red-600 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 cursor-pointer transition-colors bg-white dark:bg-gray-700 checked:bg-red-600 checked:border-red-600"
          />
          {formData.includeReferences && (
            <svg
              className="absolute top-0.5 left-0.5 w-4 h-4 text-white pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-none">
          Include References (Optional)
        </h2>
      </label>

      {formData.includeReferences && (
        <div className="space-y-6 mt-6">
          {formData.references.map((ref, index) => (
            <div
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reference {index + 1}
                </h3>
                {formData.references.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveReference(index)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Name"
                  required
                  error={formErrors[`reference_${index}_name`]}
                >
                  <input
                    type="text"
                    value={ref.name}
                    onChange={(e) => onReferenceChange(index, 'name', e.target.value)}
                    className={getInputClassName(formErrors[`reference_${index}_name`])}
                    placeholder="Full name"
                  />
                </FormField>

                <FormField
                  label="Relationship"
                  required
                  error={formErrors[`reference_${index}_relationship`]}
                >
                  <div className="relative">
                    <select
                      value={ref.relationship}
                      onChange={(e) => onReferenceChange(index, 'relationship', e.target.value)}
                      className={`${getInputClassName(formErrors[`reference_${index}_relationship`])} appearance-none pr-10`}
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
                  error={formErrors[`reference_${index}_phoneNumber`]}
                >
                  <input
                    type="tel"
                    value={ref.phoneNumber}
                    onChange={(e) => onReferenceChange(index, 'phoneNumber', e.target.value)}
                    className={getInputClassName(formErrors[`reference_${index}_phoneNumber`])}
                    placeholder="+255 XXX XXX XXX"
                  />
                </FormField>

                <FormField label="Email (optional)">
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => onReferenceChange(index, 'email', e.target.value)}
                    className={getInputClassName()}
                    placeholder="email@example.com"
                  />
                </FormField>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={onAddReference}
            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-400 hover:border-red-500 dark:hover:border-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            + Add Another Reference
          </button>
        </div>
      )}
    </div>
  );
}


