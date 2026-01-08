/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type SubmitApplicationInput = {
  propertyId: string,
  applicantDetails: ApplicantDetailsInput,
  employment?: EmploymentDetailsInput | null,
  references?: Array< ReferenceInput > | null,
  documents?: ApplicationDocumentsInput | null,
};

export type ApplicantDetailsInput = {
  monthlyIncome: number,
  occupation: string,
  employmentStatus: EmploymentStatus,
  moveInDate: string,
  leaseDuration: number,
  numberOfOccupants: number,
  hasPets: boolean,
  petDetails?: string | null,
  smokingStatus: SmokingStatus,
  emergencyContact: EmergencyContactInput,
};

export enum EmploymentStatus {
  EMPLOYED_FULL_TIME = "EMPLOYED_FULL_TIME",
  EMPLOYED_PART_TIME = "EMPLOYED_PART_TIME",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  CONTRACT = "CONTRACT",
  UNEMPLOYED = "UNEMPLOYED",
  STUDENT = "STUDENT",
  RETIRED = "RETIRED",
}


export enum SmokingStatus {
  NON_SMOKER = "NON_SMOKER",
  SMOKER = "SMOKER",
  OCCASIONAL = "OCCASIONAL",
}


export type EmergencyContactInput = {
  name: string,
  relationship: string,
  phoneNumber: string,
  email?: string | null,
};

export type EmploymentDetailsInput = {
  employerName: string,
  employerPhone: string,
  employerAddress: string,
  jobTitle: string,
  employmentStartDate: string,
  monthlyIncome: number,
};

export type ReferenceInput = {
  name: string,
  relationship: string,
  phoneNumber: string,
  email?: string | null,
};

export type ApplicationDocumentsInput = {
  identificationDocument?: string | null,
  proofOfIncome?: Array< string > | null,
  employmentLetter?: string | null,
  bankStatements?: Array< string > | null,
  previousLandlordReference?: string | null,
  additionalDocuments?: Array< string > | null,
};

