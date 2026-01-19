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
  media?: PropertyMedia | null,
  pricing: PropertyPricing,
  propertyId: string,
  propertyType: PropertyType,
  specifications: PropertySpecifications,
  status: PropertyStatus,
  title: string,
  updatedAt: string,
  version?: number | null,
};

export type Address = {
  __typename: "Address",
  coordinates?: Coordinates | null,
  district: string,
  postalCode?: string | null,
  region: string,
  street?: string | null,
  ward?: string | null,
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
  COMMERCIAL = "COMMERCIAL",
  HOUSE = "HOUSE",
  LAND = "LAND",
  ROOM = "ROOM",
  STUDIO = "STUDIO",
}


export type PropertySpecifications = {
  __typename: "PropertySpecifications",
  bathrooms?: number | null,
  bedrooms?: number | null,
  floors?: number | null,
  furnished?: boolean | null,
  parkingSpaces?: number | null,
  squareMeters: number,
};

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  DELETED = "DELETED",
  DRAFT = "DRAFT",
  MAINTENANCE = "MAINTENANCE",
  RENTED = "RENTED",
}


export type CreateLocationInput = {
  name: string,
  parent?: string | null,
  type: LocationType,
};

export enum LocationType {
  DISTRICT = "DISTRICT",
  REGION = "REGION",
  STREET = "STREET",
  WARD = "WARD",
}


export type LocationCreateResponse = {
  __typename: "LocationCreateResponse",
  location: LocationResult,
  message: string,
  success: boolean,
};

export type LocationResult = District | Region | Street | Ward


export type District = {
  __typename: "District",
  id: string,
  name: string,
  regionId: string,
};

export type Region = {
  __typename: "Region",
  id: string,
  name: string,
};

export type Street = {
  __typename: "Street",
  id: string,
  name: string,
  wardId: string,
};

export type Ward = {
  __typename: "Ward",
  districtId: string,
  id: string,
  name: string,
};

export type CreatePropertyInput = {
  address: AddressInput,
  amenities?: Array< string > | null,
  availability: PropertyAvailabilityInput,
  description: string,
  media?: PropertyMediaInput | null,
  pricing: PropertyPricingInput,
  propertyType: PropertyType,
  specifications: PropertySpecificationsInput,
  title: string,
};

export type AddressInput = {
  coordinates?: CoordinatesInput | null,
  district: string,
  postalCode?: string | null,
  region: string,
  street?: string | null,
  ward?: string | null,
};

export type CoordinatesInput = {
  latitude: number,
  longitude: number,
};

export type PropertyAvailabilityInput = {
  available: boolean,
  availableFrom?: string | null,
  maximumLeaseTerm?: number | null,
  minimumLeaseTerm?: number | null,
};

export type PropertyPricingInput = {
  currency: string,
  deposit: number,
  monthlyRent: number,
  serviceCharge?: number | null,
  utilitiesIncluded?: boolean | null,
};

export type PropertySpecificationsInput = {
  bathrooms?: number | null,
  bedrooms?: number | null,
  floors?: number | null,
  furnished?: boolean | null,
  parkingSpaces?: number | null,
  squareMeters: number,
};

export type CreatePropertyResponse = {
  __typename: "CreatePropertyResponse",
  message: string,
  propertyId: string,
  success: boolean,
};

export type MediaItem = {
  __typename: "MediaItem",
  actionTime: number,
  additionalFiles?:  Array<MediaFile | null > | null,
  media?: PropertyMedia | null,
  userId: string,
};

export type MediaFile = {
  __typename: "MediaFile",
  contentType: string,
  fileName?: string | null,
  fileUrl: string,
};

export type MediaUploadResponse = {
  __typename: "MediaUploadResponse",
  fileUrl: string,
  key: string,
  uploadUrl: string,
};

export type LocationImportResponse = {
  __typename: "LocationImportResponse",
  errors?: Array< string > | null,
  imported: number,
  message: string,
  skipped: number,
  success: boolean,
};

export type PropertyImportResult = {
  __typename: "PropertyImportResult",
  errors: Array< string >,
  imported: number,
  message: string,
  skipped: number,
  success: boolean,
  updated: number,
};

export type ChatInitializationResponse = {
  __typename: "ChatInitializationResponse",
  conversationId: string,
  landlordInfo: ChatLandlordInfo,
  propertyId: string,
  propertyTitle: string,
};

export type ChatLandlordInfo = {
  __typename: "ChatLandlordInfo",
  businessName?: string | null,
  firstName: string,
  lastName: string,
  profileImage?: string | null,
};

