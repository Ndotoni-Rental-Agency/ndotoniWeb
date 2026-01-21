import { useState, useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listAllLandlordApplications } from '@/graphql/queries';

// TODO:
// import { approveLandlordApplication, rejectLandlordApplication } from '@/graphql/mutations';

interface LandlordApplication {
  applicationId: string;
  userId: string;
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  rejectionReason?: string;
}

interface UseAdminLandlordApplicationsReturn {
  listApplications: (
    status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  ) => Promise<LandlordApplication[]>;
  approveApplication: (
    applicationId: string
  ) => Promise<{ success: boolean; message: string }>;
  rejectApplication: (
    applicationId: string,
    reason?: string
  ) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  isProcessing: boolean;
}

export function useAdminLandlordApplications(): UseAdminLandlordApplicationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const listApplications = useCallback(
    async (status?: 'PENDING' | 'APPROVED' | 'REJECTED') => {
      try {
        setIsLoading(true);

        const data =
          await GraphQLClient.executeAuthenticated<{
            listAllLandlordApplications: {
              applications: LandlordApplication[];
              nextToken?: string;
            };
          }>(
            listAllLandlordApplications,
            { status, limit: 50 }
          );

        return data.listAllLandlordApplications?.applications ?? [];
      } catch (error) {
        console.error('Error listing landlord applications:', error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const approveApplication = useCallback(
    async (applicationId: string) => {
      try {
        setIsProcessing(true);

        // TODO: uncomment when backend is ready
        // const data =
        //   await GraphQLClient.executeAuthenticated<{
        //     approveLandlordApplication: {
        //       success: boolean;
        //       message: string;
        //     };
        //   }>(
        //     approveLandlordApplication,
        //     { applicationId }
        //   );

        // return data.approveLandlordApplication;

        return {
          success: false,
          message: 'Backend mutation not yet implemented',
        };
      } catch (error: any) {
        console.error('Error approving application:', error);
        return {
          success: false,
          message:
            error?.message ||
            'An error occurred while approving the application',
        };
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const rejectApplication = useCallback(
    async (applicationId: string, reason?: string) => {
      try {
        setIsProcessing(true);

        // TODO: uncomment when backend is ready
        // const data =
        //   await GraphQLClient.executeAuthenticated<{
        //     rejectLandlordApplication: {
        //       success: boolean;
        //       message: string;
        //     };
        //   }>(
        //     rejectLandlordApplication,
        //     { applicationId, rejectionReason: reason }
        //   );

        // return data.rejectLandlordApplication;

        return {
          success: false,
          message: 'Backend mutation not yet implemented',
        };
      } catch (error: any) {
        console.error('Error rejecting application:', error);
        return {
          success: false,
          message:
            error?.message ||
            'An error occurred while rejecting the application',
        };
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  return {
    listApplications,
    approveApplication,
    rejectApplication,
    isLoading,
    isProcessing,
  };
}
