'use client';

import { useState, useCallback } from 'react';
import {
  UserStats,
  PropertyStats,
  ApplicationStats,
  LandlordApplicationStats,
  ContactInquiryStats,
  ContactInquiry,
  Application,
  Property,
  InquiryType,
  ApplicationStatus,
  PropertyStatus,
} from '@/API';
import { useAdmin } from './useAdmin';

export interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  draftProperties: number;
  rentedProperties: number;
  newPropertiesThisWeek: number;
  newPropertiesThisMonth: number;
  totalUsers: number;
  totalTenants: number;
  totalLandlords: number;
  totalAgents: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeUsers: number;
  totalApplications: number;
  submittedApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  underReviewApplications: number;
  pendingLandlordApps: number;
  totalInquiries: number;
  pendingInquiries: number;
  inProgressInquiries: number;
  resolvedInquiries: number;
  inquiryByType: { type: string; count: number }[];
}

export interface ActivityItem {
  id: string;
  type: 'inquiry' | 'application' | 'property' | 'user';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  rawUserStats: UserStats | null;
  rawPropertyStats: PropertyStats | null;
  rawApplicationStats: ApplicationStats | null;
  rawLandlordAppStats: LandlordApplicationStats | null;
  rawInquiryStats: ContactInquiryStats | null;
}

const DEFAULT_STATS: DashboardStats = {
  totalProperties: 0,
  availableProperties: 0,
  draftProperties: 0,
  rentedProperties: 0,
  newPropertiesThisWeek: 0,
  newPropertiesThisMonth: 0,
  totalUsers: 0,
  totalTenants: 0,
  totalLandlords: 0,
  totalAgents: 0,
  newUsersThisWeek: 0,
  newUsersThisMonth: 0,
  activeUsers: 0,
  totalApplications: 0,
  submittedApplications: 0,
  approvedApplications: 0,
  rejectedApplications: 0,
  underReviewApplications: 0,
  pendingLandlordApps: 0,
  totalInquiries: 0,
  pendingInquiries: 0,
  inProgressInquiries: 0,
  resolvedInquiries: 0,
  inquiryByType: [],
};

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildActivityFromInquiries(inquiries: ContactInquiry[]): ActivityItem[] {
  return inquiries.slice(0, 5).map((inq) => ({
    id: `inq-${inq.inquiryId}`,
    type: 'inquiry' as const,
    title: `New inquiry: ${inq.subject}`,
    description: `${inq.name} · ${inq.inquiryType.toLowerCase().replace(/_/g, ' ')}`,
    timestamp: formatTimestamp(inq.createdAt),
    status: inq.status,
  }));
}

function buildActivityFromApplications(applications: Application[]): ActivityItem[] {
  return applications.slice(0, 5).map((app) => {
    const applicantName = app.applicant
      ? `${app.applicant.firstName ?? ''} ${app.applicant.lastName ?? ''}`.trim()
      : 'Unknown';
    const propertyTitle = (app as any).property?.title ?? 'a property';
    return {
      id: `app-${app.applicationId}`,
      type: 'application' as const,
      title: 'Application submitted',
      description: `${applicantName} applied for ${propertyTitle}`,
      timestamp: app.createdAt ? formatTimestamp(app.createdAt) : 'Unknown',
      status: app.status,
    };
  });
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: DEFAULT_STATS,
    recentActivity: [],
    rawUserStats: null,
    rawPropertyStats: null,
    rawApplicationStats: null,
    rawLandlordAppStats: null,
    rawInquiryStats: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    getUserStats,
    getPropertyStats,
    getApplicationStats,
    getLandlordApplicationStats,
    getInquiryStats,
    listInquiries,
    listApplications,
  } = useAdmin();

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [userStats, propertyStats, applicationStats, landlordAppStats, inquiryStats] =
        await Promise.allSettled([
          getUserStats(),
          getPropertyStats(),
          getApplicationStats(),
          getLandlordApplicationStats(),
          getInquiryStats(),
        ]);

      const [recentInquiriesResult, recentApplicationsResult] = await Promise.allSettled([
        listInquiries(undefined, 5),
        listApplications(undefined, 5),
      ]);

      const uStats = userStats.status === 'fulfilled' ? userStats.value : null;
      const pStats = propertyStats.status === 'fulfilled' ? propertyStats.value : null;
      const aStats = applicationStats.status === 'fulfilled' ? applicationStats.value : null;
      const laStats = landlordAppStats.status === 'fulfilled' ? landlordAppStats.value : null;
      const iStats = inquiryStats.status === 'fulfilled' ? inquiryStats.value : null;

      const recentInquiries =
        recentInquiriesResult.status === 'fulfilled'
          ? (recentInquiriesResult.value.items ?? [])
          : [];
      const recentApps =
        recentApplicationsResult.status === 'fulfilled'
          ? (recentApplicationsResult.value.applications ?? [])
          : [];

      const activityFromInquiries = buildActivityFromInquiries(recentInquiries as ContactInquiry[]);
      const activityFromApplications = buildActivityFromApplications(recentApps as Application[]);

      // Interleave and sort activity by recency (most recent first)
      const allActivity = [...activityFromInquiries, ...activityFromApplications]
        .sort((a, b) => {
          const aMin = parseInt(a.timestamp) || 9999;
          const bMin = parseInt(b.timestamp) || 9999;
          return aMin - bMin;
        })
        .slice(0, 8);

      const composedStats: DashboardStats = {
        totalProperties: pStats?.totalProperties ?? 0,
        availableProperties: pStats?.availableProperties ?? 0,
        draftProperties: pStats?.draftProperties ?? 0,
        rentedProperties: pStats?.rentedProperties ?? 0,
        newPropertiesThisWeek: pStats?.newPropertiesThisWeek ?? 0,
        newPropertiesThisMonth: pStats?.newPropertiesThisMonth ?? 0,
        totalUsers: uStats?.totalUsers ?? 0,
        totalTenants: uStats?.totalTenants ?? 0,
        totalLandlords: uStats?.totalLandlords ?? 0,
        totalAgents: uStats?.totalAgents ?? 0,
        newUsersThisWeek: uStats?.newUsersThisWeek ?? 0,
        newUsersThisMonth: uStats?.newUsersThisMonth ?? 0,
        activeUsers: uStats?.activeUsers ?? 0,
        totalApplications: (aStats?.total ?? 0) + (laStats?.total ?? 0),
        submittedApplications: aStats?.submitted ?? 0,
        approvedApplications: aStats?.approved ?? 0,
        rejectedApplications: aStats?.rejected ?? 0,
        underReviewApplications: aStats?.underReview ?? 0,
        pendingLandlordApps: laStats?.pending ?? 0,
        totalInquiries: iStats?.total ?? 0,
        pendingInquiries: iStats?.pending ?? 0,
        inProgressInquiries: iStats?.inProgress ?? 0,
        resolvedInquiries: iStats?.resolved ?? 0,
        inquiryByType: (iStats?.byType ?? []).map((b) => ({
          type: b.type,
          count: b.count,
        })),
      };

      setData({
        stats: composedStats,
        recentActivity: allActivity,
        rawUserStats: uStats,
        rawPropertyStats: pStats,
        rawApplicationStats: aStats,
        rawLandlordAppStats: laStats,
        rawInquiryStats: iStats,
      });
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [getUserStats, getPropertyStats, getApplicationStats, getLandlordApplicationStats, getInquiryStats, listInquiries, listApplications]);

  return { data, isLoading, error, refetch: fetchDashboardData };
}
