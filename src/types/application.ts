import { EmploymentStatus, SmokingStatus } from '@/generated/graphql';

export interface ApplicationFormData {
  // Applicant Details (required)
  monthlyIncome: string;
  occupation: string;
  employmentStatus: EmploymentStatus | '';
  moveInDate: string;
  leaseDuration: string;
  numberOfOccupants: string;
  hasPets: boolean;
  petDetails: string;
  smokingStatus: SmokingStatus | '';
  // Emergency Contact (required)
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  // Employment Details (optional)
  includeEmployment: boolean;
  employerName: string;
  employerPhone: string;
  employerAddress: string;
  jobTitle: string;
  employmentStartDate: string;
  employmentMonthlyIncome: string;
  // References (optional)
  includeReferences: boolean;
  references: ReferenceFormData[];
}

export interface ReferenceFormData {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}

export interface FormErrors {
  [key: string]: string;
}


