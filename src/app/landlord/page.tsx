'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  occupiedProperties: number;
  totalRevenue: number;
  pendingApplications: number;
}

export default function LandlordDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    occupiedProperties: 0,
    totalRevenue: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Dashboard data fetching to be implemented with actual GraphQL queries
      // For now, show empty state until real data is available
      setStats({
        totalProperties: 0,
        availableProperties: 0,
        occupiedProperties: 0,
        totalRevenue: 0,
        pendingApplications: 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };



  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white transition-colors">Welcome back, John</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">Here's what's happening with your properties today.</p>
      </div>

      {/* Stats Cards - Airbnb Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Total listings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 transition-colors">{stats.totalProperties}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1 transition-colors">+2 this month</p>
            </div>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-red-500 dark:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Available</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 transition-colors">{stats.availableProperties}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Ready to book</p>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-green-500 dark:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Occupied</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 transition-colors">{stats.occupiedProperties}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">Currently rented</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-blue-500 dark:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">This month</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 transition-colors">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1 transition-colors">+12% from last month</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-purple-500 dark:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/landlord/properties/create"
            className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/30 transition-colors">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 dark:text-white transition-colors">Create listing</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Add a new property</p>
            </div>
          </Link>
          
          <Link
            href="/landlord/properties"
            className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 dark:text-white transition-colors">Manage listings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Edit your properties</p>
            </div>
          </Link>
          
          <Link
            href="/landlord/media"
            className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/30 transition-colors">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900 dark:text-white transition-colors">Photo library</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Manage your photos</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors">Recent activity</h2>
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mb-2 transition-colors">No recent activity</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors">
            Activity will appear here once you start managing properties
          </p>
        </div>
      </div>
    </div>
  );
}