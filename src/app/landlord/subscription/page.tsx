'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { initiatePayment } from '@/graphql/mutations';

type Plan = 'PER_LISTING' | 'MONTHLY' | 'YEARLY';

const PLANS = [
  { id: 'PER_LISTING' as Plan, price: 5000, label: 'Per Listing', labelSw: 'Kwa Nyumba', duration: '90 days', durationSw: 'Siku 90' },
  { id: 'MONTHLY' as Plan, price: 25000, label: 'Monthly (Unlimited)', labelSw: 'Kila Mwezi (Bila Kikomo)', duration: '30 days', durationSw: 'Siku 30' },
  { id: 'YEARLY' as Plan, price: 250000, label: 'Yearly (Unlimited)', labelSw: 'Kila Mwaka (Bila Kikomo)', duration: '365 days', durationSw: 'Siku 365' },
];

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
    setStatus('pending');
    setMessage('');

    try {
      const data = await GraphQLClient.executeAuthenticated<{ initiatePayment: any }>(
        initiatePayment,
        { input: { phoneNumber, listingPlan: selectedPlan } }
      );

      const result = data.initiatePayment;
      if (result.status === 'PENDING') {
        setMessage('Check your phone for the M-Pesa prompt. Confirm to complete payment.');
      } else if (result.status === 'COMPLETED') {
        setStatus('success');
        setMessage('Payment confirmed! Your subscription is active.');
      } else {
        setStatus('error');
        setMessage(result.message || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Listing Subscription</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Choose a plan to list your properties on Ndotoni.</p>

      {/* Plans */}
      <div className="grid gap-4 mb-8">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedPlan === plan.id
                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{plan.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{plan.duration}</p>
              </div>
              <p className="text-lg font-bold text-emerald-600">TZS {plan.price.toLocaleString()}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Phone Input */}
      {selectedPlan && (
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
      )}

      {/* Pay Button */}
      {selectedPlan && phoneNumber.length >= 12 && (
        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Processing...' : `Pay TZS ${PLANS.find(p => p.id === selectedPlan)?.price.toLocaleString()}`}
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
  );
}
