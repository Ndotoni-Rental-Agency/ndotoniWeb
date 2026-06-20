export const PROPERTY_TYPES = [
  { value: 'HOUSE', label: 'House', emoji: '🏠' },
  { value: 'APARTMENT', label: 'Apartment', emoji: '🏢' },
  { value: 'STUDIO', label: 'Studio', emoji: '🛏️' },
  { value: 'ROOM', label: 'Room', emoji: '🚪' },
  { value: 'COMMERCIAL', label: 'Commercial', emoji: '🏬' },
] as const;

export const SHORT_TERM_PROPERTY_TYPES = [
  { value: 'HOTEL', label: 'Hotel', emoji: '🏨' },
  { value: 'VILLA', label: 'Villa', emoji: '🏡' },
  { value: 'APARTMENT', label: 'Apartment', emoji: '🏢' },
  { value: 'GUESTHOUSE', label: 'Guest House', emoji: '🛖' },
  { value: 'RESORT', label: 'Resort', emoji: '🌴' },
  { value: 'LODGE', label: 'Lodge', emoji: '🏕️' },
  { value: 'HOSTEL', label: 'Hostel', emoji: '🛌' },
  { value: 'OTHER', label: 'Other', emoji: '🏗️' },
] as const;

export const STEPS = [
  { id: 1, label: 'Type & Rental' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Pricing & Details' },
  { id: 4, label: 'Photos & Publish' },
];
