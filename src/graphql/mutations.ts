/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const assignPropertyAgent = /* GraphQL */ `mutation AssignPropertyAgent($agentId: ID!, $propertyId: ID!) {
  assignPropertyAgent(agentId: $agentId, propertyId: $propertyId) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AssignPropertyAgentMutationVariables,
  APITypes.AssignPropertyAgentMutation
>;
export const associateMediaWithProperty = /* GraphQL */ `mutation AssociateMediaWithProperty(
  $media: PropertyMediaInput!
  $propertyId: ID!
) {
  associateMediaWithProperty(media: $media, propertyId: $propertyId) {
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
    landlordId
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
` as GeneratedMutation<
  APITypes.AssociateMediaWithPropertyMutationVariables,
  APITypes.AssociateMediaWithPropertyMutation
>;
export const createConversation = /* GraphQL */ `mutation CreateConversation($input: CreateConversationInput!) {
  createConversation(input: $input) {
    createdAt
    id
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
      userType
      verificationDocuments
      __typename
    }
    landlordId
    lastMessage
    lastMessageSender
    lastMessageTime
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
      landlordId
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
    propertyTitle
    tenant {
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
      __typename
    }
    tenantId
    unreadCount
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateConversationMutationVariables,
  APITypes.CreateConversationMutation
>;
export const sendMessage = /* GraphQL */ `mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    id
    conversationId
    senderId
    content
    timestamp
    isRead
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SendMessageMutationVariables,
  APITypes.SendMessageMutation
>;
export const markAsRead = /* GraphQL */ `mutation MarkAsRead($conversationId: String!, $userId: String!) {
  markAsRead(conversationId: $conversationId, userId: $userId) {
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
` as GeneratedMutation<
  APITypes.MarkAsReadMutationVariables,
  APITypes.MarkAsReadMutation
>;
export const publishNewMessage = /* GraphQL */ `mutation PublishNewMessage($input: AWSJSON!) {
  publishNewMessage(input: $input) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishNewMessageMutationVariables,
  APITypes.PublishNewMessageMutation
>;
export const publishConversationUpdate = /* GraphQL */ `mutation PublishConversationUpdate($input: AWSJSON!) {
  publishConversationUpdate(input: $input) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishConversationUpdateMutationVariables,
  APITypes.PublishConversationUpdateMutation
>;
export const publishUnreadCountUpdate = /* GraphQL */ `mutation PublishUnreadCountUpdate($input: AWSJSON!) {
  publishUnreadCountUpdate(input: $input) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishUnreadCountUpdateMutationVariables,
  APITypes.PublishUnreadCountUpdateMutation
>;
export const createLocation = /* GraphQL */ `mutation CreateLocation($input: CreateLocationInput!) {
  createLocation(input: $input) {
    success
    location {
      ... on Region {
        id
        name
      }
      ... on District {
        id
        name
        regionId
      }
      ... on Ward {
        id
        name
        districtId
      }
      ... on Street {
        id
        name
        wardId
      }
    }
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLocationMutationVariables,
  APITypes.CreateLocationMutation
>;
export const createProperty = /* GraphQL */ `mutation CreateProperty($input: CreatePropertyInput!) {
  createProperty(input: $input) {
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
    landlordId
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
` as GeneratedMutation<
  APITypes.UpdateLocationMutationVariables,
  APITypes.UpdateLocationMutation
>;
export const deleteMediaItem = /* GraphQL */ `mutation DeleteMediaItem($fileUrl: String!) {
  deleteMediaItem(fileUrl: $fileUrl) {
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
` as GeneratedMutation<
  APITypes.DeleteMediaItemMutationVariables,
  APITypes.DeleteMediaItemMutation
>;
export const deleteProperty = /* GraphQL */ `mutation DeleteProperty($propertyId: ID!) {
  deleteProperty(propertyId: $propertyId) {
    message
    success
    imported
    skipped
    errors
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ImportLocationsFromCSVMutationVariables,
  APITypes.ImportLocationsFromCSVMutation
>;
export const regenerateLocationJson = /* GraphQL */ `mutation RegenerateLocationJson {
  regenerateLocationJson {
    success
    cloudfrontUrl
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.RegenerateLocationJsonMutationVariables,
  APITypes.RegenerateLocationJsonMutation
>;
export const getMediaUploadUrl = /* GraphQL */ `mutation GetMediaUploadUrl($contentType: String!, $fileName: String!) {
  getMediaUploadUrl(contentType: $contentType, fileName: $fileName) {
    fileUrl
    key
    uploadUrl
    key
    fileUrl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.GetMediaUploadUrlMutationVariables,
  APITypes.GetMediaUploadUrlMutation
>;
export const importLocationsFromCSV = /* GraphQL */ `mutation ImportLocationsFromCSV($csvData: String!) {
  importLocationsFromCSV(csvData: $csvData) {
    errors
    imported
    message
    skipped
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ImportLocationsFromCSVMutationVariables,
  APITypes.ImportLocationsFromCSVMutation
>;
export const importPropertiesFromCSV = /* GraphQL */ `mutation ImportPropertiesFromCSV($csvData: String!) {
  importPropertiesFromCSV(csvData: $csvData) {
    errors
    imported
    message
    skipped
    success
    updated
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ImportPropertiesFromCSVMutationVariables,
  APITypes.ImportPropertiesFromCSVMutation
>;
export const markAsRead = /* GraphQL */ `mutation MarkAsRead($conversationId: String!) {
  markAsRead(conversationId: $conversationId) {
    createdAt
    id
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
      userType
      verificationDocuments
      __typename
    }
    landlordId
    lastMessage
    lastMessageSender
    lastMessageTime
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
      landlordId
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
    propertyTitle
    tenant {
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
      __typename
    }
    tenantId
    unreadCount
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMediaItemMutationVariables,
  APITypes.DeleteMediaItemMutation
>;
export const markPropertyAsAvailable = /* GraphQL */ `mutation MarkPropertyAsAvailable($propertyId: ID!) {
  markPropertyAsAvailable(propertyId: $propertyId) {
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
    description
    landlord {
      firstName
      lastName
      __typename
    }
    landlordId
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
` as GeneratedMutation<
  APITypes.CreatePropertyMutationVariables,
  APITypes.CreatePropertyMutation
>;
export const markPropertyAsRented = /* GraphQL */ `mutation MarkPropertyAsRented($propertyId: ID!, $tenantId: ID!) {
  markPropertyAsRented(propertyId: $propertyId, tenantId: $tenantId) {
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
    landlordId
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
` as GeneratedMutation<
  APITypes.UpdatePropertyMutationVariables,
  APITypes.UpdatePropertyMutation
>;
export const deleteProperty = /* GraphQL */ `mutation DeleteProperty($propertyId: ID!, $landlordId: ID!) {
  deleteProperty(propertyId: $propertyId, landlordId: $landlordId) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePropertyMutationVariables,
  APITypes.DeletePropertyMutation
>;
export const updatePropertyStatus = /* GraphQL */ `mutation UpdatePropertyStatus(
  $propertyId: ID!
  $landlordId: ID!
  $status: PropertyStatus!
) {
  updatePropertyStatus(
    propertyId: $propertyId
    landlordId: $landlordId
    status: $status
  ) {
    propertyId
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishNewPropertyEventMutationVariables,
  APITypes.PublishNewPropertyEventMutation
>;
export const publishPropertyUpdateEvent = /* GraphQL */ `mutation PublishPropertyUpdateEvent($input: PropertyUpdateEventInput!) {
  publishPropertyUpdateEvent(input: $input) {
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
      landlordId
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
` as GeneratedMutation<
  APITypes.UpdatePropertyStatusMutationVariables,
  APITypes.UpdatePropertyStatusMutation
>;
export const removePropertyAgent = /* GraphQL */ `mutation RemovePropertyAgent($propertyId: ID!) {
  removePropertyAgent(propertyId: $propertyId) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.RemovePropertyAgentMutationVariables,
  APITypes.RemovePropertyAgentMutation
>;
export const resendVerificationCode = /* GraphQL */ `mutation ResendVerificationCode($email: String!) {
  resendVerificationCode(email: $email) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ResendVerificationCodeMutationVariables,
  APITypes.ResendVerificationCodeMutation
>;
export const resetPassword = /* GraphQL */ `mutation ResetPassword(
  $confirmationCode: String!
  $email: String!
  $newPassword: String!
) {
  resetPassword(
    confirmationCode: $confirmationCode
    email: $email
    newPassword: $newPassword
  ) {
    message
    success
    imported
    updated
    skipped
    errors
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ImportPropertiesFromCSVMutationVariables,
  APITypes.ImportPropertiesFromCSVMutation
>;
export const sendMessage = /* GraphQL */ `mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    content
    conversationId
    id
    isRead
    senderId
    senderName
    timestamp
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SendMessageMutationVariables,
  APITypes.SendMessageMutation
>;
export const signIn = /* GraphQL */ `mutation SignIn($email: String!, $password: String!) {
  signIn(email: $email, password: $password) {
    accessToken
    refreshToken
    user {
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
        userId
        email
        phoneNumber
        firstName
        lastName
        phoneNumber
        profileImage
        pushNotifications
        smsNotifications
        taxId
        updatedAt
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
        userType
      }
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SignInMutationVariables,
  APITypes.SignInMutation
>;
export const signUp = /* GraphQL */ `mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    accessToken
    refreshToken
    user {
      ... on Admin {
        userId
        email
        phoneNumber
        firstName
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
        accountStatus
        isEmailVerified
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
        emailNotifications
        smsNotifications
        pushNotifications
        permissions
        createdAt
        updatedAt
        userType
      }
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SignUpMutationVariables,
  APITypes.SignUpMutation
>;
export const submitApplication = /* GraphQL */ `mutation SubmitApplication($input: SubmitApplicationInput!) {
  submitApplication(input: $input) {
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
      userType
      __typename
    }
    applicantDetails {
      emergencyContact {
        email
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
      landlordId
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
` as GeneratedMutation<
  APITypes.SubmitApplicationMutationVariables,
  APITypes.SubmitApplicationMutation
>;
export const submitLandlordApplication = /* GraphQL */ `mutation SubmitLandlordApplication($input: LandlordApplicationInput!) {
  submitLandlordApplication(input: $input) {
    applicationId
    message
    status
    submittedAt
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SubmitLandlordApplicationMutationVariables,
  APITypes.SubmitLandlordApplicationMutation
>;
export const toggleFavorite = /* GraphQL */ `mutation ToggleFavorite($propertyId: ID!) {
  toggleFavorite(propertyId: $propertyId) {
    isFavorited
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ToggleFavoriteMutationVariables,
  APITypes.ToggleFavoriteMutation
>;
export const updateApplication = /* GraphQL */ `mutation UpdateApplication(
  $applicationId: ID!
  $input: UpdateApplicationInput!
) {
  updateApplication(applicationId: $applicationId, input: $input) {
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
      landlordId
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
` as GeneratedMutation<
  APITypes.UpdateApplicationMutationVariables,
  APITypes.UpdateApplicationMutation
>;
export const updateApplicationStatus = /* GraphQL */ `mutation UpdateApplicationStatus(
  $applicationId: ID!
  $input: UpdateApplicationStatusInput!
) {
  updateApplicationStatus(applicationId: $applicationId, input: $input) {
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
      landlordId
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
` as GeneratedMutation<
  APITypes.UpdateApplicationStatusMutationVariables,
  APITypes.UpdateApplicationStatusMutation
>;
export const forgotPassword = /* GraphQL */ `mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ForgotPasswordMutationVariables,
  APITypes.ForgotPasswordMutation
>;
export const updateProperty = /* GraphQL */ `mutation UpdateProperty($input: UpdatePropertyInput!, $propertyId: ID!) {
  updateProperty(input: $input, propertyId: $propertyId) {
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
    landlordId
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
` as GeneratedMutation<
  APITypes.VerifyEmailMutationVariables,
  APITypes.VerifyEmailMutation
>;
export const updatePropertyStatus = /* GraphQL */ `mutation UpdatePropertyStatus($propertyId: ID!, $status: PropertyStatus!) {
  updatePropertyStatus(propertyId: $propertyId, status: $status) {
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
    landlordId
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
` as GeneratedMutation<
  APITypes.ResendVerificationCodeMutationVariables,
  APITypes.ResendVerificationCodeMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    ... on Admin {
      accountStatus
      createdAt
      currency
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
      updatedAt
      userType
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
      userType
    }
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const becomeLandlord = /* GraphQL */ `mutation BecomeLandlord($userId: ID!, $input: BecomeLandlordInput!) {
  becomeLandlord(userId: $userId, input: $input) {
    success
    message
    applicationId
    status
    submittedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.BecomeLandlordMutationVariables,
  APITypes.BecomeLandlordMutation
>;
