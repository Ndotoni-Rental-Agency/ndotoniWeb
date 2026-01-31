import { FormData } from '@/hooks/useCreatePropertyForm';
import { PROPERTY_TYPES } from '@/constants';

interface BasicInfoStepProps {
  formData: FormData;
  onUpdate: (data: Partial<FormData>) => void;
}

export function BasicInfoStep({ formData, onUpdate }: BasicInfoStepProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <label className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 transition-colors">
          What's the name of your place?
        </label>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 transition-colors">
          Short names work best. Have fun with it—you can always change it later.
        </p>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all duration-200"
          placeholder="e.g., Modern 2-Bedroom Apartment in Masaki"
          required
        />
      </div>

      <div>
        <label className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 transition-colors">
          Create your description
        </label>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 transition-colors">
          Share what makes your place special and help guests imagine their stay. (Optional)
        </p>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={5}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all duration-200 resize-none"
          placeholder="Describe your property, its features, and what makes it special..."
        />
        <div className="mt-2 text-right">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors">{(formData.description || '').length}/500</span>
        </div>
      </div>

      <div>
        <label className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 transition-colors">
          What type of place will guests have?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {PROPERTY_TYPES.map(type => (
            <button
              key={type.value}
              type="button"
              onClick={() => onUpdate({ propertyType: type.value })}
              className={`p-4 sm:p-6 border-2 rounded-xl sm:rounded-2xl text-left transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 ${
                formData.propertyType === type.value
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-4 ring-red-100 dark:ring-red-800'
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">
                {type.label}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-colors">
                {type.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}