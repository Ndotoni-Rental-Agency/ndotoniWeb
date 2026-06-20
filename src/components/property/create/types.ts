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

export interface PriceSuggestion {
  suggestedPrice: number;
  reasoning: string;
  range: { min: number; max: number };
}
