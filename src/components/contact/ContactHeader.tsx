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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: t('contact.header.liveChat'),
      description: t('contact.header.liveChatDesc'),
      action: t('contact.header.startChat'),
      href: '/chat',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    }
  ];

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 dark:bg-red-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
        <div className="text-center space-y-6 mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('contact.header.online')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('contact.header.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-600">
              {t('contact.header.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {t('contact.header.subtitle')}
          </p>
        </div>

        {/* Contact Methods Grid - Row on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={index}
              method={method}
              delay={100 + index * 100}
            />
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 px-6 sm:px-8 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('contact.header.fastResponse')}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{t('contact.header.fastResponseTime')}</div>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{t('contact.header.available24_7')}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{t('contact.header.alwaysHere')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

function ContactMethodCard({ method, delay }: { method: any; delay: number }) {
  const { ref, isVisible } = useFadeIn({ delay });

  return (
    <div
      ref={ref}
      className={`group relative bg-white dark:bg-gray-800 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800/50 hover:-translate-y-1 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 rounded-3xl transition-opacity duration-300"></div>
      
      <div className="relative space-y-6">
        {/* Icon */}
        <div className="inline-flex p-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg">
          {method.icon}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {method.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {method.description}
          </p>
        </div>

        {/* Action Button */}
        <Link
          href={method.href}
          className="block w-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-900 dark:text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md text-center"
        >
          {method.action}
          <svg className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-gray-200 dark:border-gray-700 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
}

