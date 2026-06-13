import { RentalType } from '@/config/features';

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
  { value: 'HOSTEL', label: 'Hostel', emoji: '🛌' },
] as const;

export const STEPS = [
  { id: 1, label: 'Type & Rental' },
  { id: 2, label: 'Location' },
  { id: 3, label: 'Pricing & Details' },
  { id: 4, label: 'Photos & Publish' },
];
