'use client';

import { Office } from './types';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfficesTabProps {
  offices: Office[];
}

export default function OfficesTab({ offices }: OfficesTabProps) {
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
        {t('contact.offices.title')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center sm:text-left transition-colors">
        {t('contact.offices.subtitle')}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {offices.map((office, index) => (
          <div 
            key={index} 
            className={`relative p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
              office.isMain 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-400'
            }`}
          >
            {office.isMain && (
              <div className="absolute -top-3 -right-3 bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                {t('contact.offices.mainOffice')}
              </div>
            )}
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${office.isMain ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
                <svg className={`w-8 h-8 ${office.isMain ? 'text-white' : 'text-red-500 dark:text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-xl mb-2 ${office.isMain ? 'text-white' : 'text-gray-900 dark:text-white'} transition-colors`}>
                  {office.city}
                </h4>
                <p className={`text-sm mb-4 ${office.isMain ? 'text-red-100' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                  {office.country}
                </p>
                <div className={`space-y-3 ${office.isMain ? 'text-red-100' : 'text-gray-600 dark:text-gray-400'} transition-colors`}>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {office.address}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${office.phone}`} className="hover:underline">
                      {office.phone}
                    </a>
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${office.email}`} className="hover:underline">
                      {office.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

