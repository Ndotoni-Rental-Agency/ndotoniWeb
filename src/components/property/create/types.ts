export interface PropertyDraftFormData {
  title: string;
  propertyType: string;
  region: string;
  district: string;
  ward?: string;
  street?: string;
  monthlyRent: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
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
