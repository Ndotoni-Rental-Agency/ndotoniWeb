// Property queries
export const getPropertyCards = /* GraphQL */ `
  query GetPropertyCards($limit: Int, $nextToken: String) {
    getPropertyCards(limit: $limit, nextToken: $nextToken) {
      properties {
        propertyId
        title
        monthlyRent
        currency
        bedrooms
        propertyType
        region
        district
        available
        thumbnail
      }
      count
      nextToken
    }
  }
`;

export const getProperty = /* GraphQL */ `
  query GetProperty($propertyId: ID!) {
    getProperty(propertyId: $propertyId) {
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
      landlordId
      managerId
      createdAt
      updatedAt
      version
    }
  }
`;

export const getLandlordProperties = /* GraphQL */ `
  query GetLandlordProperties($landlordId: ID!, $limit: Int, $nextToken: String) {
    getLandlordProperties(landlordId: $landlordId, limit: $limit, nextToken: $nextToken) {
      properties {
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
        landlordId
        managerId
        createdAt
        updatedAt
      }
      count
      nextToken
    }
  }
`;