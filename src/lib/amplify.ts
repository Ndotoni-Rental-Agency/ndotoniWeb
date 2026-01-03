import { Amplify } from 'aws-amplify';

// Configure Amplify with your AppSync GraphQL API
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://lfiixcwaubhifi3npxynnco6zy.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-cpabzplkzjhldhhaolyapqnemy'
    }
  }
});

export default Amplify;