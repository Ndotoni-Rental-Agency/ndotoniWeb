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
      className={`relative overflow-hidden transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Background organic shapes */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-30 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-brand-50 rounded-full opacity-40 pointer-events-none" />

      {/* Decorative crosses */}
      <div className="absolute top-8 left-[5%] deco-cross text-brand-300 text-lg">+</div>
      <div className="absolute bottom-12 right-[10%] deco-cross text-brand-200 text-base">+</div>

      <div className="relative text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-50 border border-brand-200 text-brand-700 rounded-full text-xs font-bold tracking-wide uppercase">
          <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          {t('about.hero.badge')}
        </div>

        {/* Heading */}
        <div className="space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-ink-900 dark:text-white">
            {t('about.hero.title')}{' '}
            <span className="text-brand-500">
              {t('about.hero.titleHighlight')}
            </span>
          </h2>
          <p className="text-ink-500 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('about.hero.subtitle')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-green hover:shadow-green-lg"
          >
            {t('about.hero.getInTouch')}
          </Link>
          <Link
            href="/search"
            className="px-8 py-3.5 bg-white text-ink-900 rounded-full text-sm font-bold hover:bg-stone-50 transition-all hover:scale-[1.02] border-2 border-stone-200 hover:border-brand-300"
          >
            {t('about.hero.browseProperties')}
          </Link>
        </div>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 pt-4">
          {TRUST_SIGNALS.map(({ icon: Icon, labelKey, defaultLabel }) => (
            <div
              key={labelKey}
              className="flex items-center gap-2.5 text-sm text-ink-600"
            >
              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center">
                <Icon size={15} className="text-brand-500 flex-shrink-0" />
              </div>
              <span className="font-medium">{t(labelKey) || defaultLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
