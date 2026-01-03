// Polling queries for hybrid subscription system
export const getPropertiesUpdatedSince = /* GraphQL */ `
  query GetPropertiesUpdatedSince($propertyIds: [ID!]!, $since: AWSDateTime!) {
    getPropertiesUpdatedSince(propertyIds: $propertyIds, since: $since) {
      propertyId
      title
      pricing {
        monthlyRent
        deposit
        currency
      }
      availability {
        available
        availableFrom
      }
      status
      updatedAt
    }
  }
`;

export const getNewPropertiesMatchingSearch = /* GraphQL */ `
  query GetNewPropertiesMatchingSearch($searchCriteria: PropertySearchInput!, $since: AWSDateTime!) {
    getNewPropertiesMatchingSearch(searchCriteria: $searchCriteria, since: $since) {
      propertyId
      title
      description
      pricing {
        monthlyRent
        deposit
        currency
      }
      specifications {
        bedrooms
        bathrooms
        squareMeters
      }
      address {
        region
        district
        ward
        street
      }
      propertyType
      availability {
        available
        availableFrom
      }
      status
      createdAt
      updatedAt
    }
  }
`;