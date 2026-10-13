import {
  Home,
  Building2,
  BedDouble,
  DoorOpen,
  Store,
  type LucideIcon,
} from 'lucide-react';

export const PROPERTY_TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'HOUSE', label: 'House', icon: Home },
  { value: 'APARTMENT', label: 'Apartment', icon: Building2 },
  { value: 'STUDIO', label: 'Studio', icon: BedDouble },
  { value: 'ROOM', label: 'Room', icon: DoorOpen },
  { value: 'COMMERCIAL', label: 'Commercial', icon: Store },
];

export const STEPS = [
  { id: 1, label: 'Property Type' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Pricing & Details' },
  { id: 4, label: 'Photos & Publish' },
];
