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
    },
    {
      title: t('about.whyChooseUs.directCommunication'),
      description: t('about.whyChooseUs.directCommunicationDesc'),
      icon: '💬',
    },
    {
      title: t('about.whyChooseUs.securePayments'),
      description: t('about.whyChooseUs.securePaymentsDesc'),
      icon: '🔒',
    },
    {
      title: t('about.whyChooseUs.support24_7'),
      description: t('about.whyChooseUs.support24_7Desc'),
      icon: '🛟',
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
            className="bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4 border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:shadow-md transition-all duration-200"
          >
            <div className="text-3xl">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

