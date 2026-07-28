import { RentalType } from '@/config/features';
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
  BedSingle,
  type LucideIcon,
} from 'lucide-react';

export interface PropertyDraftFormData {
  title: string;
  propertyType: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  monthlyRent: number;
  nightlyRate?: number;
  cleaningFee?: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  minimumStay?: number;
  instantBookEnabled?: boolean;
  guestPhoneNumber?: string;
  guestWhatsappNumber?: string;
  guestEmail?: string;
}

export type FormErrors = Partial<Record<keyof PropertyDraftFormData, string>>;

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
  { value: 'HOSTEL', label: 'Hostel', icon: BedSingle },
];

export const STEPS = [
  { id: 1, label: 'Type & Rental' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Pricing & Details' },
  { id: 4, label: 'Photos & Publish' },
];
