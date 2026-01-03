export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDateTime: { input: string; output: string; }
  AWSJSON: { input: string; output: string; }
};

export type AccountStatus =
  | 'ACTIVE'
  | 'PENDING_LANDLORD_VERIFICATION'
  | 'PENDING_VERIFICATION'
  | 'SUSPENDED';

export type Address = {
  __typename?: 'Address';
  coordinates?: Maybe<Coordinates>;
  district: Scalars['String']['output'];
  postalCode?: Maybe<Scalars['String']['output']>;
  region: Scalars['String']['output'];
  street: Scalars['String']['output'];
  ward: Scalars['String']['output'];
};

export type AddressInput = {
  coordinates?: InputMaybe<CoordinatesInput>;
  district: Scalars['String']['input'];
  postalCode?: InputMaybe<Scalars['String']['input']>;
  region: Scalars['String']['input'];
  street: Scalars['String']['input'];
  ward: Scalars['String']['input'];
};

export type Admin = {
  __typename?: 'Admin';
  accountStatus: AccountStatus;
  createdAt: Scalars['AWSDateTime']['output'];
  currency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  language: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  permissions?: Maybe<Array<Scalars['String']['output']>>;
  phoneNumber: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications: Scalars['Boolean']['output'];
  smsNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
  userType: UserType;
};

export type AppInitialState = {
  __typename?: 'AppInitialState';
  personalizedSections?: Maybe<PersonalizedSections>;
  properties: PropertyCardsResponse;
  totalProperties: Scalars['Int']['output'];
  user?: Maybe<UserBasic>;
};

export type ApplicantDetails = {
  __typename?: 'ApplicantDetails';
  emergencyContact: EmergencyContact;
  employmentStatus: EmploymentStatus;
  hasPets: Scalars['Boolean']['output'];
  leaseDuration: Scalars['Int']['output'];
  monthlyIncome: Scalars['Float']['output'];
  moveInDate: Scalars['AWSDateTime']['output'];
  numberOfOccupants: Scalars['Int']['output'];
  occupation: Scalars['String']['output'];
  petDetails?: Maybe<Scalars['String']['output']>;
  smokingStatus: SmokingStatus;
};

export type ApplicantDetailsInput = {
  emergencyContact: EmergencyContactInput;
  employmentStatus: EmploymentStatus;
  hasPets: Scalars['Boolean']['input'];
  leaseDuration: Scalars['Int']['input'];
  monthlyIncome: Scalars['Float']['input'];
  moveInDate: Scalars['AWSDateTime']['input'];
  numberOfOccupants: Scalars['Int']['input'];
  occupation: Scalars['String']['input'];
  petDetails?: InputMaybe<Scalars['String']['input']>;
  smokingStatus: SmokingStatus;
};

