'use client';

import { PageHeader } from '@/components/marketing/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { COMPANY_INFO } from '@/config/company';
import Link from 'next/link';

export default function ContactHeader() {
  const { t } = useLanguage();

  const contactMethods = [
    {
      title: t('contact.header.callUs'),
      description: t('contact.header.callUsDesc'),
      action: COMPANY_INFO.contact.phone.formatted,
      href: `tel:${COMPANY_INFO.contact.phone.primary}`,
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      title: t('contact.header.emailUs'),
      description: t('contact.header.emailUsDesc'),
      action: COMPANY_INFO.contact.email.primary,
      href: `mailto:${COMPANY_INFO.contact.email.primary}`,
      icon: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <PageHeader
      title={t('contact.header.title')}
      highlight={t('contact.header.titleHighlight')}
      subtitle={t('contact.header.subtitle')}
    >
      <div className="grid grid-cols-1 gap-4">
        {contactMethods.map((method, index) => (
          <ContactMethodCard key={index} method={method} />
        ))}
      </div>
    </PageHeader>
  );
}

function ContactMethodCard({ method }: { method: any }) {
  return (
    <Link
      href={method.href}
      className="group flex items-start gap-4 rounded-2xl border border-white/15 bg-cream-100 p-6 transition-colors hover:border-ink-900 dark:border-white/15 dark:bg-cream-100 dark:hover:border-white"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white dark:bg-white dark:text-ink-900">
        {method.icon}
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-bold text-ink-900 dark:text-ink-900">
          {method.title}
        </span>
        <span className="mt-0.5 block text-sm leading-relaxed text-ink-500 dark:text-ink-500">
          {method.description}
        </span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-brand-800 dark:text-brand-800">
          {method.action}
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </span>
    </Link>
  );
}
