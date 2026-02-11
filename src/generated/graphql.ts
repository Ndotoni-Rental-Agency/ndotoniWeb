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
  street?: Maybe<Scalars['String']['output']>;
  ward?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  coordinates?: InputMaybe<CoordinatesInput>;
  district: Scalars['String']['input'];
  postalCode?: InputMaybe<Scalars['String']['input']>;
  region: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
};

export type Admin = {
  __typename?: 'Admin';
  accountStatus?: Maybe<AccountStatus>;
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['AWSDateTime']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailNotifications?: Maybe<Scalars['Boolean']['output']>;
  emergencyContactName?: Maybe<Scalars['String']['output']>;
  emergencyContactPhone?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  hasProperties: Scalars['Boolean']['output'];
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  nationalIdLast4?: Maybe<Scalars['String']['output']>;
  occupation?: Maybe<Scalars['String']['output']>;
  permissions?: Maybe<Array<Scalars['String']['output']>>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications?: Maybe<Scalars['Boolean']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  smsNotifications?: Maybe<Scalars['Boolean']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  userType: UserType;
  ward?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type Agent = {
  __typename?: 'Agent';
  accountStatus?: Maybe<AccountStatus>;
  address?: Maybe<Scalars['String']['output']>;
  agencyName?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['AWSDateTime']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailNotifications?: Maybe<Scalars['Boolean']['output']>;
  emergencyContactName?: Maybe<Scalars['String']['output']>;
  emergencyContactPhone?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  hasProperties: Scalars['Boolean']['output'];
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  licenseNumber?: Maybe<Scalars['String']['output']>;
  nationalIdLast4?: Maybe<Scalars['String']['output']>;
  occupation?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications?: Maybe<Scalars['Boolean']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  smsNotifications?: Maybe<Scalars['Boolean']['output']>;
  specializations?: Maybe<Array<Scalars['String']['output']>>;
  street?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  userType: UserType;
  ward?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type ApplicantDetails = {
  __typename?: 'ApplicantDetails';
  emergencyContact: EmergencyContact;
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
  applicant?: Maybe<TenantBasicInfo>;
  applicantDetails: ApplicantDetails;
  applicationId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  landlord?: Maybe<LandlordBasicInfo>;
  landlordNotes?: Maybe<Scalars['String']['output']>;
  property?: Maybe<Property>;
  propertyId: Scalars['ID']['output'];
  rejectionReason?: Maybe<Scalars['String']['output']>;
  status: ApplicationStatus;
  submittedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
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
  status?: Maybe<Scalars['String']['output']>;
  submittedAt?: Maybe<Scalars['String']['output']>;
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
};

export type CategorizedPropertiesResponse = {
  __typename?: 'CategorizedPropertiesResponse';
  favorites?: Maybe<CategoryPropertyResponse>;
  lowestPrice: CategoryPropertyResponse;
  more?: Maybe<CategoryPropertyResponse>;
  mostViewed?: Maybe<CategoryPropertyResponse>;
  nearby: CategoryPropertyResponse;
  recentlyViewed?: Maybe<CategoryPropertyResponse>;
};

export type CategoryPropertyResponse = {
  __typename?: 'CategoryPropertyResponse';
  category: PropertyCategory;
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
  properties: Array<PropertyCard>;
};

export type ChatInitializationResponse = {
  __typename?: 'ChatInitializationResponse';
  /** Conversation ID for the chat */
  conversationId: Scalars['ID']['output'];
  /** Landlord information (safe subset) */
  landlordInfo: ChatLandlordInfo;
  /** Property ID */
  propertyId: Scalars['ID']['output'];
  /** Property title for context */
  propertyTitle: Scalars['String']['output'];
};

export type ChatLandlordInfo = {
  __typename?: 'ChatLandlordInfo';
  /** Business name if available */
  businessName?: Maybe<Scalars['String']['output']>;
  /** Landlord's first name */
  firstName: Scalars['String']['output'];
  /** Landlord's last name */
  lastName: Scalars['String']['output'];
  /** Profile image URL if available */
  profileImage?: Maybe<Scalars['String']['output']>;
};

export type ChatMessage = {
  __typename?: 'ChatMessage';
  content: Scalars['String']['output'];
  conversationId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isMine: Scalars['Boolean']['output'];
  isRead: Scalars['Boolean']['output'];
  senderName: Scalars['String']['output'];
  timestamp: Scalars['AWSDateTime']['output'];
};

export type CognitoUserPool = {
  userPoolId: Scalars['String']['input'];
};

export type Conversation = {
  __typename?: 'Conversation';
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['String']['output'];
  lastMessage: Scalars['String']['output'];
  lastMessageTime: Scalars['AWSDateTime']['output'];
  otherPartyImage?: Maybe<Scalars['String']['output']>;
  otherPartyName: Scalars['String']['output'];
  propertyTitle: Scalars['String']['output'];
  unreadCount: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
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

export type CreatePropertyDraftInput = {
  available: Scalars['Boolean']['input'];
  bathrooms?: InputMaybe<Scalars['Int']['input']>;
  bedrooms?: InputMaybe<Scalars['Int']['input']>;
  currency: Scalars['String']['input'];
  district: Scalars['String']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  monthlyRent: Scalars['Float']['input'];
  propertyType: PropertyType;
  region: Scalars['String']['input'];
  street?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  ward?: InputMaybe<Scalars['String']['input']>;
  guestPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  guestWhatsappNumber?: InputMaybe<Scalars['String']['input']>;
  guestEmail?: InputMaybe<Scalars['String']['input']>;
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

export type CreatePropertyResponse = {
  __typename?: 'CreatePropertyResponse';
  message: Scalars['String']['output'];
  propertyId: Scalars['ID']['output'];
  success: Scalars['Boolean']['output'];
};

export type DataType =
  | 'LOCATIONS'
  | 'PROPERTIES';

export type DeleteResponse = {
  __typename?: 'DeleteResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
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

export type EmploymentStatus =
  | 'CONTRACT'
  | 'EMPLOYED_FULL_TIME'
  | 'EMPLOYED_PART_TIME'
  | 'RETIRED'
  | 'SELF_EMPLOYED'
  | 'STUDENT'
  | 'UNEMPLOYED';

export type EnrichPropertyInput = {
  address?: InputMaybe<AddressInput>;
  amenities?: InputMaybe<Array<Scalars['String']['input']>>;
  availability?: InputMaybe<PropertyAvailabilityInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  media?: InputMaybe<PropertyMediaInput>;
  pricing?: InputMaybe<PropertyPricingInput>;
  specifications?: InputMaybe<PropertySpecificationsInput>;
};

export type FavoriteResponse = {
  __typename?: 'FavoriteResponse';
  isFavorited: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type InitialAppState = {
  __typename?: 'InitialAppState';
  categorizedProperties: CategorizedPropertiesResponse;
};

export type Landlord = {
  __typename?: 'Landlord';
  accountStatus?: Maybe<AccountStatus>;
  address?: Maybe<Scalars['String']['output']>;
  businessLicense?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['AWSDateTime']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailNotifications?: Maybe<Scalars['Boolean']['output']>;
  emergencyContactName?: Maybe<Scalars['String']['output']>;
  emergencyContactPhone?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  hasProperties: Scalars['Boolean']['output'];
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  nationalIdLast4?: Maybe<Scalars['String']['output']>;
  occupation?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications?: Maybe<Scalars['Boolean']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  smsNotifications?: Maybe<Scalars['Boolean']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  taxId?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  userType: UserType;
  verificationDocuments?: Maybe<Array<Scalars['String']['output']>>;
  ward?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type LandlordApplication = {
  __typename?: 'LandlordApplication';
  address?: Maybe<Scalars['String']['output']>;
  adminNotes?: Maybe<Scalars['String']['output']>;
  alternatePhone?: Maybe<Scalars['String']['output']>;
  applicant?: Maybe<TenantBasicInfo>;
  applicationId: Scalars['ID']['output'];
  birthDate?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  nationalId?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  rejectionReason?: Maybe<Scalars['String']['output']>;
  reviewedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  status?: Maybe<LandlordApplicationStatus>;
  submittedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  userId: Scalars['ID']['output'];
};

export type LandlordApplicationInput = {
  address: AddressInput;
  alternatePhone?: InputMaybe<Scalars['String']['input']>;
  birthDate: Scalars['String']['input'];
  nationalId: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type LandlordApplicationListResponse = {
  __typename?: 'LandlordApplicationListResponse';
  applications: Array<LandlordApplication>;
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type LandlordApplicationStats = {
  __typename?: 'LandlordApplicationStats';
  approved: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  rejected: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  underReview: Scalars['Int']['output'];
};

export type LandlordApplicationStatus =
  | 'APPROVED'
  | 'PENDING'
  | 'REJECTED'
  | 'UNDER_REVIEW';

export type LandlordBasicInfo = {
  __typename?: 'LandlordBasicInfo';
  businessName?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
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

export type MediaFile = {
  __typename?: 'MediaFile';
  contentType: Scalars['String']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  fileUrl: Scalars['String']['output'];
};

export type MediaItem = {
  __typename?: 'MediaItem';
  actionTime: Scalars['Float']['output'];
  additionalFiles?: Maybe<Array<Maybe<MediaFile>>>;
  media?: Maybe<PropertyMedia>;
  userId: Scalars['String']['output'];
};

export type MediaUploadResponse = {
  __typename?: 'MediaUploadResponse';
  fileUrl: Scalars['String']['output'];
  key: Scalars['String']['output'];
  uploadUrl: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Delete a rental application.
   *
   * Admin only - requires authentication and admin role.
   * Permanently removes application from system.
   */
  adminDeleteApplication: SuccessResponse;
  /**
   * Delete landlord application (admin only).
   *
   * Admin only - requires authentication and admin role.
   * Permanently removes landlord application from system.
   */
  adminDeleteLandlordApplication: SuccessResponse;
  /**
   * Delete a property permanently.
   *
   * Admin only - requires authentication and admin role.
   * Permanently removes property from system.
   */
  adminDeleteProperty: SuccessResponse;
  /**
   * Update rental application status as admin.
   *
   * Admin only - requires authentication and admin role.
   * Can force any status transition.
   */
  adminUpdateApplicationStatus: Application;
  /**
   * Approve a property listing.
   *
   * Admin only - requires authentication and admin role.
   * Changes property status to AVAILABLE (approved and available for rent).
   */
  approveProperty: SuccessResponse;
  /**
   * Assign an agent to manage this property.
   *
   * Requires authentication - only property owner can assign agent.
   */
  assignPropertyAgent: SuccessResponse;
  /**
   * Associate uploaded media with a property.
   *
   * Requires authentication - only property owner can associate media.
   */
  associateMediaWithProperty: Property;
  /**
   * Create a new location (region, district, ward, or street).
   *
   * Admin only - requires authentication.
   */
  createLocation: LocationCreateResponse;
  /**
   * Create a new property listing.
   *
   * Requires authentication - landlordId derived from auth context.
   */
  createProperty: CreatePropertyResponse;
  /**
   * Create a property draft with minimal required fields.
   *
   * Requires authentication - landlordId derived from auth context.
   */
  createPropertyDraft: CreatePropertyResponse;
  /**
   * Delete a conversation for the current user.
   *
   * This only removes the conversation from the current user's view.
   * The other participant will still see the conversation.
   * Requires authentication - userId derived from auth context.
   */
  deleteConversation: DeleteResponse;
  /**
   * Delete a media item from storage.
   *
   * Requires authentication - only owner can delete.
   */
  deleteMediaItem?: Maybe<MediaItem>;
  /**
   * Delete a message for the current user.
   *
   * This only removes the message from the current user's view.
   * The other participant will still see the message.
   * Requires authentication - userId derived from auth context.
   */
  deleteMessage: DeleteResponse;
  /**
   * Delete a property listing (soft delete - sets status to DELETED).
   *
   * Requires authentication - only property owner can delete.
   */
  deleteProperty: SuccessResponse;
  /**
   * Delete user account.
   *
   * Admin only - requires authentication and admin role.
   * Permanently deletes user and all associated data.
   */
  deleteUser: SuccessResponse;
  dummyMutation?: Maybe<Scalars['String']['output']>;
  /**
   * Request password reset code.
   *
   * Public endpoint - sends reset code to user's email.
   */
  forgotPassword: SuccessResponse;
  /**
   * Generate presigned URL for bulk data upload.
   *
   * Admin only - requires authentication and admin role.
   * Returns a presigned URL and file key for uploading CSV files.
   * Supports both locations and properties data imports.
   * Files are automatically processed by batch jobs when uploaded.
   */
  generateDataUploadUrl: UploadUrlResponse;
  /**
   * Get presigned URL for uploading media files.
   *
   * Requires authentication - userId/landlordId derived from auth context.
   */
  getMediaUploadUrl: MediaUploadResponse;
  /**
   * Batch import locations from CSV data.
   *
   * Admin only - requires authentication.
   */
  importLocationsFromCSV: LocationImportResponse;
  /**
   * Batch import properties from CSV data.
   *
   * Requires authentication - landlordId derived from auth context.
   */
  importPropertiesFromCSV: PropertyImportResult;
  /**
   * Initialize a chat conversation for a property.
   *
   * This mutation securely handles landlord information without exposing landlordId to clients.
   * It validates that the property exists and returns the necessary chat context.
   * The backend derives tenantId from the authenticated user and landlordId from the property.
   *
   * Requires authentication.
   */
  initializePropertyChat: ChatInitializationResponse;
  /**
   * Mark all messages in a conversation as read.
   *
   * Requires authentication - userId derived from auth context.
   * Backend validates that the user is a participant in the conversation.
   */
  markAsRead: Conversation;
  /**
   * Mark property as available for rent.
   *
   * Requires authentication - only property owner can mark as available.
   */
  markPropertyAsAvailable: Property;
  /**
   * Mark property as rented and assign tenant.
   *
   * Requires authentication - only property owner can mark as rented.
   */
  markPropertyAsRented: Property;
  publishNewPropertyEvent?: Maybe<SubscriptionPublishResponse>;
  /**
   * Publish a property draft to make it available for browsing.
   *
   * Requires authentication - only property owner can publish.
   * Enforces minimal requirements before publishing.
   */
  publishProperty: SuccessResponse;
  publishPropertyUpdateEvent?: Maybe<PropertyUpdateEvent>;
  /**
   * Regenerate location JSON file for CloudFront distribution.
   *
   * Admin only - requires authentication.
   */
  regenerateLocationJson: LocationJsonResponse;
  /**
   * Reject a property listing.
   *
   * Admin only - requires authentication and admin role.
   * Changes property status to DELETED with reason.
   */
  rejectProperty: SuccessResponse;
  /**
   * Remove agent from this property.
   *
   * Requires authentication - only property owner can remove agent.
   */
  removePropertyAgent: SuccessResponse;
  /**
   * Resend email verification code.
   *
   * Public endpoint - sends new verification code to user's email.
   */
  resendVerificationCode: SuccessResponse;
  /**
   * Reset password with confirmation code.
   *
   * Public endpoint - resets password using code from email.
   */
  resetPassword: SuccessResponse;
  /**
   * Review landlord application (admin only).
   *
   * Admin only - requires authentication and admin role.
   * Approve or reject a landlord application.
   * When approved, automatically updates user type to LANDLORD.
   */
  reviewLandlordApplication: LandlordApplication;
  /**
   * Send a message in a conversation.
   *
   * Requires authentication - senderId and senderName derived from auth context.
   * Backend validates that the user is a participant in the conversation.
   */
  sendMessage: ChatMessage;
  /**
   * Sign in with email and password.
   *
   * Public endpoint - authenticates user via Cognito.
   * Returns auth tokens and user profile on success.
   */
  signIn: AuthResponse;
  /**
   * Register a new user account.
   *
   * Public endpoint - creates user in Cognito and DynamoDB.
   * Returns auth tokens and user profile on success.
   */
  signUp: SuccessResponse;
  /**
   * Submit a new rental application for a property.
   *
   * Requires authentication - applicantUserId derived from auth context.
   */
  submitApplication: Application;
  /**
   * Submit landlord application to upgrade from TENANT to LANDLORD.
   *
   * Requires authentication - userId derived from auth context.
   * Changes user type from TENANT to LANDLORD after verification.
   */
  submitLandlordApplication: ApplicationResponse;
  /**
   * Toggle favorite status for a property.
   *
   * Requires authentication - userId derived from auth context.
   */
  toggleFavorite: FavoriteResponse;
  /**
   * Update editable application data (does NOT change status).
   *
   * Requires authentication - only applicant can update their application.
   */
  updateApplication: Application;
  /**
   * Update application status with controlled state transitions.
   *
   * Allowed transitions:
   * - Tenant: SUBMITTED -> WITHDRAWN
   * - Landlord: SUBMITTED -> UNDER_REVIEW -> APPROVED/REJECTED
   *
   * Requires authentication - landlord or applicant based on transition.
   */
  updateApplicationStatus: Application;
  /**
   * Update location name.
   *
   * Admin only - requires authentication.
   */
  updateLocation: LocationUpdateResponse;
  /**
   * Update an existing property listing.
   *
   * Requires authentication - only property owner can update.
   */
  updateProperty: SuccessResponse;
  /**
   * Update property status (DRAFT, AVAILABLE, RENTED, MAINTENANCE, DELETED).
   *
   * Requires authentication - only property owner can update status.
   */
  updatePropertyStatus: Property;
  /**
   * Update authenticated user's profile.
   *
   * Requires authentication - userId derived from auth context.
   */
  updateUser: SuccessResponse;
  /**
   * Update user role.
   *
   * Admin only - requires authentication and admin role.
   * Can change user between TENANT, LANDLORD, AGENT, ADMIN roles.
   */
  updateUserRole: SuccessResponse;
  /**
   * Update user account status.
   *
   * Admin only - requires authentication and admin role.
   * Can activate, suspend, or ban user accounts.
   */
  updateUserStatus: SuccessResponse;
  /**
   * Verify email address with confirmation code.
   *
   * Public endpoint - verifies email using code sent during signup.
   */
  verifyEmail: SuccessResponse;
};


export type MutationAdminDeleteApplicationArgs = {
  applicationId: Scalars['ID']['input'];
};


export type MutationAdminDeleteLandlordApplicationArgs = {
  applicationId: Scalars['ID']['input'];
};


export type MutationAdminDeletePropertyArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationAdminUpdateApplicationStatusArgs = {
  applicationId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status: ApplicationStatus;
};


export type MutationApprovePropertyArgs = {
  notes?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
};


export type MutationAssignPropertyAgentArgs = {
  agentId: Scalars['ID']['input'];
  propertyId: Scalars['ID']['input'];
};


export type MutationAssociateMediaWithPropertyArgs = {
  media: PropertyMediaInput;
  propertyId: Scalars['ID']['input'];
};


export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};


export type MutationCreatePropertyArgs = {
  input: CreatePropertyInput;
};


export type MutationCreatePropertyDraftArgs = {
  input: CreatePropertyDraftInput;
};


export type MutationDeleteConversationArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationDeleteMediaItemArgs = {
  fileUrl: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['String']['input'];
};


export type MutationDeletePropertyArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationGenerateDataUploadUrlArgs = {
  dataType: DataType;
  filename?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGetMediaUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
};


export type MutationImportLocationsFromCsvArgs = {
  csvData: Scalars['String']['input'];
};


export type MutationImportPropertiesFromCsvArgs = {
  csvData: Scalars['String']['input'];
};


export type MutationInitializePropertyChatArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationMarkAsReadArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationMarkPropertyAsAvailableArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationMarkPropertyAsRentedArgs = {
  propertyId: Scalars['ID']['input'];
  tenantId: Scalars['ID']['input'];
};


export type MutationPublishNewPropertyEventArgs = {
  propertyId: Scalars['ID']['input'];
  region: Scalars['String']['input'];
};


export type MutationPublishPropertyArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationPublishPropertyUpdateEventArgs = {
  input: PropertyUpdateEventInput;
};


export type MutationRejectPropertyArgs = {
  propertyId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};


export type MutationRemovePropertyAgentArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationResendVerificationCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  confirmationCode: Scalars['String']['input'];
  email: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationReviewLandlordApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  status: LandlordApplicationStatus;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
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


export type MutationSubmitLandlordApplicationArgs = {
  input: LandlordApplicationInput;
};


export type MutationToggleFavoriteArgs = {
  propertyId: Scalars['ID']['input'];
};


export type MutationUpdateApplicationArgs = {
  applicationId: Scalars['ID']['input'];
  input: UpdateApplicationInput;
};


export type MutationUpdateApplicationStatusArgs = {
  applicationId: Scalars['ID']['input'];
  input: UpdateApplicationStatusInput;
};


export type MutationUpdateLocationArgs = {
  locationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationUpdatePropertyArgs = {
  input: UpdatePropertyInput;
  propertyId: Scalars['ID']['input'];
};


export type MutationUpdatePropertyStatusArgs = {
  propertyId: Scalars['ID']['input'];
  status: PropertyStatus;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserRoleArgs = {
  userId: Scalars['ID']['input'];
  userType: UserType;
};


export type MutationUpdateUserStatusArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  status: AccountStatus;
  userId: Scalars['ID']['input'];
};


export type MutationVerifyEmailArgs = {
  code: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type Property = {
  __typename?: 'Property';
  address: Address;
  agent?: Maybe<PropertyUser>;
  agentId?: Maybe<Scalars['ID']['output']>;
  amenities?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  availability?: Maybe<PropertyAvailability>;
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  landlord?: Maybe<PropertyUser>;
  media?: Maybe<PropertyMedia>;
  pricing?: Maybe<PropertyPricing>;
  propertyId: Scalars['ID']['output'];
  propertyType: PropertyType;
  specifications?: Maybe<PropertySpecifications>;
  status: PropertyStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
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

export type PropertyCategory =
  | 'FAVORITES'
  | 'LOWEST_PRICE'
  | 'MORE'
  | 'MOST_VIEWED'
  | 'NEARBY'
  | 'RECENTLY_VIEWED';

export type PropertyChange = {
  __typename?: 'PropertyChange';
  field: Scalars['String']['output'];
  newValue: Scalars['AWSJSON']['output'];
  oldValue?: Maybe<Scalars['AWSJSON']['output']>;
};

export type PropertyChangeInput = {
  field: Scalars['String']['input'];
  newValue: Scalars['AWSJSON']['input'];
  oldValue?: InputMaybe<Scalars['AWSJSON']['input']>;
};

export type PropertyEventType =
  | 'ARCHIVED'
  | 'AVAILABILITY_CHANGED'
  | 'CREATED'
  | 'DELETED'
  | 'DESCRIPTION_UPDATED'
  | 'MEDIA_UPDATED'
  | 'PRICE_CHANGED'
  | 'PROPERTY_CREATED'
  | 'PUBLISHED'
  | 'STATUS_CHANGED'
  | 'UPDATED';

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

export type PropertySortOption =
  | 'NEWEST_FIRST'
  | 'PRICE_HIGH_LOW'
  | 'PRICE_LOW_HIGH';

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

export type PropertyStats = {
  __typename?: 'PropertyStats';
  availableProperties: Scalars['Int']['output'];
  deletedProperties: Scalars['Int']['output'];
  draftProperties: Scalars['Int']['output'];
  maintenanceProperties: Scalars['Int']['output'];
  newPropertiesThisMonth: Scalars['Int']['output'];
  newPropertiesThisWeek: Scalars['Int']['output'];
  rentedProperties: Scalars['Int']['output'];
  totalProperties: Scalars['Int']['output'];
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
  changes: Array<PropertyChange>;
  eventType: PropertyEventType;
  property: Scalars['AWSJSON']['output'];
  propertyId: Scalars['ID']['output'];
  timestamp: Scalars['AWSDateTime']['output'];
};

export type PropertyUpdateEventInput = {
  changes: Array<PropertyChangeInput>;
  eventType: PropertyEventType;
  property: Scalars['AWSJSON']['input'];
  propertyId: Scalars['ID']['input'];
  timestamp: Scalars['AWSDateTime']['input'];
};

export type PropertyUser = {
  __typename?: 'PropertyUser';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type PublishResult = {
  __typename?: 'PublishResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  dummyQuery?: Maybe<Scalars['String']['output']>;
  /**
   * Get rental application statistics for admin dashboard.
   *
   * Admin only - requires authentication and admin role.
   * Returns overall system statistics for rental applications.
   */
  getAdminApplicationStats: ApplicationStats;
  /**
   * Get property statistics for admin dashboard.
   *
   * Admin only - requires authentication and admin role.
   * Returns overall system statistics for properties.
   */
  getAdminPropertyStats: PropertyStats;
  /**
   * Get a single application by ID.
   *
   * Requires authentication - only accessible by applicant or landlord.
   */
  getApplication?: Maybe<Application>;
  /**
   * Get presigned URL for uploading application documents.
   *
   * Requires authentication - only applicant can upload documents.
   */
  getApplicationDocumentUploadUrl: MediaUploadResponse;
  /**
   * Get application statistics for landlord dashboard.
   *
   * Returns counts by status: total, submitted, under review, approved, rejected, withdrawn.
   *
   * Requires authentication - landlordId derived from auth context.
   */
  getApplicationStats: ApplicationStats;
  /**
   * Get categorized properties for home page.
   *
   * Returns multiple categories in one request: nearby, lowest price, favorites, most viewed, etc.
   */
  getCategorizedProperties: CategorizedPropertiesResponse;
  /**
   * Get all messages in a conversation.
   *
   * Requires authentication - user must be participant in conversation.
   */
  getConversationMessages: Array<ChatMessage>;
  /**
   * Get all districts within a region.
   *
   * Public endpoint - returns districts for specified region.
   */
  getDistricts: Array<District>;
  /**
   * Get initial app state with categorized properties and regions.
   *
   * Returns all data needed for the home screen in a single request.
   */
  getInitialAppState: InitialAppState;
  getInitialAppStateFast: InitialAppState;
  /**
   * Get a single landlord application by ID.
   *
   * Admin only - requires authentication and admin role.
   */
  getLandlordApplication?: Maybe<LandlordApplication>;
  /**
   * Get landlord application statistics for admin dashboard.
   *
   * Admin only - requires authentication and admin role.
   * Returns overall system statistics for landlord applications.
   */
  getLandlordApplicationStats: LandlordApplicationStats;
  /**
   * Get authenticated user's profile.
   *
   * Returns user profile based on auth context.
   */
  getMe?: Maybe<UserProfile>;
  /**
   * Get media library for authenticated user.
   *
   * Requires authentication - userId derived from auth context.
   */
  getMediaLibrary?: Maybe<MediaItem>;
  /**
   * Get my landlord application.
   *
   * Requires authentication - userId derived from auth context.
   */
  getMyLandlordApplication?: Maybe<LandlordApplication>;
  /**
   * Get properties by specific category with pagination.
   *
   * Categories: NEARBY, LOWEST_PRICE, FAVORITES, MOST_VIEWED, RECENTLY_VIEWED, MORE
   */
  getPropertiesByCategory: CategoryPropertyResponse;
  /**
   * Get property cards by location with optional sorting.
   *
   * Returns lightweight PropertyCard objects for fast browsing.
   * Default sorting: newest first (actionTime DESC)
   *
   * When sortBy is PRICE_LOW_HIGH or PRICE_HIGH_LOW, uses GSI for efficient price-based sorting.
   * Results are paginated - use nextToken for subsequent pages.
   *
   * Ward filtering should be done on the frontend after fetching district results.
   */
  getPropertiesByLocation: PropertyCardsResponse;
  /** Get single property details by ID */
  getProperty?: Maybe<Property>;
  /**
   * Get all regions.
   *
   * Public endpoint - returns list of all regions.
   */
  getRegions: Array<Region>;
  /**
   * Get all streets within a ward.
   *
   * Public endpoint - returns streets for specified ward.
   */
  getStreets: Array<Street>;
  /**
   * Get total unread message count for authenticated user.
   *
   * Requires authentication - userId derived from auth context.
   */
  getUnreadCount: Scalars['Int']['output'];
  /**
   * Get user by email.
   *
   * Admin only - requires authentication and admin role.
   */
  getUserByEmail?: Maybe<UserProfile>;
  /**
   * Get user by ID.
   *
   * Admin only - requires authentication and admin role.
   */
  getUserById?: Maybe<UserProfile>;
  /**
   * Get all conversations for the authenticated user.
   *
   * Requires authentication - userId derived from auth context.
   */
  getUserConversations: Array<Conversation>;
  /**
   * Get user statistics for admin dashboard.
   *
   * Admin only - requires authentication and admin role.
   * Returns counts by role and registration trends.
   */
  getUserStats: UserStats;
  /**
   * Get all wards within a district.
   *
   * Public endpoint - returns wards for specified district.
   */
  getWards: Array<Ward>;
  /**
   * List properties managed by the authenticated agent.
   *
   * Returns full Property objects with all details.
   * Requires authentication - agentId derived from auth context.
   */
  listAgentProperties: PropertyListResponse;
  /**
   * List all rental applications in the system.
   *
   * Admin only - requires authentication and admin role.
   * Returns paginated list of all rental applications (excludes landlord applications).
   */
  listAllApplications: ApplicationListResponse;
  /**
   * List all landlord applications in the system.
   *
   * Admin only - requires authentication and admin role.
   * Returns paginated list of all landlord applications.
   */
  listAllLandlordApplications: LandlordApplicationListResponse;
  /**
   * List all properties in the system.
   *
   * Admin only - requires authentication and admin role.
   * Returns paginated list of all properties with optional status filter.
   */
  listAllProperties: PropertyListResponse;
  /**
   * List all users in the system.
   *
   * Admin only - requires authentication and admin role.
   * Returns paginated list of all users with their profiles.
   */
  listAllUsers: UserListResponse;
  /**
   * List properties owned by the authenticated landlord.
   *
   * Returns full Property objects with all details.
   * Requires authentication - landlordId derived from auth context.
   */
  listLandlordProperties: PropertyListResponse;
  /**
   * List applications submitted by the authenticated user.
   *
   * Requires authentication - userId derived from auth context.
   */
  listMyApplications: ApplicationListResponse;
  /**
   * List applications for a specific property.
   *
   * Requires authentication - only accessible by property landlord.
   */
  listPropertyApplications: ApplicationListResponse;
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


export type QueryGetCategorizedPropertiesArgs = {
  limitPerCategory?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetConversationMessagesArgs = {
  conversationId: Scalars['String']['input'];
};


export type QueryGetDistrictsArgs = {
  regionId: Scalars['ID']['input'];
};


export type QueryGetInitialAppStateArgs = {
  limitPerCategory?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetInitialAppStateFastArgs = {
  limitPerCategory?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetLandlordApplicationArgs = {
  applicationId: Scalars['ID']['input'];
};


export type QueryGetPropertiesByCategoryArgs = {
  category: PropertyCategory;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetPropertiesByLocationArgs = {
  district?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  region: Scalars['String']['input'];
  sortBy?: InputMaybe<PropertySortOption>;
};


export type QueryGetPropertyArgs = {
  propertyId: Scalars['ID']['input'];
};


export type QueryGetStreetsArgs = {
  wardId: Scalars['ID']['input'];
};


export type QueryGetUserByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetWardsArgs = {
  districtId: Scalars['ID']['input'];
};


export type QueryListAgentPropertiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListAllApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};


export type QueryListAllLandlordApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<LandlordApplicationStatus>;
};


export type QueryListAllPropertiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<PropertyStatus>;
};


export type QueryListAllUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  userType?: InputMaybe<UserType>;
};


export type QueryListLandlordPropertiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListMyApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ApplicationStatus>;
};


export type QueryListPropertyApplicationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  propertyId: Scalars['ID']['input'];
  status?: InputMaybe<ApplicationStatus>;
};

export type Region = {
  __typename?: 'Region';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type SendMessageInput = {
  content: Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
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
  propertyId: Scalars['ID']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  dummySubscription?: Maybe<Scalars['String']['output']>;
  onNewPropertyInRegion?: Maybe<SubscriptionPublishResponse>;
  onPropertyUpdated?: Maybe<PropertyUpdateEvent>;
};


export type SubscriptionOnNewPropertyInRegionArgs = {
  region: Scalars['String']['input'];
};


export type SubscriptionOnPropertyUpdatedArgs = {
  propertyId: Scalars['ID']['input'];
};

export type SubscriptionPublishResponse = {
  __typename?: 'SubscriptionPublishResponse';
  message?: Maybe<Scalars['String']['output']>;
  propertyId?: Maybe<Scalars['ID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Tenant = {
  __typename?: 'Tenant';
  accountStatus?: Maybe<AccountStatus>;
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['AWSDateTime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dateOfBirth?: Maybe<Scalars['AWSDateTime']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  emailNotifications?: Maybe<Scalars['Boolean']['output']>;
  emergencyContactName?: Maybe<Scalars['String']['output']>;
  emergencyContactPhone?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  gender?: Maybe<Scalars['String']['output']>;
  hasProperties: Scalars['Boolean']['output'];
  isEmailVerified?: Maybe<Scalars['Boolean']['output']>;
  language?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  nationalIdLast4?: Maybe<Scalars['String']['output']>;
  occupation?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  pushNotifications?: Maybe<Scalars['Boolean']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  smsNotifications?: Maybe<Scalars['Boolean']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['AWSDateTime']['output']>;
  userType: UserType;
  ward?: Maybe<Scalars['String']['output']>;
  whatsappNumber?: Maybe<Scalars['String']['output']>;
};

export type TenantBasicInfo = {
  __typename?: 'TenantBasicInfo';
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
};

export type UnreadCountUpdate = {
  __typename?: 'UnreadCountUpdate';
  totalUnread: Scalars['Int']['output'];
};

export type UpdateApplicationInput = {
  applicantDetails?: InputMaybe<ApplicantDetailsInput>;
};

export type UpdateApplicationStatusInput = {
  landlordNotes?: InputMaybe<Scalars['String']['input']>;
  rejectionReason?: InputMaybe<Scalars['String']['input']>;
  status: ApplicationStatus;
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
  address?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  dateOfBirth?: InputMaybe<Scalars['AWSDateTime']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  emergencyContactName?: InputMaybe<Scalars['String']['input']>;
  emergencyContactPhone?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  hasProperties?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  nationalId?: InputMaybe<Scalars['String']['input']>;
  occupation?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  preferences?: InputMaybe<Scalars['AWSJSON']['input']>;
  profileImage?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  ward?: InputMaybe<Scalars['String']['input']>;
  whatsappNumber?: InputMaybe<Scalars['String']['input']>;
};

/** Response for presigned URL generation */
export type UploadUrlResponse = {
  __typename?: 'UploadUrlResponse';
  /** The S3 file key where the file will be stored */
  fileKey: Scalars['String']['output'];
  /** The presigned URL to upload the file to */
  uploadUrl: Scalars['String']['output'];
};

export type UserListResponse = {
  __typename?: 'UserListResponse';
  count: Scalars['Int']['output'];
  nextToken?: Maybe<Scalars['String']['output']>;
  users: Array<UserWithId>;
};

export type UserProfile = Admin | Agent | Landlord | Tenant;

export type UserStats = {
  __typename?: 'UserStats';
  activeUsers: Scalars['Int']['output'];
  newUsersThisMonth: Scalars['Int']['output'];
  newUsersThisWeek: Scalars['Int']['output'];
  totalAdmins: Scalars['Int']['output'];
  totalAgents: Scalars['Int']['output'];
  totalLandlords: Scalars['Int']['output'];
  totalTenants: Scalars['Int']['output'];
  totalUsers: Scalars['Int']['output'];
};

export type UserType =
  | 'ADMIN'
  | 'AGENT'
  | 'LANDLORD'
  | 'TENANT';

export type UserWithId = {
  __typename?: 'UserWithId';
  profile: UserProfile;
  userId: Scalars['ID']['output'];
};

export type Ward = {
  __typename?: 'Ward';
  districtId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type _ApplicationPlaceholder = {
  __typename?: '_ApplicationPlaceholder';
  _temp?: Maybe<Scalars['String']['output']>;
};

export type _ChatPlaceholder = {
  __typename?: '_ChatPlaceholder';
  _temp?: Maybe<Scalars['String']['output']>;
};

export type _PropertyPlaceholder = {
  __typename?: '_PropertyPlaceholder';
  _temp?: Maybe<Scalars['String']['output']>;
};
