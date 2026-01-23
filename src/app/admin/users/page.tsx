'use client';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/hooks/useAdmin';
import { Button, Input, Modal } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/Card';
import { UserProfile, UserType, AccountStatus } from '@/API';
import { MagnifyingGlassIcon, EyeIcon, TrashIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { createPortal } from 'react-dom';
import { useRef, useState, useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface UserWithId {
  userId: string;
  profile: UserProfile;
}

interface UserActionsDropdownProps {
  user: UserWithId;
  onStatusChange: (user: UserWithId, status: AccountStatus) => void;
  onRoleChange: (user: UserWithId, role: UserType) => void;
  onDelete: (user: UserWithId) => void;
}

// UserActionsDropdown Component - exactly like AdminPropertyCard actions
const UserActionsDropdown: React.FC<UserActionsDropdownProps> = ({
  user,
  onStatusChange,
  onRoleChange,
  onDelete,
}) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const userActions = [
    { label: 'View Details', value: 'view' },
    { label: 'Set Active', value: AccountStatus.ACTIVE },
    { label: 'Suspend User', value: AccountStatus.SUSPENDED },
    { label: 'Set Pending', value: AccountStatus.PENDING_VERIFICATION },
    { label: 'Set as Tenant', value: `${UserType.TENANT}_role` },
    { label: 'Set as Landlord', value: `${UserType.LANDLORD}_role` },
    { label: 'Set as Agent', value: `${UserType.AGENT}_role` },
    { label: 'Set as Admin', value: `${UserType.ADMIN}_role` },
    { label: 'Delete User', value: 'delete' },
  ];

  return (
    <div
      ref={actionsRef}
      className="relative"
      onClick={(e) => e.stopPropagation()} // prevent card click
    >
      <button
        className="px-3 py-1 border rounded text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
        onClick={() => setIsActionsOpen((prev) => !prev)}
      >
        Actions <ChevronDownIcon className="w-3 h-3" />
      </button>

      {isActionsOpen && portalContainer && createPortal(
        <div
          className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-[1000] flex flex-col"
          style={{
            top: actionsRef.current?.getBoundingClientRect().bottom,
            left: actionsRef.current?.getBoundingClientRect().left,
          }}
        >
          {userActions.map((action) => (
            <button
              key={action.value}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-900 dark:text-gray-100 truncate transition"
              onClick={() => {
                if (action.value === 'view') {
                  window.open(`/admin/users/${user.userId}`, '_blank');
                } else if (action.value === 'delete') {
                  onDelete(user);
                } else if (action.value.endsWith('_role')) {
                  const roleValue = action.value.replace('_role', '') as UserType;
                  onRoleChange(user, roleValue);
                } else {
                  onStatusChange(user, action.value as AccountStatus);
                }
                setIsActionsOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>,
        portalContainer
      )}
    </div>
  );
};

export default function AdminUsersPage() {
  const { listUsers, updateUserStatus, deleteUser, updateUserRole, isLoading } = useAdmin();
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithId[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<UserType | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithId | null>(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState<AccountStatus | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserType | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
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

  const handleRoleChangeClick = (user: UserWithId, newRole: UserType) => {
    setSelectedUser(user);
    setSelectedNewRole(newRole);
    setIsRoleModalOpen(true);
  };

  const handleRoleChangeConfirm = async () => {
    if (!selectedUser || !selectedNewRole) return;

    try {
      const result = await updateUserRole(selectedUser.userId, selectedNewRole);

      if (result.success) {
        // Update local state
        setUsers(prev =>
          prev.map(u => u.userId === selectedUser.userId
            ? { ...u, profile: { ...u.profile, userType: selectedNewRole } }
            : u
          )
        );
        showSuccess('Success', result.message);
        setIsRoleModalOpen(false);
        setSelectedUser(null);
        setSelectedNewRole(null);
      }
    } catch (error: any) {
      // Extract specific GraphQL error message
      const errorMessage = error?.graphQLErrors?.[0]?.message ||  // Apollo Client structure
                          error?.errors?.[0]?.message ||          // Direct GraphQL errors structure
                          error?.networkError?.message ||         // Network errors
                          error?.message ||                        // Generic error
                          'Failed to update user role';           // Fallback

      console.log('Error object:', error); // Debug log
      console.log('Extracted message:', errorMessage); // Debug log

      showError('Error', errorMessage);
    }
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
            <div key={user.userId} className="group cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
              <div className="flex">
                {/* Avatar Container - Fixed width like property cards */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-l-lg flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm">
                    {user.profile.firstName.charAt(0)}{user.profile.lastName.charAt(0)}
                  </div>
                </div>

                {/* Content - Takes remaining space */}
                <div className="flex-1 p-3 sm:p-4 min-h-[6rem] sm:min-h-[8rem] flex flex-col justify-between">
                  <div className="flex-1">
                    {/* User Type Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                        {user.profile.userType}
                      </span>
                      {user.profile.accountStatus && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
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

                    {/* Name */}
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-1 line-clamp-2 leading-tight">
                      {user.profile.firstName} {user.profile.lastName}
                    </h3>

                    {/* Email */}
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                      {user.profile.email}
                    </div>

                    {/* User ID */}
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      ID: {user.userId.slice(0, 8)}...
                    </div>
                  </div>

                  {/* Actions dropdown */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                      {/* Empty space for alignment */}
                    </div>

                    {/* Actions dropdown - exactly like AdminPropertyCard */}
                    <UserActionsDropdown
                      user={user}
                      onStatusChange={handleStatusChangeClick}
                      onRoleChange={handleRoleChangeClick}
                      onDelete={handleDeleteClick}
                    />
                  </div>
                </div>
              </div>
            </div>
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

      {/* Role Change Confirmation Modal */}
      {selectedUser && selectedNewRole && (
        <Modal
          isOpen={isRoleModalOpen}
          onClose={() => {
            setIsRoleModalOpen(false);
            setSelectedUser(null);
            setSelectedNewRole(null);
          }}
          title="Change User Role"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Are you sure you want to change{' '}
              <span className="font-semibold">{selectedUser.profile.firstName} {selectedUser.profile.lastName}</span>'s role
              from <span className="font-semibold">{selectedUser.profile.userType}</span> to{' '}
              <span className="font-semibold">{selectedNewRole}</span>?
            </p>
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRoleModalOpen(false);
                  setSelectedUser(null);
                  setSelectedNewRole(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRoleChangeConfirm}
              >
                Change Role
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
