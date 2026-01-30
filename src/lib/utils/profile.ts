/**
 * Profile utility functions
 */

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate date of birth (must be at least 18 years old)
 */
export function isValidAge(dateOfBirth: string, minAge: number = 18): boolean {
  const age = calculateAge(dateOfBirth);
  return age >= minAge;
}

/**
 * Format gender for display
 */
export function formatGender(gender: string): string {
  switch (gender?.toLowerCase()) {
    case 'male':
      return 'Male';
    case 'female':
      return 'Female';
    case 'other':
      return 'Other';
    case 'prefer_not_to_say':
      return 'Prefer not to say';
    default:
      return '';
  }
}

/**
 * Get profile completion percentage
 */
export function getProfileCompletion(user: any): number {
  if (!user) return 0;
  
  const fields = [
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'whatsappNumber',
    'dateOfBirth',
    'gender',
    'occupation',
    'address',
    'region',
    'district',
    'emergencyContactName',
    'emergencyContactPhone'
  ];
  
  const filledFields = fields.filter(field => {
    const value = user[field];
    return value && value.toString().trim() !== '';
  });
  
  return Math.round((filledFields.length / fields.length) * 100);
}

/**
 * Mask National ID for security - only show last 4 digits
 */
export function maskNationalId(nationalId: string): string {
  if (!nationalId || nationalId.length < 4) return nationalId;
  return `****${nationalId.slice(-4)}`;
}

/**
 * Check if National ID is masked
 */
export function isNationalIdMasked(nationalId: string): boolean {
  return nationalId.startsWith('****');
}
export function getMissingProfileFields(user: any): string[] {
  if (!user) return [];
  
  const fieldLabels: Record<string, string> = {
    phoneNumber: 'Phone Number',
    whatsappNumber: 'WhatsApp Number',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    occupation: 'Occupation',
    address: 'Address Details',
    region: 'Region',
    district: 'District',
    emergencyContactName: 'Emergency Contact Name',
    emergencyContactPhone: 'Emergency Contact Phone'
  };
  
  const missingFields: string[] = [];
  
  Object.entries(fieldLabels).forEach(([field, label]) => {
    const value = user[field];
    if (!value || value.toString().trim() === '') {
      missingFields.push(label);
    }
  });
  
  return missingFields;
}