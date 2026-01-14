/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type SuccessResponse = {
  __typename: "SuccessResponse",
  message: string,
  success: boolean,
};

export type PropertyMediaInput = {
  floorPlan?: string | null,
  images?: Array< string > | null,
  videos?: Array< string > | null,
  virtualTour?: string | null,
};

export type Property = {
  __typename: "Property",
  address: Address,
  agent?: PropertyUser | null,
  agentId?: string | null,
  amenities?: Array< string > | null,
  availability: PropertyAvailability,
  createdAt: string,
  description: string,
  landlord?: PropertyUser | null,
  landlordId: string,
  media?: PropertyMedia | null,
  pricing: PropertyPricing,
  propertyId: string,
  propertyType: PropertyType,
  specifications: PropertySpecifications,
  pricing: PropertyPricing,
  amenities?: Array< string > | null,
  media?: PropertyMedia | null,
  availability: PropertyAvailability,
  status: PropertyStatus,
  version?: number | null,
  createdAt: string,
  updatedAt: string,
};

export type Address = {
  __typename: "Address",
  street: string,
  ward: string,
  district: string,
  region: string,
  postalCode?: string | null,
  coordinates?: Coordinates | null,
};

export type Coordinates = {
  __typename: "Coordinates",
  latitude: number,
  longitude: number,
};

export type PropertyUser = {
  __typename: "PropertyUser",
  firstName: string,
  lastName: string,
};

export type PropertyAvailability = {
  __typename: "PropertyAvailability",
  available: boolean,
  availableFrom?: string | null,
  maximumLeaseTerm?: number | null,
  minimumLeaseTerm?: number | null,
};

export type PropertyMedia = {
  __typename: "PropertyMedia",
  floorPlan?: string | null,
  images?: Array< string > | null,
  videos?: Array< string > | null,
  virtualTour?: string | null,
};

export type PropertyPricing = {
  __typename: "PropertyPricing",
  currency: string,
  deposit: number,
  monthlyRent: number,
  serviceCharge?: number | null,
  utilitiesIncluded?: boolean | null,
};

export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  STUDIO = "STUDIO",
  ROOM = "ROOM",
  COMMERCIAL = "COMMERCIAL",
  LAND = "LAND",
}


export type PropertySpecifications = {
  __typename: "PropertySpecifications",
  squareMeters: number,
  bedrooms?: number | null,
  bathrooms?: number | null,
  floors?: number | null,
  parkingSpaces?: number | null,
  furnished?: boolean | null,
};

export type PropertyPricing = {
  __typename: "PropertyPricing",
  monthlyRent: number,
  deposit: number,
  currency: string,
  utilitiesIncluded?: boolean | null,
  serviceCharge?: number | null,
};

export type PropertyMedia = {
  __typename: "PropertyMedia",
  images?: Array< string > | null,
  videos?: Array< string > | null,
  virtualTour?: string | null,
  floorPlan?: string | null,
};

export type PropertyAvailability = {
  __typename: "PropertyAvailability",
  available: boolean,
  availableFrom?: string | null,
  minimumLeaseTerm?: number | null,
  maximumLeaseTerm?: number | null,
};

export enum PropertyStatus {
  DRAFT = "DRAFT",
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  MAINTENANCE = "MAINTENANCE",
  DELETED = "DELETED",
}


export type CreateConversationInput = {
  tenantId: string,
  landlordId: string,
  propertyId: string,
  propertyTitle: string,
  initialMessage?: string | null,
};

export type Conversation = {
  __typename: "Conversation",
  id: string,
  landlord?: Landlord | null,
  landlordId: string,
  propertyId: string,
  propertyTitle: string,
  lastMessage: string,
  lastMessageSender: string,
  lastMessageTime: string,
  property?: Property | null,
  propertyId: string,
  propertyTitle: string,
  tenant?: Tenant | null,
  tenantId: string,
  unreadCount: string,
  createdAt: string,
  updatedAt: string,
};

export type Landlord = {
  __typename: "Landlord",
  accountStatus?: AccountStatus | null,
  businessLicense?: string | null,
  businessName?: string | null,
  createdAt?: string | null,
  currency?: string | null,
  email: string,
  emailNotifications?: boolean | null,
  firstName: string,
  isEmailVerified?: boolean | null,
  language?: string | null,
  lastName: string,
  phoneNumber?: string | null,
  profileImage?: string | null,
  pushNotifications?: boolean | null,
  smsNotifications?: boolean | null,
  taxId?: string | null,
  updatedAt?: string | null,
  userType: UserType,
  verificationDocuments?: Array< string > | null,
};

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  PENDING_LANDLORD_VERIFICATION = "PENDING_LANDLORD_VERIFICATION",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  SUSPENDED = "SUSPENDED",
}


export enum UserType {
  ADMIN = "ADMIN",
  AGENT = "AGENT",
  LANDLORD = "LANDLORD",
  TENANT = "TENANT",
}


export type Tenant = {
  __typename: "Tenant",
  accountStatus?: AccountStatus | null,
  createdAt?: string | null,
  currency?: string | null,
  email: string,
  emailNotifications?: boolean | null,
  firstName: string,
  isEmailVerified?: boolean | null,
  language?: string | null,
  lastName: string,
  phoneNumber?: string | null,
  profileImage?: string | null,
  pushNotifications?: boolean | null,
  smsNotifications?: boolean | null,
  updatedAt?: string | null,
  userType: UserType,
};

export type CreateLocationInput = {
  type: LocationType,
  name: string,
  parent?: string | null,
};

export enum LocationType {
  REGION = "REGION",
  DISTRICT = "DISTRICT",
  WARD = "WARD",
  STREET = "STREET",
}


export type LocationCreateResponse = {
  __typename: "LocationCreateResponse",
  success: boolean,
  location: LocationResult,
  message: string,
};

export type LocationResult = Region | District | Ward | Street


export type Region = {
  __typename: "Region",
  id: string,
  name: string,
};

export type District = {
  __typename: "District",
  id: string,
  name: string,
  regionId: string,
};

export type Ward = {
  __typename: "Ward",
  id: string,
  name: string,
  districtId: string,
};

export type Street = {
  __typename: "Street",
  id: string,
  name: string,
  wardId: string,
};

export type LocationUpdateResponse = {
  __typename: "LocationUpdateResponse",
  success: boolean,
  message?: string | null,
  location?: Region | null,
};

export type LocationImportResponse = {
  __typename: "LocationImportResponse",
  success: boolean,
  imported: number,
  skipped: number,
  errors?: Array< string > | null,
  message: string,
};

export type LocationJsonResponse = {
  __typename: "LocationJsonResponse",
  success: boolean,
  cloudfrontUrl: string,
  message: string,
};

export type MediaUploadResponse = {
  __typename: "MediaUploadResponse",
  uploadUrl: string,
  key: string,
  fileUrl: string,
};

export type MediaItem = {
  __typename: "MediaItem",
  userId: string,
  actionTime: number,
  media?: PropertyMedia | null,
  additionalFiles?:  Array<MediaFile | null > | null,
};

export type MediaFile = {
  __typename: "MediaFile",
  contentType: string,
  fileUrl: string,
  fileName?: string | null,
};

