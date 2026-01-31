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
import { 
  ProfileFormData, 
  LocationChangeData, 
  createFormDataFromUser, 
  convertFormDataToUpdateInput 
} from '@/types/profile';

export default function ProfilePage() {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [editingStates, setEditingStates] = useState({
    personalInfo: false,
    addressInfo: false,
    emergencyContact: false
  });
  const { updateProfile, isUpdating } = useUpdateProfile();
  
  // Form state with proper typing
  const [formData, setFormData] = useState<ProfileFormData>(createFormDataFromUser(user));

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(createFormDataFromUser(user));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (field: string, value: string | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleLocationChange = (location: LocationChangeData) => {
    setFormData(prev => ({
      ...prev,
      region: location.region,
      district: location.district,
      ward: location.ward || '',
      street: location.street || ''
    }));
  };

  // Individual section save handlers
  const handleEditSection = (section: keyof typeof editingStates) => {
    setEditingStates(prev => ({ ...prev, [section]: true }));
  };

  const handleCancelSection = (section: keyof typeof editingStates) => {
    // Reset form to current user data
    setFormData(createFormDataFromUser(user));
    setEditingStates(prev => ({ ...prev, [section]: false }));
  };

  const handleSavePersonalInfo = async () => {
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

    try {
      // Format phone numbers before saving
      const personalInfoUpdate: any = {
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        phoneNumber: formData.phoneNumber ? formatWhatsAppNumber(formData.phoneNumber) : null,
        whatsappNumber: formData.whatsappNumber ? formatWhatsAppNumber(formData.whatsappNumber) : null,
        gender: formData.gender || null,
        occupation: formData.occupation || null
      };

      // Handle dateOfBirth - convert to ISO datetime string if provided
      if (formData.dateOfBirth) {
        const birthDate = new Date(formData.dateOfBirth);
        // Set to noon UTC to avoid timezone issues
        birthDate.setUTCHours(12, 0, 0, 0);
        personalInfoUpdate.dateOfBirth = birthDate.toISOString();
      }

      // Only include nationalId if user entered a new one
      if (formData.nationalId && formData.nationalId.trim() !== '') {
        personalInfoUpdate.nationalId = formData.nationalId;
      }

      const result = await updateProfile(personalInfoUpdate);
      if (result.success) {
        toast.success('Personal information updated successfully');
        // Clear the nationalId input field if it was updated
        if (formData.nationalId && formData.nationalId.trim() !== '') {
          setFormData(prev => ({ ...prev, nationalId: '' }));
        }
        // Exit edit mode for this section
        setEditingStates(prev => ({ ...prev, personalInfo: false }));
        // Refresh user data
        await refreshUser();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update personal information');
    }
  };

  const handleSaveAddressInfo = async () => {
    try {
      const addressUpdate = {
        region: formData.region || null,
        district: formData.district || null,
        ward: formData.ward || null,
        street: formData.street || null,
        address: formData.address || null,
        city: formData.city || null
      };

      const result = await updateProfile(addressUpdate);
      if (result.success) {
        toast.success('Address information updated successfully');
        // Exit edit mode for this section
        setEditingStates(prev => ({ ...prev, addressInfo: false }));
        await refreshUser();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update address information');
    }
  };

  const handleSaveEmergencyContact = async () => {
    // Validate emergency contact phone if provided
    if (formData.emergencyContactPhone && !isValidWhatsAppNumber(formData.emergencyContactPhone)) {
      toast.error('Please enter a valid emergency contact phone number');
      return;
    }

    try {
      const emergencyContactUpdate = {
        emergencyContactName: formData.emergencyContactName || null,
        emergencyContactPhone: formData.emergencyContactPhone ? formatWhatsAppNumber(formData.emergencyContactPhone) : null
      };

      const result = await updateProfile(emergencyContactUpdate);
      if (result.success) {
        toast.success('Emergency contact updated successfully');
        // Exit edit mode for this section
        setEditingStates(prev => ({ ...prev, emergencyContact: false }));
        await refreshUser();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update emergency contact');
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    setFormData(createFormDataFromUser(user));
    setEditingStates({
      personalInfo: false,
      addressInfo: false,
      emergencyContact: false
    });
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
        <ProfileHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <PersonalInformationSection
              formData={formData}
              user={user}
              isEditing={editingStates.personalInfo}
              isUpdating={isUpdating}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onPhoneChange={handlePhoneChange}
              onSave={handleSavePersonalInfo}
              onCancel={() => handleCancelSection('personalInfo')}
              onEdit={() => handleEditSection('personalInfo')}
            />

            {/* Address Information */}
            <AddressInformationSection
              formData={formData}
              isEditing={editingStates.addressInfo}
              isUpdating={isUpdating}
              onInputChange={handleInputChange}
              onLocationChange={handleLocationChange}
              onSave={handleSaveAddressInfo}
              onCancel={() => handleCancelSection('addressInfo')}
              onEdit={() => handleEditSection('addressInfo')}
            />

            {/* Emergency Contact */}
            <EmergencyContactSection
              formData={formData}
              isEditing={editingStates.emergencyContact}
              isUpdating={isUpdating}
              onInputChange={handleInputChange}
              onSave={handleSaveEmergencyContact}
              onCancel={() => handleCancelSection('emergencyContact')}
              onEdit={() => handleEditSection('emergencyContact')}
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