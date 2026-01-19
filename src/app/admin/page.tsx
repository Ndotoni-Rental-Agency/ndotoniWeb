'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateClient } from 'aws-amplify/api';
import { 
  QuickStatsGrid, 
  ChartCard, 
  RecentActivityCard,
  SimpleBarChart
} from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserPlusIcon,
  HomeModernIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Property, PropertyStatus } from '@/API';

// Force dynamic rendering for pages using AuthGuard
export const dynamic = 'force-dynamic';

const client = generateClient();

interface DashboardStats {
  totalProperties: number;
  pendingProperties: number;
  totalUsers: number;
  totalApplications: number;
  pendingApplications: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch properties
      //@todo: will be implemented later 
      // Fetch users
      let totalUsers = 0;
      try {
       //@todo: will be implemented later 
     
      } catch (error) {
        console.error('Error fetching users:', error);
      }

      // Fetch applications
      let totalApplications = 0;
      let pendingApplications = 0;
      try {
         //@todo: will be implemented later 
      } catch (error) {
        console.error('Error fetching applications:', error);
      }

       //@todo: will be implemented later 
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts and recent activity
  const monthlyStats = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 48 },
    { label: 'Apr', value: 68 },
    { label: 'May', value: 73 },
    { label: 'Jun', value: 65 },
  ];

  const recentActivities = [
    {
      id: '1',
      title: 'New property listed',
      description: 'Modern apartment in Masaki',
      timestamp: '2 hours ago',
      icon: <BuildingOfficeIcon className="w-5 h-5 text-red-600" />,
      badge: {
        text: 'New',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      },
    },
    {
      id: '2',
      title: 'Application submitted',
      description: 'John Doe applied for Mikocheni Villa',
      timestamp: '4 hours ago',
      icon: <DocumentTextIcon className="w-5 h-5 text-blue-600" />,
      badge: {
        text: 'Pending',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      },
    },
    {
      id: '3',
      title: 'New user registered',
      description: 'Sarah Wilson joined as a tenant',
      timestamp: '6 hours ago',
      icon: <UserPlusIcon className="w-5 h-5 text-green-600" />,
    },
    {
      id: '4',
      title: 'Property approved',
      description: 'Luxury villa in Oyster Bay approved',
      timestamp: '1 day ago',
      icon: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
    },
  ];

  const quickStats = [
    {
      title: t('admin.dashboard.totalProperties'),
      value: stats.totalProperties,
      icon: <BuildingOfficeIcon className="w-5 h-5 text-red-600 dark:text-red-400" />,
      trend: { value: 12.5, isPositive: true },
      color: 'border-l-4 border-red-500',
    },
    {
      title: t('admin.dashboard.totalUsers'),
      value: stats.totalUsers,
      icon: <UserGroupIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      trend: { value: 8.2, isPositive: true },
      color: 'border-l-4 border-blue-500',
    },
    {
      title: t('admin.dashboard.applications'),
      value: stats.totalApplications,
      icon: <DocumentTextIcon className="w-5 h-5 text-green-600 dark:text-green-400" />,
      trend: { value: 4.3, isPositive: false },
      color: 'border-l-4 border-green-500',
    },
    {
      title: t('admin.dashboard.pendingReview'),
      value: stats.pendingProperties,
      icon: <ClockIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
      description: 'Requires attention',
      color: 'border-l-4 border-yellow-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Quick Stats Grid */}
        <QuickStatsGrid stats={quickStats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties Chart */}
        <ChartCard
          title="Properties Overview"
          value={stats.totalProperties}
          change={{ value: 12.5, label: 'vs last month' }}
          icon={<ArrowTrendingUpIcon className="w-5 h-5 text-red-600" />}
          chart={<SimpleBarChart data={monthlyStats} height={180} />}
        />

        {/* Applications Chart */}
        <ChartCard
          title="Monthly Applications"
          value={stats.totalApplications}
          change={{ value: -4.3, label: 'vs last month' }}
          icon={<DocumentTextIcon className="w-5 h-5 text-blue-600" />}
          chart={
            <SimpleBarChart
              data={monthlyStats.map((d) => ({ ...d, color: 'bg-blue-500' }))}
              height={180}
            />
          }
        />
      </div>

      {/* Activity and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentActivityCard
            title="Recent Activity"
            items={recentActivities}
            viewAllHref="/admin/activity"
            emptyMessage="No recent activity to display"
          />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="mb-4">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Link href="/admin/properties">
              <Button variant="outline" fullWidth className="justify-start">
                <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                {t('admin.dashboard.manageProperties')}
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" fullWidth className="justify-start">
                <UserGroupIcon className="w-5 h-5 mr-2" />
                {t('admin.dashboard.manageUsers')}
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button variant="outline" fullWidth className="justify-start">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                {t('admin.dashboard.viewApplications')}
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="primary" fullWidth className="justify-start">
                <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
