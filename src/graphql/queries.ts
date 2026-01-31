/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const _empty = /* GraphQL */ `query _empty {
  _empty
}
` as GeneratedQuery<APITypes._emptyQueryVariables, APITypes._emptyQuery>;
export const dummyQuery = /* GraphQL */ `query DummyQuery {
  dummyQuery
}
` as GeneratedQuery<
  APITypes.DummyQueryQueryVariables,
  APITypes.DummyQueryQuery
>;
export const getAdminApplicationStats = /* GraphQL */ `query GetAdminApplicationStats {
  getAdminApplicationStats {
    approved
    rejected
    submitted
    total
    underReview
    withdrawn
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAdminApplicationStatsQueryVariables,
  APITypes.GetAdminApplicationStatsQuery
>;
export const getAdminPropertyStats = /* GraphQL */ `query GetAdminPropertyStats {
  getAdminPropertyStats {
    availableProperties
    deletedProperties
    draftProperties
    maintenanceProperties
    newPropertiesThisMonth
    newPropertiesThisWeek
    rentedProperties
    totalProperties
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAdminPropertyStatsQueryVariables,
  APITypes.GetAdminPropertyStatsQuery
>;
export const getApplication = /* GraphQL */ `query GetApplication($applicationId: ID!) {
  getApplication(applicationId: $applicationId) {
    applicant {
      firstName
      lastName
      profileImage
      __typename
    }
    applicantDetails {
      emergencyContact {
        email
        name
        phoneNumber
        relationship
        __typename
      }
      hasPets
      leaseDuration
      monthlyIncome
      moveInDate
      numberOfOccupants
      occupation
      petDetails
      smokingStatus
      __typename
    }
    applicationId
    createdAt
    landlord {
      businessName
      firstName
      lastName
      profileImage
      __typename
    }
    landlordNotes
    property {
      address {
        coordinates {
          latitude
          longitude
          __typename
        }
        district
        postalCode
        region
        street
        ward
        __typename
      }
      agent {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      agentId
      amenities
      availability {
        available
        availableFrom
        maximumLeaseTerm
        minimumLeaseTerm
        __typename
      }
      createdAt
      description
      landlord {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      media {
        floorPlan
        images
        videos
        virtualTour
        __typename
      }
      pricing {
        currency
        deposit
        monthlyRent
        serviceCharge
        utilitiesIncluded
        __typename
      }
      propertyId
      propertyType
      specifications {
        bathrooms
        bedrooms
        floors
        furnished
        parkingSpaces
        squareMeters
        __typename
      }
      status
      title
      updatedAt
      version
      __typename
    }
    propertyId
    rejectionReason
    status
    submittedAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetApplicationQueryVariables,
  APITypes.GetApplicationQuery
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
    fileUrl
    key
    uploadUrl
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetApplicationDocumentUploadUrlQueryVariables,
  APITypes.GetApplicationDocumentUploadUrlQuery
>;
export const getApplicationStats = /* GraphQL */ `query GetApplicationStats($landlordId: ID!) {
  getApplicationStats(landlordId: $landlordId) {
    approved
    rejected
    submitted
    total
    underReview
    withdrawn
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetApplicationStatsQueryVariables,
  APITypes.GetApplicationStatsQuery
>;
export const getCategorizedProperties = /* GraphQL */ `query GetCategorizedProperties($limitPerCategory: Int) {
  getCategorizedProperties(limitPerCategory: $limitPerCategory) {
    favorites {
      category
      count
      nextToken
      properties {
        bedrooms
        currency
        district
        monthlyRent
        propertyId
        propertyType
        region
        thumbnail
        title
        __typename
      }
      __typename
    }
    lowestPrice {
      category
      count
      nextToken
      properties {
        bedrooms
        currency
        district
        monthlyRent
        propertyId
        propertyType
        region
        thumbnail
        title
        __typename
      }
      __typename
    }
    more {
      category
      count
      nextToken
      properties {
        bedrooms
        currency
        district
        monthlyRent
        propertyId
        propertyType
        region
        thumbnail
        title
        __typename
      }
      __typename
    }
    mostViewed {
      category
      count
      nextToken
      properties {
        bedrooms
        currency
        district
        monthlyRent
        propertyId
        propertyType
        region
        thumbnail
        title
        __typename
      }
      __typename
    }
    nearby {
      category
      count
      nextToken
      properties {
        bedrooms
        currency
        district
        monthlyRent
        propertyId
        propertyType
        region
        thumbnail
        title
        __typename
      }
      __typename
    }
    recentlyViewed {
      category
      count
      nextToken
      properties {
        bedrooms
        currency
        district
        monthlyRent
        propertyId
        propertyType
        region
        thumbnail
        title
        __typename
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCategorizedPropertiesQueryVariables,
  APITypes.GetCategorizedPropertiesQuery
>;
export const getConversationMessages = /* GraphQL */ `query GetConversationMessages($conversationId: String!) {
  getConversationMessages(conversationId: $conversationId) {
    content
    conversationId
    id
    isMine
    isRead
    senderName
    timestamp
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetConversationMessagesQueryVariables,
  APITypes.GetConversationMessagesQuery
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
export const getInitialAppState = /* GraphQL */ `query GetInitialAppState($limitPerCategory: Int) {
  getInitialAppState(limitPerCategory: $limitPerCategory) {
    categorizedProperties {
      favorites {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      lowestPrice {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      more {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      mostViewed {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      nearby {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      recentlyViewed {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInitialAppStateQueryVariables,
  APITypes.GetInitialAppStateQuery
>;
export const getInitialAppStateFast = /* GraphQL */ `query GetInitialAppStateFast($limitPerCategory: Int) {
  getInitialAppStateFast(limitPerCategory: $limitPerCategory) {
    categorizedProperties {
      favorites {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      lowestPrice {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      more {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      mostViewed {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      nearby {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      recentlyViewed {
        category
        count
        nextToken
        properties {
          bedrooms
          currency
          district
          monthlyRent
          propertyId
          propertyType
          region
          thumbnail
          title
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInitialAppStateFastQueryVariables,
  APITypes.GetInitialAppStateFastQuery
>;
export const getLandlordApplication = /* GraphQL */ `query GetLandlordApplication($applicationId: ID!) {
  getLandlordApplication(applicationId: $applicationId) {
    address
    adminNotes
    alternatePhone
    applicant {
      firstName
      lastName
      profileImage
      __typename
    }
    applicationId
    birthDate
    createdAt
    nationalId
    phoneNumber
    rejectionReason
    reviewedAt
    status
    submittedAt
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLandlordApplicationQueryVariables,
  APITypes.GetLandlordApplicationQuery
>;
export const getLandlordApplicationStats = /* GraphQL */ `query GetLandlordApplicationStats {
  getLandlordApplicationStats {
    approved
    pending
    rejected
    total
    underReview
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetLandlordApplicationStatsQueryVariables,
  APITypes.GetLandlordApplicationStatsQuery
>;
export const getMe = /* GraphQL */ `query GetMe {
  getMe {
    ... on Admin {
      accountStatus
      address
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      permissions
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
    ... on Agent {
      accountStatus
      address
      agencyName
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      licenseNumber
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      specializations
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
    ... on Landlord {
      accountStatus
      address
      businessLicense
      businessName
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      taxId
      updatedAt
      userType
      verificationDocuments
      ward
      whatsappNumber
    }
    ... on Tenant {
      accountStatus
      address
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
  }
}
` as GeneratedQuery<APITypes.GetMeQueryVariables, APITypes.GetMeQuery>;
export const getMediaLibrary = /* GraphQL */ `query GetMediaLibrary {
  getMediaLibrary {
    actionTime
    additionalFiles {
      contentType
      fileName
      fileUrl
      __typename
    }
    media {
      floorPlan
      images
      videos
      virtualTour
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMediaLibraryQueryVariables,
  APITypes.GetMediaLibraryQuery
>;
export const getMyLandlordApplication = /* GraphQL */ `query GetMyLandlordApplication {
  getMyLandlordApplication {
    address
    adminNotes
    alternatePhone
    applicant {
      firstName
      lastName
      profileImage
      __typename
    }
    applicationId
    birthDate
    createdAt
    nationalId
    phoneNumber
    rejectionReason
    reviewedAt
    status
    submittedAt
    updatedAt
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetMyLandlordApplicationQueryVariables,
  APITypes.GetMyLandlordApplicationQuery
>;
export const getPropertiesByCategory = /* GraphQL */ `query GetPropertiesByCategory(
  $category: PropertyCategory!
  $limit: Int
  $nextToken: String
) {
  getPropertiesByCategory(
    category: $category
    limit: $limit
    nextToken: $nextToken
  ) {
    category
    count
    nextToken
    properties {
      bedrooms
      currency
      district
      monthlyRent
      propertyId
      propertyType
      region
      thumbnail
      title
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertiesByCategoryQueryVariables,
  APITypes.GetPropertiesByCategoryQuery
>;
export const getPropertiesByLocation = /* GraphQL */ `query GetPropertiesByLocation(
  $bathrooms: Int
  $bedrooms: Int
  $district: String
  $limit: Int
  $maxPrice: Float
  $minPrice: Float
  $nextToken: String
  $propertyType: PropertyType
  $region: String!
  $sortBy: PropertySortOption
) {
  getPropertiesByLocation(
    bathrooms: $bathrooms
    bedrooms: $bedrooms
    district: $district
    limit: $limit
    maxPrice: $maxPrice
    minPrice: $minPrice
    nextToken: $nextToken
    propertyType: $propertyType
    region: $region
    sortBy: $sortBy
  ) {
    count
    nextToken
    properties {
      bedrooms
      currency
      district
      monthlyRent
      propertyId
      propertyType
      region
      thumbnail
      title
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertiesByLocationQueryVariables,
  APITypes.GetPropertiesByLocationQuery
>;
export const getProperty = /* GraphQL */ `query GetProperty($propertyId: ID!) {
  getProperty(propertyId: $propertyId) {
    address {
      coordinates {
        latitude
        longitude
        __typename
      }
      district
      postalCode
      region
      street
      ward
      __typename
    }
    agent {
      firstName
      lastName
      whatsappNumber
      __typename
    }
    agentId
    amenities
    availability {
      available
      availableFrom
      maximumLeaseTerm
      minimumLeaseTerm
      __typename
    }
    createdAt
    description
    landlord {
      firstName
      lastName
      whatsappNumber
      __typename
    }
    media {
      floorPlan
      images
      videos
      virtualTour
      __typename
    }
    pricing {
      currency
      deposit
      monthlyRent
      serviceCharge
      utilitiesIncluded
      __typename
    }
    propertyId
    propertyType
    specifications {
      bathrooms
      bedrooms
      floors
      furnished
      parkingSpaces
      squareMeters
      __typename
    }
    status
    title
    updatedAt
    version
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPropertyQueryVariables,
  APITypes.GetPropertyQuery
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
export const getUnreadCount = /* GraphQL */ `query GetUnreadCount {
  getUnreadCount
}
` as GeneratedQuery<
  APITypes.GetUnreadCountQueryVariables,
  APITypes.GetUnreadCountQuery
>;
export const getUserByEmail = /* GraphQL */ `query GetUserByEmail($email: String!) {
  getUserByEmail(email: $email) {
    ... on Admin {
      accountStatus
      address
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      permissions
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
    ... on Agent {
      accountStatus
      address
      agencyName
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      licenseNumber
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      specializations
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
    ... on Landlord {
      accountStatus
      address
      businessLicense
      businessName
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      taxId
      updatedAt
      userType
      verificationDocuments
      ward
      whatsappNumber
    }
    ... on Tenant {
      accountStatus
      address
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
  }
}
` as GeneratedQuery<
  APITypes.GetUserByEmailQueryVariables,
  APITypes.GetUserByEmailQuery
>;
export const getUserById = /* GraphQL */ `query GetUserById($userId: ID!) {
  getUserById(userId: $userId) {
    ... on Admin {
      accountStatus
      address
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      permissions
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
    ... on Agent {
      accountStatus
      address
      agencyName
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      licenseNumber
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      specializations
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
    ... on Landlord {
      accountStatus
      address
      businessLicense
      businessName
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      taxId
      updatedAt
      userType
      verificationDocuments
      ward
      whatsappNumber
    }
    ... on Tenant {
      accountStatus
      address
      city
      createdAt
      currency
      dateOfBirth
      district
      email
      emailNotifications
      emergencyContactName
      emergencyContactPhone
      firstName
      gender
      hasProperties
      isEmailVerified
      language
      lastName
      nationalIdLast4
      occupation
      phoneNumber
      profileImage
      pushNotifications
      region
      smsNotifications
      street
      updatedAt
      userType
      ward
      whatsappNumber
    }
  }
}
` as GeneratedQuery<
  APITypes.GetUserByIdQueryVariables,
  APITypes.GetUserByIdQuery
>;
export const getUserConversations = /* GraphQL */ `query GetUserConversations {
  getUserConversations {
    createdAt
    id
    lastMessage
    lastMessageTime
    otherPartyImage
    otherPartyName
    propertyTitle
    unreadCount
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserConversationsQueryVariables,
  APITypes.GetUserConversationsQuery
>;
export const getUserStats = /* GraphQL */ `query GetUserStats {
  getUserStats {
    activeUsers
    newUsersThisMonth
    newUsersThisWeek
    totalAdmins
    totalAgents
    totalLandlords
    totalTenants
    totalUsers
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserStatsQueryVariables,
  APITypes.GetUserStatsQuery
>;
export const getWards = /* GraphQL */ `query GetWards($districtId: ID!) {
  getWards(districtId: $districtId) {
    districtId
    id
    name
    __typename
  }
}
` as GeneratedQuery<APITypes.GetWardsQueryVariables, APITypes.GetWardsQuery>;
export const listAgentProperties = /* GraphQL */ `query ListAgentProperties($limit: Int, $nextToken: String) {
  listAgentProperties(limit: $limit, nextToken: $nextToken) {
    count
    nextToken
    properties {
      address {
        coordinates {
          latitude
          longitude
          __typename
        }
        district
        postalCode
        region
        street
        ward
        __typename
      }
      agent {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      agentId
      amenities
      availability {
        available
        availableFrom
        maximumLeaseTerm
        minimumLeaseTerm
        __typename
      }
      createdAt
      description
      landlord {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      media {
        floorPlan
        images
        videos
        virtualTour
        __typename
      }
      pricing {
        currency
        deposit
        monthlyRent
        serviceCharge
        utilitiesIncluded
        __typename
      }
      propertyId
      propertyType
      specifications {
        bathrooms
        bedrooms
        floors
        furnished
        parkingSpaces
        squareMeters
        __typename
      }
      status
      title
      updatedAt
      version
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAgentPropertiesQueryVariables,
  APITypes.ListAgentPropertiesQuery
>;
export const listAllApplications = /* GraphQL */ `query ListAllApplications(
  $limit: Int
  $nextToken: String
  $status: ApplicationStatus
) {
  listAllApplications(limit: $limit, nextToken: $nextToken, status: $status) {
    applications {
      applicant {
        firstName
        lastName
        profileImage
        __typename
      }
      applicantDetails {
        emergencyContact {
          email
          name
          phoneNumber
          relationship
          __typename
        }
        hasPets
        leaseDuration
        monthlyIncome
        moveInDate
        numberOfOccupants
        occupation
        petDetails
        smokingStatus
        __typename
      }
      applicationId
      createdAt
      landlord {
        businessName
        firstName
        lastName
        profileImage
        __typename
      }
      landlordNotes
      property {
        address {
          district
          postalCode
          region
          street
          ward
          __typename
        }
        agent {
          firstName
          lastName
          whatsappNumber
          __typename
        }
        agentId
        amenities
        availability {
          available
          availableFrom
          maximumLeaseTerm
          minimumLeaseTerm
          __typename
        }
        createdAt
        description
        landlord {
          firstName
          lastName
          whatsappNumber
          __typename
        }
        media {
          floorPlan
          images
          videos
          virtualTour
          __typename
        }
        pricing {
          currency
          deposit
          monthlyRent
          serviceCharge
          utilitiesIncluded
          __typename
        }
        propertyId
        propertyType
        specifications {
          bathrooms
          bedrooms
          floors
          furnished
          parkingSpaces
          squareMeters
          __typename
        }
        status
        title
        updatedAt
        version
        __typename
      }
      propertyId
      rejectionReason
      status
      submittedAt
      updatedAt
      __typename
    }
    count
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAllApplicationsQueryVariables,
  APITypes.ListAllApplicationsQuery
>;
export const listAllLandlordApplications = /* GraphQL */ `query ListAllLandlordApplications(
  $limit: Int
  $nextToken: String
  $status: LandlordApplicationStatus
) {
  listAllLandlordApplications(
    limit: $limit
    nextToken: $nextToken
    status: $status
  ) {
    applications {
      address
      adminNotes
      alternatePhone
      applicant {
        firstName
        lastName
        profileImage
        __typename
      }
      applicationId
      birthDate
      createdAt
      nationalId
      phoneNumber
      rejectionReason
      reviewedAt
      status
      submittedAt
      updatedAt
      userId
      __typename
    }
    count
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAllLandlordApplicationsQueryVariables,
  APITypes.ListAllLandlordApplicationsQuery
>;
export const listAllProperties = /* GraphQL */ `query ListAllProperties(
  $limit: Int
  $nextToken: String
  $status: PropertyStatus
) {
  listAllProperties(limit: $limit, nextToken: $nextToken, status: $status) {
    count
    nextToken
    properties {
      address {
        coordinates {
          latitude
          longitude
          __typename
        }
        district
        postalCode
        region
        street
        ward
        __typename
      }
      agent {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      agentId
      amenities
      availability {
        available
        availableFrom
        maximumLeaseTerm
        minimumLeaseTerm
        __typename
      }
      createdAt
      description
      landlord {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      media {
        floorPlan
        images
        videos
        virtualTour
        __typename
      }
      pricing {
        currency
        deposit
        monthlyRent
        serviceCharge
        utilitiesIncluded
        __typename
      }
      propertyId
      propertyType
      specifications {
        bathrooms
        bedrooms
        floors
        furnished
        parkingSpaces
        squareMeters
        __typename
      }
      status
      title
      updatedAt
      version
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAllPropertiesQueryVariables,
  APITypes.ListAllPropertiesQuery
>;
export const listAllUsers = /* GraphQL */ `query ListAllUsers($limit: Int, $nextToken: String, $userType: UserType) {
  listAllUsers(limit: $limit, nextToken: $nextToken, userType: $userType) {
    count
    nextToken
    users {
      profile {
        ... on Admin {
          accountStatus
          address
          city
          createdAt
          currency
          dateOfBirth
          district
          email
          emailNotifications
          emergencyContactName
          emergencyContactPhone
          firstName
          gender
          hasProperties
          isEmailVerified
          language
          lastName
          nationalIdLast4
          occupation
          permissions
          phoneNumber
          profileImage
          pushNotifications
          region
          smsNotifications
          street
          updatedAt
          userType
          ward
          whatsappNumber
        }
        ... on Agent {
          accountStatus
          address
          agencyName
          city
          createdAt
          currency
          dateOfBirth
          district
          email
          emailNotifications
          emergencyContactName
          emergencyContactPhone
          firstName
          gender
          hasProperties
          isEmailVerified
          language
          lastName
          licenseNumber
          nationalIdLast4
          occupation
          phoneNumber
          profileImage
          pushNotifications
          region
          smsNotifications
          specializations
          street
          updatedAt
          userType
          ward
          whatsappNumber
        }
        ... on Landlord {
          accountStatus
          address
          businessLicense
          businessName
          city
          createdAt
          currency
          dateOfBirth
          district
          email
          emailNotifications
          emergencyContactName
          emergencyContactPhone
          firstName
          gender
          hasProperties
          isEmailVerified
          language
          lastName
          nationalIdLast4
          occupation
          phoneNumber
          profileImage
          pushNotifications
          region
          smsNotifications
          street
          taxId
          updatedAt
          userType
          verificationDocuments
          ward
          whatsappNumber
        }
        ... on Tenant {
          accountStatus
          address
          city
          createdAt
          currency
          dateOfBirth
          district
          email
          emailNotifications
          emergencyContactName
          emergencyContactPhone
          firstName
          gender
          hasProperties
          isEmailVerified
          language
          lastName
          nationalIdLast4
          occupation
          phoneNumber
          profileImage
          pushNotifications
          region
          smsNotifications
          street
          updatedAt
          userType
          ward
          whatsappNumber
        }
      }
      userId
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAllUsersQueryVariables,
  APITypes.ListAllUsersQuery
>;
export const listLandlordProperties = /* GraphQL */ `query ListLandlordProperties($limit: Int, $nextToken: String) {
  listLandlordProperties(limit: $limit, nextToken: $nextToken) {
    count
    nextToken
    properties {
      address {
        coordinates {
          latitude
          longitude
          __typename
        }
        district
        postalCode
        region
        street
        ward
        __typename
      }
      agent {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      agentId
      amenities
      availability {
        available
        availableFrom
        maximumLeaseTerm
        minimumLeaseTerm
        __typename
      }
      createdAt
      description
      landlord {
        firstName
        lastName
        whatsappNumber
        __typename
      }
      media {
        floorPlan
        images
        videos
        virtualTour
        __typename
      }
      pricing {
        currency
        deposit
        monthlyRent
        serviceCharge
        utilitiesIncluded
        __typename
      }
      propertyId
      propertyType
      specifications {
        bathrooms
        bedrooms
        floors
        furnished
        parkingSpaces
        squareMeters
        __typename
      }
      status
      title
      updatedAt
      version
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLandlordPropertiesQueryVariables,
  APITypes.ListLandlordPropertiesQuery
>;
export const listMyApplications = /* GraphQL */ `query ListMyApplications(
  $limit: Int
  $nextToken: String
  $status: ApplicationStatus
) {
  listMyApplications(limit: $limit, nextToken: $nextToken, status: $status) {
    applications {
      applicant {
        firstName
        lastName
        profileImage
        __typename
      }
      applicantDetails {
        emergencyContact {
          email
          name
          phoneNumber
          relationship
          __typename
        }
        hasPets
        leaseDuration
        monthlyIncome
        moveInDate
        numberOfOccupants
        occupation
        petDetails
        smokingStatus
        __typename
      }
      applicationId
      createdAt
      landlord {
        businessName
        firstName
        lastName
        profileImage
        __typename
      }
      landlordNotes
      property {
        address {
          district
          postalCode
          region
          street
          ward
          __typename
        }
        agent {
          firstName
          lastName
          whatsappNumber
          __typename
        }
        agentId
        amenities
        availability {
          available
          availableFrom
          maximumLeaseTerm
          minimumLeaseTerm
          __typename
        }
        createdAt
        description
        landlord {
          firstName
          lastName
          whatsappNumber
          __typename
        }
        media {
          floorPlan
          images
          videos
          virtualTour
          __typename
        }
        pricing {
          currency
          deposit
          monthlyRent
          serviceCharge
          utilitiesIncluded
          __typename
        }
        propertyId
        propertyType
        specifications {
          bathrooms
          bedrooms
          floors
          furnished
          parkingSpaces
          squareMeters
          __typename
        }
        status
        title
        updatedAt
        version
        __typename
      }
      propertyId
      rejectionReason
      status
      submittedAt
      updatedAt
      __typename
    }
    count
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMyApplicationsQueryVariables,
  APITypes.ListMyApplicationsQuery
>;
export const listPropertyApplications = /* GraphQL */ `query ListPropertyApplications(
  $limit: Int
  $nextToken: String
  $propertyId: ID!
  $status: ApplicationStatus
) {
  listPropertyApplications(
    limit: $limit
    nextToken: $nextToken
    propertyId: $propertyId
    status: $status
  ) {
    applications {
      applicant {
        firstName
        lastName
        profileImage
        __typename
      }
      applicantDetails {
        emergencyContact {
          email
          name
          phoneNumber
          relationship
          __typename
        }
        hasPets
        leaseDuration
        monthlyIncome
        moveInDate
        numberOfOccupants
        occupation
        petDetails
        smokingStatus
        __typename
      }
      applicationId
      createdAt
      landlord {
        businessName
        firstName
        lastName
        profileImage
        __typename
      }
      landlordNotes
      property {
        address {
          district
          postalCode
          region
          street
          ward
          __typename
        }
        agent {
          firstName
          lastName
          whatsappNumber
          __typename
        }
        agentId
        amenities
        availability {
          available
          availableFrom
          maximumLeaseTerm
          minimumLeaseTerm
          __typename
        }
        createdAt
        description
        landlord {
          firstName
          lastName
          whatsappNumber
          __typename
        }
        media {
          floorPlan
          images
          videos
          virtualTour
          __typename
        }
        pricing {
          currency
          deposit
          monthlyRent
          serviceCharge
          utilitiesIncluded
          __typename
        }
        propertyId
        propertyType
        specifications {
          bathrooms
          bedrooms
          floors
          furnished
          parkingSpaces
          squareMeters
          __typename
        }
        status
        title
        updatedAt
        version
        __typename
      }
      propertyId
      rejectionReason
      status
      submittedAt
      updatedAt
      __typename
    }
    count
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPropertyApplicationsQueryVariables,
  APITypes.ListPropertyApplicationsQuery
>;
