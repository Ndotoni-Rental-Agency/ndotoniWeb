import { ApplicationFormData } from '@/types/application';
import { SmokingStatus } from '@/generated/graphql';

export function formatDateForAPI(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString();
}

export function buildApplicationInput(
  formData: ApplicationFormData,
  propertyId: string
) {
  return {
    propertyId,
    applicantDetails: {
      dateOfBirth: formatDateForAPI(formData.dateOfBirth),
      occupation: formData.occupation.trim(),
      monthlyIncome: parseFloat(formData.monthlyIncome),
      moveInDate: formatDateForAPI(formData.moveInDate),
      leaseDuration: parseInt(formData.leaseDuration),
      numberOfOccupants: formData.numberOfOccupants ? parseInt(formData.numberOfOccupants) : 1,
      hasPets: formData.hasPets,
      smokingStatus: formData.smokingStatus as SmokingStatus,
      emergencyContact: {
        name: formData.emergencyContactName.trim(),
        relationship: formData.emergencyContactRelationship.trim(),
        phoneNumber: formData.emergencyContactPhone.trim(),
        email: formData.emergencyContactEmail.trim() || null,
      },
    },
    employment: null,
    references: [],
    documents: null, 
  };
}

