'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HoursTab() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <div 
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-lg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center sm:text-left transition-colors">
        {t('contact.hours.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center sm:text-left transition-colors">
        {t('contact.hours.subtitle')}
      </p>
      
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">{t('contact.hours.regularHours')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
              <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('contact.hours.mondayFriday')}</span>
              <span className="text-gray-600 dark:text-gray-400 font-semibold transition-colors">8:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-blue-200 dark:border-blue-700">
              <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('contact.hours.saturday')}</span>
              <span className="text-gray-600 dark:text-gray-400 font-semibold transition-colors">9:00 AM - 2:00 PM</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors">{t('contact.hours.sunday')}</span>
              <span className="text-red-500 dark:text-red-400 font-semibold transition-colors">{t('contact.hours.closed')}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">{t('contact.hours.emergencySupport')}</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-green-800 dark:text-green-400 transition-colors">{t('contact.hours.available24_7')}</p>
                <p className="text-sm text-green-700 dark:text-green-300 transition-colors">{t('contact.hours.forUrgentIssues')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl transition-colors">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-400 transition-colors">{t('contact.hours.emergencyHotline')}</p>
                <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors">+255 123 456 999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-xl transition-colors">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-400 transition-colors">{t('contact.hours.holidayHours')}</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 transition-colors">{t('contact.hours.holidayHoursDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

