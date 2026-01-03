export const CREATE_PROPERTY_STEPS = [
  {
    id: 1,
    name: 'Basic Info',
    description: 'Property details and type'
  },
  {
    id: 2,
    name: 'Location',
    description: 'Address selection'
  },
  {
    id: 3,
    name: 'Specifications',
    description: 'Rooms and features'
  },
  {
    id: 4,
    name: 'Pricing',
    description: 'Rent and fees'
  },
  {
    id: 5,
    name: 'Availability',
    description: 'Lease terms'
  },
  {
    id: 6,
    name: 'Media',
    description: 'Photos and videos'
  }
] as const;

export type StepId = typeof CREATE_PROPERTY_STEPS[number]['id'];