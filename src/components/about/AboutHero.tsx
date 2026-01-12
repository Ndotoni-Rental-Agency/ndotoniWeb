'use client';

import Link from 'next/link';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutHero() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {t('about.hero.badge')}
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('about.hero.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              {t('about.hero.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link 
              href="/contact"
              className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:scale-105 shadow-lg shadow-gray-900/20"
            >
              {t('about.hero.getInTouch')}
            </Link>
            <Link 
              href="/search"
              className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              {t('about.hero.browseProperties')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

