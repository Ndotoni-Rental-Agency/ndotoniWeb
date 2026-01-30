'use client';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile } from '@/API';

interface ProfileHeaderProps {
  user: UserProfile | null;
  isEditing: boolean;
  onEditClick: () => void;
}

export default function ProfileHeader({ user, isEditing, onEditClick }: ProfileHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-medium">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {user?.userType}
            </span>
            {user?.occupation && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                {user.occupation}
              </span>
            )}
            {user?.city && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                📍 {user.city}
              </span>
            )}
          </div>
        </div>
        {!isEditing && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEditClick}
          >
            {t('common.edit')}
          </Button>
        )}
      </div>
    </div>
  );
}