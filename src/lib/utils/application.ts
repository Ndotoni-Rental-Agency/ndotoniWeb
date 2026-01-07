import { ApplicationFormData } from '@/types/application';
import { EmploymentStatus, SmokingStatus } from '@/generated/graphql';

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
      monthlyIncome: parseFloat(formData.monthlyIncome),
      occupation: formData.occupation.trim(),
      employmentStatus: formData.employmentStatus as EmploymentStatus,
      moveInDate: formatDateForAPI(formData.moveInDate),
      leaseDuration: parseInt(formData.leaseDuration),
      numberOfOccupants: parseInt(formData.numberOfOccupants),
      hasPets: formData.hasPets,
      petDetails: formData.hasPets ? formData.petDetails.trim() : null,
      smokingStatus: formData.smokingStatus as SmokingStatus,
      emergencyContact: {
        name: formData.emergencyContactName.trim(),
        relationship: formData.emergencyContactRelationship.trim(),
        phoneNumber: formData.emergencyContactPhone.trim(),
        email: formData.emergencyContactEmail.trim() || null,
      },
    },
    employment: formData.includeEmployment
      ? {
          employerName: formData.employerName.trim(),
          employerPhone: formData.employerPhone.trim(),
          employerAddress: formData.employerAddress.trim(),
          jobTitle: formData.jobTitle.trim(),
          employmentStartDate: formatDateForAPI(formData.employmentStartDate),
          monthlyIncome: parseFloat(formData.employmentMonthlyIncome),
        }
      : null,
    references:
      formData.includeReferences && formData.references.length > 0
        ? formData.references
            .filter((ref) => ref.name.trim() && ref.phoneNumber.trim())
            .map((ref) => ({
              name: ref.name.trim(),
              relationship: ref.relationship.trim(),
              phoneNumber: ref.phoneNumber.trim(),
              email: ref.email.trim() || null,
            }))
        : [],
    documents: null, 
  };
}

