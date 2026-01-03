// =============================================================================
// GRAPHQL MUTATIONS
// All mutations consolidated in one file for easy access and maintenance
// =============================================================================

// =============================================================================
// AUTHENTICATION MUTATIONS
// =============================================================================

export const signUp = /* GraphQL */ `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      accessToken
      refreshToken
      user {
        ... on Tenant {
          userId
          email
          firstName
          lastName
          userType
          accountStatus
          isEmailVerified
          phoneNumber
          language
          currency
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
          language
          currency
          businessName
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
          language
          currency
          permissions
        }
      }
    }
  }
`;

export const signIn = /* GraphQL */ `
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        ... on Tenant {
          userId
          email
          firstName
          lastName
          userType
          accountStatus
          isEmailVerified
          phoneNumber
          language
          currency
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
          language
          currency
          businessName
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
          language
          currency
          permissions
        }
      }
    }
  }
`;

export const forgotPassword = /* GraphQL */ `
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const resetPassword = /* GraphQL */ `
  mutation ResetPassword($email: String!, $confirmationCode: String!, $newPassword: String!) {
    resetPassword(email: $email, confirmationCode: $confirmationCode, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const verifyEmail = /* GraphQL */ `
  mutation VerifyEmail($email: String!, $code: String!) {
    verifyEmail(email: $email, code: $code) {
      success
      message
    }
  }
`;

export const resendVerificationCode = /* GraphQL */ `
  mutation ResendVerificationCode($email: String!) {
    resendVerificationCode(email: $email) {
      success
      message
    }
  }
`;

export const socialSignIn = /* GraphQL */ `
  mutation SocialSignIn($provider: String!, $accessToken: String!) {
    socialSignIn(provider: $provider, accessToken: $accessToken) {
      accessToken
      refreshToken
      user {
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
          businessName
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
          permissions
        }
      }
    }
  }
`;

export const socialSignUp = /* GraphQL */ `
  mutation SocialSignUp($provider: String!, $accessToken: String!, $userType: String) {
    socialSignUp(provider: $provider, accessToken: $accessToken, userType: $userType) {
      accessToken
      refreshToken
      user {
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
          businessName
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
          permissions
        }
      }
    }
  }
`;

// =============================================================================
// USER MUTATIONS
// =============================================================================

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

// =============================================================================
// PROPERTY MUTATIONS
// =============================================================================

export const createProperty = /* GraphQL */ `
  mutation CreateProperty($landlordId: ID!, $input: CreatePropertyInput!) {
    createProperty(landlordId: $landlordId, input: $input) {
      propertyId
      landlordId
      title
      description
      pricing {
        monthlyRent
        deposit
        currency
      }
      address {
        region
        district
        ward
        street
      }
      propertyType
      status
      createdAt
      updatedAt
    }
  }
`;

export const updateProperty = /* GraphQL */ `
  mutation UpdateProperty($propertyId: ID!, $landlordId: ID!, $input: UpdatePropertyInput!) {
    updateProperty(propertyId: $propertyId, landlordId: $landlordId, input: $input) {
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
      updatedAt
    }
  }
`;

// =============================================================================
// MEDIA MUTATIONS
// =============================================================================

export const getMediaUploadUrl = /* GraphQL */ `
  mutation GetMediaUploadUrl($userId: ID!, $fileName: String!, $contentType: String!) {
    getMediaUploadUrl(userId: $userId, fileName: $fileName, contentType: $contentType) {
      uploadUrl
      key
      fileUrl
    }
  }
`;

export const associateMediaWithProperty = /* GraphQL */ `
  mutation AssociateMediaWithProperty($propertyId: ID!, $userId: ID!, $media: PropertyMediaInput!) {
    associateMediaWithProperty(propertyId: $propertyId, userId: $userId, media: $media) {
      propertyId
      media {
        images
        videos
        floorPlan
        virtualTour
      }
      updatedAt
    }
  }
`;