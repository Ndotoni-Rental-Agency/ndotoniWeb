'use client';

import { getProfileCompletion, getMissingProfileFields } from '@/lib/utils/profile';

interface ProfileCompletionCardProps {
  user: any;
}

export default function ProfileCompletionCard({ user }: ProfileCompletionCardProps) {
  const completionPercentage = getProfileCompletion(user);
  const missingFields = getMissingProfileFields(user);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Profile Completion
      </h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        {missingFields.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Complete your profile to improve your rental applications:
            </p>
            <div className="flex flex-wrap gap-1">
              {missingFields.slice(0, 3).map((field, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                >
                  {field}
                </span>
              ))}
              {missingFields.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                  +{missingFields.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}