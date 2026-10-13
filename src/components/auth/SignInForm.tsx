'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function SignInForm({ onSubmit, loading, error }: SignInFormProps) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData.email, formData.password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-gray-300 mb-2">
          {sw ? 'Barua pepe' : 'Email'}
        </label>
        <input
          type="email"
          autoComplete="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-3 border border-stone-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent transition-colors"
          placeholder={sw ? 'Weka barua pepe yako' : 'Enter your email'}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-gray-300 mb-2">
          {sw ? 'Nenosiri' : 'Password'}
        </label>
        <div className="relative">
          <input
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="w-full px-4 py-3 pr-12 border border-stone-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-ink-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-clay-500 focus:border-transparent transition-colors"
            placeholder={sw ? 'Weka nenosiri lako' : 'Enter your password'}
          />
          <button
            type="button"
            aria-label={sw ? (showPassword ? 'Ficha nenosiri' : 'Onyesha nenosiri') : (showPassword ? 'Hide password' : 'Show password')}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
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
        className="w-full bg-brand-600 text-cream-50 py-3.5 rounded-full font-semibold hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-green-sm"
      >
        {loading ? (sw ? 'Inaingia…' : 'Signing in…') : (sw ? 'Ingia' : 'Sign in')}
      </button>
    </form>
  );
}