'use client';

import { Button } from '@/components/ui/Button';

export default function DangerZoneCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-6">
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
        Danger Zone
      </h2>
      <div className="space-y-3">
        <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
          Deactivate Account
        </Button>
        <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20">
          Delete Account
        </Button>
      </div>
    </div>
  );
}