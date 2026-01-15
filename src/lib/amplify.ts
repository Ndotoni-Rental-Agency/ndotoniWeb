import { Amplify } from 'aws-amplify';

// Configure Amplify with your AppSync GraphQL API (Beta Environment)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-west-2_7wcOXxOs5',
      userPoolClientId: '7lp18reb2k0kpv6bp6oskdc2mp',
      loginWith: {
        oauth: {
          domain: 'rental-app-dev-055929692194.auth.us-west-2.amazoncognito.com',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: ['http://localhost:3000/auth/callback'],
          redirectSignOut: ['http://localhost:3000'],
          responseType: 'code'
        }
      }
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://wkayzoj7qzcttar73wgh5cx2le.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-soqyespwfve3povw56yjmaw6de'
    }
  }
});

export default Amplify;