/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const dummyQuery = /* GraphQL */ `query DummyQuery {
  dummyQuery
}
` as GeneratedQuery<
  APITypes.DummyQueryQueryVariables,
  APITypes.DummyQueryQuery
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
        available
        bedrooms
        category
        currency
        district
        landlordName
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
        available
        bedrooms
        category
        currency
        district
        landlordName
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
        available
        bedrooms
        category
        currency
        district
        landlordName
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
        available
        bedrooms
        category
        currency
        district
        landlordName
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
        available
        bedrooms
        category
        currency
        district
        landlordName
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
        available
        bedrooms
        category
        currency
        district
        landlordName
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
          available
          bedrooms
          category
          currency
          district
          landlordName
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
          available
          bedrooms
          category
          currency
          district
          landlordName
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
          available
          bedrooms
          category
          currency
          district
          landlordName
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
          available
          bedrooms
          category
          currency
          district
          landlordName
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
          available
          bedrooms
          category
          currency
          district
          landlordName
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
          available
          bedrooms
          category
          currency
          district
          landlordName
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
    regions {
      id
      name
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetInitialAppStateQueryVariables,
  APITypes.GetInitialAppStateQuery
>;
export const getMe = /* GraphQL */ `query GetMe {
  getMe {
    ... on Admin {
      accountStatus
      createdAt
      currency
      email
      emailNotifications
      firstName
      isEmailVerified
      language
      lastName
      permissions
      phoneNumber
      profileImage
      pushNotifications
      smsNotifications
      updatedAt
      userType
    }
    ... on Agent {
      accountStatus
      agencyName
      createdAt
      currency
      email
      emailNotifications
      firstName
      isEmailVerified
      language
      lastName
      licenseNumber
      phoneNumber
      profileImage
      pushNotifications
      smsNotifications
      specializations
      updatedAt
      userType
    }
    ... on Landlord {
      accountStatus
      businessLicense
      businessName
      createdAt
      currency
      email
      emailNotifications
      firstName
      isEmailVerified
      language
      lastName
      phoneNumber
      profileImage
      pushNotifications
      smsNotifications
      taxId
      updatedAt
      userType
      verificationDocuments
    }
    ... on Tenant {
      accountStatus
      createdAt
      currency
      email
      emailNotifications
      firstName
      isEmailVerified
      language
      lastName
      phoneNumber
      profileImage
      pushNotifications
      smsNotifications
      updatedAt
      userType
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
      available
      bedrooms
      category
      currency
      district
      landlordName
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
  $district: String
  $limit: Int
  $nextToken: String
  $region: String!
  $sortBy: PropertySortOption
) {
  getPropertiesByLocation(
    district: $district
    limit: $limit
    nextToken: $nextToken
    region: $region
    sortBy: $sortBy
  ) {
    count
    nextToken
    properties {
      available
      bedrooms
      category
      currency
      district
      landlordName
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