export type Application = {
  __typename: "Application",
  applicationId: string,
  propertyId: string,
  property?: Property | null,
  applicantUserId: string,
  applicant?: Tenant | null,
  landlordId: string,
  landlord?: Landlord | null,
  status: ApplicationStatus,
  submittedAt: string,
  reviewedAt?: string | null,
  reviewedBy?: string | null,
  applicantDetails: ApplicantDetails,
  employment?: EmploymentDetails | null,
  references?:  Array<Reference > | null,
  documents?: ApplicationDocuments | null,
  landlordNotes?: string | null,
  rejectionReason?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type Property = {
  __typename: "Property",
  propertyId: string,
  landlordId: string,
  managerId?: string | null,
  title: string,
  description: string,
  address: Address,
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


export type Tenant = {
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
};

export enum UserType {
  TENANT = "TENANT",
  LANDLORD = "LANDLORD",
  ADMIN = "ADMIN",
}


export enum AccountStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_LANDLORD_VERIFICATION = "PENDING_LANDLORD_VERIFICATION",
}


export type Landlord = {
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
  verificationDocuments?: Array< string > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum ApplicationStatus {
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
  EXPIRED = "EXPIRED",
}


export type ApplicantDetails = {
  __typename: "ApplicantDetails",
  monthlyIncome: number,
  occupation: string,
  employmentStatus: EmploymentStatus,
  moveInDate: string,
  leaseDuration: number,
  numberOfOccupants: number,
  hasPets: boolean,
  petDetails?: string | null,
  smokingStatus: SmokingStatus,
  emergencyContact: EmergencyContact,
};

export type EmergencyContact = {
  __typename: "EmergencyContact",
  name: string,
  relationship: string,
  phoneNumber: string,
  email?: string | null,
};

export type EmploymentDetails = {
  __typename: "EmploymentDetails",
  employerName: string,
  employerPhone: string,
  employerAddress: string,
  jobTitle: string,
  employmentStartDate: string,
  monthlyIncome: number,
};

export type Reference = {
  __typename: "Reference",
  name: string,
  relationship: string,
  phoneNumber: string,
  email?: string | null,
};

export type ApplicationDocuments = {
  __typename: "ApplicationDocuments",
  identificationDocument?: string | null,
  proofOfIncome?: Array< string > | null,
  employmentLetter?: string | null,
  bankStatements?: Array< string > | null,
  previousLandlordReference?: string | null,
  additionalDocuments?: Array< string > | null,
};

export type UpdateApplicationInput = {
  applicantDetails?: ApplicantDetailsInput | null,
  employment?: EmploymentDetailsInput | null,
  references?: Array< ReferenceInput > | null,
  documents?: ApplicationDocumentsInput | null,
};

export type ReviewApplicationInput = {
  status: ApplicationStatus,
  landlordNotes?: string | null,
  rejectionReason?: string | null,
};

export type SuccessResponse = {
  __typename: "SuccessResponse",
  success: boolean,
  message: string,
};

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
  tenantId: string,
  landlordId: string,
  propertyId: string,
  propertyTitle: string,
  lastMessage: string,
  lastMessageSender: string,
  lastMessageTime: string,
  unreadCount: string,
  createdAt: string,
  updatedAt: string,
};

export type SendMessageInput = {
  conversationId: string,
  senderId: string,
  content: string,
};

export type ChatMessage = {
  __typename: "ChatMessage",
  id: string,
  conversationId: string,
  senderId: string,
  content: string,
  timestamp: string,
  isRead: boolean,
};

export type PublishResult = {
  __typename: "PublishResult",
  success: boolean,
  message?: string | null,
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

export type SignUpInput = {
  email: string,
  password: string,
  phoneNumber: string,
  firstName: string,
  lastName: string,
};

export type AuthResponse = {
  __typename: "AuthResponse",
  accessToken: string,
  refreshToken: string,
  user: UserProfile,
};

export type UserProfile = Tenant | Landlord | Admin


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
};

export type UpdateUserInput = {
  firstName?: string | null,
  lastName?: string | null,
  phoneNumber?: string | null,
  profileImage?: string | null,
  preferences?: string | null,
};

export type BecomeLandlordInput = {
  businessName: string,
  businessLicense: string,
  taxId: string,
  verificationDocuments?: Array< string > | null,
};

export type ApplicationResponse = {
  __typename: "ApplicationResponse",
  success: boolean,
  message: string,
  applicationId?: string | null,
  status?: string | null,
  submittedAt?: string | null,
};

export type LandlordApplicationInput = {
  userId: string,
  nationalId: string,
  birthDate: string,
  phoneNumber: string,
  alternatePhone?: string | null,
  address: AddressInput,
};

export type AppInitialState = {
  __typename: "AppInitialState",
  user?: UserBasic | null,
  properties: PropertyCardsResponse,
  totalProperties: number,
  personalizedSections?: PersonalizedSections | null,
};

export type UserBasic = {
  __typename: "UserBasic",
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  userType: UserType,
  profileImage?: string | null,
  language: string,
  currency: string,
};

export type PropertyCardsResponse = {
  __typename: "PropertyCardsResponse",
  properties:  Array<PropertyCard >,
  nextToken?: string | null,
  count: number,
};

export type PropertyCard = {
  __typename: "PropertyCard",
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
};

export type PersonalizedSections = {
  __typename: "PersonalizedSections",
  favorites?:  Array<PropertyCard > | null,
  recentlyViewed?:  Array<PropertyCard > | null,
  recommended?:  Array<PropertyCard > | null,
};

export type ApplicationListResponse = {
  __typename: "ApplicationListResponse",
  applications:  Array<Application >,
  nextToken?: string | null,
  count: number,
};

export type ApplicationStats = {
  __typename: "ApplicationStats",
  total: number,
  submitted: number,
  underReview: number,
  approved: number,
  rejected: number,
  withdrawn: number,
};

export type PropertyListResponse = {
  __typename: "PropertyListResponse",
  properties:  Array<Property >,
  nextToken?: string | null,
  count: number,
};

export type PropertySearchResponse = {
  __typename: "PropertySearchResponse",
  properties:  Array<Property >,
  count: number,
  total: number,
  from: number,
  size: number,
  nextToken?: string | null,
};

export type UnreadCountUpdate = {
  __typename: "UnreadCountUpdate",
  totalUnread: number,
};

export type PropertySearchInput = {
  region?: string | null,
  district?: string | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  propertyType?: PropertyType | null,
  bedrooms?: number | null,
};

export type SubmitApplicationMutationVariables = {
  input: SubmitApplicationInput,
};

export type SubmitApplicationMutation = {
  submitApplication:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type UpdateApplicationMutationVariables = {
  applicationId: string,
  input: UpdateApplicationInput,
};

export type UpdateApplicationMutation = {
  updateApplication:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type WithdrawApplicationMutationVariables = {
  applicationId: string,
};

export type WithdrawApplicationMutation = {
  withdrawApplication:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type ReviewApplicationMutationVariables = {
  applicationId: string,
  input: ReviewApplicationInput,
};

export type ReviewApplicationMutation = {
  reviewApplication:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type ApproveApplicationMutationVariables = {
  applicationId: string,
  landlordNotes?: string | null,
};

export type ApproveApplicationMutation = {
  approveApplication:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  },
};

export type RejectApplicationMutationVariables = {
  applicationId: string,
  rejectionReason: string,
  landlordNotes?: string | null,
};

export type RejectApplicationMutation = {
  rejectApplication:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
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
    success: boolean,
    message: string,
  },
};

export type CreateConversationMutationVariables = {
  input: CreateConversationInput,
};

export type CreateConversationMutation = {
  createConversation:  {
    __typename: "Conversation",
    id: string,
    tenantId: string,
    landlordId: string,
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

export type MarkAsReadMutationVariables = {
  conversationId: string,
  userId: string,
};

export type MarkAsReadMutation = {
  markAsRead:  {
    __typename: "Conversation",
    id: string,
    tenantId: string,
    landlordId: string,
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

export type PublishNewMessageMutationVariables = {
  input: string,
};

export type PublishNewMessageMutation = {
  publishNewMessage?:  {
    __typename: "PublishResult",
    success: boolean,
    message?: string | null,
  } | null,
};

export type PublishConversationUpdateMutationVariables = {
  input: string,
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
    location: ( {
        __typename: "Region",
        id: string,
        name: string,
      } | {
        __typename: "District",
        id: string,
        name: string,
        regionId: string,
      } | {
        __typename: "Ward",
        id: string,
        name: string,
        districtId: string,
      } | {
        __typename: "Street",
        id: string,
        name: string,
        wardId: string,
      }
    ),
    message: string,
  },
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

export type GetMediaUploadUrlMutationVariables = {
  userId: string,
  fileName: string,
  contentType: string,
};

export type GetMediaUploadUrlMutation = {
  getMediaUploadUrl:  {
    __typename: "MediaUploadResponse",
    uploadUrl: string,
    key: string,
    fileUrl: string,
  },
};

export type DeleteMediaItemMutationVariables = {
  userId: string,
  fileUrl: string,
};

export type DeleteMediaItemMutation = {
  deleteMediaItem?:  {
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

export type AssociateMediaWithPropertyMutationVariables = {
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

export type CreatePropertyMutationVariables = {
  landlordId: string,
  input: CreatePropertyInput,
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

export type UpdatePropertyMutationVariables = {
  propertyId: string,
  landlordId: string,
  input: UpdatePropertyInput,
};

export type UpdatePropertyMutation = {
  updateProperty:  {
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

export type UpdatePropertyStatusMutation = {
  updatePropertyStatus:  {
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

export type MarkPropertyAsRentedMutationVariables = {
  propertyId: string,
  landlordId: string,
  tenantId: string,
};

export type MarkPropertyAsRentedMutation = {
  markPropertyAsRented:  {
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

export type MarkPropertyAsAvailableMutationVariables = {
  propertyId: string,
  landlordId: string,
};

export type MarkPropertyAsAvailableMutation = {
  markPropertyAsAvailable:  {
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

export type AssignPropertyManagerMutationVariables = {
  propertyId: string,
  landlordId: string,
  managerId: string,
};

export type AssignPropertyManagerMutation = {
  assignPropertyManager:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type RemovePropertyManagerMutationVariables = {
  propertyId: string,
  landlordId: string,
};

export type RemovePropertyManagerMutation = {
  removePropertyManager:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type ImportPropertiesFromCSVMutationVariables = {
  csvData: string,
};

export type ImportPropertiesFromCSVMutation = {
  importPropertiesFromCSV:  {
    __typename: "PropertyImportResult",
    success: boolean,
    imported: number,
    updated: number,
    skipped: number,
    errors: Array< string >,
    message: string,
  },
};

export type PublishNewPropertyEventMutationVariables = {
  propertyId: string,
  region: string,
};

export type PublishNewPropertyEventMutation = {
  publishNewPropertyEvent?:  {
    __typename: "SubscriptionPublishResponse",
    success: boolean,
    message?: string | null,
    propertyId?: string | null,
  } | null,
};

export type PublishPropertyUpdateEventMutationVariables = {
  input: PropertyUpdateEventInput,
};

export type PublishPropertyUpdateEventMutation = {
  publishPropertyUpdateEvent?:  {
    __typename: "PropertyUpdateEvent",
    propertyId: string,
    eventType: PropertyEventType,
    property?:  {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    changes?:  Array< {
      __typename: "PropertyChange",
      field: string,
      oldValue?: string | null,
      newValue: string,
    } > | null,
    timestamp: string,
  } | null,
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
      }
    ),
  },
};

export type ForgotPasswordMutationVariables = {
  email: string,
};

export type ForgotPasswordMutation = {
  forgotPassword:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type ResetPasswordMutationVariables = {
  email: string,
  confirmationCode: string,
  newPassword: string,
};

export type ResetPasswordMutation = {
  resetPassword:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type VerifyEmailMutationVariables = {
  email: string,
  code: string,
};

export type VerifyEmailMutation = {
  verifyEmail:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type ResendVerificationCodeMutationVariables = {
  email: string,
};

export type ResendVerificationCodeMutation = {
  resendVerificationCode:  {
    __typename: "SuccessResponse",
    success: boolean,
    message: string,
  },
};

export type UpdateUserMutationVariables = {
  userId: string,
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
    message: string,
    applicationId?: string | null,
    status?: string | null,
    submittedAt?: string | null,
  },
};

export type SubmitLandlordApplicationMutationVariables = {
  input: LandlordApplicationInput,
};

export type SubmitLandlordApplicationMutation = {
  submitLandlordApplication:  {
    __typename: "ApplicationResponse",
    success: boolean,
    message: string,
    applicationId?: string | null,
    status?: string | null,
    submittedAt?: string | null,
  },
};

export type GetAppInitialStateQueryVariables = {
  limit?: number | null,
};

export type GetAppInitialStateQuery = {
  getAppInitialState:  {
    __typename: "AppInitialState",
    user?:  {
      __typename: "UserBasic",
      userId: string,
      firstName: string,
      lastName: string,
      email: string,
      userType: UserType,
      profileImage?: string | null,
      language: string,
      currency: string,
    } | null,
    properties:  {
      __typename: "PropertyCardsResponse",
      nextToken?: string | null,
      count: number,
    },
    totalProperties: number,
    personalizedSections?:  {
      __typename: "PersonalizedSections",
    } | null,
  },
};

export type GetPropertyCardsQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type GetPropertyCardsQuery = {
  getPropertyCards:  {
    __typename: "PropertyCardsResponse",
    properties:  Array< {
      __typename: "PropertyCard",
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
    } >,
    nextToken?: string | null,
    count: number,
  },
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMyApplicationsQueryVariables = {
  status?: ApplicationStatus | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMyApplicationsQuery = {
  listMyApplications:  {
    __typename: "ApplicationListResponse",
    applications:  Array< {
      __typename: "Application",
      applicationId: string,
      propertyId: string,
      applicantUserId: string,
      landlordId: string,
      status: ApplicationStatus,
      submittedAt: string,
      reviewedAt?: string | null,
      reviewedBy?: string | null,
      landlordNotes?: string | null,
      rejectionReason?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
  },
};

export type ListPropertyApplicationsQueryVariables = {
  propertyId: string,
  status?: ApplicationStatus | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPropertyApplicationsQuery = {
  listPropertyApplications:  {
    __typename: "ApplicationListResponse",
    applications:  Array< {
      __typename: "Application",
      applicationId: string,
      propertyId: string,
      applicantUserId: string,
      landlordId: string,
      status: ApplicationStatus,
      submittedAt: string,
      reviewedAt?: string | null,
      reviewedBy?: string | null,
      landlordNotes?: string | null,
      rejectionReason?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
  },
};

export type ListLandlordApplicationsQueryVariables = {
  landlordId: string,
  status?: ApplicationStatus | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLandlordApplicationsQuery = {
  listLandlordApplications:  {
    __typename: "ApplicationListResponse",
    applications:  Array< {
      __typename: "Application",
      applicationId: string,
      propertyId: string,
      applicantUserId: string,
      landlordId: string,
      status: ApplicationStatus,
      submittedAt: string,
      reviewedAt?: string | null,
      reviewedBy?: string | null,
      landlordNotes?: string | null,
      rejectionReason?: string | null,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
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

export type GetApplicationDocumentUploadUrlQueryVariables = {
  applicationId: string,
  fileName: string,
  fileType: string,
};

export type GetApplicationDocumentUploadUrlQuery = {
  getApplicationDocumentUploadUrl:  {
    __typename: "MediaUploadResponse",
    uploadUrl: string,
    key: string,
    fileUrl: string,
  },
};

export type GetUserConversationsQueryVariables = {
  userId: string,
};

export type GetUserConversationsQuery = {
  getUserConversations:  Array< {
    __typename: "Conversation",
    id: string,
    tenantId: string,
    landlordId: string,
    propertyId: string,
    propertyTitle: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    unreadCount: string,
    createdAt: string,
    updatedAt: string,
  } >,
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
    content: string,
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

export type GetWardsQueryVariables = {
  districtId: string,
};

export type GetWardsQuery = {
  getWards:  Array< {
    __typename: "Ward",
    id: string,
    name: string,
    districtId: string,
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

export type GetMediaLibraryQueryVariables = {
  userId: string,
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

export type GetPropertyQueryVariables = {
  propertyId: string,
};

export type GetPropertyQuery = {
  getProperty?:  {
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
};

export type ListPropertiesQueryVariables = {
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPropertiesQuery = {
  listProperties:  {
    __typename: "PropertyListResponse",
    properties:  Array< {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
  },
};

export type SearchPropertiesQueryVariables = {
  region?: string | null,
  district?: string | null,
  minPrice?: number | null,
  maxPrice?: number | null,
  propertyType?: PropertyType | null,
  bedrooms?: number | null,
  limit?: number | null,
  from?: number | null,
  q?: string | null,
};

export type SearchPropertiesQuery = {
  searchProperties:  {
    __typename: "PropertySearchResponse",
    properties:  Array< {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
  region: string,
  district?: string | null,
};

export type GetPropertiesByLocationQuery = {
  getPropertiesByLocation:  Array< {
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
};

export type GetNearbyPropertiesQueryVariables = {
  lat: number,
  lng: number,
  radiusKm?: number | null,
};

export type GetNearbyPropertiesQuery = {
  getNearbyProperties:  Array< {
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
};

export type ListLandlordPropertiesQueryVariables = {
  landlordId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLandlordPropertiesQuery = {
  listLandlordProperties:  {
    __typename: "PropertyListResponse",
    properties:  Array< {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
  },
};

export type ListManagedPropertiesQueryVariables = {
  managerId: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListManagedPropertiesQuery = {
  listManagedProperties:  {
    __typename: "PropertyListResponse",
    properties:  Array< {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } >,
    nextToken?: string | null,
    count: number,
  },
};

export type GetUserQueryVariables = {
  userId: string,
};

export type GetUserQuery = {
  getUser: ( {
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
    }
  ) | null,
};

export type OnApplicationStatusChangedSubscriptionVariables = {
  applicationId: string,
};

export type OnApplicationStatusChangedSubscription = {
  onApplicationStatusChanged?:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnNewApplicationForLandlordSubscriptionVariables = {
  landlordId: string,
};

export type OnNewApplicationForLandlordSubscription = {
  onNewApplicationForLandlord?:  {
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
      propertyType: PropertyType,
      amenities?: Array< string > | null,
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
    } | null,
    landlordId: string,
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
      verificationDocuments?: Array< string > | null,
      createdAt?: string | null,
      updatedAt?: string | null,
    } | null,
    status: ApplicationStatus,
    submittedAt: string,
    reviewedAt?: string | null,
    reviewedBy?: string | null,
    applicantDetails:  {
      __typename: "ApplicantDetails",
      monthlyIncome: number,
      occupation: string,
      employmentStatus: EmploymentStatus,
      moveInDate: string,
      leaseDuration: number,
      numberOfOccupants: number,
      hasPets: boolean,
      petDetails?: string | null,
      smokingStatus: SmokingStatus,
    },
    employment?:  {
      __typename: "EmploymentDetails",
      employerName: string,
      employerPhone: string,
      employerAddress: string,
      jobTitle: string,
      employmentStartDate: string,
      monthlyIncome: number,
    } | null,
    references?:  Array< {
      __typename: "Reference",
      name: string,
      relationship: string,
      phoneNumber: string,
      email?: string | null,
    } > | null,
    documents?:  {
      __typename: "ApplicationDocuments",
      identificationDocument?: string | null,
      proofOfIncome?: Array< string > | null,
      employmentLetter?: string | null,
      bankStatements?: Array< string > | null,
      previousLandlordReference?: string | null,
      additionalDocuments?: Array< string > | null,
    } | null,
    landlordNotes?: string | null,
    rejectionReason?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnNewMessageSubscriptionVariables = {
  conversationId: string,
};

export type OnNewMessageSubscription = {
  onNewMessage?:  {
    __typename: "ChatMessage",
    id: string,
    conversationId: string,
    senderId: string,
    content: string,
    timestamp: string,
    isRead: boolean,
  } | null,
};

export type OnConversationUpdatedSubscriptionVariables = {
  userId: string,
};

export type OnConversationUpdatedSubscription = {
  onConversationUpdated?:  {
    __typename: "Conversation",
    id: string,
    tenantId: string,
    landlordId: string,
    propertyId: string,
    propertyTitle: string,
    lastMessage: string,
    lastMessageSender: string,
    lastMessageTime: string,
    unreadCount: string,
    createdAt: string,
    updatedAt: string,
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

export type OnPropertiesUpdatedSubscriptionVariables = {
  propertyIds: Array< string >,
};

export type OnPropertiesUpdatedSubscription = {
  onPropertiesUpdated?:  {
    __typename: "PropertyUpdateEvent",
    propertyId: string,
    eventType: PropertyEventType,
    property?:  {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    changes?:  Array< {
      __typename: "PropertyChange",
      field: string,
      oldValue?: string | null,
      newValue: string,
    } > | null,
    timestamp: string,
  } | null,
};

export type OnNewPropertyMatchesSearchSubscriptionVariables = {
  searchCriteria: PropertySearchInput,
};

export type OnNewPropertyMatchesSearchSubscription = {
  onNewPropertyMatchesSearch?:  {
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
};

export type OnPropertyUpdatedSubscriptionVariables = {
  propertyId: string,
};

export type OnPropertyUpdatedSubscription = {
  onPropertyUpdated?:  {
    __typename: "PropertyUpdateEvent",
    propertyId: string,
    eventType: PropertyEventType,
    property?:  {
      __typename: "Property",
      propertyId: string,
      landlordId: string,
      managerId?: string | null,
      title: string,
      description: string,
      propertyType: PropertyType,
      amenities?: Array< string > | null,
      status: PropertyStatus,
      version?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    changes?:  Array< {
      __typename: "PropertyChange",
      field: string,
      oldValue?: string | null,
      newValue: string,
    } > | null,
    timestamp: string,
  } | null,
};

export type OnNewPropertyInRegionSubscriptionVariables = {
  region: string,
};

export type OnNewPropertyInRegionSubscription = {
  onNewPropertyInRegion?:  {
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
};
