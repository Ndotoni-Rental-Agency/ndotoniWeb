import { SmokingStatus } from '@/generated/graphql';

export interface ApplicationFormData {
  // Essential Applicant Details
  dateOfBirth: string;
  occupation: string;
  monthlyIncome: string;
  moveInDate: string;
  leaseDuration: string;
  numberOfOccupants: string;
  hasPets: boolean;
  smokingStatus: SmokingStatus | '';
  // Emergency Contact (required)
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
}

export interface FormErrors {
  [key: string]: string;
}


