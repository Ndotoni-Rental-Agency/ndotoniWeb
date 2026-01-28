/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const dummySubscription = /* GraphQL */ `subscription DummySubscription {
  dummySubscription
}
` as GeneratedSubscription<
  APITypes.DummySubscriptionSubscriptionVariables,
  APITypes.DummySubscriptionSubscription
>;
export const onNewPropertyInRegion = /* GraphQL */ `subscription OnNewPropertyInRegion($region: String!) {
  onNewPropertyInRegion(region: $region) {
    message
    propertyId
    success
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnNewPropertyInRegionSubscriptionVariables,
  APITypes.OnNewPropertyInRegionSubscription
>;
export const onPropertyUpdated = /* GraphQL */ `subscription OnPropertyUpdated($propertyId: ID!) {
  onPropertyUpdated(propertyId: $propertyId) {
    changes {
      field
      newValue
      oldValue
      __typename
    }
    eventType
    property
    propertyId
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnPropertyUpdatedSubscriptionVariables,
  APITypes.OnPropertyUpdatedSubscription
>;
