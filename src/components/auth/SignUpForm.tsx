'use client';

import { useState } from 'react';
import { validateInternationalPhone, normalizePhoneNumber } from '@/lib/utils/phoneValidation';
import { PhoneInput } from '@/components/ui/PhoneInput';

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface SignUpFormProps {
  onSubmit: (data: SignUpData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function SignUpForm({ onSubmit, loading, error }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validatePhoneNumber = (phone: string): boolean => {
    return validateInternationalPhone(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters long');
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setValidationError('Please enter a valid phone number');
      return;
    }

    await onSubmit({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: normalizePhoneNumber(formData.phoneNumber), // Normalize to international format
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
            placeholder="Last name"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
          placeholder="Enter your email"
        />
      </div>
      <PhoneInput
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || '' }))}
        placeholder="Enter phone number"
        required
        helperText="Enter your phone number with country code"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            value={formData.password}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, password: e.target.value }));
              setValidationError(null);
            }}
            className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors"
            placeholder="Create a password"
          />
          <button
            type="button"
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Must be at least 8 characters long
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
              setValidationError(null);
            }}
            className={`w-full px-4 py-3 pr-12 border ${
              formData.confirmPassword && formData.password !== formData.confirmPassword
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-emerald-900 focus:border-gray-900 dark:focus:border-emerald-900 transition-colors`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none transition-colors"
          >
            {showConfirmPassword ? (
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
        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            Passwords do not match
          </p>
        )}
      </div>
      
      {/* Error message */}
      {(error || validationError) && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {validationError || error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 dark:bg-emerald-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}