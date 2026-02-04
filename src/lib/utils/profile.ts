/**
 * Profile utility functions
 */

import { UserProfile } from '@/API';

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate date of birth (must be at least 18 years old)
 */
export function isValidAge(dateOfBirth: string, minAge: number = 18): boolean {
  const age = calculateAge(dateOfBirth);
  return age >= minAge;
}

/**
 * Format gender for display
 */
export function formatGender(gender: string): string {
  switch (gender?.toLowerCase()) {
    case 'male':
      return 'Male';
    case 'female':
      return 'Female';
    case 'other':
      return 'Other';
    case 'prefer_not_to_say':
      return 'Prefer not to say';
    default:
      return '';
  }
}

/**
 * Get profile completion percentage
 */
export function getProfileCompletion(user: UserProfile | null): number {
  if (!user) return 0;
  
  const fields: (keyof UserProfile)[] = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'whatsappNumber',
    'dateOfBirth',
    'gender',
    'occupation',
    'address',
    'region',
    'district',
    'emergencyContactName',
    'emergencyContactPhone'
  ];
  
  const filledFields = fields.filter(field => {
    const value = user[field];
    return value && value.toString().trim() !== '';
  });
  
  return Math.round((filledFields.length / fields.length) * 100);
}

/**
 * Mask National ID for security - only show last 4 digits
 */
export function maskNationalId(nationalId: string): string {
  if (!nationalId || nationalId.length < 4) return nationalId;
  return `****${nationalId.slice(-4)}`;
}

/**
 * Check if National ID is masked
 */
export function isNationalIdMasked(nationalId: string): boolean {
  return nationalId.startsWith('****');
}

/** Translation keys for missing profile fields (use with t('profile.fields.X')) */
export const PROFILE_FIELD_KEYS: Record<string, string> = {
  phoneNumber: 'profile.fields.phoneNumber',
  whatsappNumber: 'profile.fields.whatsappNumber',
  dateOfBirth: 'profile.fields.dateOfBirth',
  gender: 'profile.fields.gender',
  occupation: 'profile.fields.occupation',
  address: 'profile.fields.addressDetails',
  region: 'profile.fields.region',
  district: 'profile.fields.district',
  emergencyContactName: 'profile.fields.emergencyContactName',
  emergencyContactPhone: 'profile.fields.emergencyContactPhone',
};

export function getMissingProfileFields(user: UserProfile | null): string[] {
  if (!user) return [];

  const missingFields: string[] = [];

  (Object.keys(PROFILE_FIELD_KEYS) as (keyof UserProfile)[]).forEach((field) => {
    const value = user[field];
    if (!value || value.toString().trim() === '') {
      missingFields.push(PROFILE_FIELD_KEYS[field]);
    }
  });

  return missingFields;
}