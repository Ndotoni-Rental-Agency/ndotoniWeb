'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Button, Input, Modal } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/Card';
import { UserProfile, UserType, AccountStatus } from '@/API';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface UserWithId {
  userId: string;
  profile: UserProfile;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { listUsers, updateUserStatus, deleteUser, updateUserRole, isLoading } = useAdmin();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithId[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithId | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<AccountStatus | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
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
          u.profile.firstName.toLowerCase().includes(query) ||
          u.profile.lastName.toLowerCase().includes(query) ||
          u.profile.email.toLowerCase().includes(query) ||
          u.userId.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((u) => u.profile.accountStatus === statusFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter((u) => u.profile.userType === typeFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, statusFilter, typeFilter, users]);

  const fetchUsers = async () => {
    try {
      const response = await listUsers(undefined, 1000);
      setUsers(response.users);
      setFilteredUsers(response.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Error', 'Failed to load users. Please try again.');
      setUsers([]);
      setFilteredUsers([]);
    }
  };

  const handleStatusChangeClick = (user: UserWithId, newStatus: AccountStatus) => {
    setSelectedUser(user);
    setSelectedNewStatus(newStatus);
    setIsStatusModalOpen(true);
  };

  const handleStatusChangeConfirm = async () => {
    if (!selectedUser || !selectedNewStatus) return;

    try {
      const result = await updateUserStatus(selectedUser.userId, selectedNewStatus);
      
      if (result.success) {
        // Update local state
        setUsers(prev => 
          prev.map(u => u.userId === selectedUser.userId 
            ? { ...u, profile: { ...u.profile, accountStatus: selectedNewStatus } }
            : u
          )
        );
        showSuccess('Success', result.message);
        setIsStatusModalOpen(false);
        setSelectedUser(null);
        setSelectedNewStatus(null);
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Failed to update user status');
    }
  };

  const handleDeleteClick = (user: UserWithId) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const result = await deleteUser(selectedUser.userId);
      
      if (result.success) {
        // Remove from local state
        setUsers(prev => prev.filter(u => u.userId !== selectedUser.userId));
        showSuccess('Success', result.message);
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      showError('Error', error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  if (isLoading) {
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
            placeholder="Search users by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as UserType | 'all')}
          className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="all">All Types</option>
          <option value={UserType.TENANT}>Tenant</option>
          <option value={UserType.LANDLORD}>Landlord</option>
          <option value={UserType.AGENT}>Agent</option>
          <option value={UserType.ADMIN}>Admin</option>
        </select>
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
            <Card key={user.userId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {user.profile.firstName.charAt(0)}{user.profile.lastName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.profile.firstName} {user.profile.lastName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {user.profile.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                        ID: {user.userId}
                      </p>
                      {user.profile.phoneNumber && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                          📞 {user.profile.phoneNumber}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                          {user.profile.userType}
                        </span>
                        {user.profile.accountStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.profile.accountStatus === AccountStatus.ACTIVE
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                              : user.profile.accountStatus === AccountStatus.SUSPENDED
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          }`}>
                            {user.profile.accountStatus.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex gap-2">
                    <select
                      value={user.profile.accountStatus || AccountStatus.ACTIVE}
                      onChange={(e) => {
                        const newStatus = e.target.value as AccountStatus;
                        if (newStatus !== user.profile.accountStatus) {
                          handleStatusChangeClick(user, newStatus);
                        }
                      }}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value={AccountStatus.ACTIVE}>Active</option>
                      <option value={AccountStatus.SUSPENDED}>Suspended</option>
                      <option value={AccountStatus.PENDING_VERIFICATION}>Pending Verification</option>
                      <option value={AccountStatus.PENDING_LANDLORD_VERIFICATION}>Pending Landlord Verification</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
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
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No users found matching your filters.'
                : 'No users found. Users will appear here once they register.'}
            </p>
            {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
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
              <span className="font-semibold">{selectedUser.profile.firstName} {selectedUser.profile.lastName}</span> to{' '}
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
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStatusChangeConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {selectedUser && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          }}
          title="Delete User"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{selectedUser.profile.firstName} {selectedUser.profile.lastName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
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
