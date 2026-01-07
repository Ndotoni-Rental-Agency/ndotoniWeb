// =============================================================================
// GRAPHQL QUERIES
// All queries consolidated in one file for easy access and maintenance
// =============================================================================

// =============================================================================
// APP QUERIES
// =============================================================================

export const getAppInitialState = /* GraphQL */ `
  query GetAppInitialState($limit: Int) {
    getAppInitialState(limit: $limit) {
      properties {
        propertyId
        title
        description
        pricing {
          monthlyRent
          deposit
          currency
          serviceCharge
          utilitiesIncluded
        }
        specifications {
          bedrooms
          bathrooms
          squareMeters
          furnished
          parkingSpaces
          floors
        }
        address {
          region
          district
          ward
          street
          coordinates {
            latitude
            longitude
          }
        }
        media {
          images
          videos
          floorPlan
          virtualTour
        }
        availability {
          available
          availableFrom
          minimumLeaseTerm
          maximumLeaseTerm
        }
        propertyType
        amenities
        status
        landlordId
        createdAt
        updatedAt
      }
      totalProperties
      user {
        userId
        firstName
        lastName
        email
        userType
      }
    }
  }
`;

// =============================================================================
// USER QUERIES
// =============================================================================

export const getUser = /* GraphQL */ `
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
      __typename
      ... on Tenant {
        userId
        email
        firstName
        lastName
        userType
        accountStatus
        isEmailVerified
        phoneNumber
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
        firstName
        lastName
        userType
        accountStatus
        isEmailVerified
        phoneNumber
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
        firstName
        lastName
        userType
        accountStatus
        isEmailVerified
        phoneNumber
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
`;

export const user = /* GraphQL */ `
  query User($userId: ID) {
    user(userId: $userId) {
      ... on Tenant {
        userId
        email
        firstName
        lastName
        userType
        accountStatus
        isEmailVerified
        phoneNumber
        profileImage
        language
        currency
        emailNotifications
        smsNotifications
        pushNotifications
      }
      ... on Landlord {
        userId
        email
        firstName
        lastName
        userType
        accountStatus
        isEmailVerified
        phoneNumber
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
      }
      ... on Admin {
        userId
        email
        firstName
        lastName
        userType
        accountStatus
        isEmailVerified
        phoneNumber
        profileImage
        language
        currency
        emailNotifications
        smsNotifications
        pushNotifications
        permissions
      }
    }
  }
`;

// =============================================================================
// PROPERTY QUERIES
// =============================================================================

export const getPropertyCards = /* GraphQL */ `
  query GetPropertyCards($limit: Int, $nextToken: String) {
    getPropertyCards(limit: $limit, nextToken: $nextToken) {
      properties {
        propertyId
        title
        monthlyRent
        currency
        bedrooms
        propertyType
        region
        district
        available
        thumbnail
      }
      count
      nextToken
    }
  }
`;

export const getProperty = /* GraphQL */ `
  query GetProperty($propertyId: ID!) {
    getProperty(propertyId: $propertyId) {
      propertyId
      title
      description
      pricing {
        monthlyRent
        deposit
        currency
        serviceCharge
        utilitiesIncluded
      }
      specifications {
        bedrooms
        bathrooms
        squareMeters
        furnished
        parkingSpaces
        floors
      }
      address {
        region
        district
        ward
        street
        coordinates {
          latitude
          longitude
        }
      }
      media {
        images
        videos
        floorPlan
        virtualTour
      }
      availability {
        available
        availableFrom
        minimumLeaseTerm
        maximumLeaseTerm
      }
      propertyType
      amenities
      status
      landlordId
      managerId
      createdAt
      updatedAt
      version
    }
  }
`;

export const getLandlordProperties = /* GraphQL */ `
  query GetLandlordProperties($landlordId: ID!, $limit: Int, $nextToken: String) {
    getLandlordProperties(landlordId: $landlordId, limit: $limit, nextToken: $nextToken) {
      properties {
        propertyId
        title
        description
        pricing {
          monthlyRent
          deposit
          currency
          serviceCharge
          utilitiesIncluded
        }
        specifications {
          bedrooms
          bathrooms
          squareMeters
          furnished
          parkingSpaces
          floors
        }
        address {
          region
          district
          ward
          street
          coordinates {
            latitude
            longitude
          }
        }
        media {
          images
          videos
          floorPlan
          virtualTour
        }
        availability {
          available
          availableFrom
          minimumLeaseTerm
          maximumLeaseTerm
        }
        propertyType
        amenities
        status
        landlordId
        managerId
        createdAt
        updatedAt
      }
      count
      nextToken
    }
  }
`;

// =============================================================================
// MEDIA QUERIES
// =============================================================================

export const getMediaLibrary = /* GraphQL */ `
  query GetMediaLibrary($userId: ID!) {
    getMediaLibrary(userId: $userId) {
      userId
      additionalFiles {
        contentType
        fileUrl
        fileName
      }
      media {
        images
        videos
        floorPlan
        virtualTour
      }
    }
  }
`;

// =============================================================================
// POLLING QUERIES (for hybrid subscription system)
// =============================================================================

export const getPropertiesUpdatedSince = /* GraphQL */ `
  query GetPropertiesUpdatedSince($propertyIds: [ID!]!, $since: AWSDateTime!) {
    getPropertiesUpdatedSince(propertyIds: $propertyIds, since: $since) {
      propertyId
      title
      pricing {
        monthlyRent
        deposit
        currency
      }
      availability {
        available
        availableFrom
      }
      status
      updatedAt
    }
  }
`;

export const getNewPropertiesMatchingSearch = /* GraphQL */ `
  query GetNewPropertiesMatchingSearch($searchCriteria: PropertySearchInput!, $since: AWSDateTime!) {
    getNewPropertiesMatchingSearch(searchCriteria: $searchCriteria, since: $since) {
      propertyId
      title
      description
      pricing {
        monthlyRent
        deposit
        currency
      }
      specifications {
        bedrooms
        bathrooms
        squareMeters
      }
      address {
        region
        district
        ward
        street
      }
      propertyType
      availability {
        available
        availableFrom
      }
      status
      createdAt
      updatedAt
    }
  }
`;