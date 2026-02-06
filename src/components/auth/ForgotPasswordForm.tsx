'use client';

import { useState } from 'react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function ForgotPasswordForm({ onSubmit, loading, error }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
          placeholder="Enter your email"
        />
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 dark:bg-emerald-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Sending...' : 'Send reset code'}
      </button>
    </form>
  );
}