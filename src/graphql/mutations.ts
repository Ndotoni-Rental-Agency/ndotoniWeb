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
export const createProperty = /* GraphQL */ `mutation CreateProperty($input: CreatePropertyInput!) {
  createProperty(input: $input) {
    message
    propertyId
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePropertyMutationVariables,
  APITypes.CreatePropertyMutation
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
export const getMediaUploadUrl = /* GraphQL */ `mutation GetMediaUploadUrl($contentType: String!, $fileName: String!) {
  getMediaUploadUrl(contentType: $contentType, fileName: $fileName) {
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
export const initializePropertyChat = /* GraphQL */ `mutation InitializePropertyChat($propertyId: ID!) {
  initializePropertyChat(propertyId: $propertyId) {
    conversationId
    landlordInfo {
      businessName
      firstName
      lastName
      profileImage
      __typename
    }
    propertyId
    propertyTitle
    __typename
  }
}
` as GeneratedMutation<
  APITypes.InitializePropertyChatMutationVariables,
  APITypes.InitializePropertyChatMutation
>;
export const markAsRead = /* GraphQL */ `mutation MarkAsRead($conversationId: String!) {
  markAsRead(conversationId: $conversationId) {
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
` as GeneratedMutation<
  APITypes.MarkAsReadMutationVariables,
  APITypes.MarkAsReadMutation
>;
export const markPropertyAsAvailable = /* GraphQL */ `mutation MarkPropertyAsAvailable($propertyId: ID!) {
  markPropertyAsAvailable(propertyId: $propertyId) {
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
` as GeneratedMutation<
  APITypes.MarkPropertyAsAvailableMutationVariables,
  APITypes.MarkPropertyAsAvailableMutation
>;
export const markPropertyAsRented = /* GraphQL */ `mutation MarkPropertyAsRented($propertyId: ID!, $tenantId: ID!) {
  markPropertyAsRented(propertyId: $propertyId, tenantId: $tenantId) {
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
` as GeneratedMutation<
  APITypes.MarkPropertyAsRentedMutationVariables,
  APITypes.MarkPropertyAsRentedMutation
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
    timestamp
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishPropertyUpdateEventMutationVariables,
  APITypes.PublishPropertyUpdateEventMutation
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
    __typename
  }
}
` as GeneratedMutation<
  APITypes.ResetPasswordMutationVariables,
  APITypes.ResetPasswordMutation
>;
export const sendMessage = /* GraphQL */ `mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateApplicationStatusMutationVariables,
  APITypes.UpdateApplicationStatusMutation
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
export const updateProperty = /* GraphQL */ `mutation UpdateProperty($input: UpdatePropertyInput!, $propertyId: ID!) {
  updateProperty(input: $input, propertyId: $propertyId) {
    message
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePropertyMutationVariables,
  APITypes.UpdatePropertyMutation
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
export const updateUser = /* GraphQL */ `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
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
