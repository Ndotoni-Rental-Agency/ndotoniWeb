import { PropertyType } from 'nest-ql-schema';

// Import types from nest-ql-schema generated types (avoiding server-side code)
export type {
  Property,
  PropertyCard,
  PropertyPricing,
  PropertySpecifications,
  PropertyMedia,
  PropertyAvailability,
  PropertyType,
  PropertyStatus,
  Address,
  Coordinates,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyCardsResponse,
  AppInitialState
} from 'nest-ql-schema/dist/generated/types';

// Custom filter interface for the frontend
export interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  amenities?: string[];
  moveInDate?: string;
  duration?: number; // in months
}

// Frontend PropertyCard interface (since the generated one might not match our needs)
export interface FrontendPropertyCard {
  propertyId: string;
  title: string;
  monthlyRent: number;
  currency: string;
  bedrooms: number;
  propertyType: PropertyType;
  region: string;
  district: string;
  ward?: string;
  available: boolean;
  thumbnail?: string;
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED';
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING';
  createdBy?: string;
}