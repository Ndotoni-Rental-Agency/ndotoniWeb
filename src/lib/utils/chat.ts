import { cachedGraphQL } from '@/lib/cache';
import { getProperty } from '@/graphql/queries';
import { PropertyUser } from '@/API';

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
 * Uses the landlord info embedded in the property details
 */
export async function resolveLandlordFromProperty(propertyId: string): Promise<LandlordInfo | null> {
  try {
    console.log('Resolving landlord for property:', propertyId);
    
    // Get the property which includes landlord information
    const propertyResponse = await cachedGraphQL.query({
      query: getProperty,
      variables: { propertyId }
    });
    
    const propertyData = propertyResponse.data?.getProperty;
    if (!propertyData?.landlordId) {
      console.error('Property not found or missing landlordId:', propertyId);
      return null;
    }
    
    console.log('Found property with landlord info:', {
      landlordId: propertyData.landlordId,
      landlord: propertyData.landlord
    });
    
    // Use the landlord info from the property if available
    const landlordInfo: LandlordInfo = {
      userId: propertyData.landlordId,
      firstName: propertyData.landlord?.firstName || 'Landlord',
      lastName: propertyData.landlord?.lastName || '',
    };
    
    console.log('Resolved landlord info:', landlordInfo);
    return landlordInfo;
    
  } catch (error) {
    console.error('Error resolving landlord from property:', error);
    return null;
  }
}

/**
 * Creates a chat URL with proper landlord resolution
 * Handles the case where landlordId is unknown
 */
export function createChatUrl(
  propertyId: string, 
  landlordId: string, 
  propertyTitle: string,
  landlord: PropertyUser
): string {
  const params = new URLSearchParams({
    propertyId,
    landlordId,
    landLordFirstName: landlord.firstName,
    landLordLastName: landlord.lastName,
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