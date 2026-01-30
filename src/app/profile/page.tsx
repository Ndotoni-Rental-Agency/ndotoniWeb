'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { toast } from 'react-hot-toast';
import { isValidWhatsAppNumber, formatWhatsAppNumber } from '@/lib/utils/whatsapp';
import {
  ProfileHeader,
  PersonalInformationSection,
  AddressInformationSection,
  EmergencyContactSection,
  AccountSettingsSection,
  ProfileCompletionCard,
  LanguageSettingsCard,
  QuickActionsCard,
  DangerZoneCard,
  AuthRequiredView
} from '@/components/profile';

export default function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfile, isUpdating } = useUpdateProfile();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    whatsappNumber: (user as any)?.whatsappNumber || '',
    profileImage: user?.profileImage || '',
    // Additional fields
    dateOfBirth: (user as any)?.dateOfBirth || '',
    gender: (user as any)?.gender || '',
    occupation: (user as any)?.occupation || '',
    emergencyContactName: (user as any)?.emergencyContactName || '',
    emergencyContactPhone: (user as any)?.emergencyContactPhone || '',
    // National ID - only store what user enters for editing
    nationalId: '',
    // Display field for showing last 4 digits
    nationalIdLast4: (user as any)?.nationalIdLast4 || '',
    address: (user as any)?.address || '',
    // Location fields
    region: (user as any)?.region || '',
    district: (user as any)?.district || '',
    ward: (user as any)?.ward || '',
    street: (user as any)?.street || '',
    city: (user as any)?.city || '',
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        whatsappNumber: (user as any)?.whatsappNumber || '',
        profileImage: user.profileImage || '',
        // Additional fields
        dateOfBirth: (user as any)?.dateOfBirth || '',
        gender: (user as any)?.gender || '',
        occupation: (user as any)?.occupation || '',
        emergencyContactName: (user as any)?.emergencyContactName || '',
        emergencyContactPhone: (user as any)?.emergencyContactPhone || '',
        // National ID - only store what user enters for editing
        nationalId: '',
        // Display field for showing last 4 digits
        nationalIdLast4: (user as any)?.nationalIdLast4 || '',
        address: (user as any)?.address || '',
        // Location fields
        region: (user as any)?.region || '',
        district: (user as any)?.district || '',
        ward: (user as any)?.ward || '',
        street: (user as any)?.street || '',
        city: (user as any)?.city || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (location: {
    region: string;
    district: string;
    ward?: string;
    street?: string;
  }) => {
    setFormData(prev => ({
      ...prev,
      region: location.region,
      district: location.district,
      ward: location.ward || '',
      street: location.street || ''
    }));
  };

  const handleSave = async () => {
    // Validate WhatsApp number if provided
    if (formData.whatsappNumber && !isValidWhatsAppNumber(formData.whatsappNumber)) {
      toast.error('Please enter a valid WhatsApp number');
      return;
    }

    // Validate date of birth (must be at least 18 years old for rentals)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        toast.error('You must be at least 18 years old');
        return;
      }
    }

    // Validate emergency contact phone if provided
    if (formData.emergencyContactPhone && !isValidWhatsAppNumber(formData.emergencyContactPhone)) {
      toast.error('Please enter a valid emergency contact phone number');
      return;
    }

    try {
      // Format phone numbers before saving
      const dataToSave: any = {
        ...formData,
        whatsappNumber: formData.whatsappNumber ? formatWhatsAppNumber(formData.whatsappNumber) : '',
        emergencyContactPhone: formData.emergencyContactPhone ? formatWhatsAppNumber(formData.emergencyContactPhone) : ''
      };

      // Only include nationalId if user entered a new one
      if (!formData.nationalId || formData.nationalId.trim() === '') {
        // Remove nationalId from the update if not provided
        const { nationalId, nationalIdLast4, ...dataWithoutNationalId } = dataToSave;
        const result = await updateProfile(dataWithoutNationalId);
        if (result.success) {
          toast.success(result.message || 'Profile updated successfully');
          setIsEditing(false);
          // Refresh user data
          await refreshUser();
        }
      } else {
        // Remove the display field before sending to backend
        const { nationalIdLast4, ...dataForBackend } = dataToSave;
        const result = await updateProfile(dataForBackend);
        if (result.success) {
          toast.success(result.message || 'Profile updated successfully');
          setIsEditing(false);
          // Clear the nationalId input field
          setFormData(prev => ({ ...prev, nationalId: '' }));
          // Refresh user data
          await refreshUser();
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        whatsappNumber: (user as any)?.whatsappNumber || '',
        profileImage: user.profileImage || '',
        // Additional fields
        dateOfBirth: (user as any)?.dateOfBirth || '',
        gender: (user as any)?.gender || '',
        occupation: (user as any)?.occupation || '',
        emergencyContactName: (user as any)?.emergencyContactName || '',
        emergencyContactPhone: (user as any)?.emergencyContactPhone || '',
        // National ID - only store what user enters for editing
        nationalId: '',
        // Display field for showing last 4 digits
        nationalIdLast4: (user as any)?.nationalIdLast4 || '',
        address: (user as any)?.address || '',
        // Location fields
        region: (user as any)?.region || '',
        district: (user as any)?.district || '',
        ward: (user as any)?.ward || '',
        street: (user as any)?.street || '',
        city: (user as any)?.city || '',
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <AuthRequiredView 
        showAuthModal={showAuthModal}
        onShowAuthModal={setShowAuthModal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ProfileHeader 
          user={user}
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <PersonalInformationSection
              formData={formData}
              user={user}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
            />

            {/* Address Information */}
            <AddressInformationSection
              formData={formData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onLocationChange={handleLocationChange}
            />

            {/* Emergency Contact */}
            <EmergencyContactSection
              formData={formData}
              isEditing={isEditing}
              isUpdating={isUpdating}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            {/* Account Settings */}
            <AccountSettingsSection />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <ProfileCompletionCard user={user} />

            {/* Language Settings */}
            <LanguageSettingsCard />

            {/* Quick Actions */}
            <QuickActionsCard />

            {/* Danger Zone */}
            <DangerZoneCard />
          </div>
        </div>
      </div>
    </div>
  );
}