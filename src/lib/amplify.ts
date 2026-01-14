import { Amplify } from 'aws-amplify';

// Configure Amplify with your AppSync GraphQL API (Beta Environment)
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-west-2_SVgyTtp2T',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '1g8sgvag40t43s2khhq81uties',
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://dhgjmpvrpvepbpnidwq5lcob7y.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'apiKey', // Use API Key as default for public access
      apiKey: 'da2-5zy3ifg7djbfroehx2dh5oed4u'
    }
  }
});

export default Amplify;