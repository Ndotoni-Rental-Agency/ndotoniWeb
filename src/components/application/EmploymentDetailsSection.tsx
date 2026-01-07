import { ApplicationFormData, FormErrors } from '@/types/application';
import { DatePicker } from '@/components/shared/forms/DatePicker';
import { FormField, getInputClassName } from './FormField';

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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <label className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          checked={formData.includeEmployment}
          onChange={(e) => onFieldChange('includeEmployment', e.target.checked)}
          className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
        />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Include Employment Details (Optional)
        </h2>
      </label>

      {formData.includeEmployment && (
        <div className="space-y-6">
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
                type="number"
                value={formData.employmentMonthlyIncome}
                onChange={(e) => onFieldChange('employmentMonthlyIncome', e.target.value)}
                className={getInputClassName(formErrors.employmentMonthlyIncome)}
                placeholder="Monthly income"
                min="0"
                step="0.01"
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


