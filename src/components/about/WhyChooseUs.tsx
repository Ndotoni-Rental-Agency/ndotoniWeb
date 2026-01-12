'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WhyChooseUs() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const features = [
    {
      title: t('about.whyChooseUs.verifiedProperties'),
      description: t('about.whyChooseUs.verifiedPropertiesDesc'),
      icon: '✓',
      gradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-100 dark:border-green-800/50'
    },
    {
      title: t('about.whyChooseUs.directCommunication'),
      description: t('about.whyChooseUs.directCommunicationDesc'),
      icon: '💬',
      gradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-100 dark:border-blue-800/50'
    },
    {
      title: t('about.whyChooseUs.securePayments'),
      description: t('about.whyChooseUs.securePaymentsDesc'),
      icon: '🔒',
      gradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-100 dark:border-purple-800/50'
    },
    {
      title: t('about.whyChooseUs.support24_7'),
      description: t('about.whyChooseUs.support24_7Desc'),
      icon: '🛟',
      gradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      borderColor: 'border-orange-100 dark:border-orange-800/50'
    }
  ];

  return (
    <div 
      ref={ref}
      className={`max-w-6xl mx-auto px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{t('about.whyChooseUs.title')}</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto"></div>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('about.whyChooseUs.subtitle')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 space-y-4 border ${feature.borderColor} hover:shadow-lg transition-all group hover:scale-105`}
          >
            <div className="text-4xl group-hover:scale-110 transition-transform">{feature.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

