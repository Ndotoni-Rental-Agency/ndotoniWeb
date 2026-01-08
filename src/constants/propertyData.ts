import { PropertyType } from '@/API';

export const PROPERTY_TYPES: { value: PropertyType; label: string; description: string }[] = [
  { 
    value: PropertyType.APARTMENT, 
    label: 'Apartment',
    description: 'A place that\'s part of a building'
  },
  { 
    value: PropertyType.HOUSE, 
    label: 'House',
    description: 'A standalone residential building'
  },
  { 
    value: PropertyType.STUDIO, 
    label: 'Studio',
    description: 'A single room with kitchen and bathroom'
  },
  { 
    value: PropertyType.COMMERCIAL, 
    label: 'Commercial',
    description: 'Office or retail space'
  },
];

export const COMMON_AMENITIES = [
  'Swimming Pool', 'Gym', 'Security', 'Parking', 'Garden', 'Balcony',
  'Air Conditioning', 'WiFi', 'Generator', 'Water Tank', 'CCTV', 'Elevator'
];