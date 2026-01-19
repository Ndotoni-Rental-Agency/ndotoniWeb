'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GraphQLClient } from '@/lib/graphql-client';
// TODO: we will uncomment this later and use:
// import { listUsers } from '@/graphql/queries';
import { UserCard } from '@/components/admin';
import { Button, Input, Modal } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/Card';
import { UserProfile, UserType, AccountStatus } from '@/API';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<AccountStatus | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const { updateUserStatus, isUpdating } = useAdminUsers();
  const { notification, showSuccess, showError, closeNotification } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.firstName.toLowerCase().includes(query) ||
          u.lastName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.userType.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((u) => u.accountStatus === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, statusFilter, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // TODO: we will uncomment this later and use:
      // const data = await GraphQLClient.executeAuthenticated<{ listUsers: { users: UserProfile[] } }>(
      //   listUsers,
      //   { limit: 1000 }
      // );
      // const usersData = data.listUsers?.users || [];
      
      // Placeholder: listUsers query is not yet available in queries.ts
      const usersData: UserProfile[] = [];
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Error', 'Failed to load users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChangeClick = (user: UserProfile, newStatus: AccountStatus) => {
    setSelectedUser(user);
    setSelectedNewStatus(newStatus);
    setIsStatusModalOpen(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (!selectedUser || !selectedNewStatus) return;

    // Use email as identifier since UserProfile doesn't have userId
    const result = await updateUserStatus(selectedUser.email, selectedNewStatus);
    
    if (result.success && result.user) {
      setUsers(prev => 
        prev.map(u => (u.email === selectedUser.email ? result.user! : u))
      );
      setFilteredUsers(prev => 
        prev.map(u => (u.email === selectedUser.email ? result.user! : u))
      );
      showSuccess('Success', result.message);
      setIsStatusModalOpen(false);
      setSelectedUser(null);
      setSelectedNewStatus(null);
    } else {
      showError('Error', result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search users by name, email, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AccountStatus | 'all')}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value={AccountStatus.ACTIVE}>Active</option>
          <option value={AccountStatus.SUSPENDED}>Suspended</option>
          <option value={AccountStatus.PENDING_VERIFICATION}>Pending Verification</option>
          <option value={AccountStatus.PENDING_LANDLORD_VERIFICATION}>Pending Landlord Verification</option>
        </select>
      </div>

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.email} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {user.email}
                      </p>
                      {user.phoneNumber && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                          📞 {user.phoneNumber}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          {user.userType}
                        </span>
                        {user.accountStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.accountStatus === AccountStatus.ACTIVE
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : user.accountStatus === AccountStatus.SUSPENDED
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          }`}>
                            {user.accountStatus.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <select
                      value={user.accountStatus || AccountStatus.ACTIVE}
                      onChange={(e) => {
                        const newStatus = e.target.value as AccountStatus;
                        if (newStatus !== user.accountStatus) {
                          handleStatusChangeClick(user, newStatus);
                        }
                      }}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      disabled={isUpdating}
                    >
                      <option value={AccountStatus.ACTIVE}>Active</option>
                      <option value={AccountStatus.SUSPENDED}>Suspended</option>
                      <option value={AccountStatus.PENDING_VERIFICATION}>Pending Verification</option>
                      <option value={AccountStatus.PENDING_LANDLORD_VERIFICATION}>Pending Landlord Verification</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all'
                ? 'No users found matching your filters.'
                : 'No users found. Users will appear here once they register.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Change Confirmation Modal */}
      {selectedUser && selectedNewStatus && (
        <Modal
          isOpen={isStatusModalOpen}
          onClose={() => {
            setIsStatusModalOpen(false);
            setSelectedUser(null);
            setSelectedNewStatus(null);
          }}
          title="Change User Status"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to change the status of{' '}
              <span className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</span> to{' '}
              <span className="font-semibold">{selectedNewStatus.replace(/_/g, ' ')}</span>?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setIsStatusModalOpen(false);
                  setSelectedUser(null);
                  setSelectedNewStatus(null);
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStatusChangeConfirm}
                loading={isUpdating}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
