import { ApplicationFormData, FormErrors } from '@/types/application';
import { DatePicker } from '@/components/shared/forms/DatePicker';
import { FormField, getInputClassName } from './FormField';
import { useFormattedNumberInput } from '@/hooks/useFormattedNumberInput';

interface EmploymentDetailsSectionProps {
  formData: ApplicationFormData;
  formErrors: FormErrors;
  onFieldChange: (field: keyof ApplicationFormData, value: any) => void;
}

export function EmploymentDetailsSection({
  formData,
  formErrors,
  onFieldChange,
}: EmploymentDetailsSectionProps) {
  const { displayValue: employmentMonthlyIncomeDisplay, handleChange: handleEmploymentMonthlyIncomeChange } =
    useFormattedNumberInput(
      formData.employmentMonthlyIncome,
      (value) => onFieldChange('employmentMonthlyIncome', value)
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm">
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            checked={formData.includeEmployment}
            onChange={(e) => onFieldChange('includeEmployment', e.target.checked)}
            className="w-5 h-5 text-red-600 border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 cursor-pointer transition-colors bg-white dark:bg-gray-700 checked:bg-red-600 checked:border-red-600"
          />
          {formData.includeEmployment && (
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
          Include Employment Details (Optional)
        </h2>
      </label>

      {formData.includeEmployment && (
        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Employer Name"
              required
              error={formErrors.employerName}
            >
              <input
                type="text"
                value={formData.employerName}
                onChange={(e) => onFieldChange('employerName', e.target.value)}
                className={getInputClassName(formErrors.employerName)}
                placeholder="Company name"
              />
            </FormField>

            <FormField
              label="Job Title"
              required
              error={formErrors.jobTitle}
            >
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => onFieldChange('jobTitle', e.target.value)}
                className={getInputClassName(formErrors.jobTitle)}
                placeholder="Your job title"
              />
            </FormField>
          </div>

          <FormField
            label="Employer Address"
            required
            error={formErrors.employerAddress}
          >
            <input
              type="text"
              value={formData.employerAddress}
              onChange={(e) => onFieldChange('employerAddress', e.target.value)}
              className={getInputClassName(formErrors.employerAddress)}
              placeholder="Full address"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Employer Phone"
              required
              error={formErrors.employerPhone}
            >
              <input
                type="tel"
                value={formData.employerPhone}
                onChange={(e) => onFieldChange('employerPhone', e.target.value)}
                className={getInputClassName(formErrors.employerPhone)}
                placeholder="+255 XXX XXX XXX"
              />
            </FormField>

            <FormField
              label="Monthly Income from Employment (TZS)"
              required
              error={formErrors.employmentMonthlyIncome}
            >
              <input
                type="text"
                value={employmentMonthlyIncomeDisplay}
                onChange={handleEmploymentMonthlyIncomeChange}
                className={getInputClassName(formErrors.employmentMonthlyIncome)}
                placeholder="Monthly income"
                inputMode="numeric"
              />
            </FormField>
          </div>

          <div>
            <DatePicker
              value={formData.employmentStartDate}
              onChange={(value) => onFieldChange('employmentStartDate', value)}
              label="Employment Start Date"
              required
            />
            {formErrors.employmentStartDate && (
              <p className="mt-1 text-sm text-red-500">{formErrors.employmentStartDate}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


