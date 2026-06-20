export interface Coords {
  latitude?: number;
  longitude?: number;
}

export interface Address {
  region?: string;
  district?: string;
  ward?: string;
  street?: string;
  postalCode?: string;
  coordinates?: Coords;
}

export interface Pricing {
  monthlyRent?: number;
  currency?: string;
  deposit?: number;
  serviceCharge?: number;
  utilitiesIncluded?: boolean;
}

export interface Specifications {
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  floors?: number;
  parkingSpaces?: number;
  furnished?: boolean;
}

export interface Availability {
  available?: boolean;
  availableFrom?: string;
  minimumLeaseTerm?: number;
  maximumLeaseTerm?: number;
}

export interface PropertyData {
  propertyId: string;
  title?: string;
  description?: string;
  propertyType?: string;
  status?: string;
  address?: Address;
  pricing?: Pricing;
  specifications?: Specifications;
  availability?: Availability;
  amenities?: string[];
  media?: { images?: string[]; videos?: string[]; floorPlan?: string; virtualTour?: string };
  // flat fields from DynamoDB
  monthlyRent?: number;
  currency?: string;
  district?: string;
  region?: string;
  ward?: string;
  street?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  furnished?: boolean;
}
