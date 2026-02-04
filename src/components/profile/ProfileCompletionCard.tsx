'use client';

import { getProfileCompletion, getMissingProfileFields } from '@/lib/utils/profile';
import { UserProfile } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileCompletionCardProps {
  user: UserProfile | null;
}

export default function ProfileCompletionCard({ user }: ProfileCompletionCardProps) {
  const { t } = useLanguage();
  const completionPercentage = getProfileCompletion(user);
  const missingFieldKeys = getMissingProfileFields(user);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('profile.profileCompletion')}
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t('profile.progress')}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-200 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        {missingFieldKeys.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('profile.completeProfileHint')}
            </p>
            <div className="flex flex-wrap gap-1">
              {missingFieldKeys.slice(0, 3).map((key, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                >
                  {t(key)}
                </span>
              ))}
              {missingFieldKeys.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  {t('profile.andMorePrefix')}{missingFieldKeys.length - 3}{t('profile.andXMore')}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}