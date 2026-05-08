'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { initiatePayment } from '@/graphql/mutations';

type Plan = 'PER_LISTING' | 'MONTHLY' | 'YEARLY';

const PLANS = [
  { id: 'PER_LISTING' as Plan, price: 5000, label: 'Per Listing', desc: 'Pay once per property', duration: '90 days' },
  { id: 'MONTHLY' as Plan, price: 25000, label: 'Monthly Unlimited', desc: 'List as many as you want', duration: '30 days' },
  { id: 'YEARLY' as Plan, price: 250000, label: 'Yearly Unlimited', desc: 'Best value — save 17%', duration: '365 days' },
];

type Step = 'select-plan' | 'payment';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('select-plan');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('payment');
    setStatus('idle');
    setMessage('');
  };

  const handleChangePlan = () => {
    setStep('select-plan');
    setStatus('idle');
    setMessage('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) value = '255' + value.substring(1);
    else if (value.startsWith('7') || value.startsWith('6')) value = '255' + value;
    if (value.length > 12) value = value.substring(0, 12);
    setPhoneNumber(value);
  };

  const handlePay = async () => {
    if (!selectedPlan || !phoneNumber || phoneNumber.length < 12) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const data = await GraphQLClient.executeAuthenticated<{ initiatePayment: any }>(
        initiatePayment,
        { input: { phoneNumber, listingPlan: selectedPlan } }
      );

      const result = data.initiatePayment;
      if (result.status === 'PENDING') {
        setStatus('pending');
        setMessage('Check your phone for the Mobile Money prompt. Confirm to complete payment.');
      } else if (result.status === 'COMPLETED') {
        setStatus('success');
        setMessage('Payment confirmed! Your subscription is active.');
      } else {
        setStatus('error');
        setMessage(result.message || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setStatus('error');
      const errorMsg = err?.errors?.[0]?.message || err?.message || 'Something went wrong. Please try again.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Listing Subscription</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Choose a plan to list your properties on Ndotoni.</p>

      {/* Step 1: Select Plan */}
      {step === 'select-plan' && (
        <div className="grid gap-4">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSelectPlan(plan.id)}
              className="p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition-all group"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{plan.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{plan.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-600">TZS {plan.price.toLocaleString()}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && selectedPlanData && (
        <div>
          {/* Selected plan summary */}
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-300">{selectedPlanData.label}</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">{selectedPlanData.duration}</p>
              </div>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">TZS {selectedPlanData.price.toLocaleString()}</p>
            </div>
            <button
              onClick={handleChangePlan}
              className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ← Select different plan
            </button>
          </div>

          {/* Phone Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mobile Money Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="0781 000 000"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <p className="mt-1 text-xs text-gray-500">Tanzania number (M-Pesa, Airtel Money, Halotel, Mixx)</p>
          </div>

          {/* Pay Button */}
          {phoneNumber.length >= 12 && (
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Processing...' : `Pay TZS ${selectedPlanData.price.toLocaleString()}`}
            </button>
          )}

          {/* Status */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              status === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              status === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
              'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
