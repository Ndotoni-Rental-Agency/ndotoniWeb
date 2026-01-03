// User mutations
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($userId: ID!, $input: UpdateUserInput!) {
    updateUser(userId: $userId, input: $input) {
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

export const becomeLandlord = /* GraphQL */ `
  mutation BecomeLandlord($userId: ID!, $input: BecomeLandlordInput!) {
    becomeLandlord(userId: $userId, input: $input) {
      applicationId
      status
      message
      submittedAt
    }
  }
`;

export const submitLandlordApplication = /* GraphQL */ `
  mutation SubmitLandlordApplication($input: LandlordApplicationInput!) {
    submitLandlordApplication(input: $input) {
      success
      applicationId
      status
      message
      submittedAt
    }
  }
`;