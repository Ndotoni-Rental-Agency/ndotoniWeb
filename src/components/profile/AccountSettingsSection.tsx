'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useCommunicationPreferences } from '@/hooks/useCommunicationPreferences';
import { cn } from '@/lib/utils/common';

interface PreferenceToggleProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function PreferenceToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: PreferenceToggleProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="pr-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <label className={cn('relative inline-flex items-center', disabled ? 'opacity-50' : 'cursor-pointer')}>
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-900 dark:peer-checked:bg-emerald-600" />
      </label>
    </div>
  );
}

export default function AccountSettingsSection() {
  const { t } = useLanguage();
  const { preferences, loading, saving, error, updatePreference } = useCommunicationPreferences();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t('profile.accountSettings')}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {t('notifications.preferencesSubtitle')}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {loading || !preferences ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-4">{t('notifications.loading')}</p>
      ) : (
        <div className="space-y-0">
          <PreferenceToggle
            title={t('profile.emailNotifications')}
            description={t('profile.emailNotificationsDesc')}
            checked={preferences.emailNotifications}
            disabled={saving}
            onChange={(checked) => updatePreference({ emailNotifications: checked })}
          />
          <PreferenceToggle
            title={t('profile.smsNotifications')}
            description={t('profile.smsNotificationsDesc')}
            checked={preferences.smsNotifications}
            disabled={saving}
            onChange={(checked) => updatePreference({ smsNotifications: checked })}
          />
          <PreferenceToggle
            title={t('profile.pushNotifications')}
            description={t('profile.pushNotificationsDesc')}
            checked={preferences.pushNotifications}
            disabled={saving}
            onChange={(checked) => updatePreference({ pushNotifications: checked })}
          />
          <PreferenceToggle
            title={t('profile.marketingCommunications')}
            description={t('profile.marketingCommunicationsDesc')}
            checked={preferences.marketingEmailsOptIn}
            disabled={saving}
            onChange={(checked) => updatePreference({ marketingEmailsOptIn: checked })}
          />
        </div>
      )}
    </div>
  );
}
