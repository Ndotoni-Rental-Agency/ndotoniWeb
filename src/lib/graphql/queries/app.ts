// App-level queries
export const getAppInitialState = /* GraphQL */ `
  query GetAppInitialState($limit: Int) {
    getAppInitialState(limit: $limit) {
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
        createdAt
        updatedAt
      }
      totalProperties
      user {
        userId
        firstName
        lastName
        email
        userType
      }
    }
  }
`;