import { useState, useCallback } from 'react';
import { deleteProperty, updatePropertyStatus } from '@/graphql/mutations';
import { Property, PropertyStatus } from '@/API';
import { cachedGraphQL } from '@/lib/cache';

interface UseAdminPropertiesReturn {
  deletePropertyById: (propertyId: string) => Promise<{ success: boolean; message: string }>;
  changePropertyStatus: (propertyId: string, status: PropertyStatus) => Promise<{ success: boolean; message: string; property?: Property }>;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
}

export function useAdminProperties(): UseAdminPropertiesReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const deletePropertyById = useCallback(async (propertyId: string) => {
    try {
      setIsDeleting(true);
      const response = await cachedGraphQL.mutate({
        query: deleteProperty,
        variables: { propertyId },
      });

      const result = response.data?.deleteProperty;
      
      if (result?.success) {
        return {
          success: true,
          message: result.message || 'Property deleted successfully',
        };
      } else {
        return {
          success: false,
          message: result?.message || 'Failed to delete property',
        };
      }
    } catch (error: any) {
      console.error('Error deleting property:', error);
      return {
        success: false,
        message: error?.message || 'An error occurred while deleting the property',
      };
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const changePropertyStatus = useCallback(async (
    propertyId: string,
    status: PropertyStatus
  ) => {
    try {
      setIsUpdatingStatus(true);
      const response = await cachedGraphQL.mutate({
        query: updatePropertyStatus,
        variables: { propertyId, status },
      });

      const result = response.data?.updatePropertyStatus;
      
      if (result) {
        return {
          success: true,
          message: 'Property status updated successfully',
          property: result as Property,
        };
      } else {
        return {
          success: false,
          message: 'Failed to update property status',
        };
      }
    } catch (error: any) {
      console.error('Error updating property status:', error);
      return {
        success: false,
        message: error?.message || 'An error occurred while updating the property status',
      };
    } finally {
      setIsUpdatingStatus(false);
    }
  }, []);

  return {
    deletePropertyById,
    changePropertyStatus,
    isDeleting,
    isUpdatingStatus,
  };
}
