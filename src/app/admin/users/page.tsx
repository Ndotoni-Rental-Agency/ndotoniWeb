'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateClient } from 'aws-amplify/api';
import { updateUser } from '@/graphql/mutations';
import { UserCard } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { UserProfile, UserType, UpdateUserInput } from '@/API';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Modal } from '@/components/ui';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const client = generateClient();

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateUserInput>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.firstName.toLowerCase().includes(query) ||
            u.lastName.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query) ||
            u.userType.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      //@todo: will be implemented later 
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      setSaving(true);
      //@todo: will be implemented later 
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
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

      {/* Search Bar */}
      <div>
        <Input
          type="text"
          placeholder="Search users by name, email, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="w-5 h-5" />}
        />
      </div>

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={"mockId"}
              user={user}
              onEdit={handleEditUser}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? 'No users found matching your search.'
                : 'No users found. Users will appear here once they register.'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
      >
        <div className="space-y-4">
          <Input
            label="First Name"
            value={editFormData.firstName || ''}
            onChange={(e) =>
              setEditFormData({ ...editFormData, firstName: e.target.value })
            }
          />
          <Input
            label="Last Name"
            value={editFormData.lastName || ''}
            onChange={(e) =>
              setEditFormData({ ...editFormData, lastName: e.target.value })
            }
          />
          <Input
            label="Phone Number"
            value={editFormData.phoneNumber || ''}
            onChange={(e) =>
              setEditFormData({ ...editFormData, phoneNumber: e.target.value })
            }
          />
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveUser} loading={saving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