export type PropertyMediaInput = {
  images?: Array< string > | null,
  videos?: Array< string > | null,
  virtualTour?: string | null,
  floorPlan?: string | null,
};

export type CreatePropertyInput = {
  title: string,
  description: string,
  address: AddressInput,
  propertyType: PropertyType,
  specifications: PropertySpecificationsInput,
  pricing: PropertyPricingInput,
  amenities?: Array< string > | null,
  media?: PropertyMediaInput | null,
  availability: PropertyAvailabilityInput,
};

export type AddressInput = {
  street: string,
  ward: string,
  district: string,
  region: string,
  postalCode?: string | null,
  coordinates?: CoordinatesInput | null,
};

export type CoordinatesInput = {
  latitude: number,
  longitude: number,
};

export type PropertySpecificationsInput = {
  squareMeters: number,
  bedrooms?: number | null,
  bathrooms?: number | null,
  floors?: number | null,
  parkingSpaces?: number | null,
  furnished?: boolean | null,
};

export type PropertyPricingInput = {
  monthlyRent: number,
  deposit: number,
  currency: string,
  utilitiesIncluded?: boolean | null,
  serviceCharge?: number | null,
};

export type PropertyAvailabilityInput = {
  available: boolean,
  availableFrom?: string | null,
  minimumLeaseTerm?: number | null,
  maximumLeaseTerm?: number | null,
};

export type UpdatePropertyInput = {
  title?: string | null,
  description?: string | null,
  address?: AddressInput | null,
  propertyType?: PropertyType | null,
  specifications?: PropertySpecificationsInput | null,
  pricing?: PropertyPricingInput | null,
  amenities?: Array< string > | null,
  media?: PropertyMediaInput | null,
  availability?: PropertyAvailabilityInput | null,
  status?: PropertyStatus | null,
};

export type SuccessResponse = {
  __typename: "SuccessResponse",
  success: boolean,
  message: string,
};

export type FavoriteResponse = {
  __typename: "FavoriteResponse",
  success: boolean,
  isFavorited: boolean,
  message?: string | null,
};

export type PropertyImportResult = {
  __typename: "PropertyImportResult",
  success: boolean,
  imported: number,
  updated: number,
  skipped: number,
  errors: Array< string >,
  message: string,
};

export type SubscriptionPublishResponse = {
  __typename: "SubscriptionPublishResponse",
  success: boolean,
  message?: string | null,
  propertyId?: string | null,
};

export type PropertyUpdateEventInput = {
  propertyId: string,
  eventType: PropertyEventType,
  changes?: Array< PropertyChangeInput > | null,
  timestamp: string,
};

export enum PropertyEventType {
  PRICE_CHANGED = "PRICE_CHANGED",
  STATUS_CHANGED = "STATUS_CHANGED",
  AVAILABILITY_CHANGED = "AVAILABILITY_CHANGED",
  MEDIA_UPDATED = "MEDIA_UPDATED",
  DESCRIPTION_UPDATED = "DESCRIPTION_UPDATED",
  PROPERTY_CREATED = "PROPERTY_CREATED",
}


export type PropertyChangeInput = {
  field: string,
  oldValue?: string | null,
  newValue: string,
};

export type PropertyUpdateEvent = {
  __typename: "PropertyUpdateEvent",
  propertyId: string,
  eventType: PropertyEventType,
  property?: Property | null,
  changes?:  Array<PropertyChange > | null,
  timestamp: string,
};

export type PropertyChange = {
  __typename: "PropertyChange",
  field: string,
  oldValue?: string | null,
  newValue: string,
};

export type SendMessageInput = {
  content: string,
  conversationId: string,
};

export type ChatMessage = {
  __typename: "ChatMessage",
  content: string,
  conversationId: string,
  id: string,
  isRead: boolean,
  senderId: string,
  senderName?: string | null,
  timestamp: string,
};

export type AuthResponse = {
  __typename: "AuthResponse",
  accessToken: string,
  refreshToken: string,
  user: UserProfile,
};

export type UserProfile = Admin | Agent | Landlord | Tenant


export type Admin = {
  __typename: "Admin",
  userId: string,
  email: string,
  phoneNumber?: string | null,
  firstName: string,
  lastName: string,
  userType: UserType,
  accountStatus?: AccountStatus | null,
  isEmailVerified?: boolean | null,
  profileImage?: string | null,
  language?: string | null,
  currency?: string | null,
  emailNotifications?: boolean | null,
  smsNotifications?: boolean | null,
  pushNotifications?: boolean | null,
  permissions?: Array< string > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  userType: UserType,
};

export type Agent = {
  __typename: "Agent",
  accountStatus?: AccountStatus | null,
  agencyName?: string | null,
  createdAt?: string | null,
  currency?: string | null,
  email: string,
  emailNotifications?: boolean | null,
  firstName: string,
  isEmailVerified?: boolean | null,
  language?: string | null,
  lastName: string,
  licenseNumber?: string | null,
  phoneNumber?: string | null,
  profileImage?: string | null,
  pushNotifications?: boolean | null,
  smsNotifications?: boolean | null,
  specializations?: Array< string > | null,
  updatedAt?: string | null,
  userType: UserType,
};

export type SignUpInput = {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  phoneNumber: string,
};

export type SubmitApplicationInput = {
  applicantDetails: ApplicantDetailsInput,
  propertyId: string,
};

export type BecomeLandlordInput = {
  businessName: string,
  businessLicense: string,
  taxId: string,
  verificationDocuments?: Array< string > | null,
};

export enum EmploymentStatus {
  CONTRACT = "CONTRACT",
  EMPLOYED_FULL_TIME = "EMPLOYED_FULL_TIME",
  EMPLOYED_PART_TIME = "EMPLOYED_PART_TIME",
  RETIRED = "RETIRED",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  STUDENT = "STUDENT",
  UNEMPLOYED = "UNEMPLOYED",
}


export enum SmokingStatus {
  NON_SMOKER = "NON_SMOKER",
  OCCASIONAL = "OCCASIONAL",
  SMOKER = "SMOKER",
}


export type Application = {
  __typename: "Application",
  applicant?: Tenant | null,
  applicantDetails: ApplicantDetails,
  applicantUserId: string,
  applicationId: string,
  createdAt: string,
  landlord?: Landlord | null,
  landlordId: string,
  landlordNotes?: string | null,
  property?: Property | null,
  propertyId: string,
  rejectionReason?: string | null,
  status: ApplicationStatus,
  submittedAt: string,
  updatedAt: string,
};

export type ApplicantDetails = {
  __typename: "ApplicantDetails",
  emergencyContact: EmergencyContact,
  employmentStatus: EmploymentStatus,
  hasPets: boolean,
  leaseDuration: number,
  monthlyIncome: number,
  moveInDate: string,
  numberOfOccupants: number,
  occupation: string,
  petDetails?: string | null,
  smokingStatus: SmokingStatus,
};

export type EmergencyContact = {
  __typename: "EmergencyContact",
  email?: string | null,
  name: string,
  phoneNumber: string,
  relationship: string,
};

