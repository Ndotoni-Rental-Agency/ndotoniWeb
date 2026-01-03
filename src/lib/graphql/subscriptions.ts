// =============================================================================
// GRAPHQL SUBSCRIPTIONS
// All subscriptions consolidated in one file for easy access and maintenance
// =============================================================================

// =============================================================================
// PROPERTY SUBSCRIPTIONS
// =============================================================================

// Property update event subscription - for tracking changes to existing properties
export const onPropertiesUpdated = /* GraphQL */ `
  subscription OnPropertiesUpdated($propertyIds: [ID!]!) {
    onPropertiesUpdated(propertyIds: $propertyIds) {
      propertyId
      eventType
      property {
        propertyId
        title
        pricing {
          monthlyRent
          currency
        }
        specifications {
          bedrooms
          bathrooms
        }
        address {
          region
          district
          ward
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
      changes {
        field
        oldValue
        newValue
      }
      timestamp
    }
  }
`;

// Single property update subscription - for property detail pages
export const onPropertyUpdated = /* GraphQL */ `
  subscription OnPropertyUpdated($propertyId: ID!) {
    onPropertyUpdated(propertyId: $propertyId) {
      propertyId
      eventType
      property {
        propertyId
        title
        pricing {
          monthlyRent
          currency
        }
        specifications {
          bedrooms
          bathrooms
        }
        address {
          region
          district
          ward
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
      changes {
        field
        oldValue
        newValue
      }
      timestamp
    }
  }
`;

// New property matching search criteria subscription
export const onNewPropertyMatchesSearch = /* GraphQL */ `
  subscription OnNewPropertyMatchesSearch($searchCriteria: PropertySearchInput!) {
    onNewPropertyMatchesSearch(searchCriteria: $searchCriteria) {
      propertyId
      title
      pricing {
        monthlyRent
        currency
      }
      specifications {
        bedrooms
        bathrooms
      }
      address {
        region
        district
        ward
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

// New property in region subscription - simpler regional subscription
export const onNewPropertyInRegion = /* GraphQL */ `
  subscription OnNewPropertyInRegion($region: String!) {
    onNewPropertyInRegion(region: $region) {
      propertyId
      title
      pricing {
        monthlyRent
        currency
      }
      specifications {
        bedrooms
        bathrooms
      }
      address {
        region
        district
        ward
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