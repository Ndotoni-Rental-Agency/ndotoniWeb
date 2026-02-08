'use client';

import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DangerZoneCard() {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-emerald-800 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-emerald-400 mb-4">
        {t('profile.dangerZone')}
      </h2>
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start text-gray-900 border-gray-200 hover:bg-gray-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20">
          {t('profile.deactivateAccount')}
        </Button>
        <Button variant="outline" className="w-full justify-start text-gray-900 border-gray-200 hover:bg-gray-50 dark:text-emerald-400 dark:border-emerald-800 dark:hover:bg-emerald-900/20">
          {t('profile.deleteAccount')}
        </Button>
      </div>
    </div>
  );
}