export enum ApplicationStatus {
  APPROVED = "APPROVED",
  EXPIRED = "EXPIRED",
  REJECTED = "REJECTED",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  WITHDRAWN = "WITHDRAWN",
}


export type LandlordApplicationInput = {
  userId: string,
  nationalId: string,
  birthDate: string,
  phoneNumber: string,
};

export type ApplicationResponse = {
  __typename: "ApplicationResponse",
  applicationId?: string | null,
  message: string,
  status?: string | null,
  submittedAt?: string | null,
  success: boolean,
};

export type FavoriteResponse = {
  __typename: "FavoriteResponse",
  isFavorited: boolean,
  message?: string | null,
  success: boolean,
};

export type UpdateApplicationInput = {
  applicantDetails?: ApplicantDetailsInput | null,
};

export type UpdateApplicationStatusInput = {
  landlordNotes?: string | null,
  rejectionReason?: string | null,
  status: ApplicationStatus,
};

export type LocationUpdateResponse = {
  __typename: "LocationUpdateResponse",
  location?: Region | null,
  message?: string | null,
  success: boolean,
};

export type UpdatePropertyInput = {
  address?: AddressInput | null,
  amenities?: Array< string > | null,
  availability?: PropertyAvailabilityInput | null,
  description?: string | null,
  media?: PropertyMediaInput | null,
  pricing?: PropertyPricingInput | null,
  propertyType?: PropertyType | null,
  specifications?: PropertySpecificationsInput | null,
  status?: PropertyStatus | null,
  title?: string | null,
};

export type UpdateUserInput = {
  firstName?: string | null,
  lastName?: string | null,
  phoneNumber?: string | null,
  preferences?: string | null,
  profileImage?: string | null,
};

export type ApplicationStats = {
  __typename: "ApplicationStats",
  approved: number,
  rejected: number,
  submitted: number,
  total: number,
  underReview: number,
  withdrawn: number,
};

export type CategorizedPropertiesResponse = {
  __typename: "CategorizedPropertiesResponse",
  nearby: CategoryPropertyResponse,
  lowestPrice: CategoryPropertyResponse,
  favorites?: CategoryPropertyResponse | null,
  mostViewed: CategoryPropertyResponse,
  recentlyViewed?: CategoryPropertyResponse | null,
  more: CategoryPropertyResponse,
};

export type CategoryPropertyResponse = {
  __typename: "CategoryPropertyResponse",
  properties:  Array<PropertyCard >,
  nextToken?: string | null,
  count: number,
  category: PropertyCategory,
};

export type PropertyCard = {
  __typename: "PropertyCard",
  available: boolean,
  bedrooms?: number | null,
  category?: PropertyCategory | null,
  currency: string,
  district: string,
  landlordName?: string | null,
  monthlyRent: number,
  propertyId: string,
  title: string,
  monthlyRent: number,
  currency: string,
  propertyType: PropertyType,
  bedrooms?: number | null,
  district: string,
  region: string,
  thumbnail?: string | null,
  available: boolean,
  category?: PropertyCategory | null,
};

export enum PropertySortOption {
  NEWEST_FIRST = "NEWEST_FIRST",
  PRICE_HIGH_LOW = "PRICE_HIGH_LOW",
  PRICE_LOW_HIGH = "PRICE_LOW_HIGH",
}


export type PropertyCardsResponse = {
  __typename: "PropertyCardsResponse",
  properties:  Array<PropertyCard >,
  nextToken?: string | null,
  count: number,
};

export type PropertyListResponse = {
  __typename: "PropertyListResponse",
  properties:  Array<Property >,
  nextToken?: string | null,
  count: number,
};

export type ApplicationListResponse = {
  __typename: "ApplicationListResponse",
  applications:  Array<Application >,
  count: number,
  nextToken?: string | null,
};

export type AssignPropertyAgentMutationVariables = {
  agentId: string,
  propertyId: string,
};

export type AssignPropertyAgentMutation = {
  assignPropertyAgent:  {
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
  },
};

export type AssociateMediaWithPropertyMutationVariables = {
  media: PropertyMediaInput,
  propertyId: string,
};

export type AssociateMediaWithPropertyMutation = {
  associateMediaWithProperty:  {
    __typename: "Property",
    address:  {
      __typename: "Address",
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      maximumLeaseTerm?: number | null,
      minimumLeaseTerm?: number | null,
    },
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    pricing:  {
      __typename: "PropertyPricing",
      currency: string,
      deposit: number,
      monthlyRent: number,
      serviceCharge?: number | null,
      utilitiesIncluded?: boolean | null,
    },
    propertyId: string,
    propertyType: PropertyType,
    specifications:  {
      __typename: "PropertySpecifications",
      bathrooms?: number | null,
      bedrooms?: number | null,
      floors?: number | null,
      furnished?: boolean | null,
      parkingSpaces?: number | null,
      squareMeters: number,
    },
    status: PropertyStatus,
    title: string,
    updatedAt: string,
    version?: number | null,
  },
};

export type CreateConversationMutationVariables = {
  input: CreateConversationInput,
};

