'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { FooterLinkColumn } from './footer/FooterLinkColumn';
import { FooterSocialIcons } from './footer/FooterSocialIcons';
import { getFooterLinks } from './footer/getFooterLinks';

export default function Footer() {
  const { t } = useLanguage();

  const { company, renters, landlords } = useMemo(() => getFooterLinks(t), [t]);

  return (
    <footer className="relative overflow-hidden bg-white dark:bg-gray-900 transition-colors">
      {/* Footer content */}
      <div className="border-t border-stone-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-10 lg:gap-x-12">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <Image
                src="/images/logo-light-mode.png"
                alt="Ndotoni"
                width={44}
                height={44}
                className="object-contain mb-3"
              />
              <p className="text-xs sm:text-sm text-ink-500 dark:text-gray-400 leading-relaxed max-w-xs">
                {t('hero.subtitle')}
              </p>
              <div className="mt-4">
                <FooterSocialIcons />
              </div>
            </div>

            <FooterLinkColumn title={t('footer.company')} links={company} />
            <FooterLinkColumn title={t('footer.renters')} links={renters} />
            <FooterLinkColumn title={t('footer.landlords')} links={landlords} />
          </div>

          {/* Bottom */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-stone-100 dark:border-gray-800">
            <p className="text-xs sm:text-sm text-ink-400 dark:text-gray-500 text-center">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
