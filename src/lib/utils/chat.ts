import { cachedGraphQL } from '@/lib/cache';
import { getProperty, getUser } from '@/graphql/queries';

export interface LandlordInfo {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  businessName?: string;
  profileImage?: string;
}

/**
 * Resolves landlord information from a property ID
 * Useful when PropertyCard doesn't have landlordId but we need to start a chat
 */
export async function resolveLandlordFromProperty(propertyId: string): Promise<LandlordInfo | null> {
  try {
    console.log('Resolving landlord for property:', propertyId);
    
    // First, get the property to find the landlordId
    const propertyResponse = await cachedGraphQL.query({
      query: getProperty,
      variables: { propertyId }
    });
    
    const propertyData = propertyResponse.data?.getProperty;
    if (!propertyData?.landlordId) {
      console.error('Property not found or missing landlordId:', propertyId);
      return null;
    }
    
    const landlordId = propertyData.landlordId;
    console.log('Found landlordId:', landlordId);
    
    // Then get the landlord details
    try {
      const landlordResponse = await cachedGraphQL.query({
        query: getUser,
        variables: { userId: landlordId }
      });
      
      const landlordData = landlordResponse.data?.getUser;
      if (!landlordData) {
        console.warn('Landlord not found in database:', landlordId);
        // Return minimal info so chat can still work
        return { 
          userId: landlordId,
          firstName: 'Landlord',
          lastName: '',
        };
      }
      
      // Extract landlord info based on the union type
      const landlordInfo: LandlordInfo = {
        userId: landlordData.userId,
        firstName: landlordData.firstName,
        lastName: landlordData.lastName,
        email: landlordData.email,
        profileImage: landlordData.profileImage,
      };
      
      // Add business name if it's a Landlord type (not Tenant or Admin)
      if ('businessName' in landlordData && landlordData.businessName) {
        landlordInfo.businessName = landlordData.businessName;
      }
      
      console.log('Resolved landlord info:', landlordInfo);
      return landlordInfo;
      
    } catch (userError) {
      console.warn('Error fetching landlord details, using fallback:', userError);
      // Return minimal info so chat can still work
      return { 
        userId: landlordId,
        firstName: 'Landlord',
        lastName: '',
      };
    }
    
  } catch (error) {
    console.error('Error resolving landlord from property:', error);
    return null;
  }
}

/**
 * Creates a chat URL with proper landlord resolution
 * Handles the case where landlordId is unknown
 */
export function createChatUrl(propertyId: string, landlordId: string | undefined, propertyTitle: string): string {
  const params = new URLSearchParams({
    propertyId,
    landlordId: landlordId || 'unknown',
    propertyTitle
  });
  
  return `/chat?${params.toString()}`;
}

/**
 * Gets a display name for a landlord
 */
export function getLandlordDisplayName(landlord: LandlordInfo): string {
  if (landlord.businessName) {
    return landlord.businessName;
  }
  
  if (landlord.firstName && landlord.lastName) {
    return `${landlord.firstName} ${landlord.lastName}`;
  }
  
  if (landlord.firstName) {
    return landlord.firstName;
  }
  
  return 'Landlord';
}