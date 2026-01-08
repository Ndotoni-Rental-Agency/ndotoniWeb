import { SmokingStatus } from '@/API';

export const SMOKING_STATUS_OPTIONS: { value: SmokingStatus; label: string }[] = [
  { value: SmokingStatus.NON_SMOKER, label: 'Non-Smoker' },
  { value: SmokingStatus.SMOKER, label: 'Smoker' },
  { value: SmokingStatus.OCCASIONAL, label: 'Occasional Smoker' },
];

export const RELATIONSHIP_OPTIONS = [
  'Spouse',
  'Parent',
  'Sibling',
  'Friend',
  'Colleague',
  'Other',
];


