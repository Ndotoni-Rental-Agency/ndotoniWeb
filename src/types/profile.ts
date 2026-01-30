/**
 * Profile-related TypeScript interfaces
 * Based on generated GraphQL types from API.ts
 */

import { UpdateUserInput, UserProfile, Tenant, Landlord, Admin, Agent } from '../API';

// Form data interface for profile updates
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  whatsappNumber: string;
  profileImage: string;
  // Additional fields
  dateOfBirth: string;
  gender: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  // National ID - only store what user enters for editing
  nationalId: string;
  // Display field for showing last 4 digits
  nationalIdLast4: string;
  address: string;
  // Location fields
  region: string;
  district: string;
  ward: string;
  street: string;
  city: string;
}

// Location change interface
export interface LocationChangeData {
  region: string;
  district: string;
  ward?: string;
  street?: string;
}

// Profile update result interface
export interface ProfileUpdateResult {
  success: boolean;
  message?: string;
}

// Type guards for user profile types
export const isTenant = (user: UserProfile): user is Tenant => {
  return user.__typename === 'Tenant';
};

export const isLandlord = (user: UserProfile): user is Landlord => {
  return user.__typename === 'Landlord';
};

export const isAdmin = (user: UserProfile): user is Admin => {
  return user.__typename === 'Admin';
};

export const isAgent = (user: UserProfile): user is Agent => {
  return user.__typename === 'Agent';
};

// Helper function to create form data from user profile
export const createFormDataFromUser = (user: UserProfile | null): ProfileFormData => {
  if (!user) {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      whatsappNumber: '',
      profileImage: '',
      dateOfBirth: '',
      gender: '',
      occupation: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      nationalId: '',
      nationalIdLast4: '',
      address: '',
      region: '',
      district: '',
      ward: '',
      street: '',
      city: '',
    };
  }

  return {
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phoneNumber: user.phoneNumber || '',
    whatsappNumber: user.whatsappNumber || '',
    profileImage: user.profileImage || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    occupation: user.occupation || '',
    emergencyContactName: user.emergencyContactName || '',
    emergencyContactPhone: user.emergencyContactPhone || '',
    nationalId: '',
    nationalIdLast4: user.nationalIdLast4 || '',
    address: user.address || '',
    region: user.region || '',
    district: user.district || '',
    ward: user.ward || '',
    street: user.street || '',
    city: user.city || '',
  };
};

// Helper function to convert form data to UpdateUserInput
export const convertFormDataToUpdateInput = (formData: ProfileFormData): UpdateUserInput => {
  const updateInput: UpdateUserInput = {
    firstName: formData.firstName || null,
    lastName: formData.lastName || null,
    phoneNumber: formData.phoneNumber || null,
    whatsappNumber: formData.whatsappNumber || null,
    profileImage: formData.profileImage || null,
    dateOfBirth: formData.dateOfBirth || null,
    gender: formData.gender || null,
    occupation: formData.occupation || null,
    emergencyContactName: formData.emergencyContactName || null,
    emergencyContactPhone: formData.emergencyContactPhone || null,
    address: formData.address || null,
    region: formData.region || null,
    district: formData.district || null,
    ward: formData.ward || null,
    street: formData.street || null,
    city: formData.city || null,
  };

  // Only include nationalId if user entered a new one
  if (formData.nationalId && formData.nationalId.trim() !== '') {
    updateInput.nationalId = formData.nationalId;
  }

  return updateInput;
};