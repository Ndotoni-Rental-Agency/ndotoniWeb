/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Application = {
  __typename: "Application",
  applicant?: Tenant | null,
  applicantDetails: ApplicantDetails,
  applicantUserId: string,
  applicationId: string,
  createdAt: string,
  documents?: ApplicationDocuments | null,
  employment?: EmploymentDetails | null,
  landlord?: Landlord | null,
  landlordId: string,
  landlordNotes?: string | null,
  property?: Property | null,
  propertyId: string,
  references?:  Array<Reference > | null,
  rejectionReason?: string | null,
  reviewedAt?: string | null,
  reviewedBy?: string | null,
  status: ApplicationStatus,
  submittedAt: string,
  updatedAt: string,
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
  userId: string,
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
  LANDLORD = "LANDLORD",
  TENANT = "TENANT",
}


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


export type ApplicationDocuments = {
  __typename: "ApplicationDocuments",
  additionalDocuments?: Array< string > | null,
  bankStatements?: Array< string > | null,
  employmentLetter?: string | null,
  identificationDocument?: string | null,
  previousLandlordReference?: string | null,
  proofOfIncome?: Array< string > | null,
};

export type EmploymentDetails = {
  __typename: "EmploymentDetails",
  employerAddress: string,
  employerName: string,
  employerPhone: string,
  employmentStartDate: string,
  jobTitle: string,
  monthlyIncome: number,
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
  userId: string,
  userType: UserType,
  verificationDocuments?: Array< string > | null,
};

export type Property = {
  __typename: "Property",
  address: Address,
  amenities?: Array< string > | null,
  availability: PropertyAvailability,
  createdAt: string,
  description: string,
  landlordId: string,
  managerId?: string | null,
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
  street: string,
  ward: string,
};

