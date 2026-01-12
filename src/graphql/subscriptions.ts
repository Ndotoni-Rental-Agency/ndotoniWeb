/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onApplicationStatusChanged = /* GraphQL */ `subscription OnApplicationStatusChanged($applicationId: ID!) {
  onApplicationStatusChanged(applicationId: $applicationId) {
    applicationId
    propertyId
    property {
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
        coordinates {
          latitude
          longitude
          __typename
        }
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
    applicantDetails {
      dateOfBirth
      monthlyIncome
      occupation
      moveInDate
      leaseDuration
      numberOfOccupants
      hasPets
      petDetails
      smokingStatus
      emergencyContact {
        name
        relationship
        phoneNumber
        email
        __typename
      }
      __typename
    }
    landlordNotes
    rejectionReason
    submittedAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnApplicationStatusChangedSubscriptionVariables,
  APITypes.OnApplicationStatusChangedSubscription
>;
export const onNewApplicationForLandlord = /* GraphQL */ `subscription OnNewApplicationForLandlord($landlordId: ID!) {
  onNewApplicationForLandlord(landlordId: $landlordId) {
    applicationId
    propertyId
    property {
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
        coordinates {
          latitude
          longitude
          __typename
        }
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
    applicantDetails {
      dateOfBirth
      monthlyIncome
      occupation
      moveInDate
      leaseDuration
      numberOfOccupants
      hasPets
      petDetails
      smokingStatus
      emergencyContact {
        name
        relationship
        phoneNumber
        email
        __typename
      }
      __typename
    }
    landlordNotes
    rejectionReason
    submittedAt
    createdAt
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
    id
    conversationId
    senderId
    content
    timestamp
    isRead
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnNewMessageSubscriptionVariables,
  APITypes.OnNewMessageSubscription
>;
export const onConversationUpdated = /* GraphQL */ `subscription OnConversationUpdated($userId: String!) {
  onConversationUpdated(userId: $userId) {
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
` as GeneratedSubscription<
  APITypes.OnConversationUpdatedSubscriptionVariables,
  APITypes.OnConversationUpdatedSubscription
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
export const onPropertiesUpdated = /* GraphQL */ `subscription OnPropertiesUpdated($propertyIds: [ID!]!) {
  onPropertiesUpdated(propertyIds: $propertyIds) {
    propertyId
    eventType
    property {
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
        coordinates {
          latitude
          longitude
          __typename
        }
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
    changes {
      field
      oldValue
      newValue
      __typename
    }
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnPropertiesUpdatedSubscriptionVariables,
  APITypes.OnPropertiesUpdatedSubscription
>;
export const onNewPropertyMatchesSearch = /* GraphQL */ `subscription OnNewPropertyMatchesSearch($searchCriteria: PropertySearchInput!) {
  onNewPropertyMatchesSearch(searchCriteria: $searchCriteria) {
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
      coordinates {
        latitude
        longitude
        __typename
      }
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
` as GeneratedSubscription<
  APITypes.OnNewPropertyMatchesSearchSubscriptionVariables,
  APITypes.OnNewPropertyMatchesSearchSubscription
>;
export const onPropertyUpdated = /* GraphQL */ `subscription OnPropertyUpdated($propertyId: ID!) {
  onPropertyUpdated(propertyId: $propertyId) {
    propertyId
    eventType
    property {
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
        coordinates {
          latitude
          longitude
          __typename
        }
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
    changes {
      field
      oldValue
      newValue
      __typename
    }
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnPropertyUpdatedSubscriptionVariables,
  APITypes.OnPropertyUpdatedSubscription
>;
export const onNewPropertyInRegion = /* GraphQL */ `subscription OnNewPropertyInRegion($region: String!) {
  onNewPropertyInRegion(region: $region) {
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
      coordinates {
        latitude
        longitude
        __typename
      }
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
` as GeneratedSubscription<
  APITypes.OnNewPropertyInRegionSubscriptionVariables,
  APITypes.OnNewPropertyInRegionSubscription
>;
export const dummySubscription = /* GraphQL */ `subscription DummySubscription {
  dummySubscription
}
` as GeneratedSubscription<
  APITypes.DummySubscriptionSubscriptionVariables,
  APITypes.DummySubscriptionSubscription
>;
