import { SmokingStatus } from '@/generated/graphql';

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