export type CreateConversationMutation = {
  createConversation:  {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    propertyTitle: string,
    tenant?:  {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | null,
    tenantId: string,
    unreadCount: string,
    createdAt: string,
    updatedAt: string,
  },
};

export type SendMessageMutationVariables = {
  input: SendMessageInput,
};

export type SendMessageMutation = {
  sendMessage:  {
    __typename: "ChatMessage",
    id: string,
    conversationId: string,
    senderId: string,
    content: string,
    timestamp: string,
    isRead: boolean,
  },
};

export type CreatePropertyMutationVariables = {
  input: CreatePropertyInput,
};

export type CreatePropertyMutation = {
  createProperty:  {
    __typename: "Property",
    address:  {
      __typename: "Address",
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      maximumLeaseTerm?: number | null,
      minimumLeaseTerm?: number | null,
    },
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    pricing:  {
      __typename: "PropertyPricing",
      currency: string,
      deposit: number,
      monthlyRent: number,
      serviceCharge?: number | null,
      utilitiesIncluded?: boolean | null,
    },
    propertyId: string,
    propertyTitle: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    unreadCount: string,
    createdAt: string,
    updatedAt: string,
  },
};

export type DeleteMediaItemMutationVariables = {
  fileUrl: string,
};

export type PublishNewMessageMutation = {
  publishNewMessage?:  {
    __typename: "PublishResult",
    success: boolean,
    message?: string | null,
  } | null,
};

export type DeletePropertyMutationVariables = {
  propertyId: string,
};

export type PublishConversationUpdateMutation = {
  publishConversationUpdate?:  {
    __typename: "PublishResult",
    success: boolean,
    message?: string | null,
  } | null,
};

export type PublishUnreadCountUpdateMutationVariables = {
  input: string,
};

export type PublishUnreadCountUpdateMutation = {
  publishUnreadCountUpdate?:  {
    __typename: "PublishResult",
    success: boolean,
    message?: string | null,
  } | null,
};

export type CreateLocationMutationVariables = {
  input: CreateLocationInput,
};

export type CreateLocationMutation = {
  createLocation:  {
    __typename: "LocationCreateResponse",
    success: boolean,
  },
};

export type GetMediaUploadUrlMutationVariables = {
  contentType: string,
  fileName: string,
};

export type UpdateLocationMutationVariables = {
  locationId: string,
  name: string,
};

export type UpdateLocationMutation = {
  updateLocation:  {
    __typename: "LocationUpdateResponse",
    success: boolean,
    message?: string | null,
    location?:  {
      __typename: "Region",
      id: string,
      name: string,
    } | null,
  },
};

export type ImportLocationsFromCSVMutationVariables = {
  csvData: string,
};

export type ImportLocationsFromCSVMutation = {
  importLocationsFromCSV:  {
    __typename: "LocationImportResponse",
    success: boolean,
    imported: number,
    skipped: number,
    errors?: Array< string > | null,
    message: string,
  },
};

export type RegenerateLocationJsonMutationVariables = {
};

export type RegenerateLocationJsonMutation = {
  regenerateLocationJson:  {
    __typename: "LocationJsonResponse",
    success: boolean,
    cloudfrontUrl: string,
    message: string,
  },
};

export type MarkAsReadMutationVariables = {
  conversationId: string,
};

export type MarkAsReadMutation = {
  markAsRead:  {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    propertyTitle: string,
    tenant?:  {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | null,
    tenantId: string,
    unreadCount: string,
    updatedAt: string,
  },
};

export type MarkPropertyAsAvailableMutationVariables = {
  propertyId: string,
  landlordId: string,
  media: PropertyMediaInput,
};

export type AssociateMediaWithPropertyMutation = {
  associateMediaWithProperty:  {
    __typename: "Property",
    propertyId: string,
    landlordId: string,
    managerId?: string | null,
    title: string,
    description: string,
    address:  {
      __typename: "Address",
      street: string,
      ward: string,
      district: string,
      region: string,
      postalCode?: string | null,
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      maximumLeaseTerm?: number | null,
      minimumLeaseTerm?: number | null,
    },
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
      floorPlan?: string | null,
    } | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      minimumLeaseTerm?: number | null,
      maximumLeaseTerm?: number | null,
    },
    status: PropertyStatus,
    version?: number | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type MarkPropertyAsRentedMutationVariables = {
  propertyId: string,
  tenantId: string,
};

export type CreatePropertyMutation = {
  createProperty:  {
    __typename: "Property",
    propertyId: string,
    landlordId: string,
    managerId?: string | null,
    title: string,
    description: string,
    address:  {
      __typename: "Address",
      street: string,
      ward: string,
      district: string,
      region: string,
      postalCode?: string | null,
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    media?:  {
      __typename: "PropertyMedia",
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
      floorPlan?: string | null,
    } | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      minimumLeaseTerm?: number | null,
      maximumLeaseTerm?: number | null,
    },
    status: PropertyStatus,
    version?: number | null,
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    pricing:  {
      __typename: "PropertyPricing",
      currency: string,
      deposit: number,
      monthlyRent: number,
      serviceCharge?: number | null,
      utilitiesIncluded?: boolean | null,
    },
    propertyType: PropertyType,
    specifications:  {
      __typename: "PropertySpecifications",
      squareMeters: number,
      bedrooms?: number | null,
      bathrooms?: number | null,
      floors?: number | null,
      parkingSpaces?: number | null,
      furnished?: boolean | null,
    },
    pricing:  {
      __typename: "PropertyPricing",
      monthlyRent: number,
      deposit: number,
      currency: string,
      utilitiesIncluded?: boolean | null,
      serviceCharge?: number | null,
    },
    amenities?: Array< string > | null,
    media?:  {
      __typename: "PropertyMedia",
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
      floorPlan?: string | null,
    } | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      minimumLeaseTerm?: number | null,
      maximumLeaseTerm?: number | null,
    },
    status: PropertyStatus,
    version?: number | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type DeletePropertyMutationVariables = {
  propertyId: string,
  landlordId: string,
};

export type DeletePropertyMutation = {
  deleteProperty:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type UpdatePropertyStatusMutationVariables = {
  propertyId: string,
  landlordId: string,
  status: PropertyStatus,
};

export type PublishPropertyUpdateEventMutationVariables = {
  input: PropertyUpdateEventInput,
};

export type PublishPropertyUpdateEventMutation = {
  publishPropertyUpdateEvent?:  {
    __typename: "PropertyUpdateEvent",
    changes?:  Array< {
      __typename: "PropertyChange",
      field: string,
      newValue: string,
      oldValue?: string | null,
    } > | null,
    eventType: PropertyEventType,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    timestamp: string,
  } | null,
};

export type PublishUnreadCountUpdateMutationVariables = {
  input: string,
};

export type PublishUnreadCountUpdateMutation = {
  publishUnreadCountUpdate?:  {
    __typename: "PublishResult",
    message?: string | null,
    success: boolean,
  } | null,
};

export type RegenerateLocationJsonMutationVariables = {
};

export type RegenerateLocationJsonMutation = {
  regenerateLocationJson:  {
    __typename: "LocationJsonResponse",
    cloudfrontUrl: string,
    message: string,
    success: boolean,
  },
};

export type RemovePropertyAgentMutationVariables = {
  propertyId: string,
};

export type RemovePropertyAgentMutation = {
  removePropertyAgent:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type ToggleFavoriteMutationVariables = {
  userId: string,
  propertyId: string,
};

export type ToggleFavoriteMutation = {
  toggleFavorite:  {
    __typename: "FavoriteResponse",
    success: boolean,
    isFavorited: boolean,
    message?: string | null,
  },
};

export type ImportPropertiesFromCSVMutationVariables = {
  csvData: string,
};

export type ImportPropertiesFromCSVMutation = {
  importPropertiesFromCSV:  {
    __typename: "PropertyImportResult",
    success: boolean,
  },
};

export type SendMessageMutationVariables = {
  input: SendMessageInput,
};

export type SendMessageMutation = {
  sendMessage:  {
    __typename: "ChatMessage",
    content: string,
    conversationId: string,
    id: string,
    isRead: boolean,
    senderId: string,
    senderName?: string | null,
    timestamp: string,
  },
};

export type SignUpMutationVariables = {
  input: SignUpInput,
};

export type SignUpMutation = {
  signUp:  {
    __typename: "AuthResponse",
    accessToken: string,
    refreshToken: string,
    user: ( {
        __typename: "Tenant",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        createdAt?: string | null,
        updatedAt?: string | null,
        userType: UserType,
      } | {
        __typename: "Agent",
        accountStatus?: AccountStatus | null,
        agencyName?: string | null,
        createdAt?: string | null,
        currency?: string | null,
        email: string,
        emailNotifications?: boolean | null,
        firstName: string,
        isEmailVerified?: boolean | null,
        language?: string | null,
        lastName: string,
        licenseNumber?: string | null,
        phoneNumber?: string | null,
        profileImage?: string | null,
        pushNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        specializations?: Array< string > | null,
        updatedAt?: string | null,
        userType: UserType,
      } | {
        __typename: "Landlord",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        businessName?: string | null,
        businessLicense?: string | null,
        taxId?: string | null,
        updatedAt?: string | null,
        userType: UserType,
        verificationDocuments?: Array< string > | null,
        createdAt?: string | null,
        updatedAt?: string | null,
      } | {
        __typename: "Admin",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        permissions?: Array< string > | null,
        createdAt?: string | null,
        updatedAt?: string | null,
        userType: UserType,
      }
    ),
  },
};

export type SignInMutationVariables = {
  email: string,
  password: string,
};

export type SignInMutation = {
  signIn:  {
    __typename: "AuthResponse",
    accessToken: string,
    refreshToken: string,
    user: ( {
        __typename: "Tenant",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        createdAt?: string | null,
        updatedAt?: string | null,
        userType: UserType,
      } | {
        __typename: "Agent",
        accountStatus?: AccountStatus | null,
        agencyName?: string | null,
        createdAt?: string | null,
        currency?: string | null,
        email: string,
        emailNotifications?: boolean | null,
        firstName: string,
        isEmailVerified?: boolean | null,
        language?: string | null,
        lastName: string,
        licenseNumber?: string | null,
        phoneNumber?: string | null,
        profileImage?: string | null,
        pushNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        specializations?: Array< string > | null,
        updatedAt?: string | null,
        userType: UserType,
      } | {
        __typename: "Landlord",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        phoneNumber?: string | null,
        profileImage?: string | null,
        pushNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        taxId?: string | null,
        updatedAt?: string | null,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        businessName?: string | null,
        businessLicense?: string | null,
        taxId?: string | null,
        verificationDocuments?: Array< string > | null,
        createdAt?: string | null,
        updatedAt?: string | null,
        userType: UserType,
      }
    ),
  },
};

export type SubmitApplicationMutationVariables = {
  input: SubmitApplicationInput,
};

export type SubmitApplicationMutation = {
  submitApplication:  {
    __typename: "Application",
    applicant?:  {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      emergencyContact:  {
        __typename: "EmergencyContact",
        email?: string | null,
        name: string,
        phoneNumber: string,
        relationship: string,
      },
      employmentStatus: EmploymentStatus,
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicantUserId: string,
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    landlordNotes?: string | null,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    rejectionReason?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type SubmitLandlordApplicationMutationVariables = {
  input: LandlordApplicationInput,
};

export type SubmitLandlordApplicationMutation = {
  submitLandlordApplication:  {
    __typename: "ApplicationResponse",
    applicationId?: string | null,
    message: string,
    status?: string | null,
    submittedAt?: string | null,
    success: boolean,
    message: string,
  },
};

export type ToggleFavoriteMutationVariables = {
  propertyId: string,
};

export type ResetPasswordMutation = {
  resetPassword:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type UpdateApplicationMutationVariables = {
  applicationId: string,
  input: UpdateApplicationInput,
};

export type UpdateApplicationMutation = {
  updateApplication:  {
    __typename: "Application",
    applicant?:  {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      emergencyContact:  {
        __typename: "EmergencyContact",
        email?: string | null,
        name: string,
        phoneNumber: string,
        relationship: string,
      },
      employmentStatus: EmploymentStatus,
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicantUserId: string,
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    landlordNotes?: string | null,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    rejectionReason?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type UpdateApplicationStatusMutationVariables = {
  applicationId: string,
  input: UpdateApplicationStatusInput,
};

export type UpdateApplicationStatusMutation = {
  updateApplicationStatus:  {
    __typename: "Application",
    applicant?:  {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      emergencyContact:  {
        __typename: "EmergencyContact",
        email?: string | null,
        name: string,
        phoneNumber: string,
        relationship: string,
      },
      employmentStatus: EmploymentStatus,
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicantUserId: string,
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    landlordNotes?: string | null,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    rejectionReason?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type UpdateLocationMutationVariables = {
  locationId: string,
  name: string,
};

export type UpdateLocationMutation = {
  updateLocation:  {
    __typename: "LocationUpdateResponse",
    location?:  {
      __typename: "Region",
      id: string,
      name: string,
    } | null,
    message?: string | null,
    success: boolean,
  },
};

export type UpdatePropertyMutationVariables = {
  input: UpdatePropertyInput,
  propertyId: string,
};

export type UpdatePropertyMutation = {
  updateProperty:  {
    __typename: "Property",
    address:  {
      __typename: "Address",
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      maximumLeaseTerm?: number | null,
      minimumLeaseTerm?: number | null,
    },
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    pricing:  {
      __typename: "PropertyPricing",
      currency: string,
      deposit: number,
      monthlyRent: number,
      serviceCharge?: number | null,
      utilitiesIncluded?: boolean | null,
    },
    propertyId: string,
    propertyType: PropertyType,
    specifications:  {
      __typename: "PropertySpecifications",
      bathrooms?: number | null,
      bedrooms?: number | null,
      floors?: number | null,
      furnished?: boolean | null,
      parkingSpaces?: number | null,
      squareMeters: number,
    },
    status: PropertyStatus,
    title: string,
    updatedAt: string,
    version?: number | null,
  },
};

export type UpdatePropertyStatusMutationVariables = {
  propertyId: string,
  status: PropertyStatus,
};

export type UpdatePropertyStatusMutation = {
  updatePropertyStatus:  {
    __typename: "Property",
    address:  {
      __typename: "Address",
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      maximumLeaseTerm?: number | null,
      minimumLeaseTerm?: number | null,
    },
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    pricing:  {
      __typename: "PropertyPricing",
      currency: string,
      deposit: number,
      monthlyRent: number,
      serviceCharge?: number | null,
      utilitiesIncluded?: boolean | null,
    },
    propertyId: string,
    propertyType: PropertyType,
    specifications:  {
      __typename: "PropertySpecifications",
      bathrooms?: number | null,
      bedrooms?: number | null,
      floors?: number | null,
      furnished?: boolean | null,
      parkingSpaces?: number | null,
      squareMeters: number,
    },
    status: PropertyStatus,
    title: string,
    updatedAt: string,
    version?: number | null,
  },
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser: ( {
      __typename: "Tenant",
      userId: string,
      email: string,
      phoneNumber?: string | null,
      firstName: string,
      lastName: string,
      userType: UserType,
      accountStatus?: AccountStatus | null,
      isEmailVerified?: boolean | null,
      profileImage?: string | null,
      language?: string | null,
      currency?: string | null,
      emailNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      pushNotifications?: boolean | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      userType: UserType,
    } | {
      __typename: "Agent",
      accountStatus?: AccountStatus | null,
      agencyName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      licenseNumber?: string | null,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      specializations?: Array< string > | null,
      updatedAt?: string | null,
      userType: UserType,
    } | {
      __typename: "Landlord",
      userId: string,
      email: string,
      phoneNumber?: string | null,
      firstName: string,
      lastName: string,
      userType: UserType,
      accountStatus?: AccountStatus | null,
      isEmailVerified?: boolean | null,
      profileImage?: string | null,
      language?: string | null,
      currency?: string | null,
      emailNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      pushNotifications?: boolean | null,
      businessName?: string | null,
      businessLicense?: string | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | {
      __typename: "Admin",
      userId: string,
      email: string,
      phoneNumber?: string | null,
      firstName: string,
      lastName: string,
      userType: UserType,
      accountStatus?: AccountStatus | null,
      isEmailVerified?: boolean | null,
      profileImage?: string | null,
      language?: string | null,
      currency?: string | null,
      emailNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      pushNotifications?: boolean | null,
      permissions?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      userType: UserType,
    }
  ),
};

export type BecomeLandlordMutationVariables = {
  userId: string,
  input: BecomeLandlordInput,
};

export type BecomeLandlordMutation = {
  becomeLandlord:  {
    __typename: "ApplicationResponse",
    success: boolean,
  },
};

export type DummyQueryQueryVariables = {
};

export type DummyQueryQuery = {
  dummyQuery?: string | null,
};

export type GetApplicationQueryVariables = {
  applicationId: string,
};

export type GetApplicationQuery = {
  getApplication?:  {
    __typename: "Application",
    applicationId: string,
    propertyId: string,
    property?:  {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      address:  {
        __typename: "Address",
        street: string,
        ward: string,
        district: string,
        region: string,
        postalCode?: string | null,
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
      },
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        squareMeters: number,
        bedrooms?: number | null,
        bathrooms?: number | null,
        floors?: number | null,
        parkingSpaces?: number | null,
        furnished?: boolean | null,
      },
      pricing:  {
        __typename: "PropertyPricing",
        monthlyRent: number,
        deposit: number,
        currency: string,
        utilitiesIncluded?: boolean | null,
        serviceCharge?: number | null,
      },
      amenities?: Array< string > | null,
      media?:  {
        __typename: "PropertyMedia",
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
        floorPlan?: string | null,
      } | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        minimumLeaseTerm?: number | null,
        maximumLeaseTerm?: number | null,
      },
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    applicantUserId: string,
    applicant?:  {
      __typename: "Tenant",
      userId: string,
      email: string,
      phoneNumber?: string | null,
      firstName: string,
      lastName: string,
      userType: UserType,
      accountStatus?: AccountStatus | null,
      isEmailVerified?: boolean | null,
      profileImage?: string | null,
      language?: string | null,
      currency?: string | null,
      emailNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      pushNotifications?: boolean | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      accountStatus?: AccountStatus | null,
      isEmailVerified?: boolean | null,
      profileImage?: string | null,
      language?: string | null,
      currency?: string | null,
      emailNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      pushNotifications?: boolean | null,
      businessName?: string | null,
      businessLicense?: string | null,
      taxId?: string | null,
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      dateOfBirth: string,
      monthlyIncome: number,
      occupation: string,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicantUserId: string,
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    landlordNotes?: string | null,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    rejectionReason?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  } | null,
};

export type GetApplicationDocumentUploadUrlQueryVariables = {
  applicationId: string,
  fileName: string,
  fileType: string,
};

export type GetApplicationDocumentUploadUrlQuery = {
  getApplicationDocumentUploadUrl:  {
    __typename: "MediaUploadResponse",
    fileUrl: string,
    key: string,
    uploadUrl: string,
  },
};

export type GetApplicationStatsQueryVariables = {
  landlordId: string,
};

export type GetApplicationStatsQuery = {
  getApplicationStats:  {
    __typename: "ApplicationStats",
    total: number,
    submitted: number,
    underReview: number,
    approved: number,
    rejected: number,
    withdrawn: number,
  },
};

export type GetCategorizedPropertiesQueryVariables = {
  limitPerCategory?: number | null,
};

export type GetCategorizedPropertiesQuery = {
  getCategorizedProperties:  {
    __typename: "CategorizedPropertiesResponse",
    favorites?:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        available: boolean,
        bedrooms?: number | null,
        category?: PropertyCategory | null,
        currency: string,
        district: string,
        landlordName?: string | null,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    } | null,
    lowestPrice:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        available: boolean,
        bedrooms?: number | null,
        category?: PropertyCategory | null,
        currency: string,
        district: string,
        landlordName?: string | null,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    },
    more:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        available: boolean,
        bedrooms?: number | null,
        category?: PropertyCategory | null,
        currency: string,
        district: string,
        landlordName?: string | null,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    },
    mostViewed:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        available: boolean,
        bedrooms?: number | null,
        category?: PropertyCategory | null,
        currency: string,
        district: string,
        landlordName?: string | null,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    },
    nearby:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        available: boolean,
        bedrooms?: number | null,
        category?: PropertyCategory | null,
        currency: string,
        district: string,
        landlordName?: string | null,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    },
    recentlyViewed?:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        available: boolean,
        bedrooms?: number | null,
        category?: PropertyCategory | null,
        currency: string,
        district: string,
        landlordName?: string | null,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    } | null,
  },
};

export type GetConversationMessagesQueryVariables = {
  conversationId: string,
};

export type GetConversationMessagesQuery = {
  getConversationMessages:  Array< {
    __typename: "ChatMessage",
    id: string,
    conversationId: string,
    senderId: string,
    senderName?: string | null,
    timestamp: string,
    isRead: boolean,
  } >,
};

export type GetUnreadCountQueryVariables = {
  userId: string,
};

export type GetUnreadCountQuery = {
  getUnreadCount: number,
};

export type GetRegionsQueryVariables = {
};

export type GetRegionsQuery = {
  getRegions:  Array< {
    __typename: "Region",
    id: string,
    name: string,
  } >,
};

export type GetDistrictsQueryVariables = {
  regionId: string,
};

export type GetDistrictsQuery = {
  getDistricts:  Array< {
    __typename: "District",
    id: string,
    name: string,
    regionId: string,
  } >,
};

export type GetMeQueryVariables = {
};

export type GetMeQuery = {
  getMe: ( {
      __typename: "Admin",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      permissions?: Array< string > | null,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | {
      __typename: "Agent",
      accountStatus?: AccountStatus | null,
      agencyName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      licenseNumber?: string | null,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      specializations?: Array< string > | null,
      updatedAt?: string | null,
      userType: UserType,
    } | {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    }
  ) | null,
};

export type GetMediaLibraryQueryVariables = {
};

export type GetMediaLibraryQuery = {
  getMediaLibrary?:  {
    __typename: "MediaItem",
    userId: string,
    actionTime: number,
    media?:  {
      __typename: "PropertyMedia",
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
      floorPlan?: string | null,
    } | null,
    additionalFiles?:  Array< {
      __typename: "MediaFile",
      contentType: string,
      fileUrl: string,
      fileName?: string | null,
    } | null > | null,
  } | null,
};

export type SearchPropertiesQueryVariables = {
  region?: string | null,
  district?: string | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  propertyType?: PropertyType | null,
  bedrooms?: number | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SearchPropertiesQuery = {
  searchProperties:  {
    __typename: "PropertySearchResponse",
    properties:  Array< {
      __typename: "PropertyCard",
      available: boolean,
      bedrooms?: number | null,
      category?: PropertyCategory | null,
      currency: string,
      district: string,
      landlordName?: string | null,
      monthlyRent: number,
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      address:  {
        __typename: "Address",
        street: string,
        ward: string,
        district: string,
        region: string,
        postalCode?: string | null,
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
      },
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        squareMeters: number,
        bedrooms?: number | null,
        bathrooms?: number | null,
        floors?: number | null,
        parkingSpaces?: number | null,
        furnished?: boolean | null,
      },
      pricing:  {
        __typename: "PropertyPricing",
        monthlyRent: number,
        deposit: number,
        currency: string,
        utilitiesIncluded?: boolean | null,
        serviceCharge?: number | null,
      },
      amenities?: Array< string > | null,
      media?:  {
        __typename: "PropertyMedia",
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
        floorPlan?: string | null,
      } | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        minimumLeaseTerm?: number | null,
        maximumLeaseTerm?: number | null,
      },
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } >,
    count: number,
    total: number,
    from: number,
    size: number,
    nextToken?: string | null,
  },
};

export type GetPropertiesByLocationQueryVariables = {
  district?: string | null,
  limit?: number | null,
  nextToken?: string | null,
  region: string,
  sortBy?: PropertySortOption | null,
};

export type GetPropertiesByLocationQuery = {
  getPropertiesByLocation:  {
    __typename: "PropertyCardsResponse",
    count: number,
    nextToken?: string | null,
    properties:  Array< {
      __typename: "PropertyCard",
      available: boolean,
      bedrooms?: number | null,
      category?: PropertyCategory | null,
      currency: string,
      district: string,
      landlordName?: string | null,
      monthlyRent: number,
      propertyId: string,
      propertyType: PropertyType,
      region: string,
      thumbnail?: string | null,
      title: string,
    } >,
  },
};

export type GetPropertyQueryVariables = {
  propertyId: string,
};

export type GetPropertyQuery = {
  getProperty?:  {
    __typename: "Property",
    address:  {
      __typename: "Address",
      coordinates?:  {
        __typename: "Coordinates",
        latitude: number,
        longitude: number,
      } | null,
      district: string,
      postalCode?: string | null,
      region: string,
      street: string,
      ward: string,
    },
    agent?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    agentId?: string | null,
    amenities?: Array< string > | null,
    availability:  {
      __typename: "PropertyAvailability",
      available: boolean,
      availableFrom?: string | null,
      maximumLeaseTerm?: number | null,
      minimumLeaseTerm?: number | null,
    },
    createdAt: string,
    description: string,
    landlord?:  {
      __typename: "PropertyUser",
      firstName: string,
      lastName: string,
    } | null,
    landlordId: string,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    pricing:  {
      __typename: "PropertyPricing",
      currency: string,
      deposit: number,
      monthlyRent: number,
      serviceCharge?: number | null,
      utilitiesIncluded?: boolean | null,
    },
    propertyId: string,
    propertyType: PropertyType,
    specifications:  {
      __typename: "PropertySpecifications",
      bathrooms?: number | null,
      bedrooms?: number | null,
      floors?: number | null,
      furnished?: boolean | null,
      parkingSpaces?: number | null,
      squareMeters: number,
    },
    status: PropertyStatus,
    title: string,
    updatedAt: string,
    version?: number | null,
  } | null,
};

export type GetRegionsQueryVariables = {
};

export type GetRegionsQuery = {
  getRegions:  Array< {
    __typename: "Region",
    id: string,
    name: string,
  } >,
};

export type GetPropertiesByCategoryQueryVariables = {
  category: PropertyCategory,
  limit?: number | null,
  nextToken?: string | null,
  userId?: string | null,
};

export type GetStreetsQuery = {
  getStreets:  Array< {
    __typename: "Street",
    id: string,
    name: string,
    wardId: string,
  } >,
};

export type GetUnreadCountQueryVariables = {
};

export type DummyQueryQueryVariables = {
};

export type DummyQueryQuery = {
  dummyQuery?: string | null,
};

export type GetUserConversationsQueryVariables = {
};

export type GetUserConversationsQuery = {
  getUserConversations:  Array< {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    landlord?:  {
      __typename: "Landlord",
      accountStatus?: AccountStatus | null,
      businessLicense?: string | null,
      businessName?: string | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      taxId?: string | null,
      updatedAt?: string | null,
      userType: UserType,
      verificationDocuments?: Array< string > | null,
    } | null,
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    property?:  {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } | null,
    propertyId: string,
    propertyTitle: string,
    tenant?:  {
      __typename: "Tenant",
      accountStatus?: AccountStatus | null,
      createdAt?: string | null,
      currency?: string | null,
      email: string,
      emailNotifications?: boolean | null,
      firstName: string,
      isEmailVerified?: boolean | null,
      language?: string | null,
      lastName: string,
      phoneNumber?: string | null,
      profileImage?: string | null,
      pushNotifications?: boolean | null,
      smsNotifications?: boolean | null,
      updatedAt?: string | null,
      userType: UserType,
    } | null,
    tenantId: string,
    unreadCount: string,
    updatedAt: string,
  } >,
};

export type GetWardsQueryVariables = {
  districtId: string,
};

export type GetWardsQuery = {
  getWards:  Array< {
    __typename: "Ward",
    districtId: string,
    id: string,
    name: string,
  } >,
};

export type ListAgentPropertiesQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  status?: ApplicationStatus | null,
};

export type ListAgentPropertiesQuery = {
  listAgentProperties:  {
    __typename: "PropertyListResponse",
    count: number,
    nextToken?: string | null,
    properties:  Array< {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } >,
  },
};

export type ListLandlordPropertiesQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLandlordPropertiesQuery = {
  listLandlordProperties:  {
    __typename: "PropertyListResponse",
    count: number,
    nextToken?: string | null,
    properties:  Array< {
      __typename: "Property",
      address:  {
        __typename: "Address",
        coordinates?:  {
          __typename: "Coordinates",
          latitude: number,
          longitude: number,
        } | null,
        district: string,
        postalCode?: string | null,
        region: string,
        street: string,
        ward: string,
      },
      agent?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      agentId?: string | null,
      amenities?: Array< string > | null,
      availability:  {
        __typename: "PropertyAvailability",
        available: boolean,
        availableFrom?: string | null,
        maximumLeaseTerm?: number | null,
        minimumLeaseTerm?: number | null,
      },
      createdAt: string,
      description: string,
      landlord?:  {
        __typename: "PropertyUser",
        firstName: string,
        lastName: string,
      } | null,
      landlordId: string,
      media?:  {
        __typename: "PropertyMedia",
        floorPlan?: string | null,
        images?: Array< string > | null,
        videos?: Array< string > | null,
        virtualTour?: string | null,
      } | null,
      pricing:  {
        __typename: "PropertyPricing",
        currency: string,
        deposit: number,
        monthlyRent: number,
        serviceCharge?: number | null,
        utilitiesIncluded?: boolean | null,
      },
      propertyId: string,
      propertyType: PropertyType,
      specifications:  {
        __typename: "PropertySpecifications",
        bathrooms?: number | null,
        bedrooms?: number | null,
        floors?: number | null,
        furnished?: boolean | null,
        parkingSpaces?: number | null,
        squareMeters: number,
      },
      status: PropertyStatus,
      title: string,
      updatedAt: string,
      version?: number | null,
    } >,
  },
};

export type ListMyApplicationsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  status?: ApplicationStatus | null,
};

export type ListMyApplicationsQuery = {
  listMyApplications:  {
    __typename: "ApplicationListResponse",
    applications:  Array< {
      __typename: "Application",
      applicant?:  {
        __typename: "Tenant",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        createdAt?: string | null,
        updatedAt?: string | null,
        userType: UserType,
      } | null,
      applicantDetails:  {
        __typename: "ApplicantDetails",
        emergencyContact:  {
          __typename: "EmergencyContact",
          email?: string | null,
          name: string,
          phoneNumber: string,
          relationship: string,
        },
        employmentStatus: EmploymentStatus,
        hasPets: boolean,
        leaseDuration: number,
        monthlyIncome: number,
        moveInDate: string,
        numberOfOccupants: number,
        occupation: string,
        petDetails?: string | null,
        smokingStatus: SmokingStatus,
      },
      applicantUserId: string,
      applicationId: string,
      createdAt: string,
      landlord?:  {
        __typename: "Landlord",
        userId: string,
        email: string,
        phoneNumber?: string | null,
        firstName: string,
        lastName: string,
        userType: UserType,
        accountStatus?: AccountStatus | null,
        isEmailVerified?: boolean | null,
        profileImage?: string | null,
        language?: string | null,
        currency?: string | null,
        emailNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        pushNotifications?: boolean | null,
        businessName?: string | null,
        businessLicense?: string | null,
        taxId?: string | null,
        updatedAt?: string | null,
        userType: UserType,
        verificationDocuments?: Array< string > | null,
        createdAt?: string | null,
        updatedAt?: string | null,
      } | null,
      landlordId: string,
      landlordNotes?: string | null,
      property?:  {
        __typename: "Property",
        address:  {
          __typename: "Address",
          district: string,
          postalCode?: string | null,
          region: string,
          street: string,
          ward: string,
        },
        agent?:  {
          __typename: "PropertyUser",
          firstName: string,
          lastName: string,
        } | null,
        agentId?: string | null,
        amenities?: Array< string > | null,
        availability:  {
          __typename: "PropertyAvailability",
          available: boolean,
          availableFrom?: string | null,
          maximumLeaseTerm?: number | null,
          minimumLeaseTerm?: number | null,
        },
        createdAt: string,
        description: string,
        landlord?:  {
          __typename: "PropertyUser",
          firstName: string,
          lastName: string,
        } | null,
        landlordId: string,
        media?:  {
          __typename: "PropertyMedia",
          floorPlan?: string | null,
          images?: Array< string > | null,
          videos?: Array< string > | null,
          virtualTour?: string | null,
        } | null,
        pricing:  {
          __typename: "PropertyPricing",
          currency: string,
          deposit: number,
          monthlyRent: number,
          serviceCharge?: number | null,
          utilitiesIncluded?: boolean | null,
        },
        propertyId: string,
        propertyType: PropertyType,
        specifications:  {
          __typename: "PropertySpecifications",
          bathrooms?: number | null,
          bedrooms?: number | null,
          floors?: number | null,
          furnished?: boolean | null,
          parkingSpaces?: number | null,
          squareMeters: number,
        },
        status: PropertyStatus,
        title: string,
        updatedAt: string,
        version?: number | null,
      } | null,
      propertyId: string,
      rejectionReason?: string | null,
      status: ApplicationStatus,
      submittedAt: string,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
  },
};

export type ListPropertyApplicationsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
  propertyId: string,
  status?: ApplicationStatus | null,
};

export type ListPropertyApplicationsQuery = {
  listPropertyApplications:  {
    __typename: "ApplicationListResponse",
    applications:  Array< {
      __typename: "Application",
      applicant?:  {
        __typename: "Tenant",
        accountStatus?: AccountStatus | null,
        createdAt?: string | null,
        currency?: string | null,
        email: string,
        emailNotifications?: boolean | null,
        firstName: string,
        isEmailVerified?: boolean | null,
        language?: string | null,
        lastName: string,
        phoneNumber?: string | null,
        profileImage?: string | null,
        pushNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        updatedAt?: string | null,
        userType: UserType,
      } | null,
      applicantDetails:  {
        __typename: "ApplicantDetails",
        emergencyContact:  {
          __typename: "EmergencyContact",
          email?: string | null,
          name: string,
          phoneNumber: string,
          relationship: string,
        },
        employmentStatus: EmploymentStatus,
        hasPets: boolean,
        leaseDuration: number,
        monthlyIncome: number,
        moveInDate: string,
        numberOfOccupants: number,
        occupation: string,
        petDetails?: string | null,
        smokingStatus: SmokingStatus,
      },
      applicantUserId: string,
      applicationId: string,
      createdAt: string,
      landlord?:  {
        __typename: "Landlord",
        accountStatus?: AccountStatus | null,
        businessLicense?: string | null,
        businessName?: string | null,
        createdAt?: string | null,
        currency?: string | null,
        email: string,
        emailNotifications?: boolean | null,
        firstName: string,
        isEmailVerified?: boolean | null,
        language?: string | null,
        lastName: string,
        phoneNumber?: string | null,
        profileImage?: string | null,
        pushNotifications?: boolean | null,
        smsNotifications?: boolean | null,
        taxId?: string | null,
        updatedAt?: string | null,
        userType: UserType,
        verificationDocuments?: Array< string > | null,
      } | null,
      landlordId: string,
      landlordNotes?: string | null,
      property?:  {
        __typename: "Property",
        address:  {
          __typename: "Address",
          district: string,
          postalCode?: string | null,
          region: string,
          street: string,
          ward: string,
        },
        agent?:  {
          __typename: "PropertyUser",
          firstName: string,
          lastName: string,
        } | null,
        agentId?: string | null,
        amenities?: Array< string > | null,
        availability:  {
          __typename: "PropertyAvailability",
          available: boolean,
          availableFrom?: string | null,
          maximumLeaseTerm?: number | null,
          minimumLeaseTerm?: number | null,
        },
        createdAt: string,
        description: string,
        landlord?:  {
          __typename: "PropertyUser",
          firstName: string,
          lastName: string,
        } | null,
        landlordId: string,
        media?:  {
          __typename: "PropertyMedia",
          floorPlan?: string | null,
          images?: Array< string > | null,
          videos?: Array< string > | null,
          virtualTour?: string | null,
        } | null,
        pricing:  {
          __typename: "PropertyPricing",
          currency: string,
          deposit: number,
          monthlyRent: number,
          serviceCharge?: number | null,
          utilitiesIncluded?: boolean | null,
        },
        propertyId: string,
        propertyType: PropertyType,
        specifications:  {
          __typename: "PropertySpecifications",
          bathrooms?: number | null,
          bedrooms?: number | null,
          floors?: number | null,
          furnished?: boolean | null,
          parkingSpaces?: number | null,
          squareMeters: number,
        },
        status: PropertyStatus,
        title: string,
        updatedAt: string,
        version?: number | null,
      } | null,
      propertyId: string,
      rejectionReason?: string | null,
      status: ApplicationStatus,
      submittedAt: string,
      updatedAt: string,
    } >,
    count: number,
    nextToken?: string | null,
  },
};

export type DummySubscriptionSubscriptionVariables = {
};

export type DummySubscriptionSubscription = {
  dummySubscription?: string | null,
};
