'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function ContactHeader() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const contactMethods = [
    {
      title: t('contact.header.callUs'),
      description: t('contact.header.callUsDesc'),
      action: '+255 123 456 789',
      href: 'tel:+255123456789',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      title: t('contact.header.emailUs'),
      description: t('contact.header.emailUsDesc'),
      action: 'hello@ndotoni.co.tz',
      href: 'mailto:hello@ndotoni.co.tz',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div 
      ref={ref}
      className={`bg-white dark:bg-gray-900 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('contact.header.title')}{' '}
            <span className="text-red-500 dark:text-red-400">
              {t('contact.header.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('contact.header.subtitle')}
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={index}
              method={method}
              delay={100 + index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactMethodCard({ method, delay }: { method: any; delay: number }) {
  const { ref, isVisible } = useFadeIn<HTMLAnchorElement>({ delay });

  return (
    <Link
      href={method.href}
      ref={ref}
      className={`group block bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:shadow-md transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
          {method.icon}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {method.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {method.description}
          </p>
        </div>

        {/* Action */}
        <div className="flex items-center text-sm font-medium text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors">
          {method.action}
          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

