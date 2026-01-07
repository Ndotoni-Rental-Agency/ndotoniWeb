import { EmploymentStatus, SmokingStatus } from '@/generated/graphql';

export const EMPLOYMENT_STATUS_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: 'EMPLOYED_FULL_TIME', label: 'Full-Time Employed' },
  { value: 'EMPLOYED_PART_TIME', label: 'Part-Time Employed' },
  { value: 'SELF_EMPLOYED', label: 'Self-Employed' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'UNEMPLOYED', label: 'Unemployed' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'RETIRED', label: 'Retired' },
];

export const SMOKING_STATUS_OPTIONS: { value: SmokingStatus; label: string }[] = [
  { value: 'NON_SMOKER', label: 'Non-Smoker' },
  { value: 'SMOKER', label: 'Smoker' },
  { value: 'OCCASIONAL', label: 'Occasional Smoker' },
];

export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Friend',
  'Colleague',
  'Other',
];


