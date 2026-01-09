'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchLocations, flattenLocations, getUniqueRegions, getDistrictsByRegion, getWardsByDistrict, LocationItem } from '@/lib/location';
import { BirthdayPicker } from '@/components/shared/forms/BirthdayPicker';

interface BecomeLandlordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BecomeLandlordModal({ isOpen, onClose }: BecomeLandlordModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { user, isAuthenticated, submitLandlordApplication } = useAuth();

  // Location data
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [formData, setFormData] = useState({
    nationalId: '',
    birthDate: '',
    phoneNumber: '',
    alternatePhone: '',
    address: {
      region: '',
      district: '',
      ward: '',
      street: ''
    },
    agreeToTerms: false
  });

  // Load locations when modal opens
  useEffect(() => {
    if (isOpen && locations.length === 0) {
      loadLocations();
    }
  }, [isOpen, locations.length]);

  // Update districts when region changes
  useEffect(() => {
    if (formData.address.region && locations.length > 0) {
      const availableDistricts = getDistrictsByRegion(locations, formData.address.region);
      setDistricts(availableDistricts);
      
      // Reset district and ward if current district is not available
      if (formData.address.district && !availableDistricts.includes(formData.address.district)) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            district: '',
            ward: ''
          }
        }));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.address.region, locations.length]); // Remove formData.address.district from dependencies

  // Update phone number when user data is available
  useEffect(() => {
    if (user?.phoneNumber && !formData.phoneNumber) { // Only set if not already set
      setFormData(prev => ({
        ...prev,
        phoneNumber: user.phoneNumber || ''
      }));
    }
  }, [user?.phoneNumber, formData.phoneNumber]);

  // Update wards when district changes
  useEffect(() => {
    if (formData.address.region && formData.address.district && locations.length > 0) {
      const availableWards = getWardsByDistrict(locations, formData.address.region, formData.address.district);
      setWards(availableWards);
      
      // Reset ward if current ward is not available
      if (formData.address.ward && !availableWards.includes(formData.address.ward)) {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            ward: ''
          }
        }));
      }
    } else {
      setWards([]);
    }
  }, [formData.address.region, formData.address.district, locations.length]); // Remove formData.address.ward from dependencies

  // Clear errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFieldErrors({});
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const loadLocations = async () => {
    setLoadingLocations(true);
    try {
      const locationsData = await fetchLocations();
      const flattenedLocations = flattenLocations(locationsData);
      setLocations(flattenedLocations);
      setRegions(getUniqueRegions(flattenedLocations));
    } catch (err) {
      console.error('Failed to load locations:', err);
      setError('Failed to load location data. Please try again.');
    } finally {
      setLoadingLocations(false);
    }
  };

  if (!isOpen) return null;

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'nationalId':
        if (!value || value.trim().length === 0) {
          return 'National ID is required';
        }
        if (value.length < 10 || value.length > 20) {
          return 'National ID must be between 10-20 characters';
        }
        if (!/^[A-Za-z0-9]+$/.test(value)) {
          return 'National ID can only contain letters and numbers';
        }
        return null;

      case 'birthDate':
        if (!value) {
          return 'Date of birth is required';
        }
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          const actualAge = age - 1;
          if (actualAge < 18) {
            return 'You must be at least 18 years old';
          }
        } else if (age < 18) {
          return 'You must be at least 18 years old';
        }
        
        if (age > 100) {
          return 'Please enter a valid birth date';
        }
        return null;

      case 'phoneNumber':
        if (!value || value.trim().length === 0) {
          return 'Phone number is required';
        }
        // Tanzania phone number validation
        const phoneRegex = /^(\+255|0)[67]\d{8}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid Tanzanian phone number (e.g., +255712345678 or 0712345678)';
        }
        return null;

      case 'alternatePhone':
        if (value && value.trim().length > 0) {
          const phoneRegex = /^(\+255|0)[67]\d{8}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            return 'Please enter a valid Tanzanian phone number';
          }
          // Note: We'll check for duplicate phone numbers during form submission
          // to avoid dependency issues in validation
        }
        return null;

      case 'address.region':
        if (!value || value.trim().length === 0) {
          return 'Region is required';
        }
        return null;

      case 'address.district':
        if (!value || value.trim().length === 0) {
          return 'District is required';
        }
        return null;

      case 'address.ward':
        if (!value || value.trim().length === 0) {
          return 'Ward is required';
        }
        return null;

      case 'address.street':
        if (!value || value.trim().length === 0) {
          return 'Street address is required';
        }
        if (value.length < 5) {
          return 'Street address must be at least 5 characters';
        }
        return null;

      case 'agreeToTerms':
        if (!value) {
          return 'You must agree to the terms and conditions';
        }
        return null;

      default:
        return null;
    }
  };

  const validateAllFields = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate all fields
    const fieldsToValidate = [
      'nationalId',
      'birthDate', 
      'phoneNumber',
      'alternatePhone',
      'address.region',
      'address.district',
      'address.ward',
      'address.street',
      'agreeToTerms'
    ];

    fieldsToValidate.forEach(field => {
      let value;
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'address') {
          value = formData.address[child as keyof typeof formData.address];
        }
      } else {
        value = formData[field as keyof typeof formData];
      }
      
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Validate field on blur/change for immediate feedback
    setTimeout(() => {
      const error = validateField(field, value);
      if (error) {
        setFieldErrors(prev => ({ ...prev, [field]: error }));
      }
    }, 500); // Small delay to avoid validating while user is still typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isAuthenticated) {
      setError('Please sign in first to apply as a landlord');
      setLoading(false);
      return;
    }

    // Validate all fields
    if (!validateAllFields()) {
      setError('Please fix the errors below before submitting');
      setLoading(false);
      return;
    }

    // Additional validation for duplicate phone numbers
    if (formData.alternatePhone && formData.alternatePhone === formData.phoneNumber) {
      setFieldErrors(prev => ({ 
        ...prev, 
        alternatePhone: 'Alternate phone number must be different from primary phone' 
      }));
      setError('Please fix the errors below before submitting');
      setLoading(false);
      return;
    }

    try {
      // Prepare application data
      const applicationData = {
        userId: user?.userId,
        nationalId: formData.nationalId,
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber,
        alternatePhone: formData.alternatePhone,
        address: formData.address
      };

      const result = await submitLandlordApplication(applicationData);
      console.log('Landlord application submitted successfully:', result);
      
      // Show success message
      setSuccess(result.message || 'Application submitted successfully!');
      setError(null);
      
      // Close modal after a short delay to let user see the success message
      setTimeout(() => {
        onClose();
      }, 2000);
      
      // Handle auto-approval
      if (result?.status === 'APPROVED') {
        setSuccess('Congratulations! Your landlord application has been approved. You can now start listing your properties. Redirecting...');
        
        setTimeout(() => {
          onClose();
          // Optionally redirect to landlord dashboard
          window.location.href = '/landlord/properties';
        }, 2000);
      } else {
        setSuccess('Your landlord application has been submitted successfully! We will review your information and upgrade your account within 1-2 business days.');
        
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Become a Landlord</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Join our platform and start listing your properties</p>
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
                <div className="font-medium mb-2">Please fix the following errors:</div>
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Personal Information</h3>
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
                          Pre-filled from your account
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Alternate Phone Number
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Address Information</h3>
                  {loadingLocations && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-400 text-sm transition-colors">
                      Loading location data...
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Region *
                      </label>
                      <select
                        required
                        value={formData.address.region}
                        onChange={(e) => handleInputChange('address.region', e.target.value)}
                        disabled={loadingLocations}
                        className={`w-full px-4 py-3 border ${
                          fieldErrors['address.region'] 
                            ? 'border-red-500 dark:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
                      >
                        <option value="">Select Region</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      {fieldErrors['address.region'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.region']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        District *
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
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      {fieldErrors['address.district'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.district']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Ward *
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
                        <option value="">Select Ward</option>
                        {wards.map(ward => (
                          <option key={ward} value={ward}>{ward}</option>
                        ))}
                      </select>
                      {fieldErrors['address.ward'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.ward']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                        Street Address *
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
                        placeholder="Enter street address"
                      />
                      {fieldErrors['address.street'] && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{fieldErrors['address.street']}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                      className={`mt-1 w-4 h-4 text-red-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-red-500 transition-colors ${
                        fieldErrors.agreeToTerms ? 'border-red-500 dark:border-red-500' : ''
                      }`}
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-gray-700 dark:text-gray-300 transition-colors">
                      I agree to the <a href="/terms" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">Terms of Service</a> and <a href="/privacy" className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors">Privacy Policy</a>, and understand that my information will be verified.
                    </label>
                  </div>
                  {fieldErrors.agreeToTerms && (
                    <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.agreeToTerms}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
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