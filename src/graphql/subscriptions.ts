/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const dummySubscription = /* GraphQL */ `subscription DummySubscription {
  dummySubscription
}
` as GeneratedSubscription<
  APITypes.DummySubscriptionSubscriptionVariables,
  APITypes.DummySubscriptionSubscription
>;
export const onApplicationStatusChanged = /* GraphQL */ `subscription OnApplicationStatusChanged($applicationId: ID!) {
  onApplicationStatusChanged(applicationId: $applicationId) {
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
` as GeneratedSubscription<
  APITypes.OnApplicationStatusChangedSubscriptionVariables,
  APITypes.OnApplicationStatusChangedSubscription
>;
export const onConversationUpdated = /* GraphQL */ `subscription OnConversationUpdated($userId: String!) {
  onConversationUpdated(userId: $userId) {
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
` as GeneratedSubscription<
  APITypes.OnConversationUpdatedSubscriptionVariables,
  APITypes.OnConversationUpdatedSubscription
>;
export const onNewApplicationForLandlord = /* GraphQL */ `subscription OnNewApplicationForLandlord($landlordId: ID!) {
  onNewApplicationForLandlord(landlordId: $landlordId) {
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
` as GeneratedSubscription<
  APITypes.OnNewApplicationForLandlordSubscriptionVariables,
  APITypes.OnNewApplicationForLandlordSubscription
>;
export const onNewMessage = /* GraphQL */ `subscription OnNewMessage($conversationId: String!) {
  onNewMessage(conversationId: $conversationId) {
    content
    conversationId
    id
    isRead
    senderId
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnNewMessageSubscriptionVariables,
  APITypes.OnNewMessageSubscription
>;
export const onNewPropertyInRegion = /* GraphQL */ `subscription OnNewPropertyInRegion($region: String!) {
  onNewPropertyInRegion(region: $region) {
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
` as GeneratedSubscription<
  APITypes.OnNewPropertyInRegionSubscriptionVariables,
  APITypes.OnNewPropertyInRegionSubscription
>;
export const onNewPropertyMatchesSearch = /* GraphQL */ `subscription OnNewPropertyMatchesSearch($searchCriteria: PropertySearchInput!) {
  onNewPropertyMatchesSearch(searchCriteria: $searchCriteria) {
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
` as GeneratedSubscription<
  APITypes.OnNewPropertyMatchesSearchSubscriptionVariables,
  APITypes.OnNewPropertyMatchesSearchSubscription
>;
export const onPropertiesUpdated = /* GraphQL */ `subscription OnPropertiesUpdated($propertyIds: [ID!]!) {
  onPropertiesUpdated(propertyIds: $propertyIds) {
    changes {
      field
      newValue
      oldValue
      __typename
    }
    eventType
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
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnPropertiesUpdatedSubscriptionVariables,
  APITypes.OnPropertiesUpdatedSubscription
>;
export const onPropertyUpdated = /* GraphQL */ `subscription OnPropertyUpdated($propertyId: ID!) {
  onPropertyUpdated(propertyId: $propertyId) {
    changes {
      field
      newValue
      oldValue
      __typename
    }
    eventType
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
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnPropertyUpdatedSubscriptionVariables,
  APITypes.OnPropertyUpdatedSubscription
>;
export const onUnreadCountChanged = /* GraphQL */ `subscription OnUnreadCountChanged($userId: String!) {
  onUnreadCountChanged(userId: $userId) {
    totalUnread
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUnreadCountChangedSubscriptionVariables,
  APITypes.OnUnreadCountChangedSubscription
>;
