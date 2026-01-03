// User queries
export const getUser = /* GraphQL */ `
  query GetUser($userId: ID!) {
    getUser(userId: $userId) {
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