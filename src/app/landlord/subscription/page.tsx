'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { initiatePayment } from '@/graphql/mutations';
import { checkListingEntitlement } from '@/graphql/queries';

type Plan = 'PER_LISTING' | 'MONTHLY' | 'YEARLY';

const PLANS = [
  { id: 'PER_LISTING' as Plan, price: 5000, label: 'Per Listing', desc: 'Pay once per property', duration: '90 days', listings: '1 property' },
  { id: 'MONTHLY' as Plan, price: 25000, label: 'Monthly', desc: 'Up to 10 listings per month', duration: '30 days', listings: '10 properties' },
  { id: 'YEARLY' as Plan, price: 250000, label: 'Yearly Unlimited', desc: 'Best value — unlimited listings', duration: '365 days', listings: 'Unlimited' },
];

interface Entitlement {
  activePlan: string | null;
  canList: boolean;
  freeListingsRemaining: number | null;
  message: string | null;
}

type Step = 'overview' | 'select-plan' | 'payment';

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('overview');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEntitlement, setLoadingEntitlement] = useState(true);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [entitlementError, setEntitlementError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEntitlement();
  }, []);

  const fetchEntitlement = async () => {
    try {
      const data = await GraphQLClient.executeAuthenticated<{
        checkListingEntitlement: Entitlement;
      }>(checkListingEntitlement);
      setEntitlement(data.checkListingEntitlement);
    } catch (err) {
      console.error('Failed to fetch entitlement:', err);
      setEntitlementError(true);
    } finally {
      setLoadingEntitlement(false);
    }
  };

  const selectedPlanData = PLANS.find(p => p.id === selectedPlan);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('payment');
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
        fetchEntitlement(); // Refresh
      } else {
        setStatus('error');
        setMessage(result.message || 'Payment failed. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.errors?.[0]?.message || err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlanLabel = (plan: string | null) => {
    if (!plan || plan === 'FREE') return 'Free Tier';
    return PLANS.find(p => p.id === plan)?.label || plan;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your listing plan.</p>
      </div>

      {/* Current Plan Status */}
      {loadingEntitlement ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      ) : entitlementError ? (
        <>
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
            We&apos;re experiencing a temporary issue loading your subscription. Our team is working on a fix. Here are the available plans:
          </div>
          <div className="space-y-3 opacity-60 pointer-events-none">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="w-full p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-left"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plan.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{plan.listings} · {plan.duration}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">TZS {plan.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : entitlement && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Plan</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{getPlanLabel(entitlement.activePlan)}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              entitlement.canList
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
            }`}>
              {entitlement.canList ? 'Active' : 'Upgrade needed'}
            </div>
          </div>

          {entitlement.freeListingsRemaining !== null && entitlement.freeListingsRemaining > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {entitlement.freeListingsRemaining} free listing{entitlement.freeListingsRemaining > 1 ? 's' : ''} remaining
            </p>
          )}

          {entitlement.message && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{entitlement.message}</p>
          )}

          {step === 'overview' && (
            <button
              onClick={() => setStep('select-plan')}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
            >
              {entitlement.canList ? 'Change Plan' : 'Upgrade'}
            </button>
          )}
        </div>
      )}

      {/* Plan Selection */}
      {step === 'select-plan' && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose a plan:</p>
          {PLANS.map((plan) => {
            const isCurrent = entitlement?.activePlan === plan.id && entitlement?.canList;
            return (
              <button
                key={plan.id}
                onClick={() => !isCurrent && handleSelectPlan(plan.id)}
                disabled={isCurrent}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-600 cursor-default'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {plan.label}
                      {isCurrent && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">(current)</span>}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{plan.desc}</p>
                    <p className="text-xs text-gray-400 mt-1">{plan.listings} · {plan.duration}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">TZS {plan.price.toLocaleString()}</p>
                </div>
              </button>
            );
          })}
          <button
            onClick={() => setStep('overview')}
            className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Payment */}
      {step === 'payment' && selectedPlanData && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{selectedPlanData.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{selectedPlanData.duration}</p>
            </div>
            <p className="text-lg font-bold text-emerald-600">TZS {selectedPlanData.price.toLocaleString()}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Mobile Money Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="0781 000 000"
              className="input"
            />
            <p className="mt-1 text-xs text-gray-400">M-Pesa, Airtel Money, Halotel, Mixx</p>
          </div>

          {phoneNumber.length >= 12 && (
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-800 text-white text-sm font-semibold transition-colors"
            >
              {loading ? 'Processing...' : `Pay TZS ${selectedPlanData.price.toLocaleString()}`}
            </button>
          )}

          {message && (
            <div className={`p-3 rounded-xl text-sm ${
              status === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
              status === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
              'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={() => { setStep('select-plan'); setStatus('idle'); setMessage(''); }}
            className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ← Change plan
          </button>
        </div>
      )}
    </div>
  );
}