export type Conversation = {
  __typename: "Conversation",
  createdAt: string,
  id: string,
  lastMessage: string,
  lastMessageTime: string,
  otherPartyImage?: string | null,
  otherPartyName: string,
  propertyTitle: string,
  unreadCount: number,
  updatedAt: string,
};

export type SubscriptionPublishResponse = {
  __typename: "SubscriptionPublishResponse",
  message?: string | null,
  propertyId?: string | null,
  success: boolean,
};

export type PropertyUpdateEventInput = {
  changes?: Array< PropertyChangeInput > | null,
  eventType: PropertyEventType,
  propertyId: string,
  timestamp: string,
};

export type PropertyChangeInput = {
  field: string,
  newValue: string,
  oldValue?: string | null,
};

export enum PropertyEventType {
  AVAILABILITY_CHANGED = "AVAILABILITY_CHANGED",
  DESCRIPTION_UPDATED = "DESCRIPTION_UPDATED",
  MEDIA_UPDATED = "MEDIA_UPDATED",
  PRICE_CHANGED = "PRICE_CHANGED",
  PROPERTY_CREATED = "PROPERTY_CREATED",
  STATUS_CHANGED = "STATUS_CHANGED",
}


export type PropertyUpdateEvent = {
  __typename: "PropertyUpdateEvent",
  changes?:  Array<PropertyChange > | null,
  eventType: PropertyEventType,
  property?: Property | null,
  propertyId: string,
  timestamp: string,
};

export type PropertyChange = {
  __typename: "PropertyChange",
  field: string,
  newValue: string,
  oldValue?: string | null,
};

export type LocationJsonResponse = {
  __typename: "LocationJsonResponse",
  cloudfrontUrl: string,
  message: string,
  success: boolean,
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
  isMine: boolean,
  isRead: boolean,
  senderName: string,
  timestamp: string,
};

