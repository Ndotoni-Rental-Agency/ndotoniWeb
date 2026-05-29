'use client';

import Link from 'next/link';
import { Shield, MapPin, Eye } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

const TRUST_SIGNALS = [
  {
    icon: Shield,
    labelKey: 'homeAbout.trust.verified' as const,
    defaultLabel: 'Verified Listings',
  },
  {
    icon: MapPin,
    labelKey: 'homeAbout.trust.acrossTanzania' as const,
    defaultLabel: 'Across Tanzania',
  },
  {
    icon: Eye,
    labelKey: 'homeAbout.trust.transparent' as const,
    defaultLabel: 'Safe & Transparent',
  },
];

export const HomeAboutSection: React.FC = () => {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="text-center space-y-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold tracking-wide uppercase">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {t('about.hero.badge')}
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink-900 dark:text-white">
            {t('about.hero.title')}{' '}
            <span className="text-brand-600 dark:text-brand-400">
              {t('about.hero.titleHighlight')}
            </span>
          </h2>
          <p className="text-ink-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/contact"
            className="px-7 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-sm font-medium transition-all hover:scale-[1.02] shadow-green-sm"
          >
            {t('about.hero.getInTouch')}
          </Link>
          <Link
            href="/search"
            className="px-7 py-3 bg-white dark:bg-gray-800 text-ink-900 dark:text-white rounded-full text-sm font-medium hover:bg-stone-50 dark:hover:bg-gray-700 transition-all hover:scale-[1.02] border border-stone-200 dark:border-gray-700 shadow-sm"
          >
            {t('about.hero.browseProperties')}
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-2">
          {TRUST_SIGNALS.map(({ icon: Icon, labelKey, defaultLabel }) => (
            <div
              key={labelKey}
              className="flex items-center gap-2 text-sm text-ink-500 dark:text-gray-400"
            >
              <Icon size={15} className="text-brand-500 flex-shrink-0" />
              <span>{t(labelKey) || defaultLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
