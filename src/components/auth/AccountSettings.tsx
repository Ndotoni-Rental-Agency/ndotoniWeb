'use client';

import { useState } from 'react';
import { useAuth, UpdateUserInput } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserProfile as User } from '@/API';
import { Button } from '@/components/ui/Button';

interface AccountSettingsProps {
  user: User;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
];

const currencies = [
  { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
  { code: 'TZS', name: 'Tanzanian Shilling (TSh)', symbol: 'TSh' },
];

export function AccountSettings({ user }: AccountSettingsProps) {
  const { updateUser, signOut } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [preferences, setPreferences] = useState({
    language: user.language,
    currency: user.currency,
  });

  const handlePreferenceChange = (field: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    // Clear messages when user makes changes
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateInput: UpdateUserInput = {
        language: preferences.language ?? undefined,
        currency: preferences.currency ?? undefined,
      };

      await updateUser(updateInput);
      setSuccess(t('profile.preferencesUpdated'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.preferencesUpdateError'));
    } finally {
      setLoading(false);
    }
  };

  const hasPreferenceChanges = 
    preferences.language !== user.language ||
    preferences.currency !== user.currency;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Language & Currency Preferences */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('profile.languageAndCurrency')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.language')}
            </label>
            <select
              value={preferences.language ?? ''}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('profile.currency')}
            </label>
            <select
              value={preferences.currency ?? ''}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          {hasPreferenceChanges && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleSavePreferences}
                loading={loading}
                size="sm"
              >
                {loading ? t('profile.saving') : t('profile.savePreferences')}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('profile.accountInformation')}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.accountType')}
              </label>
              <p className="text-sm text-gray-900 dark:text-white capitalize">
                {t(`userType.${user.userType.toLowerCase()}`)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.accountStatus')}
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.accountStatus === 'ACTIVE' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                user.accountStatus === 'SUSPENDED' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }`}>
                {user.accountStatus ? t(`accountStatus.${user.accountStatus.toLowerCase()}`) : user.accountStatus}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.memberSince')}
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('profile.lastUpdated')}
              </label>
              <p className="text-sm text-gray-900 dark:text-white">
                {user.updatedAt ? formatDate(user.updatedAt) : t('profile.never')}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('profile.userId')}
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
              {user.userId}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">{t('profile.dangerZone')}</h3>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('profile.signOut')}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('profile.signOutDescription')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {t('profile.signOut')}
            </Button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('profile.deleteAccount')}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('profile.deleteAccountDescription')}
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed"
              >
                {t('profile.deleteAccount')}
              </Button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {t('profile.deleteAccountDisabled')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}