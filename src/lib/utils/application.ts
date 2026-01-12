import { SmokingStatus } from '@/API';

// Define the form data type locally since the old types are gone
export interface ApplicationFormData {
  dateOfBirth: string;
  occupation: string;
  monthlyIncome: string;
  moveInDate: string;
  leaseDuration: string;
  numberOfOccupants: string;
  hasPets: boolean;
  petDetails?: string;
  smokingStatus: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
}

export interface FormErrors {
  [key: string]: string;
}

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
      monthlyIncome: parseFloat(formData.monthlyIncome),
      occupation: formData.occupation.trim(),
      moveInDate: formatDateForAPI(formData.moveInDate),
      leaseDuration: parseInt(formData.leaseDuration),
      numberOfOccupants: formData.numberOfOccupants ? parseInt(formData.numberOfOccupants) : 1,
      hasPets: formData.hasPets,
      petDetails: formData.petDetails || null,
      smokingStatus: formData.smokingStatus as SmokingStatus,
      emergencyContact: {
        name: formData.emergencyContactName.trim(),
        relationship: formData.emergencyContactRelationship.trim(),
        phoneNumber: formData.emergencyContactPhone.trim(),
        email: formData.emergencyContactEmail.trim() || null,
      },
    },
  };
}

