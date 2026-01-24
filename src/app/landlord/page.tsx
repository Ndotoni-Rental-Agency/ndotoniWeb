'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { cachedGraphQL } from '@/lib/cache';
import { Property } from '@/API';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

interface DashboardStats {
  totalProperties: number;
  availableProperties: number;
  occupiedProperties: number;
  totalRevenue: number;
  pendingApplications: number;
}

interface RecentProperty {
  propertyId: string;
  title: string;
  status: string;
  monthlyRent: number;
  currency: string;
  thumbnail?: string;
  createdAt: string;
}

export default function LandlordDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    availableProperties: 0,
    occupiedProperties: 0,
    totalRevenue: 0,
    pendingApplications: 0,
  });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {

    try {
      setLoading(true);
      setError(null);

      // Fetch landlord's properties
      const response = await cachedGraphQL.fetchLandlordProperties({
        landlordId: "",
        limit: 10 // Get recent properties for dashboard
      });

      console.log("prop ", response);

      const properties = response.properties;
        
      if (properties.length > 0) {
        // Calculate stats from properties
        const totalProperties = properties.length;
        const availableProperties = properties.filter((p: Property) => p.status === 'AVAILABLE').length;
        const occupiedProperties = properties.filter((p: Property) => p.status === 'RENTED').length;
        
        // Calculate estimated revenue (this would come from actual booking data in production)
        const totalRevenue = properties
          .filter((p: Property) => p.status === 'RENTED')
          .reduce((sum: number, p: Property) => sum + (p.pricing?.monthlyRent || 0), 0);

        setStats({
          totalProperties,
          availableProperties,
          occupiedProperties,
          totalRevenue,
          pendingApplications: 0, // This would come from applications API
        });

        // Set recent properties (last 3)
        const recent = properties.slice(0, 3).map((property: Property) => ({
          propertyId: property.propertyId,
          title: property.title,
          status: property.status || 'DRAFT',
          monthlyRent: property.pricing?.monthlyRent || 0,
          currency: property.pricing?.currency || 'TZS',
          thumbnail: property.media?.images?.[0],
          createdAt: property.createdAt || new Date().toISOString(),
        }));
        
        setRecentProperties(recent);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'RENTED':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'MAINTENANCE':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'DRAFT':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error loading dashboard
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchDashboardData}
                  className="bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white transition-colors">
          Welcome back, {user?.firstName || 'Landlord'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => router.push('/landlord/quick-draft')}
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
          </button>
          
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

      {/* Stats Cards - Airbnb Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Total listings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1 transition-colors">{stats.totalProperties}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {stats.totalProperties > 0 ? 'Active portfolio' : 'Start adding properties'}
              </p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {stats.occupiedProperties > 0 ? `From ${stats.occupiedProperties} rented properties` : 'No active rentals'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-purple-500 dark:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors">Recent properties</h2>
          <Link 
            href="/landlord/properties"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            View all
          </Link>
        </div>
        
        {recentProperties.length > 0 ? (
          <div className="space-y-4">
            {recentProperties.map((property) => (
              <Link 
                key={property.propertyId}
                href={`/landlord/properties/${property.propertyId}/edit`}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {property.thumbnail ? (
                      <img 
                        src={property.thumbnail} 
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0h-4m-2 0H3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white transition-colors">{property.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                      {formatCurrency(property.monthlyRent)} / month
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status.toLowerCase()}
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0h-4m-2 0H3" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-2 transition-colors">No properties yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors">Create your first property listing to get started</p>
            <Link 
              href="/landlord/properties/create"
              className="inline-flex items-center mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Create Property
            </Link>
          </div>
        )}
      </div>
      {/* Quick-draft is now a standalone page at /landlord/quick-draft */}
    </div>
  );
}