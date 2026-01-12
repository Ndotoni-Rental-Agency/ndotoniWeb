'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface MissionTabProps {
  values: Value[];
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
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 space-y-4 border border-red-100 dark:border-red-800/50">
          <div className="text-4xl">🎯</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('about.mission.missionTitle')}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('about.mission.missionDescription')}
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 space-y-4 border border-blue-100 dark:border-blue-800/50">
          <div className="text-4xl">🌟</div>
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
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 space-y-3 h-full border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800/50 hover:shadow-md transition-all">
                <div className="text-3xl">{value.icon}</div>
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