export type Application = {
  __typename?: 'Application';
  applicant?: Maybe<Tenant>;
  applicantDetails: ApplicantDetails;
  applicantUserId: Scalars['ID']['output'];
  applicationId: Scalars['ID']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  documents?: Maybe<ApplicationDocuments>;
  employment?: Maybe<EmploymentDetails>;
  landlord?: Maybe<Landlord>;
  landlordId: Scalars['ID']['output'];
  landlordNotes?: Maybe<Scalars['String']['output']>;
  property?: Maybe<Property>;
  propertyId: Scalars['ID']['output'];
  references?: Maybe<Array<Reference>>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  reviewedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  reviewedBy?: Maybe<Scalars['ID']['output']>;
  status: ApplicationStatus;
  submittedAt: Scalars['AWSDateTime']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type ApplicationDocuments = {
  __typename?: 'ApplicationDocuments';
  additionalDocuments?: Maybe<Array<Scalars['String']['output']>>;
  bankStatements?: Maybe<Array<Scalars['String']['output']>>;
  employmentLetter?: Maybe<Scalars['String']['output']>;
  identificationDocument?: Maybe<Scalars['String']['output']>;
  previousLandlordReference?: Maybe<Scalars['String']['output']>;
  proofOfIncome?: Maybe<Array<Scalars['String']['output']>>;
};

export type ApplicationDocumentsInput = {
  additionalDocuments?: InputMaybe<Array<Scalars['String']['input']>>;
  bankStatements?: InputMaybe<Array<Scalars['String']['input']>>;
  employmentLetter?: InputMaybe<Scalars['String']['input']>;
  identificationDocument?: InputMaybe<Scalars['String']['input']>;
  previousLandlordReference?: InputMaybe<Scalars['String']['input']>;
  proofOfIncome?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ApplicationListResponse = {
  __typename?: 'ApplicationListResponse';
  applications: Array<Application>;
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type ApplicationResponse = {
  __typename?: 'ApplicationResponse';
  applicationId?: Maybe<Scalars['ID']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ApplicationStats = {
  __typename?: 'ApplicationStats';
  approved: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  submitted: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
  withdrawn: Scalars['Int']['output'];
};

export type ApplicationStatus =
  | 'APPROVED'
  | 'EXPIRED'
  | 'REJECTED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'WITHDRAWN';

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: UserProfile;
};

export type BecomeLandlordInput = {
  businessLicense: Scalars['String']['input'];
  businessName: Scalars['String']['input'];
  taxId: Scalars['String']['input'];
  verificationDocuments?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type CoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type CreateLocationInput = {
  name: Scalars['String']['input'];
  parent?: InputMaybe<Scalars['String']['input']>;
  type: LocationType;
};

export type CreatePropertyInput = {
  address: AddressInput;
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  availability: PropertyAvailabilityInput;
  description: Scalars['String']['input'];
  media?: InputMaybe<PropertyMediaInput>;
  pricing: PropertyPricingInput;
  propertyType: PropertyType;
  specifications: PropertySpecificationsInput;
  title: Scalars['String']['input'];
};

export type District = {
  __typename?: 'District';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  regionId: Scalars['ID']['output'];
};

export type EmergencyContact = {
  __typename?: 'EmergencyContact';
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  relationship: Scalars['String']['output'];
};

export type EmergencyContactInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  relationship: Scalars['String']['input'];
};

export type EmploymentDetails = {
  __typename?: 'EmploymentDetails';
  employerAddress: Scalars['String']['output'];
  employerName: Scalars['String']['output'];
  employerPhone: Scalars['String']['output'];
  employmentStartDate: Scalars['AWSDateTime']['output'];
  jobTitle: Scalars['String']['output'];
  monthlyIncome: Scalars['Float']['output'];
};

export type EmploymentDetailsInput = {
  employerAddress: Scalars['String']['input'];
  employerName: Scalars['String']['input'];
  employerPhone: Scalars['String']['input'];
  employmentStartDate: Scalars['AWSDateTime']['input'];
  jobTitle: Scalars['String']['input'];
  monthlyIncome: Scalars['Float']['input'];
};

export type EmploymentStatus =
  | 'CONTRACT'
  | 'EMPLOYED_FULL_TIME'
  | 'EMPLOYED_PART_TIME'
  | 'RETIRED'
  | 'SELF_EMPLOYED'
  | 'STUDENT'
  | 'UNEMPLOYED';

export type Landlord = {
  __typename?: 'Landlord';
  accountStatus: AccountStatus;
  businessLicense?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  currency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  language: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications: Scalars['Boolean']['output'];
  smsNotifications: Scalars['Boolean']['output'];
  taxId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
  userType: UserType;
  verificationDocuments?: Maybe<Array<Scalars['String']['output']>>;
};

export type LocationCreateResponse = {
  __typename?: 'LocationCreateResponse';
  location: LocationResult;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type LocationImportResponse = {
  __typename?: 'LocationImportResponse';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  imported: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  skipped: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type LocationJsonResponse = {
  __typename?: 'LocationJsonResponse';
  cloudfrontUrl: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type LocationResult = District | Region | Street | Ward;

export type LocationType =
  | 'DISTRICT'
  | 'REGION'
  | 'STREET'
  | 'WARD';

export type LocationUpdateResponse = {
  __typename?: 'LocationUpdateResponse';
  location?: Maybe<Region>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MediaItem = {
  __typename?: 'MediaItem';
  contentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  fileUrl: Scalars['String']['output'];
  landlordId: Scalars['ID']['output'];
  mediaId: Scalars['ID']['output'];
  tags?: Maybe<Array<Scalars['String']['output']>>;
  uploadedAt: Scalars['AWSDateTime']['output'];
};

export type MediaLibraryResponse = {
  __typename?: 'MediaLibraryResponse';
  count: Scalars['Int']['output'];
  items: Array<MediaItem>;
};

export type MediaUploadResponse = {
  __typename?: 'MediaUploadResponse';
  fileUrl: Scalars['String']['output'];
  key: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  approveApplication: Application;
  assignPropertyManager: SuccessResponse;
  associateMediaWithProperty: Property;
  becomeLandlord: ApplicationResponse;
  createLocation: LocationCreateResponse;
  createProperty: Property;
  deleteProperty: SuccessResponse;
  forgotPassword: SuccessResponse;
  getMediaUploadUrl: MediaUploadResponse;
  importLocationsFromCSV: LocationImportResponse;
  importPropertiesFromCSV: PropertyImportResult;
  markPropertyAsAvailable: Property;
  markPropertyAsRented: Property;
  regenerateLocationJson: LocationJsonResponse;
  rejectApplication: Application;
  removePropertyManager: SuccessResponse;
  resetPassword: SuccessResponse;
  reviewApplication: Application;
  reviewLandlordApplication: SuccessResponse;
  signIn: AuthResponse;
  signUp: AuthResponse;
  submitApplication: Application;
  updateApplication: Application;
  updateLocation: LocationUpdateResponse;
  updateProperty: Property;
  updatePropertyStatus: Property;
  updateUser: UserProfile;
  verifyEmail: SuccessResponse;
  withdrawApplication: Application;
};


export type MutationApproveApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  landlordNotes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAssignPropertyManagerArgs = {
  landlordId: Scalars['ID']['input'];
  managerId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
};


export type MutationAssociateMediaWithPropertyArgs = {
  landlordId: Scalars['ID']['input'];
  mediaUrls: Array<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
};


export type MutationBecomeLandlordArgs = {
  input: BecomeLandlordInput;
  userId: Scalars['ID']['input'];
};


export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};


export type MutationCreatePropertyArgs = {
  input: CreatePropertyInput;
  landlordId: Scalars['ID']['input'];
};


export type MutationDeletePropertyArgs = {
  landlordId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationGetMediaUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  landlordId: Scalars['ID']['input'];
};


export type MutationImportLocationsFromCsvArgs = {
  csvData: Scalars['String']['input'];
};


export type MutationImportPropertiesFromCsvArgs = {
  csvData: Scalars['String']['input'];
};


export type MutationMarkPropertyAsAvailableArgs = {
  landlordId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
};


export type MutationMarkPropertyAsRentedArgs = {
  landlordId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
  tenantId: Scalars['ID']['input'];
};


export type MutationRejectApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  landlordNotes?: InputMaybe<Scalars['String']['input']>;
  rejectionReason: Scalars['String']['input'];
};


export type MutationRemovePropertyManagerArgs = {
  landlordId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  confirmationCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationReviewApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  input: ReviewApplicationInput;
};


export type MutationReviewLandlordApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  input: ReviewApplicationInput;
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSubmitApplicationArgs = {
  input: SubmitApplicationInput;
};


export type MutationUpdateApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  input: UpdateApplicationInput;
};


export type MutationUpdateLocationArgs = {
  locationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdatePropertyArgs = {
  input: UpdatePropertyInput;
  landlordId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
};


export type MutationUpdatePropertyStatusArgs = {
  landlordId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
  status: PropertyStatus;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  userId: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};


export type MutationWithdrawApplicationArgs = {
  applicationId: Scalars['ID']['input'];
};

export type PersonalizedSections = {
  __typename?: 'PersonalizedSections';
  favorites?: Maybe<Array<PropertyCard>>;
  recentlyViewed?: Maybe<Array<PropertyCard>>;
  recommended?: Maybe<Array<PropertyCard>>;
};

export type Property = {
  __typename?: 'Property';
  address: Address;
  amenities?: Maybe<Array<Scalars['String']['output']>>;
  availability: PropertyAvailability;
  createdAt: Scalars['AWSDateTime']['output'];
  description: Scalars['String']['output'];
  landlordId: Scalars['ID']['output'];
  managerId?: Maybe<Scalars['ID']['output']>;
  media?: Maybe<PropertyMedia>;
  pricing: PropertyPricing;
  propertyId: Scalars['ID']['output'];
  propertyType: PropertyType;
  specifications: PropertySpecifications;
  status: PropertyStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  version?: Maybe<Scalars['Int']['output']>;
};

export type PropertyAvailability = {
  __typename?: 'PropertyAvailability';
  available: Scalars['Boolean']['output'];
  availableFrom?: Maybe<Scalars['AWSDateTime']['output']>;
  maximumLeaseTerm?: Maybe<Scalars['Int']['output']>;
  minimumLeaseTerm?: Maybe<Scalars['Int']['output']>;
};

export type PropertyAvailabilityInput = {
  available: Scalars['Boolean']['input'];
  availableFrom?: InputMaybe<Scalars['AWSDateTime']['input']>;
  maximumLeaseTerm?: InputMaybe<Scalars['Int']['input']>;
  minimumLeaseTerm?: InputMaybe<Scalars['Int']['input']>;
};

export type PropertyCard = {
  __typename?: 'PropertyCard';
  available: Scalars['Boolean']['output'];
  bedrooms?: Maybe<Scalars['Int']['output']>;
  currency: Scalars['String']['output'];
  district: Scalars['String']['output'];
  monthlyRent: Scalars['Float']['output'];
  propertyId: Scalars['ID']['output'];
  propertyType: PropertyType;
  region: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type PropertyCardsResponse = {
  __typename?: 'PropertyCardsResponse';
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
  properties: Array<PropertyCard>;
};

export type PropertyChange = {
  __typename?: 'PropertyChange';
  field: Scalars['String']['output'];
  newValue: Scalars['String']['output'];
  oldValue?: Maybe<Scalars['String']['output']>;
};

export type PropertyEventType =
  | 'AVAILABILITY_CHANGED'
  | 'PRICE_CHANGED'
  | 'PROPERTY_CREATED'
  | 'PROPERTY_DELETED'
  | 'PROPERTY_UPDATED'
  | 'STATUS_CHANGED';

export type PropertyImportResult = {
  __typename?: 'PropertyImportResult';
  errors: Array<Scalars['String']['output']>;
  imported: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  skipped: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  updated: Scalars['Int']['output'];
};

export type PropertyListResponse = {
  __typename?: 'PropertyListResponse';
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
  properties: Array<Property>;
};

export type PropertyMedia = {
  __typename?: 'PropertyMedia';
  floorPlan?: Maybe<Scalars['String']['output']>;
  images?: Maybe<Array<Scalars['String']['output']>>;
  videos?: Maybe<Array<Scalars['String']['output']>>;
  virtualTour?: Maybe<Scalars['String']['output']>;
};

export type PropertyMediaInput = {
  floorPlan?: InputMaybe<Scalars['String']['input']>;
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  videos?: InputMaybe<Array<Scalars['String']['input']>>;
  virtualTour?: InputMaybe<Scalars['String']['input']>;
};

export type PropertyPricing = {
  __typename?: 'PropertyPricing';
  currency: Scalars['String']['output'];
  deposit: Scalars['Float']['output'];
  monthlyRent: Scalars['Float']['output'];
  serviceCharge?: Maybe<Scalars['Float']['output']>;
  utilitiesIncluded?: Maybe<Scalars['Boolean']['output']>;
};

export type PropertyPricingInput = {
  currency: Scalars['String']['input'];
  deposit: Scalars['Float']['input'];
  monthlyRent: Scalars['Float']['input'];
  serviceCharge?: InputMaybe<Scalars['Float']['input']>;
  utilitiesIncluded?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PropertySearchInput = {
  bedrooms?: InputMaybe<Scalars['Int']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  propertyType?: InputMaybe<PropertyType>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type PropertySearchResponse = {
  __typename?: 'PropertySearchResponse';
  count: Scalars['Int']['output'];
  from: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
  properties: Array<Property>;
  size: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PropertySpecifications = {
  __typename?: 'PropertySpecifications';
  bathrooms?: Maybe<Scalars['Int']['output']>;
  bedrooms?: Maybe<Scalars['Int']['output']>;
  floors?: Maybe<Scalars['Int']['output']>;
  furnished?: Maybe<Scalars['Boolean']['output']>;
  parkingSpaces?: Maybe<Scalars['Int']['output']>;
  squareMeters: Scalars['Float']['output'];
};

export type PropertySpecificationsInput = {
  bathrooms?: InputMaybe<Scalars['Int']['input']>;
  bedrooms?: InputMaybe<Scalars['Int']['input']>;
  floors?: InputMaybe<Scalars['Int']['input']>;
  furnished?: InputMaybe<Scalars['Boolean']['input']>;
  parkingSpaces?: InputMaybe<Scalars['Int']['input']>;
  squareMeters: Scalars['Float']['input'];
};

export type PropertyStatus =
  | 'AVAILABLE'
  | 'DELETED'
  | 'DRAFT'
  | 'MAINTENANCE'
  | 'RENTED';

export type PropertyType =
  | 'APARTMENT'
  | 'COMMERCIAL'
  | 'HOUSE'
  | 'LAND'
  | 'ROOM'
  | 'STUDIO';

export type PropertyUpdateEvent = {
  __typename?: 'PropertyUpdateEvent';
  changes?: Maybe<Array<PropertyChange>>;
  eventType: PropertyEventType;
  property?: Maybe<Property>;
  propertyId: Scalars['ID']['output'];
  timestamp: Scalars['AWSDateTime']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  getAppInitialState: AppInitialState;
  getApplication?: Maybe<Application>;
  getApplicationDocumentUploadUrl: MediaUploadResponse;
  getApplicationStats: ApplicationStats;
  getDistricts: Array<District>;
  getMediaLibrary: MediaLibraryResponse;
  getNearbyProperties: Array<Property>;
  getPropertiesByLocation: Array<Property>;
  getProperty?: Maybe<Property>;
  getPropertyCards: PropertyCardsResponse;
  getRegions: Array<Region>;
  getStreets: Array<Street>;
  getUser?: Maybe<UserProfile>;
  getUserById?: Maybe<UserProfile>;
  getWards: Array<Ward>;
  listLandlordApplications: ApplicationListResponse;
  listLandlordProperties: PropertyListResponse;
  listManagedProperties: PropertyListResponse;
  listMyApplications: ApplicationListResponse;
  listProperties: PropertyListResponse;
  listPropertyApplications: ApplicationListResponse;
  searchProperties: PropertySearchResponse;
};


export type QueryGetAppInitialStateArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetApplicationArgs = {
  applicationId: Scalars['ID']['input'];
};


export type QueryGetApplicationDocumentUploadUrlArgs = {
  applicationId: Scalars['ID']['input'];
  fileName: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
};


export type QueryGetApplicationStatsArgs = {
  landlordId: Scalars['ID']['input'];
};


export type QueryGetDistrictsArgs = {
  regionId: Scalars['ID']['input'];
};


export type QueryGetMediaLibraryArgs = {
  landlordId: Scalars['ID']['input'];
};


export type QueryGetNearbyPropertiesArgs = {
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
  radiusKm?: InputMaybe<Scalars['Float']['input']>;
};


export type QueryGetPropertiesByLocationArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  region: Scalars['String']['input'];
};


export type QueryGetPropertyArgs = {
  propertyId: Scalars['ID']['input'];
};


export type QueryGetPropertyCardsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetStreetsArgs = {
  wardId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetWardsArgs = {
  districtId: Scalars['ID']['input'];
};


export type QueryListLandlordApplicationsArgs = {
  landlordId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};


export type QueryListLandlordPropertiesArgs = {
  landlordId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListManagedPropertiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  managerId: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListMyApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};


export type QueryListPropertiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListPropertyApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
  status?: InputMaybe<ApplicationStatus>;
};


export type QuerySearchPropertiesArgs = {
  bedrooms?: InputMaybe<Scalars['Int']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  propertyType?: InputMaybe<PropertyType>;
  q?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type Reference = {
  __typename?: 'Reference';
  email?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  relationship: Scalars['String']['output'];
};

export type ReferenceInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  relationship: Scalars['String']['input'];
};

export type Region = {
  __typename?: 'Region';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ReviewApplicationInput = {
  landlordNotes?: InputMaybe<Scalars['String']['input']>;
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: ApplicationStatus;
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type SmokingStatus =
  | 'NON_SMOKER'
  | 'OCCASIONAL'
  | 'SMOKER';

export type Street = {
  __typename?: 'Street';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  wardId: Scalars['ID']['output'];
};

export type SubmitApplicationInput = {
  applicantDetails: ApplicantDetailsInput;
  documents?: InputMaybe<ApplicationDocumentsInput>;
  employment?: InputMaybe<EmploymentDetailsInput>;
  propertyId: Scalars['ID']['input'];
  references?: InputMaybe<Array<ReferenceInput>>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']['output']>;
  onApplicationStatusChanged?: Maybe<Application>;
  onNewApplicationForLandlord?: Maybe<Application>;
  onNewPropertyInRegion?: Maybe<Property>;
  onNewPropertyMatchesSearch?: Maybe<Property>;
  onPropertiesUpdated?: Maybe<PropertyUpdateEvent>;
  onPropertyUpdated?: Maybe<PropertyUpdateEvent>;
};


export type SubscriptionOnApplicationStatusChangedArgs = {
  applicationId: Scalars['ID']['input'];
};


export type SubscriptionOnNewApplicationForLandlordArgs = {
  landlordId: Scalars['ID']['input'];
};


export type SubscriptionOnNewPropertyInRegionArgs = {
  region: Scalars['String']['input'];
};


export type SubscriptionOnNewPropertyMatchesSearchArgs = {
  searchCriteria: PropertySearchInput;
};


export type SubscriptionOnPropertiesUpdatedArgs = {
  propertyIds: Array<Scalars['ID']['input']>;
};


export type SubscriptionOnPropertyUpdatedArgs = {
  propertyId: Scalars['ID']['input'];
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Tenant = {
  __typename?: 'Tenant';
  accountStatus: AccountStatus;
  createdAt: Scalars['AWSDateTime']['output'];
  currency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailNotifications: Scalars['Boolean']['output'];
  firstName: Scalars['String']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  language: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications: Scalars['Boolean']['output'];
  smsNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
  userType: UserType;
};

export type UpdateApplicationInput = {
  applicantDetails?: InputMaybe<ApplicantDetailsInput>;
  documents?: InputMaybe<ApplicationDocumentsInput>;
  employment?: InputMaybe<EmploymentDetailsInput>;
  references?: InputMaybe<Array<ReferenceInput>>;
};

export type UpdatePropertyInput = {
  address?: InputMaybe<AddressInput>;
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  availability?: InputMaybe<PropertyAvailabilityInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<PropertyMediaInput>;
  pricing?: InputMaybe<PropertyPricingInput>;
  propertyType?: InputMaybe<PropertyType>;
  specifications?: InputMaybe<PropertySpecificationsInput>;
  status?: InputMaybe<PropertyStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<Scalars['AWSJSON']['input']>;
  profileImage?: InputMaybe<Scalars['String']['input']>;
};

export type UserBasic = {
  __typename?: 'UserBasic';
  currency: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  language: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  userId: Scalars['ID']['output'];
  userType: UserType;
};

export type UserProfile = Admin | Landlord | Tenant;

export type UserType =
  | 'ADMIN'
  | 'LANDLORD'
  | 'TENANT';

export type Ward = {
  __typename?: 'Ward';
  districtId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};
