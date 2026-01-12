/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const submitApplication = /* GraphQL */ `mutation SubmitApplication($input: SubmitApplicationInput!) {
  submitApplication(input: $input) {
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
` as GeneratedMutation<
  APITypes.SubmitApplicationMutationVariables,
  APITypes.SubmitApplicationMutation
>;
export const updateApplication = /* GraphQL */ `mutation UpdateApplication(
  $applicationId: ID!
  $input: UpdateApplicationInput!
) {
  updateApplication(applicationId: $applicationId, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateApplicationMutationVariables,
  APITypes.UpdateApplicationMutation
>;
export const updateApplicationStatus = /* GraphQL */ `mutation UpdateApplicationStatus(
  $applicationId: ID!
  $input: UpdateApplicationStatusInput!
) {
  updateApplicationStatus(applicationId: $applicationId, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateApplicationStatusMutationVariables,
  APITypes.UpdateApplicationStatusMutation
>;
export const createConversation = /* GraphQL */ `mutation CreateConversation($input: CreateConversationInput!) {
  createConversation(input: $input) {
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
export const updateLocation = /* GraphQL */ `mutation UpdateLocation($locationId: ID!, $name: String!) {
  updateLocation(locationId: $locationId, name: $name) {
    success
    message
    location {
      id
      name
      __typename
    }
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLocationMutationVariables,
  APITypes.UpdateLocationMutation
>;
export const importLocationsFromCSV = /* GraphQL */ `mutation ImportLocationsFromCSV($csvData: String!) {
  importLocationsFromCSV(csvData: $csvData) {
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
export const getMediaUploadUrl = /* GraphQL */ `mutation GetMediaUploadUrl(
  $userId: ID!
  $fileName: String!
  $contentType: String!
) {
  getMediaUploadUrl(
    userId: $userId
    fileName: $fileName
    contentType: $contentType
  ) {
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
export const deleteMediaItem = /* GraphQL */ `mutation DeleteMediaItem($userId: ID!, $fileUrl: String!) {
  deleteMediaItem(userId: $userId, fileUrl: $fileUrl) {
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
` as GeneratedMutation<
  APITypes.DeleteMediaItemMutationVariables,
  APITypes.DeleteMediaItemMutation
>;
export const associateMediaWithProperty = /* GraphQL */ `mutation AssociateMediaWithProperty(
  $propertyId: ID!
  $landlordId: ID!
  $media: PropertyMediaInput!
) {
  associateMediaWithProperty(
    propertyId: $propertyId
    landlordId: $landlordId
    media: $media
  ) {
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
` as GeneratedMutation<
  APITypes.AssociateMediaWithPropertyMutationVariables,
  APITypes.AssociateMediaWithPropertyMutation
>;
export const createProperty = /* GraphQL */ `mutation CreateProperty($landlordId: ID!, $input: CreatePropertyInput!) {
  createProperty(landlordId: $landlordId, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreatePropertyMutationVariables,
  APITypes.CreatePropertyMutation
>;
export const updateProperty = /* GraphQL */ `mutation UpdateProperty(
  $propertyId: ID!
  $landlordId: ID!
  $input: UpdatePropertyInput!
) {
  updateProperty(
    propertyId: $propertyId
    landlordId: $landlordId
    input: $input
  ) {
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
` as GeneratedMutation<
  APITypes.UpdatePropertyStatusMutationVariables,
  APITypes.UpdatePropertyStatusMutation
>;
export const markPropertyAsRented = /* GraphQL */ `mutation MarkPropertyAsRented(
  $propertyId: ID!
  $landlordId: ID!
  $tenantId: ID!
) {
  markPropertyAsRented(
    propertyId: $propertyId
    landlordId: $landlordId
    tenantId: $tenantId
  ) {
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
` as GeneratedMutation<
  APITypes.MarkPropertyAsRentedMutationVariables,
  APITypes.MarkPropertyAsRentedMutation
>;
export const markPropertyAsAvailable = /* GraphQL */ `mutation MarkPropertyAsAvailable($propertyId: ID!, $landlordId: ID!) {
  markPropertyAsAvailable(propertyId: $propertyId, landlordId: $landlordId) {
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
` as GeneratedMutation<
  APITypes.MarkPropertyAsAvailableMutationVariables,
  APITypes.MarkPropertyAsAvailableMutation
>;
export const assignPropertyManager = /* GraphQL */ `mutation AssignPropertyManager(
  $propertyId: ID!
  $landlordId: ID!
  $managerId: ID!
) {
  assignPropertyManager(
    propertyId: $propertyId
    landlordId: $landlordId
    managerId: $managerId
  ) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AssignPropertyManagerMutationVariables,
  APITypes.AssignPropertyManagerMutation
>;
export const removePropertyManager = /* GraphQL */ `mutation RemovePropertyManager($propertyId: ID!, $landlordId: ID!) {
  removePropertyManager(propertyId: $propertyId, landlordId: $landlordId) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.RemovePropertyManagerMutationVariables,
  APITypes.RemovePropertyManagerMutation
>;
export const toggleFavorite = /* GraphQL */ `mutation ToggleFavorite($userId: ID!, $propertyId: ID!) {
  toggleFavorite(userId: $userId, propertyId: $propertyId) {
    success
    isFavorited
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ToggleFavoriteMutationVariables,
  APITypes.ToggleFavoriteMutation
>;
export const importPropertiesFromCSV = /* GraphQL */ `mutation ImportPropertiesFromCSV($csvData: String!) {
  importPropertiesFromCSV(csvData: $csvData) {
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
export const publishNewPropertyEvent = /* GraphQL */ `mutation PublishNewPropertyEvent($propertyId: ID!, $region: String!) {
  publishNewPropertyEvent(propertyId: $propertyId, region: $region) {
    success
    message
    propertyId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishNewPropertyEventMutationVariables,
  APITypes.PublishNewPropertyEventMutation
>;
export const publishPropertyUpdateEvent = /* GraphQL */ `mutation PublishPropertyUpdateEvent($input: PropertyUpdateEventInput!) {
  publishPropertyUpdateEvent(input: $input) {
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
` as GeneratedMutation<
  APITypes.PublishPropertyUpdateEventMutationVariables,
  APITypes.PublishPropertyUpdateEventMutation
>;
export const dummyMutation = /* GraphQL */ `mutation DummyMutation {
  dummyMutation
}
` as GeneratedMutation<
  APITypes.DummyMutationMutationVariables,
  APITypes.DummyMutationMutation
>;
export const signUp = /* GraphQL */ `mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SignUpMutationVariables,
  APITypes.SignUpMutation
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SignInMutationVariables,
  APITypes.SignInMutation
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
export const resetPassword = /* GraphQL */ `mutation ResetPassword(
  $email: String!
  $confirmationCode: String!
  $newPassword: String!
) {
  resetPassword(
    email: $email
    confirmationCode: $confirmationCode
    newPassword: $newPassword
  ) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ResetPasswordMutationVariables,
  APITypes.ResetPasswordMutation
>;
export const verifyEmail = /* GraphQL */ `mutation VerifyEmail($email: String!, $code: String!) {
  verifyEmail(email: $email, code: $code) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.VerifyEmailMutationVariables,
  APITypes.VerifyEmailMutation
>;
export const resendVerificationCode = /* GraphQL */ `mutation ResendVerificationCode($email: String!) {
  resendVerificationCode(email: $email) {
    success
    message
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ResendVerificationCodeMutationVariables,
  APITypes.ResendVerificationCodeMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser($userId: ID!, $input: UpdateUserInput!) {
  updateUser(userId: $userId, input: $input) {
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
export const submitLandlordApplication = /* GraphQL */ `mutation SubmitLandlordApplication($input: LandlordApplicationInput!) {
  submitLandlordApplication(input: $input) {
    success
    message
    applicationId
    status
    submittedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.SubmitLandlordApplicationMutationVariables,
  APITypes.SubmitLandlordApplicationMutation
>;
