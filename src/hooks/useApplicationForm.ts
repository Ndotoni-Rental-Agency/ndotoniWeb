import { useState, useCallback } from 'react';
import { ApplicationFormData, FormErrors, ReferenceFormData } from '@/types/application';

const initialFormData: ApplicationFormData = {
  monthlyIncome: '',
  occupation: '',
  employmentStatus: '',
  moveInDate: '',
  leaseDuration: '',
  numberOfOccupants: '',
  hasPets: false,
  petDetails: '',
  smokingStatus: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
  emergencyContactEmail: '',
  includeEmployment: false,
  employerName: '',
  employerPhone: '',
  employerAddress: '',
  jobTitle: '',
  employmentStartDate: '',
  employmentMonthlyIncome: '',
  includeReferences: false,
  references: [{ name: '', relationship: '', phoneNumber: '', email: '' }],
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

  const updateReference = useCallback((index: number, field: keyof ReferenceFormData, value: string) => {
    setFormData((prev) => {
      const newReferences = [...prev.references];
      newReferences[index] = { ...newReferences[index], [field]: value };
      return { ...prev, references: newReferences };
    });
    // Clear error
    const errorKey = `reference_${index}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [formErrors]);

  const addReference = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { name: '', relationship: '', phoneNumber: '', email: '' }],
    }));
  }, []);

  const removeReference = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    // Applicant Details validation
    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      errors.monthlyIncome = 'Monthly income is required and must be greater than 0';
    }
    if (!formData.occupation?.trim()) {
      errors.occupation = 'Occupation is required';
    }
    if (!formData.employmentStatus) {
      errors.employmentStatus = 'Employment status is required';
    }
    if (!formData.moveInDate) {
      errors.moveInDate = 'Move-in date is required';
    }
    if (!formData.leaseDuration || parseInt(formData.leaseDuration) <= 0) {
      errors.leaseDuration = 'Lease duration is required (in months)';
    }
    if (!formData.numberOfOccupants || parseInt(formData.numberOfOccupants) <= 0) {
      errors.numberOfOccupants = 'Number of occupants is required';
    }
    if (formData.hasPets && !formData.petDetails?.trim()) {
      errors.petDetails = 'Pet details are required when you have pets';
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

    // Employment Details validation (if included)
    if (formData.includeEmployment) {
      if (!formData.employerName?.trim()) {
        errors.employerName = 'Employer name is required';
      }
      if (!formData.employerPhone?.trim()) {
        errors.employerPhone = 'Employer phone is required';
      }
      if (!formData.employerAddress?.trim()) {
        errors.employerAddress = 'Employer address is required';
      }
      if (!formData.jobTitle?.trim()) {
        errors.jobTitle = 'Job title is required';
      }
      if (!formData.employmentStartDate) {
        errors.employmentStartDate = 'Employment start date is required';
      }
      if (!formData.employmentMonthlyIncome || parseFloat(formData.employmentMonthlyIncome) <= 0) {
        errors.employmentMonthlyIncome = 'Employment monthly income is required';
      }
    }

    // References validation (if included)
    if (formData.includeReferences) {
      formData.references.forEach((ref, index) => {
        if (!ref.name?.trim()) {
          errors[`reference_${index}_name`] = 'Reference name is required';
        }
        if (!ref.relationship?.trim()) {
          errors[`reference_${index}_relationship`] = 'Reference relationship is required';
        }
        if (!ref.phoneNumber?.trim()) {
          errors[`reference_${index}_phoneNumber`] = 'Reference phone number is required';
        }
      });
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
    updateReference,
    addReference,
    removeReference,
    validateForm,
    resetForm,
  };
}


