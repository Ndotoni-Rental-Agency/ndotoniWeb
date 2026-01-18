'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useHierarchicalLocation } from '@/hooks/useHierarchicalLocation';
import { BirthdayPicker } from '@/components/shared/forms/BirthdayPicker';

interface BecomeLandlordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeLandlordModal({
  isOpen,
  onClose,
}: BecomeLandlordModalProps) {
  const { user, isAuthenticated, submitLandlordApplication } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Use hierarchical location hook
  const {
    regions,
    districts,
    wards,
    selected,
    selectRegion,
    selectDistrict,
    selectWard,
    loadingRegions,
    error: locationError
  } = useHierarchicalLocation();

  const [formData, setFormData] = useState({
    nationalId: '',
    birthDate: '',
    phoneNumber: '',
    alternatePhone: '',
    address: {
      region: '',
      district: '',
      ward: '',
      street: '',
    },
    agreeToTerms: false,
  });

  /* ---------------- effects ---------------- */

  useEffect(() => {
    if (user?.phoneNumber && !formData.phoneNumber) {
      setFormData((f) => ({ ...f, phoneNumber: user.phoneNumber! }));
    }
  }, [user?.phoneNumber]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
      setFieldErrors({});
    }
  }, [isOpen]);

  // Sync form data with selected locations
  useEffect(() => {
    if (selected.region && formData.address.region !== selected.region.name) {
      setFormData(f => ({
        ...f,
        address: {
          ...f.address,
          region: selected.region?.name || '',
          district: selected.district?.name || '',
          ward: selected.ward?.name || '',
        }
      }));
    }
  }, [selected]);

  /* ---------------- validation ---------------- */

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'nationalId':
        if (!value) return 'National ID is required';
        if (value.length < 10 || value.length > 20)
          return 'National ID must be 10–20 characters';
        if (!/^[A-Za-z0-9]+$/.test(value))
          return 'Only letters and numbers allowed';
        return null;

      case 'birthDate': {
        if (!value) return 'Date of birth is required';
        const birth = new Date(value);
        const age =
          new Date().getFullYear() - birth.getFullYear();
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 100) return 'Please enter a valid birth date';
        return null;
      }

      case 'phoneNumber':
      case 'alternatePhone': {
        if (!value && field === 'alternatePhone') return null;
        const phoneRegex = /^(\+255|0)[67]\d{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, '')))
          return 'Invalid Tanzanian phone number';
        return null;
      }

      case 'address.region':
      case 'address.district':
      case 'address.ward':
      case 'address.street':
        if (!value) return 'This field is required';
        if (field === 'address.street' && value.length < 5)
          return 'Street must be at least 5 characters';
        return null;

      case 'agreeToTerms':
        if (!value) return 'You must agree to the terms';
        return null;

      default:
        return null;
    }
  };

  const validateAll = () => {
    const errors: Record<string, string> = {};
    const fields = [
      'nationalId',
      'birthDate',
      'phoneNumber',
      'alternatePhone',
      'address.region',
      'address.district',
      'address.ward',
      'address.street',
      'agreeToTerms',
    ];

    fields.forEach((field) => {
      const value = field.includes('.')
        ? formData.address[field.split('.')[1] as keyof typeof formData.address]
        : (formData as any)[field];

      const err = validateField(field, value);
      if (err) errors[field] = err;
    });

    if (
      formData.alternatePhone &&
      formData.alternatePhone === formData.phoneNumber
    ) {
      errors.alternatePhone =
        'Alternate phone must differ from primary';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ---------------- handlers ---------------- */

  const handleInputChange = (field: string, value: any) => {
    setFieldErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });

    if (field.startsWith('address.')) {
      const key = field.split('.')[1];
      
      if (key === 'region') {
        // Find and select the region
        const region = regions.find(r => r.name === value);
        if (region) {
          selectRegion(region);
        }
        setFormData((f) => ({
          ...f,
          address: {
            ...f.address,
            region: value,
            district: '',
            ward: '',
          },
        }));
      } else if (key === 'district') {
        // Find and select the district
        const district = districts.find(d => d.name === value);
        if (district) {
          selectDistrict(district);
        }
        setFormData((f) => ({
          ...f,
          address: {
            ...f.address,
            district: value,
            ward: '',
          },
        }));
      } else if (key === 'ward') {
        // Find and select the ward
        const ward = wards.find(w => w.name === value);
        if (ward) {
          selectWard(ward);
        }
        setFormData((f) => ({
          ...f,
          address: {
            ...f.address,
            ward: value,
          },
        }));
      } else {
        setFormData((f) => ({
          ...f,
          address: {
            ...f.address,
            [key]: value,
          },
        }));
      }
    } else {
      setFormData((f) => ({ ...f, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('Please sign in first');
      return;
    }

    if (!validateAll()) {
      setError('Please fix the errors below');
      return;
    }

    setLoading(true);
    try {
      // temporarily remove terms and condition field 
      const { agreeToTerms, ...formDataWithoutTerms } = formData;
      console.log(formDataWithoutTerms);
      const res = await submitLandlordApplication({
        ...formDataWithoutTerms,
      });

      setSuccess(res.message || t('becomeLandlord.success'));
      setTimeout(() => onClose(), 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t('becomeLandlord.error')
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 rounded-t-2xl transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('becomeLandlord.title')}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{t('becomeLandlord.subtitle')}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="px-8 py-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm transition-colors">
                {error}
              </div>
            )}
            {Object.keys(fieldErrors).length > 0 && !error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm transition-colors">
                <div className="font-medium mb-2">{t('landlord.createProperty.fixErrors')}</div>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(fieldErrors).map(([field, error]) => (
                    <li key={field} className="text-xs">
                      {field.includes('.') ? field.split('.')[1].charAt(0).toUpperCase() + field.split('.')[1].slice(1) : field.charAt(0).toUpperCase() + field.slice(1)}: {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm transition-colors">
                {success}
              </div>
            )}

            {!isAuthenticated ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">Sign In Required</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors">Please sign in to your account to apply as a landlord</p>
                <button
                  onClick={onClose}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">{t('becomeLandlord.personalInformation')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        National ID Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nationalId}
                        onChange={(e) => handleInputChange('nationalId', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors.nationalId 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                        placeholder="Enter your national ID"
                      />
                      {fieldErrors.nationalId && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.nationalId}</p>
                      )}
                    </div>
                    <div>
                      <BirthdayPicker
                        label="Date of Birth"
                        value={formData.birthDate}
                        onChange={(value) => handleInputChange('birthDate', value)}
                        required
                        error={fieldErrors.birthDate}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Primary Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className={`w-full px-4 py-3 border ${
                            fieldErrors.phoneNumber 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                          placeholder="+255 712 345 678"
                        />
                        {user?.phoneNumber && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      {fieldErrors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.phoneNumber}</p>
                      )}
                      {user?.phoneNumber && !fieldErrors.phoneNumber && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">
                          {t('becomeLandlord.preFilledFromAccount')}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        {t('becomeLandlord.alternatePhoneNumber')}
                      </label>
                      <input
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors.alternatePhone 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                        placeholder="+255 712 345 678"
                      />
                      {fieldErrors.alternatePhone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors.alternatePhone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">{t('becomeLandlord.addressInformation')}</h3>
                  {loadingRegions && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 text-sm transition-colors">
                      {t('becomeLandlord.loadingLocationData')}
                    </div>
                  )}
                  {locationError && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm transition-colors">
                      {locationError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        {t('becomeLandlord.region')} *
                      </label>
                      <select
                        required
                        value={formData.address.region}
                        onChange={(e) => handleInputChange('address.region', e.target.value)}
                        disabled={loadingRegions}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors['address.region'] 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <option value="">{loadingRegions ? 'Loading...' : t('landlord.createProperty.location.regionPlaceholder')}</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.name}>{region.name}</option>
                        ))}
                      </select>
                      {fieldErrors['address.region'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.region']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        {t('becomeLandlord.district')} *
                      </label>
                      <select
                        required
                        value={formData.address.district}
                        onChange={(e) => handleInputChange('address.district', e.target.value)}
                        disabled={!formData.address.region || districts.length === 0}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors['address.district'] 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <option value="">{districts.length === 0 ? 'Select region first' : t('landlord.createProperty.location.districtPlaceholder')}</option>
                        {districts.map(district => (
                          <option key={district.id} value={district.name}>{district.name}</option>
                        ))}
                      </select>
                      {fieldErrors['address.district'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.district']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        {t('becomeLandlord.ward')} *
                      </label>
                      <select
                        required
                        value={formData.address.ward}
                        onChange={(e) => handleInputChange('address.ward', e.target.value)}
                        disabled={!formData.address.district || wards.length === 0}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors['address.ward'] 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <option value="">{wards.length === 0 ? 'Select district first' : t('landlord.createProperty.location.wardPlaceholder')}</option>
                        {wards.map(ward => (
                          <option key={ward.id} value={ward.name}>{ward.name}</option>
                        ))}
                      </select>
                      {fieldErrors['address.ward'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.ward']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        {t('becomeLandlord.street')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address.street}
                        onChange={(e) => handleInputChange('address.street', e.target.value)}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors['address.street'] 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors`}
                        placeholder={t('landlord.createProperty.location.streetPlaceholder')}
                      />
                      {fieldErrors['address.street'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.street']}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                {/* Terms and Conditions */}
<div>
  <label
    htmlFor="agreeToTerms"
    className="flex items-start gap-3 cursor-pointer select-none"
  >
    {/* Hidden checkbox */}
    <input
      type="checkbox"
      id="agreeToTerms"
      checked={formData.agreeToTerms}
      onChange={(e) =>
        handleInputChange('agreeToTerms', e.target.checked)
      }
      className="sr-only"
    />

    {/* Checkbox UI */}
    <div
      className={`
        mt-1 h-5 w-5 rounded-md border
        flex items-center justify-center
        transition-colors
        ${
          formData.agreeToTerms
            ? 'bg-red-600 border-red-600 dark:bg-red-500 dark:border-red-500'
            : 'bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600'
        }
        ${fieldErrors.agreeToTerms ? 'border-red-500' : ''}
      `}
    >
      {formData.agreeToTerms && (
        <svg
          className="h-4 w-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>

    {/* Text */}
    <span className="text-sm text-gray-700 dark:text-gray-300">
      I agree to the{' '}
      <a
        href="/terms"
        className="text-red-600 dark:text-red-400 hover:underline"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        href="/privacy"
        className="text-red-600 dark:text-red-400 hover:underline"
      >
        Privacy Policy
      </a>, and understand that my information will be verified.
    </span>
  </label>

  {fieldErrors.agreeToTerms && (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {fieldErrors.agreeToTerms}
    </p>
  )}
</div>



                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? t('becomeLandlord.submitting') : t('becomeLandlord.submit')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}