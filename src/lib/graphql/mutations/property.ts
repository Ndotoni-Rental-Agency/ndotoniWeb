// Property mutations
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