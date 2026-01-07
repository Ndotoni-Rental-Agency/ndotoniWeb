import { ApplicationFormData, FormErrors } from '@/types/application';
import { DatePicker } from '@/components/shared/forms/DatePicker';
import { EMPLOYMENT_STATUS_OPTIONS, SMOKING_STATUS_OPTIONS } from '@/constants/application';
import { FormField, getInputClassName } from './FormField';

interface ApplicantDetailsSectionProps {
  formData: ApplicationFormData;
  formErrors: FormErrors;
  onFieldChange: (field: keyof ApplicationFormData, value: any) => void;
}

export function ApplicantDetailsSection({
  formData,
  formErrors,
  onFieldChange,
}: ApplicantDetailsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Applicant Details
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Monthly Income (TZS)"
            required
            error={formErrors.monthlyIncome}
          >
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => onFieldChange('monthlyIncome', e.target.value)}
              className={getInputClassName(formErrors.monthlyIncome)}
              placeholder="Enter monthly income"
              min="0"
              step="0.01"
            />
          </FormField>

          <FormField
            label="Occupation"
            required
            error={formErrors.occupation}
          >
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => onFieldChange('occupation', e.target.value)}
              className={getInputClassName(formErrors.occupation)}
              placeholder="Enter your occupation"
            />
          </FormField>
        </div>

        <FormField
          label="Employment Status"
          required
          error={formErrors.employmentStatus}
        >
          <select
            value={formData.employmentStatus}
            onChange={(e) => onFieldChange('employmentStatus', e.target.value)}
            className={getInputClassName(formErrors.employmentStatus)}
          >
            <option value="">Select employment status</option>
            {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DatePicker
              value={formData.moveInDate}
              onChange={(value) => onFieldChange('moveInDate', value)}
              label="Desired Move-In Date"
              required
              minDate={new Date().toISOString().split('T')[0]}
            />
            {formErrors.moveInDate && (
              <p className="mt-1 text-sm text-red-500">{formErrors.moveInDate}</p>
            )}
          </div>

          <FormField
            label="Lease Duration (months)"
            required
            error={formErrors.leaseDuration}
          >
            <input
              type="number"
              value={formData.leaseDuration}
              onChange={(e) => onFieldChange('leaseDuration', e.target.value)}
              className={getInputClassName(formErrors.leaseDuration)}
              placeholder="e.g., 12"
              min="1"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Number of Occupants"
            required
            error={formErrors.numberOfOccupants}
          >
            <input
              type="number"
              value={formData.numberOfOccupants}
              onChange={(e) => onFieldChange('numberOfOccupants', e.target.value)}
              className={getInputClassName(formErrors.numberOfOccupants)}
              placeholder="Number of people"
              min="1"
            />
          </FormField>

          <FormField
            label="Smoking Status"
            required
            error={formErrors.smokingStatus}
          >
            <select
              value={formData.smokingStatus}
              onChange={(e) => onFieldChange('smokingStatus', e.target.value)}
              className={getInputClassName(formErrors.smokingStatus)}
            >
              <option value="">Select smoking status</option>
              {SMOKING_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div>
          <label className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={formData.hasPets}
              onChange={(e) => onFieldChange('hasPets', e.target.checked)}
              className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              I have pets
            </span>
          </label>
          {formData.hasPets && (
            <div className="mt-3">
              <textarea
                value={formData.petDetails}
                onChange={(e) => onFieldChange('petDetails', e.target.value)}
                className={getInputClassName(formErrors.petDetails)}
                placeholder="Please describe your pets (type, number, size, etc.)"
                rows={3}
              />
              {formErrors.petDetails && (
                <p className="mt-1 text-sm text-red-500">{formErrors.petDetails}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


