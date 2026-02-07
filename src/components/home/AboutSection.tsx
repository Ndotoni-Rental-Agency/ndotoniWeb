'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const AboutSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="mt-16 mb-8">
      {/* Subtle divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="border-t border-gray-200 dark:border-gray-800"></div>
      </div>
      
      {/* Content card with subtle background */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="text-center space-y-6">
            {/* Icon or accent */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-emerald-900/20 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-gray-700 dark:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              {t('homeAbout.title')}
            </h2>
            
            {/* Description */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <p className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 transition-colors">
                {t('homeAbout.description')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                {t('homeAbout.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
