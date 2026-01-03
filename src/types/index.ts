// Re-export generated GraphQL types
export * from '@/generated/graphql';

// Additional frontend-specific types
import { 
  PropertyType, 
  PropertyStatus, 
  AccountStatus, 
  UserType,
  ApplicationStatus,
  PropertyCard as GraphQLPropertyCard,
  Property as GraphQLProperty,
  UserProfile as GraphQLUserProfile,
  Application as GraphQLApplication
} from '@/generated/graphql';

// Enhanced property card type for frontend use
export interface PropertyCard extends GraphQLPropertyCard {
  ward?: string; // Additional field for more specific location
}

// Enhanced property type for detailed views
export interface Property extends Omit<GraphQLProperty, 'propertyType' | 'status'> {
  propertyType: PropertyType;
  status: PropertyStatus;
  views?: number;
  favorites?: number;
  isOwner?: boolean;
  isFavorited?: boolean;
}

// User types based on GraphQL union
export interface BaseUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  accountStatus: AccountStatus;
  isEmailVerified: boolean;
  phoneNumber: string;
  profileImage?: string;
  language: string;
  currency: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant extends BaseUser {
  userType: 'TENANT';
}

export interface Landlord extends BaseUser {
  userType: 'LANDLORD';
  businessName?: string;
  businessLicense?: string;
  taxId?: string;
  verificationDocuments?: string[];
}

export interface Admin extends BaseUser {
  userType: 'ADMIN';
  permissions?: string[];
}

export type User = Tenant | Landlord | Admin;

// Application types
export interface Application extends Omit<GraphQLApplication, 'status'> {
  status: ApplicationStatus;
  isOwner?: boolean;
  canReview?: boolean;
}

// Application response type for landlord application submission
export interface ApplicationResponse {
  success: boolean;
  applicationId?: string;
  status?: string;
  message: string;
  submittedAt?: string;
}

// Search and filter types
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
  moveInDate?: string;
  duration?: number;
  q?: string; // search query
}

export interface SearchParams extends PropertyFilters {
  from?: number;
  limit?: number;
  sortBy?: 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Location types
export interface LocationItem {
  region: string;
  district: string;
  ward?: string;
  street?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  count: number;
  total?: number;
  nextToken?: string;
  hasMore?: boolean;
}

// Form types
export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: UserType;
  agreeToTerms: boolean;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PropertyFormData {
  title: string;
  description: string;
  propertyType: PropertyType;
  address: {
    region: string;
    district: string;
    ward: string;
    street: string;
    postalCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  specifications: {
    bedrooms?: number;
    bathrooms?: number;
    squareMeters: number;
    floors?: number;
    furnished: boolean;
    parkingSpaces?: number;
  };
  pricing: {
    monthlyRent: number;
    deposit: number;
    currency: string;
    serviceCharge?: number;
    utilitiesIncluded: boolean;
  };
  availability: {
    available: boolean;
    availableFrom?: string;
    minimumLeaseTerm?: number;
    maximumLeaseTerm?: number;
  };
  amenities: string[];
  media?: {
    images: string[];
    videos?: string[];
    floorPlan?: string;
    virtualTour?: string;
  };
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Modal types
export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

// Theme types
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'solid' | 'outline' | 'ghost' | 'link';