export type Coordinates = {
  __typename: "Coordinates",
  latitude: number,
  longitude: number,
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


export type Reference = {
  __typename: "Reference",
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

export type BecomeLandlordInput = {
  businessLicense: string,
  businessName: string,
  taxId: string,
  verificationDocuments?: Array< string > | null,
};

export type ApplicationResponse = {
  __typename: "ApplicationResponse",
  applicationId?: string | null,
  message: string,
  status?: string | null,
  submittedAt?: string | null,
  success: boolean,
};

export type CreateConversationInput = {
  initialMessage?: string | null,
  landlordId: string,
  propertyId: string,
  propertyTitle: string,
  tenantId: string,
};

export type Conversation = {
  __typename: "Conversation",
  createdAt: string,
  id: string,
  landlordId: string,
  lastMessage: string,
  lastMessageSender: string,
  lastMessageTime: string,
  propertyId: string,
  propertyTitle: string,
  tenantId: string,
  unreadCount: string,
  updatedAt: string,
};

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
  street: string,
  ward: string,
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

export type PublishResult = {
  __typename: "PublishResult",
  message?: string | null,
  success: boolean,
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

export type ReviewApplicationInput = {
  landlordNotes?: string | null,
  rejectionReason?: string | null,
  status: ApplicationStatus,
};

export type SendMessageInput = {
  content: string,
  conversationId: string,
  senderId: string,
};

export type ChatMessage = {
  __typename: "ChatMessage",
  content: string,
  conversationId: string,
  id: string,
  isRead: boolean,
  senderId: string,
  timestamp: string,
};

export type AuthResponse = {
  __typename: "AuthResponse",
  accessToken: string,
  refreshToken: string,
  user: UserProfile,
};

export type UserProfile = Admin | Landlord | Tenant


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
  userId: string,
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
  documents?: ApplicationDocumentsInput | null,
  employment?: EmploymentDetailsInput | null,
  propertyId: string,
  references?: Array< ReferenceInput > | null,
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

export type ApplicationDocumentsInput = {
  additionalDocuments?: Array< string > | null,
  bankStatements?: Array< string > | null,
  employmentLetter?: string | null,
  identificationDocument?: string | null,
  previousLandlordReference?: string | null,
  proofOfIncome?: Array< string > | null,
};

export type EmploymentDetailsInput = {
  employerAddress: string,
  employerName: string,
  employerPhone: string,
  employmentStartDate: string,
  jobTitle: string,
  monthlyIncome: number,
};

export type ReferenceInput = {
  email?: string | null,
  name: string,
  phoneNumber: string,
  relationship: string,
};

export type LandlordApplicationInput = {
  address: AddressInput,
  alternatePhone?: string | null,
  birthDate: string,
  nationalId: string,
  phoneNumber: string,
  userId: string,
};

export type FavoriteResponse = {
  __typename: "FavoriteResponse",
  isFavorited: boolean,
  message?: string | null,
  success: boolean,
};

export type UpdateApplicationInput = {
  applicantDetails?: ApplicantDetailsInput | null,
  documents?: ApplicationDocumentsInput | null,
  employment?: EmploymentDetailsInput | null,
  references?: Array< ReferenceInput > | null,
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

export type AppInitialState = {
  __typename: "AppInitialState",
  categorizedProperties: CategorizedPropertiesResponse,
  totalProperties: number,
};

export type CategorizedPropertiesResponse = {
  __typename: "CategorizedPropertiesResponse",
  favorites?: CategoryPropertyResponse | null,
  lowestPrice: CategoryPropertyResponse,
  more: CategoryPropertyResponse,
  mostViewed: CategoryPropertyResponse,
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
  available: boolean,
  bedrooms?: number | null,
  category?: PropertyCategory | null,
  currency: string,
  district: string,
  monthlyRent: number,
  propertyId: string,
  propertyType: PropertyType,
  region: string,
  thumbnail?: string | null,
  title: string,
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

export type PropertyCardsResponse = {
  __typename: "PropertyCardsResponse",
  count: number,
  nextToken?: string | null,
  properties:  Array<PropertyCard >,
};

export type ApplicationListResponse = {
  __typename: "ApplicationListResponse",
  applications:  Array<Application >,
  count: number,
  nextToken?: string | null,
};

export type PropertyListResponse = {
  __typename: "PropertyListResponse",
  count: number,
  nextToken?: string | null,
  properties:  Array<Property >,
};

export type PropertySearchResponse = {
  __typename: "PropertySearchResponse",
  count: number,
  from: number,
  nextToken?: string | null,
  properties:  Array<Property >,
  size: number,
  total: number,
};

export type PropertySearchInput = {
  bedrooms?: number | null,
  district?: string | null,
  maxPrice?: number | null,
  minPrice?: number | null,
  propertyType?: PropertyType | null,
  region?: string | null,
};

export type UnreadCountUpdate = {
  __typename: "UnreadCountUpdate",
  totalUnread: number,
};

export type ApproveApplicationMutationVariables = {
  applicationId: string,
  landlordNotes?: string | null,
};

export type ApproveApplicationMutation = {
  approveApplication:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type AssignPropertyManagerMutationVariables = {
  landlordId: string,
  managerId: string,
  propertyId: string,
};

export type AssignPropertyManagerMutation = {
  assignPropertyManager:  {
    __typename: "SuccessResponse",
    message: string,
    success: boolean,
  },
};

export type AssociateMediaWithPropertyMutationVariables = {
  landlordId: string,
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
    landlordId: string,
    managerId?: string | null,
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

export type BecomeLandlordMutationVariables = {
  input: BecomeLandlordInput,
  userId: string,
};

export type BecomeLandlordMutation = {
  becomeLandlord:  {
    __typename: "ApplicationResponse",
    applicationId?: string | null,
    message: string,
    status?: string | null,
    submittedAt?: string | null,
    success: boolean,
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
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    propertyId: string,
    propertyTitle: string,
    tenantId: string,
    unreadCount: string,
    updatedAt: string,
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
  landlordId: string,
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
    landlordId: string,
    managerId?: string | null,
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

export type DeleteMediaItemMutationVariables = {
  fileUrl: string,
  userId: string,
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
  landlordId: string,
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
  userId: string,
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

export type MarkAsReadMutationVariables = {
  conversationId: string,
  userId: string,
};

export type MarkAsReadMutation = {
  markAsRead:  {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    propertyId: string,
    propertyTitle: string,
    tenantId: string,
    unreadCount: string,
    updatedAt: string,
  },
};

export type MarkPropertyAsAvailableMutationVariables = {
  landlordId: string,
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
      street: string,
      ward: string,
    },
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
    landlordId: string,
    managerId?: string | null,
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
  landlordId: string,
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
      street: string,
      ward: string,
    },
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
    landlordId: string,
    managerId?: string | null,
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

export type PublishConversationUpdateMutationVariables = {
  input: string,
};

export type PublishConversationUpdateMutation = {
  publishConversationUpdate?:  {
    __typename: "PublishResult",
    message?: string | null,
    success: boolean,
  } | null,
};

export type PublishNewMessageMutationVariables = {
  input: string,
};

export type PublishNewMessageMutation = {
  publishNewMessage?:  {
    __typename: "PublishResult",
    message?: string | null,
    success: boolean,
  } | null,
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
        street: string,
        ward: string,
      },
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
      landlordId: string,
      managerId?: string | null,
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

export type RejectApplicationMutationVariables = {
  applicationId: string,
  landlordNotes?: string | null,
  rejectionReason: string,
};

export type RejectApplicationMutation = {
  rejectApplication:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type RemovePropertyManagerMutationVariables = {
  landlordId: string,
  propertyId: string,
};

export type RemovePropertyManagerMutation = {
  removePropertyManager:  {
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

export type ReviewApplicationMutationVariables = {
  applicationId: string,
  input: ReviewApplicationInput,
};

export type ReviewApplicationMutation = {
  reviewApplication:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type ReviewLandlordApplicationMutationVariables = {
  applicationId: string,
  input: ReviewApplicationInput,
};

export type ReviewLandlordApplicationMutation = {
  reviewLandlordApplication:  {
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
    isRead: boolean,
    senderId: string,
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
    user: ( {
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
        userId: string,
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
        userId: string,
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
        userId: string,
        userType: UserType,
      }
    ),
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
        userId: string,
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
        userId: string,
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
        userId: string,
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
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
  userId: string,
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
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
  landlordId: string,
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
    landlordId: string,
    managerId?: string | null,
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
  landlordId: string,
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
    landlordId: string,
    managerId?: string | null,
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
  userId: string,
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
      userId: string,
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
      userId: string,
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
      userId: string,
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

export type WithdrawApplicationMutationVariables = {
  applicationId: string,
};

export type WithdrawApplicationMutation = {
  withdrawApplication:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  },
};

export type DummyQueryQueryVariables = {
};

export type DummyQueryQuery = {
  dummyQuery?: string | null,
};

export type GetAppInitialStateQueryVariables = {
  limitPerCategory?: number | null,
  userId?: string | null,
};

export type GetAppInitialStateQuery = {
  getAppInitialState:  {
    __typename: "AppInitialState",
    categorizedProperties:  {
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
          monthlyRent: number,
          propertyId: string,
          propertyType: PropertyType,
          region: string,
          thumbnail?: string | null,
          title: string,
        } >,
      } | null,
    },
    totalProperties: number,
  },
};

export type GetApplicationQueryVariables = {
  applicationId: string,
};

export type GetApplicationQuery = {
  getApplication?:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
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
  userId?: string | null,
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
    isRead: boolean,
    senderId: string,
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

export type GetMediaLibraryQueryVariables = {
  userId: string,
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

export type GetNearbyPropertiesQueryVariables = {
  lat: number,
  lng: number,
  radiusKm?: number | null,
};

export type GetNearbyPropertiesQuery = {
  getNearbyProperties:  Array< {
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
    landlordId: string,
    managerId?: string | null,
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
};

export type GetPropertiesByCategoryQueryVariables = {
  category: PropertyCategory,
  limit?: number | null,
  nextToken?: string | null,
  userId?: string | null,
};

export type GetPropertiesByCategoryQuery = {
  getPropertiesByCategory:  {
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
  region: string,
};

export type GetPropertiesByLocationQuery = {
  getPropertiesByLocation:  Array< {
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
    landlordId: string,
    managerId?: string | null,
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
};

export type GetPropertyQueryVariables = {
  propertyId: string,
  userId?: string | null,
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
    landlordId: string,
    managerId?: string | null,
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

export type GetPropertyCardsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type GetPropertyCardsQuery = {
  getPropertyCards:  {
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
      monthlyRent: number,
      propertyId: string,
      propertyType: PropertyType,
      region: string,
      thumbnail?: string | null,
      title: string,
    } >,
  },
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
  userId: string,
};

export type GetUnreadCountQuery = {
  getUnreadCount: number,
};

export type GetUserQueryVariables = {
  userId: string,
};

export type GetUserQuery = {
  getUser: ( {
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
      userId: string,
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
      userId: string,
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
      userId: string,
      userType: UserType,
    }
  ) | null,
};

export type GetUserConversationsQueryVariables = {
  userId: string,
};

export type GetUserConversationsQuery = {
  getUserConversations:  Array< {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    propertyId: string,
    propertyTitle: string,
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

export type ListLandlordApplicationsQueryVariables = {
  landlordId: string,
  limit?: number | null,
  nextToken?: string | null,
  status?: ApplicationStatus | null,
};

export type ListLandlordApplicationsQuery = {
  listLandlordApplications:  {
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
        userId: string,
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
      documents?:  {
        __typename: "ApplicationDocuments",
        additionalDocuments?: Array< string > | null,
        bankStatements?: Array< string > | null,
        employmentLetter?: string | null,
        identificationDocument?: string | null,
        previousLandlordReference?: string | null,
        proofOfIncome?: Array< string > | null,
      } | null,
      employment?:  {
        __typename: "EmploymentDetails",
        employerAddress: string,
        employerName: string,
        employerPhone: string,
        employmentStartDate: string,
        jobTitle: string,
        monthlyIncome: number,
      } | null,
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
        userId: string,
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
        landlordId: string,
        managerId?: string | null,
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
      references?:  Array< {
        __typename: "Reference",
        email?: string | null,
        name: string,
        phoneNumber: string,
        relationship: string,
      } > | null,
      rejectionReason?: string | null,
      reviewedAt?: string | null,
      reviewedBy?: string | null,
      status: ApplicationStatus,
      submittedAt: string,
      updatedAt: string,
    } >,
    count: number,
    nextToken?: string | null,
  },
};

export type ListLandlordPropertiesQueryVariables = {
  landlordId: string,
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
      landlordId: string,
      managerId?: string | null,
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

export type ListManagedPropertiesQueryVariables = {
  limit?: number | null,
  managerId: string,
  nextToken?: string | null,
};

export type ListManagedPropertiesQuery = {
  listManagedProperties:  {
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
      landlordId: string,
      managerId?: string | null,
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
        userId: string,
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
      documents?:  {
        __typename: "ApplicationDocuments",
        additionalDocuments?: Array< string > | null,
        bankStatements?: Array< string > | null,
        employmentLetter?: string | null,
        identificationDocument?: string | null,
        previousLandlordReference?: string | null,
        proofOfIncome?: Array< string > | null,
      } | null,
      employment?:  {
        __typename: "EmploymentDetails",
        employerAddress: string,
        employerName: string,
        employerPhone: string,
        employmentStartDate: string,
        jobTitle: string,
        monthlyIncome: number,
      } | null,
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
        userId: string,
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
        landlordId: string,
        managerId?: string | null,
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
      references?:  Array< {
        __typename: "Reference",
        email?: string | null,
        name: string,
        phoneNumber: string,
        relationship: string,
      } > | null,
      rejectionReason?: string | null,
      reviewedAt?: string | null,
      reviewedBy?: string | null,
      status: ApplicationStatus,
      submittedAt: string,
      updatedAt: string,
    } >,
    count: number,
    nextToken?: string | null,
  },
};

export type ListPropertiesQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPropertiesQuery = {
  listProperties:  {
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
      landlordId: string,
      managerId?: string | null,
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
        userId: string,
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
      documents?:  {
        __typename: "ApplicationDocuments",
        additionalDocuments?: Array< string > | null,
        bankStatements?: Array< string > | null,
        employmentLetter?: string | null,
        identificationDocument?: string | null,
        previousLandlordReference?: string | null,
        proofOfIncome?: Array< string > | null,
      } | null,
      employment?:  {
        __typename: "EmploymentDetails",
        employerAddress: string,
        employerName: string,
        employerPhone: string,
        employmentStartDate: string,
        jobTitle: string,
        monthlyIncome: number,
      } | null,
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
        userId: string,
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
        landlordId: string,
        managerId?: string | null,
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
      references?:  Array< {
        __typename: "Reference",
        email?: string | null,
        name: string,
        phoneNumber: string,
        relationship: string,
      } > | null,
      rejectionReason?: string | null,
      reviewedAt?: string | null,
      reviewedBy?: string | null,
      status: ApplicationStatus,
      submittedAt: string,
      updatedAt: string,
    } >,
    count: number,
    nextToken?: string | null,
  },
};

export type SearchPropertiesQueryVariables = {
  bedrooms?: number | null,
  district?: string | null,
  from?: number | null,
  limit?: number | null,
  maxPrice?: number | null,
  minPrice?: number | null,
  propertyType?: PropertyType | null,
  q?: string | null,
  region?: string | null,
};

export type SearchPropertiesQuery = {
  searchProperties:  {
    __typename: "PropertySearchResponse",
    count: number,
    from: number,
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
      landlordId: string,
      managerId?: string | null,
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
    size: number,
    total: number,
  },
};

export type DummySubscriptionSubscriptionVariables = {
};

export type DummySubscriptionSubscription = {
  dummySubscription?: string | null,
};

export type OnApplicationStatusChangedSubscriptionVariables = {
  applicationId: string,
};

export type OnApplicationStatusChangedSubscription = {
  onApplicationStatusChanged?:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  } | null,
};

export type OnConversationUpdatedSubscriptionVariables = {
  userId: string,
};

export type OnConversationUpdatedSubscription = {
  onConversationUpdated?:  {
    __typename: "Conversation",
    createdAt: string,
    id: string,
    landlordId: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    propertyId: string,
    propertyTitle: string,
    tenantId: string,
    unreadCount: string,
    updatedAt: string,
  } | null,
};

export type OnNewApplicationForLandlordSubscriptionVariables = {
  landlordId: string,
};

export type OnNewApplicationForLandlordSubscription = {
  onNewApplicationForLandlord?:  {
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
      userId: string,
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
    documents?:  {
      __typename: "ApplicationDocuments",
      additionalDocuments?: Array< string > | null,
      bankStatements?: Array< string > | null,
      employmentLetter?: string | null,
      identificationDocument?: string | null,
      previousLandlordReference?: string | null,
      proofOfIncome?: Array< string > | null,
    } | null,
    employment?:  {
      __typename: "EmploymentDetails",
      employerAddress: string,
      employerName: string,
      employerPhone: string,
      employmentStartDate: string,
      jobTitle: string,
      monthlyIncome: number,
    } | null,
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
      userId: string,
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
      landlordId: string,
      managerId?: string | null,
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
    references?:  Array< {
      __typename: "Reference",
      email?: string | null,
      name: string,
      phoneNumber: string,
      relationship: string,
    } > | null,
    rejectionReason?: string | null,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    status: ApplicationStatus,
    submittedAt: string,
    updatedAt: string,
  } | null,
};

export type OnNewMessageSubscriptionVariables = {
  conversationId: string,
};

export type OnNewMessageSubscription = {
  onNewMessage?:  {
    __typename: "ChatMessage",
    content: string,
    conversationId: string,
    id: string,
    isRead: boolean,
    senderId: string,
    timestamp: string,
  } | null,
};

export type OnNewPropertyInRegionSubscriptionVariables = {
  region: string,
};

export type OnNewPropertyInRegionSubscription = {
  onNewPropertyInRegion?:  {
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
    landlordId: string,
    managerId?: string | null,
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

export type OnNewPropertyMatchesSearchSubscriptionVariables = {
  searchCriteria: PropertySearchInput,
};

export type OnNewPropertyMatchesSearchSubscription = {
  onNewPropertyMatchesSearch?:  {
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
    landlordId: string,
    managerId?: string | null,
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

export type OnPropertiesUpdatedSubscriptionVariables = {
  propertyIds: Array< string >,
};

export type OnPropertiesUpdatedSubscription = {
  onPropertiesUpdated?:  {
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
      landlordId: string,
      managerId?: string | null,
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

export type OnPropertyUpdatedSubscriptionVariables = {
  propertyId: string,
};

export type OnPropertyUpdatedSubscription = {
  onPropertyUpdated?:  {
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
      landlordId: string,
      managerId?: string | null,
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

export type OnUnreadCountChangedSubscriptionVariables = {
  userId: string,
};

export type OnUnreadCountChangedSubscription = {
  onUnreadCountChanged?:  {
    __typename: "UnreadCountUpdate",
    totalUnread: number,
  } | null,
};
