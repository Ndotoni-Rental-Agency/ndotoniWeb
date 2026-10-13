'use client';

import { KangaBand } from '@/components/ui/KangaBand';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile } from '@/API';

interface ProfileHeaderProps {
  user: UserProfile | null;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-cream-100 dark:bg-gray-800 rounded-3xl border border-stone-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-brand-900 dark:bg-brand-800 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-medium">
            {(user?.firstName ?? '?').charAt(0)}
            {(user?.lastName ?? '').charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-poster text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 break-all">
            {user?.email}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
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
                <MapPin className="w-4 h-4 inline" /> {user.city}
              </span>
            )}
          </div>
        </div>
      </div>
      <KangaBand variant="thin" className="mt-6 w-24" />
    </div>
  );
}
