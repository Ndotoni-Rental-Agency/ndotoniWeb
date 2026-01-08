/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAppInitialState = /* GraphQL */ `query GetAppInitialState($limit: Int) {
  getAppInitialState(limit: $limit) {
    user {
      userId
      firstName
      lastName
      email
      userType
      profileImage
      language
      currency
      __typename
    }
    properties {
      nextToken
      count
      __typename
    }
    totalProperties
    personalizedSections {
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAppInitialStateQueryVariables,
  APITypes.GetAppInitialStateQuery
>;
export const getPropertyCards = /* GraphQL */ `query GetPropertyCards($limit: Int, $nextToken: String) {
  getPropertyCards(limit: $limit, nextToken: $nextToken) {
    properties {
      propertyId
      title
      monthlyRent
      currency
      propertyType
      bedrooms
      district
      region
      thumbnail
      available
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertyCardsQueryVariables,
  APITypes.GetPropertyCardsQuery
>;
export const getApplication = /* GraphQL */ `query GetApplication($applicationId: ID!) {
  getApplication(applicationId: $applicationId) {
    applicationId
    propertyId
    property {
      propertyId
      landlordId
      managerId
      title
      description
      propertyType
      amenities
      status
      version
      createdAt
      updatedAt
      __typename
    }
    applicantUserId
    applicant {
      userId
      email
      phoneNumber
      firstName
      lastName
      userType
      accountStatus
      isEmailVerified
      profileImage
      language
      currency
      emailNotifications
      smsNotifications
      pushNotifications
      createdAt
      updatedAt
      __typename
    }
    landlordId
    landlord {
      userId
      email
      phoneNumber
      firstName
      lastName
      userType
      accountStatus
      isEmailVerified
      profileImage
      language
      currency
      emailNotifications
      smsNotifications
      pushNotifications
      businessName
      businessLicense
      taxId
      verificationDocuments
      createdAt
      updatedAt
      __typename
    }
    status
    submittedAt
    reviewedAt
    reviewedBy
    applicantDetails {
      monthlyIncome
      occupation
      employmentStatus
      moveInDate
      leaseDuration
      numberOfOccupants
      hasPets
      petDetails
      smokingStatus
      __typename
    }
    employment {
      employerName
      employerPhone
      employerAddress
      jobTitle
      employmentStartDate
      monthlyIncome
      __typename
    }
    references {
      name
      relationship
      phoneNumber
      email
      __typename
    }
    documents {
      identificationDocument
      proofOfIncome
      employmentLetter
      bankStatements
      previousLandlordReference
      additionalDocuments
      __typename
    }
    landlordNotes
    rejectionReason
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetApplicationQueryVariables,
  APITypes.GetApplicationQuery
>;
export const listMyApplications = /* GraphQL */ `query ListMyApplications(
  $status: ApplicationStatus
  $limit: Int
  $nextToken: String
) {
  listMyApplications(status: $status, limit: $limit, nextToken: $nextToken) {
    applications {
      applicationId
      propertyId
      applicantUserId
      landlordId
      status
      submittedAt
      reviewedAt
      reviewedBy
      landlordNotes
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMyApplicationsQueryVariables,
  APITypes.ListMyApplicationsQuery
>;
export const listPropertyApplications = /* GraphQL */ `query ListPropertyApplications(
  $propertyId: ID!
  $status: ApplicationStatus
  $limit: Int
  $nextToken: String
) {
  listPropertyApplications(
    propertyId: $propertyId
    status: $status
    limit: $limit
    nextToken: $nextToken
  ) {
    applications {
      applicationId
      propertyId
      applicantUserId
      landlordId
      status
      submittedAt
      reviewedAt
      reviewedBy
      landlordNotes
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPropertyApplicationsQueryVariables,
  APITypes.ListPropertyApplicationsQuery
>;
export const listLandlordApplications = /* GraphQL */ `query ListLandlordApplications(
  $landlordId: ID!
  $status: ApplicationStatus
  $limit: Int
  $nextToken: String
) {
  listLandlordApplications(
    landlordId: $landlordId
    status: $status
    limit: $limit
    nextToken: $nextToken
  ) {
    applications {
      applicationId
      propertyId
      applicantUserId
      landlordId
      status
      submittedAt
      reviewedAt
      reviewedBy
      landlordNotes
      rejectionReason
      createdAt
      updatedAt
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLandlordApplicationsQueryVariables,
  APITypes.ListLandlordApplicationsQuery
>;
export const getApplicationStats = /* GraphQL */ `query GetApplicationStats($landlordId: ID!) {
  getApplicationStats(landlordId: $landlordId) {
    total
    submitted
    underReview
    approved
    rejected
    withdrawn
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetApplicationStatsQueryVariables,
  APITypes.GetApplicationStatsQuery
>;
export const getApplicationDocumentUploadUrl = /* GraphQL */ `query GetApplicationDocumentUploadUrl(
  $applicationId: ID!
  $fileName: String!
  $fileType: String!
) {
  getApplicationDocumentUploadUrl(
    applicationId: $applicationId
    fileName: $fileName
    fileType: $fileType
  ) {
    uploadUrl
    key
    fileUrl
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetApplicationDocumentUploadUrlQueryVariables,
  APITypes.GetApplicationDocumentUploadUrlQuery
>;
export const getUserConversations = /* GraphQL */ `query GetUserConversations($userId: String!) {
  getUserConversations(userId: $userId) {
    id
    tenantId
    landlordId
    propertyId
    propertyTitle
    lastMessage
    lastMessageSender
    lastMessageTime
    unreadCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserConversationsQueryVariables,
  APITypes.GetUserConversationsQuery
>;
export const getConversationMessages = /* GraphQL */ `query GetConversationMessages($conversationId: String!) {
  getConversationMessages(conversationId: $conversationId) {
    id
    conversationId
    senderId
    content
    timestamp
    isRead
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetConversationMessagesQueryVariables,
  APITypes.GetConversationMessagesQuery
>;
export const getUnreadCount = /* GraphQL */ `query GetUnreadCount($userId: String!) {
  getUnreadCount(userId: $userId)
}
` as GeneratedQuery<
  APITypes.GetUnreadCountQueryVariables,
  APITypes.GetUnreadCountQuery
>;
export const getRegions = /* GraphQL */ `query GetRegions {
  getRegions {
    id
    name
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetRegionsQueryVariables,
  APITypes.GetRegionsQuery
>;
export const getDistricts = /* GraphQL */ `query GetDistricts($regionId: ID!) {
  getDistricts(regionId: $regionId) {
    id
    name
    regionId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetDistrictsQueryVariables,
  APITypes.GetDistrictsQuery
>;
export const getWards = /* GraphQL */ `query GetWards($districtId: ID!) {
  getWards(districtId: $districtId) {
    id
    name
    districtId
    __typename
  }
}
` as GeneratedQuery<APITypes.GetWardsQueryVariables, APITypes.GetWardsQuery>;
export const getStreets = /* GraphQL */ `query GetStreets($wardId: ID!) {
  getStreets(wardId: $wardId) {
    id
    name
    wardId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetStreetsQueryVariables,
  APITypes.GetStreetsQuery
>;
export const getMediaLibrary = /* GraphQL */ `query GetMediaLibrary($userId: ID!) {
  getMediaLibrary(userId: $userId) {
    userId
    actionTime
    media {
      images
      videos
      virtualTour
      floorPlan
      __typename
    }
    additionalFiles {
      contentType
      fileUrl
      fileName
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMediaLibraryQueryVariables,
  APITypes.GetMediaLibraryQuery
>;
export const getProperty = /* GraphQL */ `query GetProperty($propertyId: ID!) {
  getProperty(propertyId: $propertyId) {
    propertyId
    landlordId
    managerId
    title
    description
    address {
      street
      ward
      district
      region
      postalCode
      __typename
    }
    propertyType
    specifications {
      squareMeters
      bedrooms
      bathrooms
      floors
      parkingSpaces
      furnished
      __typename
    }
    pricing {
      monthlyRent
      deposit
      currency
      utilitiesIncluded
      serviceCharge
      __typename
    }
    amenities
    media {
      images
      videos
      virtualTour
      floorPlan
      __typename
    }
    availability {
      available
      availableFrom
      minimumLeaseTerm
      maximumLeaseTerm
      __typename
    }
    status
    version
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertyQueryVariables,
  APITypes.GetPropertyQuery
>;
export const listProperties = /* GraphQL */ `query ListProperties($limit: Int, $nextToken: String) {
  listProperties(limit: $limit, nextToken: $nextToken) {
    properties {
      propertyId
      landlordId
      managerId
      title
      description
      propertyType
      amenities
      status
      version
      createdAt
      updatedAt
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPropertiesQueryVariables,
  APITypes.ListPropertiesQuery
>;
export const searchProperties = /* GraphQL */ `query SearchProperties(
  $region: String
  $district: String
  $minPrice: Float
  $maxPrice: Float
  $propertyType: PropertyType
  $bedrooms: Int
  $limit: Int
  $from: Int
  $q: String
) {
  searchProperties(
    region: $region
    district: $district
    minPrice: $minPrice
    maxPrice: $maxPrice
    propertyType: $propertyType
    bedrooms: $bedrooms
    limit: $limit
    from: $from
    q: $q
  ) {
    properties {
      propertyId
      landlordId
      managerId
      title
      description
      propertyType
      amenities
      status
      version
      createdAt
      updatedAt
      __typename
    }
    count
    total
    from
    size
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchPropertiesQueryVariables,
  APITypes.SearchPropertiesQuery
>;
export const getPropertiesByLocation = /* GraphQL */ `query GetPropertiesByLocation($region: String!, $district: String) {
  getPropertiesByLocation(region: $region, district: $district) {
    propertyId
    landlordId
    managerId
    title
    description
    address {
      street
      ward
      district
      region
      postalCode
      __typename
    }
    propertyType
    specifications {
      squareMeters
      bedrooms
      bathrooms
      floors
      parkingSpaces
      furnished
      __typename
    }
    pricing {
      monthlyRent
      deposit
      currency
      utilitiesIncluded
      serviceCharge
      __typename
    }
    amenities
    media {
      images
      videos
      virtualTour
      floorPlan
      __typename
    }
    availability {
      available
      availableFrom
      minimumLeaseTerm
      maximumLeaseTerm
      __typename
    }
    status
    version
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertiesByLocationQueryVariables,
  APITypes.GetPropertiesByLocationQuery
>;
export const getNearbyProperties = /* GraphQL */ `query GetNearbyProperties($lat: Float!, $lng: Float!, $radiusKm: Float) {
  getNearbyProperties(lat: $lat, lng: $lng, radiusKm: $radiusKm) {
    propertyId
    landlordId
    managerId
    title
    description
    address {
      street
      ward
      district
      region
      postalCode
      __typename
    }
    propertyType
    specifications {
      squareMeters
      bedrooms
      bathrooms
      floors
      parkingSpaces
      furnished
      __typename
    }
    pricing {
      monthlyRent
      deposit
      currency
      utilitiesIncluded
      serviceCharge
      __typename
    }
    amenities
    media {
      images
      videos
      virtualTour
      floorPlan
      __typename
    }
    availability {
      available
      availableFrom
      minimumLeaseTerm
      maximumLeaseTerm
      __typename
    }
    status
    version
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetNearbyPropertiesQueryVariables,
  APITypes.GetNearbyPropertiesQuery
>;
export const listLandlordProperties = /* GraphQL */ `query ListLandlordProperties(
  $landlordId: ID!
  $limit: Int
  $nextToken: String
) {
  listLandlordProperties(
    landlordId: $landlordId
    limit: $limit
    nextToken: $nextToken
  ) {
    properties {
      propertyId
      landlordId
      managerId
      title
      description
      propertyType
      amenities
      status
      version
      createdAt
      updatedAt
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLandlordPropertiesQueryVariables,
  APITypes.ListLandlordPropertiesQuery
>;
export const listManagedProperties = /* GraphQL */ `query ListManagedProperties($managerId: ID!, $limit: Int, $nextToken: String) {
  listManagedProperties(
    managerId: $managerId
    limit: $limit
    nextToken: $nextToken
  ) {
    properties {
      propertyId
      landlordId
      managerId
      title
      description
      propertyType
      amenities
      status
      version
      createdAt
      updatedAt
      __typename
    }
    nextToken
    count
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListManagedPropertiesQueryVariables,
  APITypes.ListManagedPropertiesQuery
>;
export const getUser = /* GraphQL */ `query GetUser($userId: ID!) {
  getUser(userId: $userId) {
    ... on Tenant {
      userId
      email
      phoneNumber
      firstName
      lastName
      userType
      accountStatus
      isEmailVerified
      profileImage
      language
      currency
      emailNotifications
      smsNotifications
      pushNotifications
      createdAt
      updatedAt
    }
    ... on Landlord {
      userId
      email
      phoneNumber
      firstName
      lastName
      userType
      accountStatus
      isEmailVerified
      profileImage
      language
      currency
      emailNotifications
      smsNotifications
      pushNotifications
      businessName
      businessLicense
      taxId
      verificationDocuments
      createdAt
      updatedAt
    }
    ... on Admin {
      userId
      email
      phoneNumber
      firstName
      lastName
      userType
      accountStatus
      isEmailVerified
      profileImage
      language
      currency
      emailNotifications
      smsNotifications
      pushNotifications
      permissions
      createdAt
      updatedAt
    }
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
