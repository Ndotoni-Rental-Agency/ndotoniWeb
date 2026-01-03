'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ProfileForm, AccountSettings, ProfileAvatar, AuthGuard } from '@/components/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

  const tabs = [
    { id: 'profile' as const, name: 'Profile Information', icon: '👤' },
    { id: 'account' as const, name: 'Account Settings', icon: '⚙️' },
  ];

  return (
    <AuthGuard>
      {user && (
        <div className="bg-gray-50 dark:bg-gray-900 py-8 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <ProfileAvatar user={user} size="lg" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.userType === 'LANDLORD' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                      user.userType === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}>
                      {user.userType}
                    </span>
                    {user.isEmailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                        ⚠ Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600 dark:text-red-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm user={user} />
                  </CardContent>
                </Card>
              )}

              {activeTab === 'account' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AccountSettings user={user} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
}