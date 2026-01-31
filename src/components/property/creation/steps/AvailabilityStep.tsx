import { FormData } from '@/hooks/useCreatePropertyForm';
import { ToggleCard, DatePicker, Counter } from '@/components/shared/forms';

interface AvailabilityStepProps {
  formData: FormData;
  onUpdateSection: <K extends keyof FormData>(section: K, value: Partial<FormData[K]>) => void;
}

export function AvailabilityStep({ formData, onUpdateSection }: AvailabilityStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
          When will your place be ready?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">
          Set your availability and lease terms to attract the right tenants.
        </p>
      </div>

      {/* Availability Status */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          Availability Status
        </h4>
        <ToggleCard
          selected={formData.availability.available || false}
          onToggle={() => onUpdateSection('availability', { available: !(formData.availability.available || false) })}
          title="Available for Rent"
          description={
            (formData.availability.available || false)
              ? 'Your property is ready to receive applications'
              : 'Your property is not currently available'
          }
        />
      </div>

      {/* Available From Date */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          When can tenants move in? (Optional)
        </h4>
        <DatePicker
          value={formData.availability.availableFrom || ''}
          onChange={(value) => onUpdateSection('availability', { availableFrom: value })}
          label="Available From"
          description="The earliest date tenants can move in"
          minDate={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Lease Terms */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          Set your lease terms (Optional)
        </h4>
        <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors">
          Specify preferred lease duration. Leave empty if flexible.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-colors">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
              Minimum Lease Term (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => onUpdateSection('availability', { 
                  minimumLeaseTerm: Math.max(0, (formData.availability.minimumLeaseTerm || 12) - 1) 
                })}
                className="w-12 h-12 rounded-full border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all duration-150 shadow-sm"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                </svg>
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{formData.availability.minimumLeaseTerm || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">months</div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSection('availability', { 
                  minimumLeaseTerm: (formData.availability.minimumLeaseTerm || 0) + 1 
                })}
                className="w-12 h-12 rounded-full border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all duration-150 shadow-sm"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 transition-colors">
              Shortest lease period you'll accept (0 = flexible)
            </p>
          </div>

          <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-colors">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3 transition-colors">
              Maximum Lease Term (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => onUpdateSection('availability', { 
                  maximumLeaseTerm: Math.max((formData.availability.minimumLeaseTerm || 0), (formData.availability.maximumLeaseTerm || 24) - 1) 
                })}
                className="w-12 h-12 rounded-full border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all duration-150 shadow-sm"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                </svg>
              </button>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{formData.availability.maximumLeaseTerm || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">months</div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSection('availability', { 
                  maximumLeaseTerm: (formData.availability.maximumLeaseTerm || 0) + 1 
                })}
                className="w-12 h-12 rounded-full border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all duration-150 shadow-sm"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 transition-colors">
              Longest lease period you'll offer (0 = flexible)
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl transition-colors">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Availability Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400 transition-colors">Status:</span>
            <span className={`font-semibold transition-colors ${(formData.availability.available || false) ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {(formData.availability.available || false) ? 'Available' : 'Not Available'}
            </span>
          </div>
          {formData.availability.availableFrom && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors">Available from:</span>
              <span className="font-semibold text-gray-900 dark:text-white transition-colors">{new Date(formData.availability.availableFrom).toLocaleDateString()}</span>
            </div>
          )}
          {((formData.availability.minimumLeaseTerm || 0) > 0 || (formData.availability.maximumLeaseTerm || 0) > 0) && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors">Lease term:</span>
              <span className="font-semibold text-gray-900 dark:text-white transition-colors">
                {(formData.availability.minimumLeaseTerm || 0) > 0 && (formData.availability.maximumLeaseTerm || 0) > 0
                  ? `${formData.availability.minimumLeaseTerm} - ${formData.availability.maximumLeaseTerm} months`
                  : (formData.availability.minimumLeaseTerm || 0) > 0
                  ? `${formData.availability.minimumLeaseTerm}+ months`
                  : (formData.availability.maximumLeaseTerm || 0) > 0
                  ? `Up to ${formData.availability.maximumLeaseTerm} months`
                  : 'Flexible'
                }
              </span>
            </div>
          )}
          {((formData.availability.minimumLeaseTerm || 0) === 0 && (formData.availability.maximumLeaseTerm || 0) === 0) && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 transition-colors">Lease term:</span>
              <span className="font-semibold text-gray-900 dark:text-white transition-colors">Flexible</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}