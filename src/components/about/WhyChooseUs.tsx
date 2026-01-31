'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPANY_INFO } from '@/config/company';

export default function WhyChooseUs() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <div 
      ref={ref}
      className={`max-w-7xl mx-auto px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="text-center space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
          Why Choose Us
        </div>
        
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
          {t('about.whyChooseUs.title')}
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {t('about.whyChooseUs.subtitle')}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {COMPANY_INFO.whyChooseUs.map((feature, index) => (
          <FeatureCard key={index} feature={feature} delay={100 + index * 100} />
        ))}
      </div>

      {/* Additional Features Section */}
      <div className="mt-20 pt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Services
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need for a seamless property rental experience
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANY_INFO.features.map((service, index) => (
            <ServiceCard key={index} service={service} delay={200 + index * 100} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature, delay }: { feature: any; delay: number }) {
  const { ref, isVisible } = useFadeIn({ delay });

  return (
    <div 
      ref={ref}
      className={`group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {feature.icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function ServiceCard({ service, delay }: { service: any; delay: number }) {
  const { ref, isVisible } = useFadeIn({ delay });

  return (
    <div 
      ref={ref}
      className={`bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-3">
        <div className="text-2xl">{service.icon}</div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          {service.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {service.description}
        </p>
      </div>
    </div>
  );
}

