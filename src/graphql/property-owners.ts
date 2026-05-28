/**
 * Property Owner GraphQL operations (manual until codegen runs)
 */

export const listPropertyOwners = /* GraphQL */ `
  query ListPropertyOwners($limit: Int, $nextToken: String) {
    listPropertyOwners(limit: $limit, nextToken: $nextToken) {
      landlords {
        userId
        firstName
        lastName
        phoneNumber
        whatsappNumber
        region
        district
        operatingRegions
        operatingDistricts
        propertyTypes
        minPrice
        maxPrice
        currency
        propertyCount
      }
      nextToken
      count
    }
  }
`;
