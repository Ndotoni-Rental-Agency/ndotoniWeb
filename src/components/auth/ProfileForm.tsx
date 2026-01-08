'use client';

import { useState } from 'react';
import { useAuth, UpdateUserInput } from '@/contexts/AuthContext';
import { UserProfile as User } from '@/API';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    businessName: (user as any).businessName || '',
  });

  const validatePhoneNumber = (phone: string): boolean => {
    // Tanzania phone number validation
    const phoneRegex = /^(\+255|255|0)[67]\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('First name and last name are required');
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber || '')) {
      setError('Please enter a valid Tanzania phone number (e.g., +255 XXX XXX XXX)');
      setLoading(false);
      return;
    }

    try {
      const updateInput: UpdateUserInput = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber?.trim() || undefined,
      };

      // Add business name for landlords
      if (user.userType === 'LANDLORD' && formData.businessName.trim()) {
        updateInput.businessName = formData.businessName.trim();
      }

      await updateUser(updateInput);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="Enter your first name"
          required
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Enter your last name"
          required
        />
      </div>

      <Input
        label="Email Address"
        value={user.email}
        disabled
        helperText="Email address cannot be changed. Contact support if you need to update it."
      />

      <Input
        label="Phone Number"
        value={formData.phoneNumber ?? ''}
        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        placeholder="+255 XXX XXX XXX"
        helperText="Enter a valid Tanzania phone number"
        required
      />

      {user.userType === 'LANDLORD' && (
        <Input
          label="Business Name"
          value={formData.businessName}
          onChange={(e) => handleInputChange('businessName', e.target.value)}
          placeholder="Enter your business name (optional)"
          helperText="This will be displayed on your property listings"
        />
      )}

      <div className="pt-4">
        <Button
          type="submit"
          loading={loading}
          fullWidth
          className="md:w-auto"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  );
}