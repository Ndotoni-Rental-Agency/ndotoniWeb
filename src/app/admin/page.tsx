'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import {
  DashboardActivityFeed,
  PropertyStatusChart,
  ApplicationStatusChart,
  InquiryStatsChart,
  UserBreakdownChart,
} from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

// Force dynamic rendering for pages using AuthGuard
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { data, isLoading, error, refetch } = useDashboardData();
  const { stats, recentActivity } = data;

  useEffect(() => {
    refetch();
  }, []);

  const quickActions = [
    {
      href: '/admin/properties',
      icon: BuildingOfficeIcon,
      label: t('admin.dashboard.manageProperties'),
    },
    {
      href: '/admin/users',
      icon: UserGroupIcon,
      label: t('admin.dashboard.manageUsers'),
    },
    {
      href: '/admin/applications',
      icon: DocumentTextIcon,
      label: t('admin.dashboard.viewApplications'),
    },
    {
      href: '/admin/landlord-applications',
      icon: UserPlusIcon,
      label: 'Landlord Applications',
      badge: stats.pendingLandlordApps > 0 ? stats.pendingLandlordApps : undefined,
      badgeColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    },
    {
      href: '/admin/inquiries',
      icon: EnvelopeIcon,
      label: 'Contact Inquiries',
      badge: stats.pendingInquiries > 0 ? stats.pendingInquiries : undefined,
      badgeColor: 'bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400',
    },
    {
      href: '/admin/whatsapp-conversations',
      icon: ChatBubbleLeftRightIcon,
      label: 'WhatsApp Inbox',
    },
  ];

  if (isLoading && stats.totalUsers === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error} —{' '}
          <button onClick={refetch} className="underline font-medium">
            Retry
          </button>
        </div>
      )}

      {/* Charts — 2×2 equal-height grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
        <PropertyStatusChart stats={stats} />
        <UserBreakdownChart stats={stats} />
        <ApplicationStatusChart stats={stats} />
        <InquiryStatsChart stats={stats} />
      </div>

      {/* Recent Activity — full width */}
      <DashboardActivityFeed
        items={recentActivity}
        isLoading={isLoading}
        onRefresh={refetch}
      />

      {/* Quick Actions — full width */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map(({ href, icon: Icon, label, badge, badgeColor }) => (
              <Link key={href} href={href}>
                <button className="w-full flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-center group">
                  <div className="relative">
                    <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
                    {badge !== undefined && (
                      <span
                        className={`absolute -top-1.5 -right-2 text-xs font-bold px-1 rounded-full ${badgeColor}`}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-tight">
                    {label}
                  </span>
                </button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
