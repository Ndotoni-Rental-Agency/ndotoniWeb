'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FooterLinkColumn } from './footer/FooterLinkColumn';
import { FooterSocialIcons } from './footer/FooterSocialIcons';
import { getFooterLinks } from './footer/getFooterLinks';

export default function Footer() {
  const { t } = useLanguage();

  const { company, renters, landlords } = useMemo(() => getFooterLinks(t), [t]);

  return (
    <footer className="bg-cream-200 dark:bg-gray-900 border-t border-stone-200 dark:border-gray-700 transition-colors">
      <div className="border-b border-stone-200/70 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <p className="eyebrow mb-3">Ndotoni · Tanzania</p>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl tracking-tight text-ink-900 dark:text-white text-balance max-w-3xl">
            {t('footer.headline')}
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 sm:gap-x-10 lg:gap-x-12">
          <div>
            <p className="text-sm text-ink-600 dark:text-gray-300 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="mt-5">
              <FooterSocialIcons />
            </div>
          </div>

          <FooterLinkColumn title={t('footer.company')} links={company} />

          <FooterLinkColumn title={t('footer.renters')} links={renters} />

          <FooterLinkColumn title={t('footer.landlords')} links={landlords} />
        </div>

        <div className="mt-10 pt-8 border-t border-stone-200 dark:border-gray-700">
          <p className="text-sm text-ink-700 dark:text-gray-200 text-center sm:text-left">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
