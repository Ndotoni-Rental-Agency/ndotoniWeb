// Authentication mutations
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