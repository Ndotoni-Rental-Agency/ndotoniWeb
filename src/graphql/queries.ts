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
export const getAppInitialState = /* GraphQL */ `query GetAppInitialState($limit: Int, $userId: ID) {
  getAppInitialState(limit: $limit, userId: $userId) {
    personalizedSections {
      favorites {
        available
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
      recentlyViewed {
        available
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
      recommended {
        available
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
    properties {
      count
      nextToken
      properties {
        available
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
    totalProperties
    user {
      currency
      email
      firstName
      language
      lastName
      profileImage
      userId
      userType
      __typename
    }
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAppInitialStateQueryVariables,
  APITypes.GetAppInitialStateQuery
>;
export const getApplication = /* GraphQL */ `query GetApplication($applicationId: ID!) {
  getApplication(applicationId: $applicationId) {
    applicant {
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
      userId
      userType
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
      employmentStatus
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
    applicantUserId
    applicationId
    createdAt
    documents {
      additionalDocuments
      bankStatements
      employmentLetter
      identificationDocument
      previousLandlordReference
      proofOfIncome
      __typename
    }
    employment {
      employerAddress
      employerName
      employerPhone
      employmentStartDate
      jobTitle
      monthlyIncome
      __typename
    }
    landlord {
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
      userId
      userType
      verificationDocuments
      __typename
    }
    landlordId
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
      landlordId
      managerId
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
    references {
      email
      name
      phoneNumber
      relationship
      __typename
    }
    rejectionReason
    reviewedAt
    reviewedBy
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
export const getConversationMessages = /* GraphQL */ `query GetConversationMessages($conversationId: String!) {
  getConversationMessages(conversationId: $conversationId) {
    content
    conversationId
    id
    isRead
    senderId
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
export const getMediaLibrary = /* GraphQL */ `query GetMediaLibrary($userId: ID!) {
  getMediaLibrary(userId: $userId) {
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
export const getNearbyProperties = /* GraphQL */ `query GetNearbyProperties($lat: Float!, $lng: Float!, $radiusKm: Float) {
  getNearbyProperties(lat: $lat, lng: $lng, radiusKm: $radiusKm) {
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
    landlordId
    managerId
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
  APITypes.GetNearbyPropertiesQueryVariables,
  APITypes.GetNearbyPropertiesQuery
>;
export const getPropertiesByLocation = /* GraphQL */ `query GetPropertiesByLocation($district: String, $region: String!) {
  getPropertiesByLocation(district: $district, region: $region) {
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
    landlordId
    managerId
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
  APITypes.GetPropertiesByLocationQueryVariables,
  APITypes.GetPropertiesByLocationQuery
>;
export const getProperty = /* GraphQL */ `query GetProperty($propertyId: ID!, $userId: ID) {
  getProperty(propertyId: $propertyId, userId: $userId) {
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
    landlordId
    managerId
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
export const getPropertyCards = /* GraphQL */ `query GetPropertyCards($limit: Int, $nextToken: String) {
  getPropertyCards(limit: $limit, nextToken: $nextToken) {
    count
    nextToken
    properties {
      available
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
  APITypes.GetPropertyCardsQueryVariables,
  APITypes.GetPropertyCardsQuery
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
export const getUnreadCount = /* GraphQL */ `query GetUnreadCount($userId: String!) {
  getUnreadCount(userId: $userId)
}
` as GeneratedQuery<
  APITypes.GetUnreadCountQueryVariables,
  APITypes.GetUnreadCountQuery
>;
export const getUser = /* GraphQL */ `query GetUser($userId: ID!) {
  getUser(userId: $userId) {
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
      userId
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
      userId
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
      userId
      userType
    }
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const getUserConversations = /* GraphQL */ `query GetUserConversations($userId: String!) {
  getUserConversations(userId: $userId) {
    createdAt
    id
    landlordId
    lastMessage
    lastMessageSender
    lastMessageTime
    propertyId
    propertyTitle
    tenantId
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
export const listLandlordApplications = /* GraphQL */ `query ListLandlordApplications(
  $landlordId: ID!
  $limit: Int
  $nextToken: String
  $status: ApplicationStatus
) {
  listLandlordApplications(
    landlordId: $landlordId
    limit: $limit
    nextToken: $nextToken
    status: $status
  ) {
    applications {
      applicant {
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
        userId
        userType
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
        employmentStatus
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
      applicantUserId
      applicationId
      createdAt
      documents {
        additionalDocuments
        bankStatements
        employmentLetter
        identificationDocument
        previousLandlordReference
        proofOfIncome
        __typename
      }
      employment {
        employerAddress
        employerName
        employerPhone
        employmentStartDate
        jobTitle
        monthlyIncome
        __typename
      }
      landlord {
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
        userId
        userType
        verificationDocuments
        __typename
      }
      landlordId
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
        landlordId
        managerId
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
      references {
        email
        name
        phoneNumber
        relationship
        __typename
      }
      rejectionReason
      reviewedAt
      reviewedBy
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
  APITypes.ListLandlordApplicationsQueryVariables,
  APITypes.ListLandlordApplicationsQuery
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
      landlordId
      managerId
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
export const listManagedProperties = /* GraphQL */ `query ListManagedProperties($limit: Int, $managerId: ID!, $nextToken: String) {
  listManagedProperties(
    limit: $limit
    managerId: $managerId
    nextToken: $nextToken
  ) {
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
      landlordId
      managerId
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
  APITypes.ListManagedPropertiesQueryVariables,
  APITypes.ListManagedPropertiesQuery
>;
export const listMyApplications = /* GraphQL */ `query ListMyApplications(
  $limit: Int
  $nextToken: String
  $status: ApplicationStatus
) {
  listMyApplications(limit: $limit, nextToken: $nextToken, status: $status) {
    applications {
      applicant {
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
        userId
        userType
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
        employmentStatus
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
      applicantUserId
      applicationId
      createdAt
      documents {
        additionalDocuments
        bankStatements
        employmentLetter
        identificationDocument
        previousLandlordReference
        proofOfIncome
        __typename
      }
      employment {
        employerAddress
        employerName
        employerPhone
        employmentStartDate
        jobTitle
        monthlyIncome
        __typename
      }
      landlord {
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
        userId
        userType
        verificationDocuments
        __typename
      }
      landlordId
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
        landlordId
        managerId
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
      references {
        email
        name
        phoneNumber
        relationship
        __typename
      }
      rejectionReason
      reviewedAt
      reviewedBy
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
export const listProperties = /* GraphQL */ `query ListProperties($limit: Int, $nextToken: String) {
  listProperties(limit: $limit, nextToken: $nextToken) {
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
      landlordId
      managerId
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
  APITypes.ListPropertiesQueryVariables,
  APITypes.ListPropertiesQuery
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
        userId
        userType
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
        employmentStatus
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
      applicantUserId
      applicationId
      createdAt
      documents {
        additionalDocuments
        bankStatements
        employmentLetter
        identificationDocument
        previousLandlordReference
        proofOfIncome
        __typename
      }
      employment {
        employerAddress
        employerName
        employerPhone
        employmentStartDate
        jobTitle
        monthlyIncome
        __typename
      }
      landlord {
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
        userId
        userType
        verificationDocuments
        __typename
      }
      landlordId
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
        landlordId
        managerId
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
      references {
        email
        name
        phoneNumber
        relationship
        __typename
      }
      rejectionReason
      reviewedAt
      reviewedBy
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
export const searchProperties = /* GraphQL */ `query SearchProperties(
  $bedrooms: Int
  $district: String
  $from: Int
  $limit: Int
  $maxPrice: Float
  $minPrice: Float
  $propertyType: PropertyType
  $q: String
  $region: String
) {
  searchProperties(
    bedrooms: $bedrooms
    district: $district
    from: $from
    limit: $limit
    maxPrice: $maxPrice
    minPrice: $minPrice
    propertyType: $propertyType
    q: $q
    region: $region
  ) {
    count
    from
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
      landlordId
      managerId
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
    size
    total
    __typename
  }
}
` as GeneratedQuery<
  APITypes.SearchPropertiesQueryVariables,
  APITypes.SearchPropertiesQuery
>;
