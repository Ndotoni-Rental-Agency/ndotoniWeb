'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateClient } from 'aws-amplify/api';
import { StatCard } from '@/components/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import PropertyStatusBadge from '@/components/property/PropertyStatusBadge';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowRightIcon
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('admin.dashboard.welcome').replace('{name}', user?.firstName || '')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('admin.dashboard.totalProperties')}
          value={stats.totalProperties}
          icon={<BuildingOfficeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
        />
        <StatCard
          title={t('admin.dashboard.pendingReview')}
          value={stats.pendingProperties}
          icon={<DocumentTextIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
          trend={
            stats.pendingProperties > 0
              ? { value: 0, isPositive: false }
              : undefined
          }
        />
        <StatCard
          title={t('admin.dashboard.totalUsers')}
          value={stats.totalUsers}
          icon={<UserGroupIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        />
        <StatCard
          title={t('admin.dashboard.applications')}
          value={stats.totalApplications}
          icon={<CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.properties')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('admin.dashboard.manageAndReview')}
            </p>
            <Link href="/admin/properties">
              <Button variant="primary" fullWidth>
                {t('admin.dashboard.manageProperties')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.users')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('admin.dashboard.viewAndEdit')}
            </p>
            <Link href="/admin/users">
              <Button variant="primary" fullWidth>
                {t('admin.dashboard.manageUsers')}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('admin.dashboard.applications')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('admin.dashboard.reviewApplications')}
            </p>
            <Link href="/admin/applications">
              <Button variant="primary" fullWidth>
                {t('admin.dashboard.viewApplications')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('admin.dashboard.propertiesPendingReview')}</CardTitle>
            <Link href="/admin/properties">
              <Button variant="ghost" size="sm">
                {t('admin.dashboard.viewAll')}
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {properties.filter((p) => p.status === PropertyStatus.DRAFT).length > 0 ? (
              <div className="space-y-4">
                {properties
                  .filter((p) => p.status === PropertyStatus.DRAFT)
                  .slice(0, 5)
                  .map((property) => (
                    <div
                      key={property.propertyId}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {property.title}
                            </h3>
                            <PropertyStatusBadge status={property.status} size="sm" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {property.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                            <span>
                              {property.address.ward}, {property.address.district}
                            </span>
                            <span>
                              {new Intl.NumberFormat('en-TZ', {
                                style: 'currency',
                                currency: property.pricing.currency || 'TZS',
                                minimumFractionDigits: 0,
                              }).format(property.pricing.monthlyRent)}/month
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Link href={`/admin/properties`}>
                          <Button variant="outline" size="sm">
                            {t('admin.dashboard.review')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t('admin.dashboard.noPropertiesPending')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t('admin.dashboard.recentProperties')}</CardTitle>
            <Link href="/admin/properties">
              <Button variant="ghost" size="sm">
                {t('admin.dashboard.viewAll')}
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {properties.length > 0 ? (
              <div className="space-y-4">
                {properties
                  .sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                  })
                  .slice(0, 5)
                  .map((property) => (
                    <div
                      key={property.propertyId}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {property.title}
                            </h3>
                            <PropertyStatusBadge status={property.status} size="sm" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {property.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                            <span>
                              {property.address.ward}, {property.address.district}
                            </span>
                            <span>
                              {new Intl.NumberFormat('en-TZ', {
                                style: 'currency',
                                currency: property.pricing.currency || 'TZS',
                                minimumFractionDigits: 0,
                              }).format(property.pricing.monthlyRent)}/month
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <Link href={`/property/${property.propertyId}`}>
                          <Button variant="outline" size="sm">
                            {t('properties.viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t('admin.dashboard.noPropertiesFound')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
