'use client';

import { useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { createHousingRequest } from '@/graphql/mutations';

interface HousingRequestFormProps {
  onClose?: () => void;
  className?: string;
}

export function HousingRequestForm({ onClose, className = '' }: HousingRequestFormProps) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('Dar es Salaam');
  const [district, setDistrict] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !description) return;

    setSubmitting(true);
    setError('');

    try {
      await GraphQLClient.executePublic(createHousingRequest, {
        phone: phone.replace(/\D/g, ''),
        contactName: name || undefined,
        region: region || undefined,
        district: district || undefined,
        maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        moveInDate: moveInDate || undefined,
        currency: 'TZS',
        description,
        source: 'WEB',
      });
      setSubmitted(true);
    } catch (err: any) {
      // Amplify throws on partial errors even when mutation succeeds.
      // If errors contain serialization issues (not auth/validation), treat as success.
      const errors = err?.errors || [];
      const isSerializationOnly = errors.length > 0 && errors.every(
        (e: any) => e?.message?.includes("Can't serialize") || e?.message?.includes('serialize value')
      );
      if (isSerializationOnly || err?.data?.createHousingRequest) {
        setSubmitted(true);
      } else {
        console.error('Housing request submission error:', err);
        setError('Failed to submit. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 text-center ${className}`}>
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Tumepokea maombi yako!
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Timu yetu itakutafutia nyumba inayofaa na kukuarifu kupitia WhatsApp.
        </p>
        {onClose && (
          <button onClick={onClose} className="text-sm text-blue-600 hover:underline">
            Funga
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        🏠 Hukupata unachotaka?
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Tuambie unataka nini na tutakutafutia.
      </p>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            placeholder="Namba ya simu *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="col-span-2 sm:col-span-1 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Jina lako"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-2 sm:col-span-1 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <textarea
          placeholder="Eleza unataka nyumba ya aina gani... (eneo, bei, vyumba, n.k.) *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Eneo (mfano: Kinondoni)"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Bajeti (TZS)"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Vyumba"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            min="1"
            max="20"
            className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Lini unataka kuhamia?"
            value={moveInDate}
            onChange={(e) => setMoveInDate(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !phone || !description}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {submitting ? 'Inatuma...' : '💾 Tuma Maombi'}
        </button>
      </div>
    </form>
  );
}
