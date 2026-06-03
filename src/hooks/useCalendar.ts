'use client';
import { useState, useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import {
  getTeamAvailability,
  getMyBusyBlocks,
  listAllUsers,
} from '@/graphql/queries';
import {
  addBusyBlock as addBusyBlockMutation,
  removeBusyBlock as removeBusyBlockMutation,
  scheduleMeeting as scheduleMeetingMutation,
  deleteTeamMeeting as deleteTeamMeetingMutation,
} from '@/graphql/mutations';
import { UserType } from '@/API';

// Types matching what the backend returns
export interface ApiBusyBlock {
  id: string;
  userId: string;
  startUtc: string;
  endUtc: string;
  title?: string | null;
  recurrence?: { type: string; days?: number[] | null; endDate: string } | null;
  createdAt: string;
}

export interface ApiMeeting {
  id: string;
  title: string;
  description?: string | null;
  link?: string | null;
  startUtc: string;
  endUtc: string;
  attendeeIds: string[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  email?: string;
  role?: string;
}

export function useCalendar() {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all admin team members
  const fetchTeamMembers = useCallback(async (): Promise<TeamMember[]> => {
    try {
      const data = await GraphQLClient.executeAuthenticated<any>(listAllUsers, { userType: UserType.ADMIN, limit: 100 });
      const users = data?.listAllUsers?.users ?? [];
      return users.map((u: any) => ({
        userId: u.userId,
        name: `${u.profile?.firstName ?? ''} ${u.profile?.lastName ?? ''}`.trim() || u.userId,
        email: u.profile?.email,
        role: u.profile?.userType,
      }));
    } catch (err) {
      console.error('Failed to fetch team members', err);
      return [];
    }
  }, []);

  // Fetch team availability for a date range
  const fetchTeamAvailability = useCallback(async (startDate: string, endDate: string): Promise<{ busyBlocks: ApiBusyBlock[]; meetings: ApiMeeting[] }> => {
    try {
      setIsLoading(true);
      const data = await GraphQLClient.executeAuthenticated<any>(getTeamAvailability, { startDate, endDate });
      return {
        busyBlocks: data?.getTeamAvailability?.busyBlocks ?? [],
        meetings: data?.getTeamAvailability?.meetings ?? [],
      };
    } catch (err: any) {
      // Gracefully handle when backend isn't deployed yet
      const msg = err?.errors?.[0]?.message ?? err?.message ?? '';
      if (!msg.includes('Cannot return null')) {
        console.error('Failed to fetch team availability', err);
      }
      return { busyBlocks: [], meetings: [] };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch my busy blocks
  const fetchMyBusyBlocks = useCallback(async (): Promise<ApiBusyBlock[]> => {
    try {
      const data = await GraphQLClient.executeAuthenticated<any>(getMyBusyBlocks);
      return data?.getMyBusyBlocks ?? [];
    } catch (err) {
      console.error('Failed to fetch my busy blocks', err);
      return [];
    }
  }, []);

  // Add a busy block
  const addBlock = useCallback(async (input: { startUtc: string; endUtc: string; title?: string; recurrence?: { type: string; days?: number[]; endDate: string } }): Promise<ApiBusyBlock | null> => {
    try {
      const data = await GraphQLClient.executeAuthenticated<any>(addBusyBlockMutation, input);
      return data?.addBusyBlock ?? null;
    } catch (err) {
      console.error('Failed to add busy block', err);
      return null;
    }
  }, []);

  // Remove a busy block
  const removeBlock = useCallback(async (blockId: string, blockStartUtc: string): Promise<boolean> => {
    try {
      await GraphQLClient.executeAuthenticated<any>(removeBusyBlockMutation, { blockId, blockStartUtc });
      return true;
    } catch (err) {
      console.error('Failed to remove busy block', err);
      return false;
    }
  }, []);

  // Schedule a meeting
  const createMeeting = useCallback(async (input: { title: string; description?: string; link?: string; startUtc: string; endUtc: string; attendeeIds: string[] }): Promise<ApiMeeting | null> => {
    try {
      const data = await GraphQLClient.executeAuthenticated<any>(scheduleMeetingMutation, input);
      return data?.scheduleMeeting ?? null;
    } catch (err) {
      console.error('Failed to schedule meeting', err);
      return null;
    }
  }, []);

  // Delete a meeting
  const deleteMeeting = useCallback(async (meetingId: string): Promise<boolean> => {
    try {
      await GraphQLClient.executeAuthenticated<any>(deleteTeamMeetingMutation, { meetingId });
      return true;
    } catch (err) {
      console.error('Failed to delete meeting', err);
      return false;
    }
  }, []);

  return {
    isLoading,
    fetchTeamMembers,
    fetchTeamAvailability,
    fetchMyBusyBlocks,
    addBlock,
    removeBlock,
    createMeeting,
    deleteMeeting,
  };
}
