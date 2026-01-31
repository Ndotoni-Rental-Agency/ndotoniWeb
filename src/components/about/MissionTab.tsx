'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

interface Value {
  readonly title: string;
  readonly description: string;
}

interface MissionTabProps {
  values: readonly Value[];
}

export default function MissionTab({ values }: MissionTabProps) {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <div 
      ref={ref}
      className={`space-y-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t('about.mission.title')}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 space-y-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.mission.missionTitle')}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('about.mission.missionDescription')}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 space-y-4 border border-blue-100 dark:border-blue-800/50">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.mission.visionTitle')}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('about.mission.visionDescription')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.mission.valuesTitle')}</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <div key={index} className="group hover:scale-105 transition-transform">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 space-y-3 h-full border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{value.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

