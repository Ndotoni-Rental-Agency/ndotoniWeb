import { FormData } from '@/hooks/useCreatePropertyForm';
import { CurrencyInput, ToggleCard } from '@/components/shared/forms';

interface PricingStepProps {
  formData: FormData;
  onUpdateSection: <K extends keyof FormData>(section: K, value: Partial<FormData[K]>) => void;
}

export function PricingStep({ formData, onUpdateSection }: PricingStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
          Now, set your price
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors">
          You can change it anytime. We'll help you price competitively.
        </p>
      </div>

      {/* Main Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrencyInput
          value={formData.pricing.monthlyRent}
          onChange={(value) => onUpdateSection('pricing', { monthlyRent: value })}
          label="Monthly Rent"
          description="Base monthly rental amount"
          placeholder="1,200,000"
          required
        />

        <CurrencyInput
          value={formData.pricing.deposit ?? 0}
          onChange={(value) => onUpdateSection('pricing', { deposit: value })}
          label="Security Deposit"
          description="Refundable security deposit (optional)"
          placeholder="2,400,000"
        />
      </div>

      {/* Additional Charges */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          Additional charges (optional)
        </h3>
        <CurrencyInput
          value={formData.pricing.serviceCharge || 0}
          onChange={(value) => onUpdateSection('pricing', { serviceCharge: value })}
          label="Service Charge"
          description="Monthly maintenance or service fees"
          placeholder="100,000"
        />
      </div>

      {/* Utilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 transition-colors">
          What's included?
        </h3>
        <ToggleCard
          selected={formData.pricing.utilitiesIncluded || false}
          onToggle={() => onUpdateSection('pricing', { utilitiesIncluded: !(formData.pricing.utilitiesIncluded || false) })}
          title="Utilities Included"
          description="Water, electricity, and internet are included in rent"
        />
      </div>

      {/* Pricing Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl transition-colors">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Pricing Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400 transition-colors">Monthly Rent</span>
            <span className="font-semibold text-gray-900 dark:text-white transition-colors">TZS {formData.pricing.monthlyRent.toLocaleString()}</span>
          </div>
          {(formData.pricing.serviceCharge || 0) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400 transition-colors">Service Charge</span>
              <span className="font-semibold text-gray-900 dark:text-white transition-colors">TZS {(formData.pricing.serviceCharge || 0).toLocaleString()}</span>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Total Monthly</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400 transition-colors">
                TZS {(formData.pricing.monthlyRent + (formData.pricing.serviceCharge || 0)).toLocaleString()}
              </span>
            </div>
          </div>
          {(formData.pricing.deposit || 0) > 0 && (
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 transition-colors">
              <span>Security Deposit</span>
              <span>TZS {formData.pricing.deposit?.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}