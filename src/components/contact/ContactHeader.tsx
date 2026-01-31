'use client';

import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPANY_INFO } from '@/config/company';
import Link from 'next/link';

export default function ContactHeader() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const contactMethods = [
    {
      title: t('contact.header.callUs'),
      description: t('contact.header.callUsDesc'),
      action: COMPANY_INFO.contact.phone.formatted,
      href: `tel:${COMPANY_INFO.contact.phone.primary}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      title: t('contact.header.emailUs'),
      description: t('contact.header.emailUsDesc'),
      action: COMPANY_INFO.contact.email.primary,
      href: `mailto:${COMPANY_INFO.contact.email.primary}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Visit Our Office',
      description: 'Come see us in person',
      action: COMPANY_INFO.contact.address.city,
      href: '#office',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-24">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('contact.header.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100">
              {t('contact.header.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('contact.header.subtitle')}
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={index}
              method={method}
              delay={100 + index * 100}
            />
          ))}
        </div>

        {/* Office Information */}
        <div id="office" className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Our Office
          </h3>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {COMPANY_INFO.offices[0].name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {COMPANY_INFO.offices[0].address}, {COMPANY_INFO.offices[0].city}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Business Hours</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  Mon-Fri: {COMPANY_INFO.hours.weekdays.display}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  Sat: {COMPANY_INFO.hours.saturday.display}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {COMPANY_INFO.contact.phone.formatted}
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {COMPANY_INFO.contact.email.primary}
                </p>
              </div>
            </div>
          </div>
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
      className={`group block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
          {method.icon}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {method.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {method.description}
          </p>
        </div>

        {/* Action */}
        <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
          {method.action}
          <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

