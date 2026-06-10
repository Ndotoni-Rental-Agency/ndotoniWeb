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
      {/* Accent bar — WhatsApp CTA */}
      <div className="bg-secondary-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white text-sm sm:text-base font-bold text-center sm:text-left">
            {t('footer.headline')}
          </p>
          <a
            href="https://wa.me/255790720329"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-white text-secondary-600 text-sm font-bold rounded-full hover:bg-secondary-50 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            WhatsApp: +255 790 720 329
          </a>
        </div>
      </div>

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