export type AuthResponse = {
  __typename: "AuthResponse",
  accessToken: string,
  refreshToken: string,
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

export type ApplicantDetailsInput = {
  emergencyContact: EmergencyContactInput,
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

export type EmergencyContactInput = {
  email?: string | null,
  name: string,
  phoneNumber: string,
  relationship: string,
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
  applicant?: TenantBasicInfo | null,
  applicantDetails: ApplicantDetails,
  applicationId: string,
  createdAt: string,
  landlord?: LandlordBasicInfo | null,
  landlordNotes?: string | null,
  property?: Property | null,
  propertyId: string,
  rejectionReason?: string | null,
  status: ApplicationStatus,
  submittedAt: string,
  updatedAt: string,
};

export type TenantBasicInfo = {
  __typename: "TenantBasicInfo",
  firstName: string,
  lastName: string,
  profileImage?: string | null,
};

export type ApplicantDetails = {
  __typename: "ApplicantDetails",
  emergencyContact: EmergencyContact,
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

export type LandlordBasicInfo = {
  __typename: "LandlordBasicInfo",
  businessName?: string | null,
  firstName: string,
  lastName: string,
  profileImage?: string | null,
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
  address: AddressInput,
  alternatePhone?: string | null,
  birthDate: string,
  nationalId: string,
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

export type UserProfile = Admin | Agent | Landlord | Tenant


export type Admin = {
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
  favorites?: CategoryPropertyResponse | null,
  lowestPrice: CategoryPropertyResponse,
  more?: CategoryPropertyResponse | null,
  mostViewed?: CategoryPropertyResponse | null,
  nearby: CategoryPropertyResponse,
  recentlyViewed?: CategoryPropertyResponse | null,
};

export type CategoryPropertyResponse = {
  __typename: "CategoryPropertyResponse",
  category: PropertyCategory,
  count: number,
  nextToken?: string | null,
  properties:  Array<PropertyCard >,
};

export enum PropertyCategory {
  FAVORITES = "FAVORITES",
  LOWEST_PRICE = "LOWEST_PRICE",
  MORE = "MORE",
  MOST_VIEWED = "MOST_VIEWED",
  NEARBY = "NEARBY",
  RECENTLY_VIEWED = "RECENTLY_VIEWED",
}


export type PropertyCard = {
  __typename: "PropertyCard",
  bedrooms?: number | null,
  currency: string,
  district: string,
  monthlyRent: number,
  propertyId: string,
  propertyType: PropertyType,
  region: string,
  thumbnail?: string | null,
  title: string,
};

export type InitialAppState = {
  __typename: "InitialAppState",
  categorizedProperties: CategorizedPropertiesResponse,
};

export enum PropertySortOption {
  NEWEST_FIRST = "NEWEST_FIRST",
  PRICE_HIGH_LOW = "PRICE_HIGH_LOW",
  PRICE_LOW_HIGH = "PRICE_LOW_HIGH",
}


export type PropertyCardsResponse = {
  __typename: "PropertyCardsResponse",
  count: number,
  nextToken?: string | null,
  properties:  Array<PropertyCard >,
};

export type PropertyListResponse = {
  __typename: "PropertyListResponse",
  count: number,
  nextToken?: string | null,
  properties:  Array<Property >,
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
      street?: string | null,
      ward?: string | null,
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

export type CreateLocationMutationVariables = {
  input: CreateLocationInput,
};

export type CreateLocationMutation = {
  createLocation:  {
    __typename: "LocationCreateResponse",
    location: ( {
        __typename: "District",
        id: string,
        name: string,
        regionId: string,
      } | {
        __typename: "Region",
        id: string,
        name: string,
      } | {
        __typename: "Street",
        id: string,
        name: string,
        wardId: string,
      } | {
        __typename: "Ward",
        districtId: string,
        id: string,
        name: string,
      }
    ),
    message: string,
    success: boolean,
  },
};

export type CreatePropertyMutationVariables = {
  input: CreatePropertyInput,
};

export type CreatePropertyMutation = {
  createProperty:  {
    __typename: "CreatePropertyResponse",
    message: string,
    propertyId: string,
    success: boolean,
  },
};

export type DeleteMediaItemMutationVariables = {
  fileUrl: string,
};

export type DeleteMediaItemMutation = {
  deleteMediaItem?:  {
    __typename: "MediaItem",
    actionTime: number,
    additionalFiles?:  Array< {
      __typename: "MediaFile",
      contentType: string,
      fileName?: string | null,
      fileUrl: string,
    } | null > | null,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    userId: string,
  } | null,
};

export type DeletePropertyMutationVariables = {
  propertyId: string,
};

export type DeletePropertyMutation = {
  deleteProperty:  {
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
  },
};

export type DummyMutationMutationVariables = {
};

export type DummyMutationMutation = {
  dummyMutation?: string | null,
};

export type ForgotPasswordMutationVariables = {
  email: string,
};

export type ForgotPasswordMutation = {
  forgotPassword:  {
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
  },
};

export type GetMediaUploadUrlMutationVariables = {
  contentType: string,
  fileName: string,
};

export type GetMediaUploadUrlMutation = {
  getMediaUploadUrl:  {
    __typename: "MediaUploadResponse",
    fileUrl: string,
    key: string,
    uploadUrl: string,
  },
};

export type ImportLocationsFromCSVMutationVariables = {
  csvData: string,
};

export type ImportLocationsFromCSVMutation = {
  importLocationsFromCSV:  {
    __typename: "LocationImportResponse",
    errors?: Array< string > | null,
    imported: number,
    message: string,
    skipped: number,
    success: boolean,
  },
};

export type ImportPropertiesFromCSVMutationVariables = {
  csvData: string,
};

export type ImportPropertiesFromCSVMutation = {
  importPropertiesFromCSV:  {
    __typename: "PropertyImportResult",
    errors: Array< string >,
    imported: number,
    message: string,
    skipped: number,
    success: boolean,
    updated: number,
  },
};

export type InitializePropertyChatMutationVariables = {
  propertyId: string,
};

export type InitializePropertyChatMutation = {
  initializePropertyChat:  {
    __typename: "ChatInitializationResponse",
    conversationId: string,
    landlordInfo:  {
      __typename: "ChatLandlordInfo",
      businessName?: string | null,
      firstName: string,
      lastName: string,
      profileImage?: string | null,
    },
    propertyId: string,
    propertyTitle: string,
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
    lastMessage: string,
    lastMessageTime: string,
    otherPartyImage?: string | null,
    otherPartyName: string,
    propertyTitle: string,
    unreadCount: number,
    updatedAt: string,
  },
};

export type MarkPropertyAsAvailableMutationVariables = {
  propertyId: string,
};

export type MarkPropertyAsAvailableMutation = {
  markPropertyAsAvailable:  {
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
      street?: string | null,
      ward?: string | null,
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

export type MarkPropertyAsRentedMutationVariables = {
  propertyId: string,
  tenantId: string,
};

export type MarkPropertyAsRentedMutation = {
  markPropertyAsRented:  {
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
      street?: string | null,
      ward?: string | null,
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

export type PublishNewPropertyEventMutationVariables = {
  propertyId: string,
  region: string,
};

export type PublishNewPropertyEventMutation = {
  publishNewPropertyEvent?:  {
    __typename: "SubscriptionPublishResponse",
    message?: string | null,
    propertyId?: string | null,
    success: boolean,
  } | null,
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
        street?: string | null,
        ward?: string | null,
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
    message: string,
    success: boolean,
  },
};

export type ResendVerificationCodeMutationVariables = {
  email: string,
};

export type ResendVerificationCodeMutation = {
  resendVerificationCode:  {
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
  },
};

export type ResetPasswordMutationVariables = {
  confirmationCode: string,
  email: string,
  newPassword: string,
};

export type ResetPasswordMutation = {
  resetPassword:  {
    __typename: "SuccessResponse",
    message: string,
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
    isMine: boolean,
    isRead: boolean,
    senderName: string,
    timestamp: string,
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
  },
};

export type SignUpMutationVariables = {
  input: SignUpInput,
};

export type SignUpMutation = {
  signUp:  {
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
  },
};

export type SubmitApplicationMutationVariables = {
  input: SubmitApplicationInput,
};

export type SubmitApplicationMutation = {
  submitApplication:  {
    __typename: "Application",
    applicant?:  {
      __typename: "TenantBasicInfo",
      firstName: string,
      lastName: string,
      profileImage?: string | null,
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
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "LandlordBasicInfo",
      businessName?: string | null,
      firstName: string,
      lastName: string,
      profileImage?: string | null,
    } | null,
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
        street?: string | null,
        ward?: string | null,
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
  },
};

export type ToggleFavoriteMutationVariables = {
  propertyId: string,
};

export type ToggleFavoriteMutation = {
  toggleFavorite:  {
    __typename: "FavoriteResponse",
    isFavorited: boolean,
    message?: string | null,
    success: boolean,
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
      __typename: "TenantBasicInfo",
      firstName: string,
      lastName: string,
      profileImage?: string | null,
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
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "LandlordBasicInfo",
      businessName?: string | null,
      firstName: string,
      lastName: string,
      profileImage?: string | null,
    } | null,
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
        street?: string | null,
        ward?: string | null,
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
      __typename: "TenantBasicInfo",
      firstName: string,
      lastName: string,
      profileImage?: string | null,
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
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "LandlordBasicInfo",
      businessName?: string | null,
      firstName: string,
      lastName: string,
      profileImage?: string | null,
    } | null,
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
        street?: string | null,
        ward?: string | null,
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
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
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
      street?: string | null,
      ward?: string | null,
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
  ),
};

export type VerifyEmailMutationVariables = {
  code: string,
  email: string,
};

export type VerifyEmailMutation = {
  verifyEmail:  {
    __typename: "SuccessResponse",
    message: string,
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
    applicant?:  {
      __typename: "TenantBasicInfo",
      firstName: string,
      lastName: string,
      profileImage?: string | null,
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
      hasPets: boolean,
      leaseDuration: number,
      monthlyIncome: number,
      moveInDate: string,
      numberOfOccupants: number,
      occupation: string,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    applicationId: string,
    createdAt: string,
    landlord?:  {
      __typename: "LandlordBasicInfo",
      businessName?: string | null,
      firstName: string,
      lastName: string,
      profileImage?: string | null,
    } | null,
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
        street?: string | null,
        ward?: string | null,
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
    approved: number,
    rejected: number,
    submitted: number,
    total: number,
    underReview: number,
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
        bedrooms?: number | null,
        currency: string,
        district: string,
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
        bedrooms?: number | null,
        currency: string,
        district: string,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    },
    more?:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        bedrooms?: number | null,
        currency: string,
        district: string,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    } | null,
    mostViewed?:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        bedrooms?: number | null,
        currency: string,
        district: string,
        monthlyRent: number,
        propertyId: string,
        propertyType: PropertyType,
        region: string,
        thumbnail?: string | null,
        title: string,
      } >,
    } | null,
    nearby:  {
      __typename: "CategoryPropertyResponse",
      category: PropertyCategory,
      count: number,
      nextToken?: string | null,
      properties:  Array< {
        __typename: "PropertyCard",
        bedrooms?: number | null,
        currency: string,
        district: string,
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
        bedrooms?: number | null,
        currency: string,
        district: string,
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
    content: string,
    conversationId: string,
    id: string,
    isMine: boolean,
    isRead: boolean,
    senderName: string,
    timestamp: string,
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

export type GetInitialAppStateQueryVariables = {
  limitPerCategory?: number | null,
};

export type GetInitialAppStateQuery = {
  getInitialAppState:  {
    __typename: "InitialAppState",
    categorizedProperties:  {
      __typename: "CategorizedPropertiesResponse",
      favorites?:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
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
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      },
      more?:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
      mostViewed?:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
      nearby:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
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
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
    },
  },
};

export type GetInitialAppStateFastQueryVariables = {
  limitPerCategory?: number | null,
};

export type GetInitialAppStateFastQuery = {
  getInitialAppStateFast:  {
    __typename: "InitialAppState",
    categorizedProperties:  {
      __typename: "CategorizedPropertiesResponse",
      favorites?:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
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
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      },
      more?:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
      mostViewed?:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
      nearby:  {
        __typename: "CategoryPropertyResponse",
        category: PropertyCategory,
        count: number,
        nextToken?: string | null,
        properties:  Array< {
          __typename: "PropertyCard",
          bedrooms?: number | null,
          currency: string,
          district: string,
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
          bedrooms?: number | null,
          currency: string,
          district: string,
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
    },
  },
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
    actionTime: number,
    additionalFiles?:  Array< {
      __typename: "MediaFile",
      contentType: string,
      fileName?: string | null,
      fileUrl: string,
    } | null > | null,
    media?:  {
      __typename: "PropertyMedia",
      floorPlan?: string | null,
      images?: Array< string > | null,
      videos?: Array< string > | null,
      virtualTour?: string | null,
    } | null,
    userId: string,
  } | null,
};

export type GetPropertiesByCategoryQueryVariables = {
  category: PropertyCategory,
  limit?: number | null,
  nextToken?: string | null,
};

export type GetPropertiesByCategoryQuery = {
  getPropertiesByCategory:  {
    __typename: "CategoryPropertyResponse",
    category: PropertyCategory,
    count: number,
    nextToken?: string | null,
    properties:  Array< {
      __typename: "PropertyCard",
      bedrooms?: number | null,
      currency: string,
      district: string,
      monthlyRent: number,
      propertyId: string,
      propertyType: PropertyType,
      region: string,
      thumbnail?: string | null,
      title: string,
    } >,
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
      bedrooms?: number | null,
      currency: string,
      district: string,
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
      street?: string | null,
      ward?: string | null,
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

export type GetStreetsQueryVariables = {
  wardId: string,
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

export type GetUnreadCountQuery = {
  getUnreadCount: number,
};

export type GetUserConversationsQueryVariables = {
};

export type GetUserConversationsQuery = {
  getUserConversations:  Array< {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    lastMessage: string,
    lastMessageTime: string,
    otherPartyImage?: string | null,
    otherPartyName: string,
    propertyTitle: string,
    unreadCount: number,
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
        street?: string | null,
        ward?: string | null,
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
        street?: string | null,
        ward?: string | null,
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
        __typename: "TenantBasicInfo",
        firstName: string,
        lastName: string,
        profileImage?: string | null,
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
        hasPets: boolean,
        leaseDuration: number,
        monthlyIncome: number,
        moveInDate: string,
        numberOfOccupants: number,
        occupation: string,
        petDetails?: string | null,
        smokingStatus: SmokingStatus,
      },
      applicationId: string,
      createdAt: string,
      landlord?:  {
        __typename: "LandlordBasicInfo",
        businessName?: string | null,
        firstName: string,
        lastName: string,
        profileImage?: string | null,
      } | null,
      landlordNotes?: string | null,
      property?:  {
        __typename: "Property",
        address:  {
          __typename: "Address",
          district: string,
          postalCode?: string | null,
          region: string,
          street?: string | null,
          ward?: string | null,
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
        __typename: "TenantBasicInfo",
        firstName: string,
        lastName: string,
        profileImage?: string | null,
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
        hasPets: boolean,
        leaseDuration: number,
        monthlyIncome: number,
        moveInDate: string,
        numberOfOccupants: number,
        occupation: string,
        petDetails?: string | null,
        smokingStatus: SmokingStatus,
      },
      applicationId: string,
      createdAt: string,
      landlord?:  {
        __typename: "LandlordBasicInfo",
        businessName?: string | null,
        firstName: string,
        lastName: string,
        profileImage?: string | null,
      } | null,
      landlordNotes?: string | null,
      property?:  {
        __typename: "Property",
        address:  {
          __typename: "Address",
          district: string,
          postalCode?: string | null,
          region: string,
          street?: string | null,
          ward?: string | null,
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
