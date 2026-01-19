import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProfileAvatar } from '@/components/auth';
import { UserProfile, UserType } from '@/API';
import { cn } from '@/lib/utils/common';

interface UserCardProps {
  user: UserProfile;
  onEdit?: (user: UserProfile) => void;
  className?: string;
}

export function UserCard({ user, onEdit, className }: UserCardProps) {
  const getUserTypeColor = (userType: UserType) => {
    switch (userType) {
      case UserType.ADMIN:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case UserType.LANDLORD:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case UserType.TENANT:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getAccountStatusColor = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'PENDING_VERIFICATION':
      case 'PENDING_LANDLORD_VERIFICATION':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <ProfileAvatar user={user} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {user.email}
              </p>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getUserTypeColor(user.userType)
                  )}
                >
                  {user.userType}
                </span>
                {user.accountStatus && (
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getAccountStatusColor(user.accountStatus)
                    )}
                  >
                    {user.accountStatus.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
              {user.phoneNumber && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  📞 {user.phoneNumber}
                </p>
              )}
            </div>
          </div>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(user)}
              className="ml-4"
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
