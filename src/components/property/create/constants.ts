import {
  Home,
  Building2,
  BedDouble,
  DoorOpen,
  Store,
  Hotel,
  Castle,
  Warehouse,
  Trees,
  Tent,
  BedSingle,
  HardHat,
  type LucideIcon,
} from 'lucide-react';

export const PROPERTY_TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'HOUSE', label: 'House', icon: Home },
  { value: 'APARTMENT', label: 'Apartment', icon: Building2 },
  { value: 'STUDIO', label: 'Studio', icon: BedDouble },
  { value: 'ROOM', label: 'Room', icon: DoorOpen },
  { value: 'COMMERCIAL', label: 'Commercial', icon: Store },
];

export const SHORT_TERM_PROPERTY_TYPES: { value: string; label: string; icon: LucideIcon }[] = [
  { value: 'HOTEL', label: 'Hotel', icon: Hotel },
  { value: 'VILLA', label: 'Villa', icon: Castle },
  { value: 'APARTMENT', label: 'Apartment', icon: Building2 },
  { value: 'GUESTHOUSE', label: 'Guest House', icon: Warehouse },
  { value: 'RESORT', label: 'Resort', icon: Trees },
  { value: 'LODGE', label: 'Lodge', icon: Tent },
  { value: 'HOSTEL', label: 'Hostel', icon: BedSingle },
  { value: 'OTHER', label: 'Other', icon: HardHat },
];

export const STEPS = [
  { id: 1, label: 'Type & Rental' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Pricing & Details' },
  { id: 4, label: 'Photos & Publish' },
];
