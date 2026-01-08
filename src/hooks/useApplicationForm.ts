import { useState, useCallback } from 'react';
import { ApplicationFormData, FormErrors } from '@/lib/utils/application';

const initialFormData: ApplicationFormData = {
  dateOfBirth: '',
  occupation: '',
  employmentStatus: '',
  monthlyIncome: '',
  moveInDate: '',
  leaseDuration: '',
  numberOfOccupants: '1',
  hasPets: false,
  smokingStatus: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
  emergencyContactEmail: '',
};

export function useApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const updateField = useCallback((field: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    // Essential Applicant Details validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    if (!formData.occupation?.trim()) {
      errors.occupation = 'Occupation is required';
    }
    if (!formData.employmentStatus) {
      errors.employmentStatus = 'Employment status is required';
    }
    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      errors.monthlyIncome = 'Monthly income is required and must be greater than 0';
    }
    if (!formData.moveInDate) {
      errors.moveInDate = 'Move-in date is required';
    }
    if (!formData.leaseDuration || parseInt(formData.leaseDuration) <= 0) {
      errors.leaseDuration = 'Lease duration is required (in months)';
    }
    if (formData.numberOfOccupants && parseInt(formData.numberOfOccupants) <= 0) {
      errors.numberOfOccupants = 'Number of occupants must be at least 1';
    }
    if (!formData.smokingStatus) {
      errors.smokingStatus = 'Smoking status is required';
    }

    // Emergency Contact validation
    if (!formData.emergencyContactName?.trim()) {
      errors.emergencyContactName = 'Emergency contact name is required';
    }
    if (!formData.emergencyContactRelationship?.trim()) {
      errors.emergencyContactRelationship = 'Emergency contact relationship is required';
    }
    if (!formData.emergencyContactPhone?.trim()) {
      errors.emergencyContactPhone = 'Emergency contact phone is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
  }, []);

  return {
    formData,
    formErrors,
    updateField,
    validateForm,
    resetForm,
  };
}


