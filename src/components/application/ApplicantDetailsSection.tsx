import { ApplicationFormData, FormErrors } from '@/lib/utils/application';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';
import { BirthdayPicker } from '@/components/shared/forms/BirthdayPicker';
import { Counter } from '@/components/shared/forms/Counter';
import { SMOKING_STATUS_OPTIONS } from '@/constants/application';
import { FormField, getInputClassName } from './FormField';
import { useFormattedNumberInput } from '@/hooks/useFormattedNumberInput';

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
  const { displayValue: monthlyIncomeDisplay, handleChange: handleMonthlyIncomeChange } =
    useFormattedNumberInput(
      formData.monthlyIncome,
      (value) => onFieldChange('monthlyIncome', value)
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Applicant Details
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <BirthdayPicker
              value={formData.dateOfBirth}
              onChange={(value) => onFieldChange('dateOfBirth', value)}
              label="Date of Birth"
              required
              error={formErrors.dateOfBirth}
            />
            {formErrors.dateOfBirth && (
              <p className="mt-1 text-sm text-gray-900 dark:text-emerald-400">{formErrors.dateOfBirth}</p>
            )}
          </div>

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
              placeholder="e.g., Student, Engineer, Teacher"
            />
          </FormField>
        </div>

        <FormField
          label="Monthly Income (TZS)"
          required
          error={formErrors.monthlyIncome}
        >
          <input
            type="text"
            value={monthlyIncomeDisplay}
            onChange={handleMonthlyIncomeChange}
            className={getInputClassName(formErrors.monthlyIncome)}
            placeholder="Enter monthly income"
            inputMode="numeric"
          />
        </FormField>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <CalendarDatePicker
              value={formData.moveInDate}
              onChange={(value) => onFieldChange('moveInDate', value)}
              label="Desired Move-In Date"
              placeholder="Select move-in date"
              min={new Date().toISOString().split('T')[0]}
            />
            {formErrors.moveInDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.moveInDate}</p>
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
          <div>
            <Counter
              value={formData.numberOfOccupants ? parseInt(formData.numberOfOccupants) : 1}
              onChange={(value) => onFieldChange('numberOfOccupants', value.toString())}
              label="Number of Occupants"
              min={1}
            />
            {formErrors.numberOfOccupants && (
              <p className="mt-1 text-sm text-gray-900 dark:text-emerald-400">{formErrors.numberOfOccupants}</p>
            )}
          </div>

          <FormField
            label="Smoking Status"
            required
            error={formErrors.smokingStatus}
          >
            <div className="relative">
              <select
                value={formData.smokingStatus}
                onChange={(e) => onFieldChange('smokingStatus', e.target.value)}
                className={`${getInputClassName(formErrors.smokingStatus)} appearance-none pr-10`}
              >
                <option value="">Select smoking status</option>
                {SMOKING_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-3 mb-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasPets}
                  onChange={(e) => onFieldChange('hasPets', e.target.checked)}
                  className="w-5 h-5 text-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-gray-500 dark:focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 cursor-pointer transition-colors bg-white dark:bg-gray-700 checked:bg-gray-900 dark:checked:bg-emerald-600 checked:border-gray-900 dark:checked:border-emerald-600"
                />
                {formData.hasPets && (
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
              <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-emerald-400 transition-colors leading-none">
                I have pets
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}


