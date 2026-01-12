'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export default function StoryTab() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <div 
      ref={ref}
      className={`space-y-8 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t('about.story.title')}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
      </div>
      
      <div className="prose prose-lg max-w-none space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p className="text-xl dark:text-gray-300">
          {t('about.story.paragraph1')}
        </p>
        <p className="dark:text-gray-300">
          {t('about.story.paragraph2')}
        </p>
        <p className="dark:text-gray-300">
          {t('about.story.paragraph3')}
        </p>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-red-100 dark:border-red-800/50">
          <p className="text-gray-800 dark:text-gray-200 italic font-medium m-0">
            "{t('about.story.quote')}"
          </p>
        </div>
      </div>
    </div>
  );
}

