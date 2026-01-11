/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const approveApplication = /* GraphQL */ `mutation ApproveApplication($applicationId: ID!, $landlordNotes: String) {
  approveApplication(
    applicationId: $applicationId
    landlordNotes: $landlordNotes
  ) {
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
` as GeneratedMutation<
  APITypes.ApproveApplicationMutationVariables,
  APITypes.ApproveApplicationMutation
>;
export const assignPropertyManager = /* GraphQL */ `mutation AssignPropertyManager(
  $landlordId: ID!
  $managerId: ID!
  $propertyId: ID!
) {
  assignPropertyManager(
    landlordId: $landlordId
    managerId: $managerId
    propertyId: $propertyId
  ) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.AssignPropertyManagerMutationVariables,
  APITypes.AssignPropertyManagerMutation
>;
export const associateMediaWithProperty = /* GraphQL */ `mutation AssociateMediaWithProperty(
  $landlordId: ID!
  $media: PropertyMediaInput!
  $propertyId: ID!
) {
  associateMediaWithProperty(
    landlordId: $landlordId
    media: $media
    propertyId: $propertyId
  ) {
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
` as GeneratedMutation<
  APITypes.AssociateMediaWithPropertyMutationVariables,
  APITypes.AssociateMediaWithPropertyMutation
>;
export const becomeLandlord = /* GraphQL */ `mutation BecomeLandlord($input: BecomeLandlordInput!, $userId: ID!) {
  becomeLandlord(input: $input, userId: $userId) {
    applicationId
    message
    status
    submittedAt
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.BecomeLandlordMutationVariables,
  APITypes.BecomeLandlordMutation
>;
export const createConversation = /* GraphQL */ `mutation CreateConversation($input: CreateConversationInput!) {
  createConversation(input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateConversationMutationVariables,
  APITypes.CreateConversationMutation
>;
export const createLocation = /* GraphQL */ `mutation CreateLocation($input: CreateLocationInput!) {
  createLocation(input: $input) {
    location {
      ... on District {
        id
        name
        regionId
      }
      ... on Region {
        id
        name
      }
      ... on Street {
        id
        name
        wardId
      }
      ... on Ward {
        districtId
        id
        name
      }
    }
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLocationMutationVariables,
  APITypes.CreateLocationMutation
>;
export const createProperty = /* GraphQL */ `mutation CreateProperty($input: CreatePropertyInput!, $landlordId: ID!) {
  createProperty(input: $input, landlordId: $landlordId) {
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
` as GeneratedMutation<
  APITypes.CreatePropertyMutationVariables,
  APITypes.CreatePropertyMutation
>;
export const deleteMediaItem = /* GraphQL */ `mutation DeleteMediaItem($fileUrl: String!, $userId: ID!) {
  deleteMediaItem(fileUrl: $fileUrl, userId: $userId) {
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
export const deleteProperty = /* GraphQL */ `mutation DeleteProperty($landlordId: ID!, $propertyId: ID!) {
  deleteProperty(landlordId: $landlordId, propertyId: $propertyId) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePropertyMutationVariables,
  APITypes.DeletePropertyMutation
>;
export const dummyMutation = /* GraphQL */ `mutation DummyMutation {
  dummyMutation
}
` as GeneratedMutation<
  APITypes.DummyMutationMutationVariables,
  APITypes.DummyMutationMutation
>;
export const forgotPassword = /* GraphQL */ `mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ForgotPasswordMutationVariables,
  APITypes.ForgotPasswordMutation
>;
export const getMediaUploadUrl = /* GraphQL */ `mutation GetMediaUploadUrl(
  $contentType: String!
  $fileName: String!
  $userId: ID!
) {
  getMediaUploadUrl(
    contentType: $contentType
    fileName: $fileName
    userId: $userId
  ) {
    fileUrl
    key
    uploadUrl
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
export const markAsRead = /* GraphQL */ `mutation MarkAsRead($conversationId: String!, $userId: String!) {
  markAsRead(conversationId: $conversationId, userId: $userId) {
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
` as GeneratedMutation<
  APITypes.MarkAsReadMutationVariables,
  APITypes.MarkAsReadMutation
>;
export const markPropertyAsAvailable = /* GraphQL */ `mutation MarkPropertyAsAvailable($landlordId: ID!, $propertyId: ID!) {
  markPropertyAsAvailable(landlordId: $landlordId, propertyId: $propertyId) {
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
` as GeneratedMutation<
  APITypes.MarkPropertyAsAvailableMutationVariables,
  APITypes.MarkPropertyAsAvailableMutation
>;
export const markPropertyAsRented = /* GraphQL */ `mutation MarkPropertyAsRented(
  $landlordId: ID!
  $propertyId: ID!
  $tenantId: ID!
) {
  markPropertyAsRented(
    landlordId: $landlordId
    propertyId: $propertyId
    tenantId: $tenantId
  ) {
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
` as GeneratedMutation<
  APITypes.MarkPropertyAsRentedMutationVariables,
  APITypes.MarkPropertyAsRentedMutation
>;
export const publishConversationUpdate = /* GraphQL */ `mutation PublishConversationUpdate($input: AWSJSON!) {
  publishConversationUpdate(input: $input) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishConversationUpdateMutationVariables,
  APITypes.PublishConversationUpdateMutation
>;
export const publishNewMessage = /* GraphQL */ `mutation PublishNewMessage($input: AWSJSON!) {
  publishNewMessage(input: $input) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishNewMessageMutationVariables,
  APITypes.PublishNewMessageMutation
>;
export const publishNewPropertyEvent = /* GraphQL */ `mutation PublishNewPropertyEvent($propertyId: ID!, $region: String!) {
  publishNewPropertyEvent(propertyId: $propertyId, region: $region) {
    message
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
` as GeneratedMutation<
  APITypes.PublishPropertyUpdateEventMutationVariables,
  APITypes.PublishPropertyUpdateEventMutation
>;
export const publishUnreadCountUpdate = /* GraphQL */ `mutation PublishUnreadCountUpdate($input: AWSJSON!) {
  publishUnreadCountUpdate(input: $input) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishUnreadCountUpdateMutationVariables,
  APITypes.PublishUnreadCountUpdateMutation
>;
export const regenerateLocationJson = /* GraphQL */ `mutation RegenerateLocationJson {
  regenerateLocationJson {
    cloudfrontUrl
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.RegenerateLocationJsonMutationVariables,
  APITypes.RegenerateLocationJsonMutation
>;
export const rejectApplication = /* GraphQL */ `mutation RejectApplication(
  $applicationId: ID!
  $landlordNotes: String
  $rejectionReason: String!
) {
  rejectApplication(
    applicationId: $applicationId
    landlordNotes: $landlordNotes
    rejectionReason: $rejectionReason
  ) {
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
` as GeneratedMutation<
  APITypes.RejectApplicationMutationVariables,
  APITypes.RejectApplicationMutation
>;
export const removePropertyManager = /* GraphQL */ `mutation RemovePropertyManager($landlordId: ID!, $propertyId: ID!) {
  removePropertyManager(landlordId: $landlordId, propertyId: $propertyId) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.RemovePropertyManagerMutationVariables,
  APITypes.RemovePropertyManagerMutation
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ResetPasswordMutationVariables,
  APITypes.ResetPasswordMutation
>;
export const reviewApplication = /* GraphQL */ `mutation ReviewApplication(
  $applicationId: ID!
  $input: ReviewApplicationInput!
) {
  reviewApplication(applicationId: $applicationId, input: $input) {
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
` as GeneratedMutation<
  APITypes.ReviewApplicationMutationVariables,
  APITypes.ReviewApplicationMutation
>;
export const reviewLandlordApplication = /* GraphQL */ `mutation ReviewLandlordApplication(
  $applicationId: ID!
  $input: ReviewApplicationInput!
) {
  reviewLandlordApplication(applicationId: $applicationId, input: $input) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ReviewLandlordApplicationMutationVariables,
  APITypes.ReviewLandlordApplicationMutation
>;
export const sendMessage = /* GraphQL */ `mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    content
    conversationId
    id
    isRead
    senderId
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
export const toggleFavorite = /* GraphQL */ `mutation ToggleFavorite($propertyId: ID!, $userId: ID!) {
  toggleFavorite(propertyId: $propertyId, userId: $userId) {
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
` as GeneratedMutation<
  APITypes.UpdateApplicationMutationVariables,
  APITypes.UpdateApplicationMutation
>;
export const updateLocation = /* GraphQL */ `mutation UpdateLocation($locationId: ID!, $name: String!) {
  updateLocation(locationId: $locationId, name: $name) {
    location {
      id
      name
      __typename
    }
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLocationMutationVariables,
  APITypes.UpdateLocationMutation
>;
export const updateProperty = /* GraphQL */ `mutation UpdateProperty(
  $input: UpdatePropertyInput!
  $landlordId: ID!
  $propertyId: ID!
) {
  updateProperty(
    input: $input
    landlordId: $landlordId
    propertyId: $propertyId
  ) {
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
` as GeneratedMutation<
  APITypes.UpdatePropertyMutationVariables,
  APITypes.UpdatePropertyMutation
>;
export const updatePropertyStatus = /* GraphQL */ `mutation UpdatePropertyStatus(
  $landlordId: ID!
  $propertyId: ID!
  $status: PropertyStatus!
) {
  updatePropertyStatus(
    landlordId: $landlordId
    propertyId: $propertyId
    status: $status
  ) {
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
` as GeneratedMutation<
  APITypes.UpdatePropertyStatusMutationVariables,
  APITypes.UpdatePropertyStatusMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput!, $userId: ID!) {
  updateUser(input: $input, userId: $userId) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const verifyEmail = /* GraphQL */ `mutation VerifyEmail($code: String!, $email: String!) {
  verifyEmail(code: $code, email: $email) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.VerifyEmailMutationVariables,
  APITypes.VerifyEmailMutation
>;
export const withdrawApplication = /* GraphQL */ `mutation WithdrawApplication($applicationId: ID!) {
  withdrawApplication(applicationId: $applicationId) {
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
` as GeneratedMutation<
  APITypes.WithdrawApplicationMutationVariables,
  APITypes.WithdrawApplicationMutation
>;
