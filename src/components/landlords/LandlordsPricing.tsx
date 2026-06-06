'use client';

import { Check, MessageCircle, Smartphone, Star } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

interface PricingTier {
  nameKey: string;
  price: string;
  durationKey: string;
  bestForKey: string;
  featuresKeys: string[];
  highlight?: boolean;
  badge?: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    nameKey: 'freeTierName',
    price: 'Bure',
    durationKey: 'freeTierDuration',
    bestForKey: 'freeTierBestFor',
    featuresKeys: ['feature_listing', 'feature_whatsapp', 'feature_photos'],
  },
  {
    nameKey: 'perListingName',
    price: 'TZS 5,000',
    durationKey: 'perListingDuration',
    bestForKey: 'perListingBestFor',
    featuresKeys: ['feature_listing', 'feature_whatsapp', 'feature_photos', 'feature_priority'],
  },
  {
    nameKey: 'monthlyName',
    price: 'TZS 25,000',
    durationKey: 'monthlyDuration',
    bestForKey: 'monthlyBestFor',
    featuresKeys: ['feature_unlimited', 'feature_whatsapp', 'feature_photos', 'feature_priority', 'feature_analytics'],
    highlight: true,
    badge: 'Maarufu',
  },
  {
    nameKey: 'yearlyName',
    price: 'TZS 250,000',
    durationKey: 'yearlyDuration',
    bestForKey: 'yearlyBestFor',
    featuresKeys: ['feature_unlimited', 'feature_whatsapp', 'feature_photos', 'feature_priority', 'feature_analytics', 'feature_support'],
  },
];

export function LandlordsPricing() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-cream-50 dark:bg-gray-900">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow">{t('landlordsPage.pricing.eyebrow')}</span>
            <h2 className="section-heading">
              {t('landlordsPage.pricing.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('landlordsPage.pricing.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              {t('landlordsPage.pricing.subheading')}
            </p>
          </div>

          {/* WhatsApp highlight */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center gap-4 rounded-2xl bg-white dark:bg-gray-800 border border-brand-100 dark:border-brand-800/40 p-5 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={22} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-white">
                  {t('landlordsPage.pricing.whatsappTitle')}
                </p>
                <p className="text-sm text-ink-500 dark:text-gray-400 mt-0.5">
                  {t('landlordsPage.pricing.whatsappDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-4">
            {PRICING_TIERS.map((tier, index) => (
              <div
                key={tier.nameKey}
                className={cn(
                  'relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1',
                  tier.highlight
                    ? 'bg-brand-600 text-white border-2 border-brand-500 shadow-green ring-4 ring-brand-100 dark:ring-brand-900/40'
                    : 'bg-white dark:bg-gray-900 border border-stone-100 dark:border-gray-800 shadow-soft hover:shadow-editorial',
                )}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-sand-400 text-ink-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                      <Star size={10} className="fill-current" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <p className={cn(
                  'text-xs font-semibold tracking-widest uppercase mb-4',
                  tier.highlight ? 'text-white/80' : 'text-ink-400 dark:text-gray-500',
                )}>
                  {t(`landlordsPage.pricing.${tier.nameKey}`)}
                </p>

                {/* Price */}
                <div className="mb-1">
                  <span className={cn(
                    'font-display text-3xl font-bold tracking-tight',
                    tier.highlight ? 'text-white' : 'text-ink-900 dark:text-white',
                  )}>
                    {tier.price}
                  </span>
                </div>
                <p className={cn(
                  'text-xs mb-6',
                  tier.highlight ? 'text-white/70' : 'text-ink-400 dark:text-gray-500',
                )}>
                  {t(`landlordsPage.pricing.${tier.durationKey}`)}
                </p>

                {/* Best for */}
                <p className={cn(
                  'text-sm font-medium mb-5 pb-5 border-b',
                  tier.highlight
                    ? 'text-white/90 border-white/20'
                    : 'text-ink-700 dark:text-gray-300 border-stone-100 dark:border-gray-800',
                )}>
                  {t(`landlordsPage.pricing.${tier.bestForKey}`)}
                </p>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {tier.featuresKeys.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        className={cn(
                          'flex-shrink-0 mt-0.5',
                          tier.highlight ? 'text-white' : 'text-brand-500',
                        )}
                      />
                      <span className={cn(
                        'text-sm leading-snug',
                        tier.highlight ? 'text-white/85' : 'text-ink-500 dark:text-gray-400',
                      )}>
                        {t(`landlordsPage.pricing.${featureKey}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-6">
                  <a
                    href="https://wa.me/255790720329"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full font-semibold text-sm transition-all hover:scale-[1.02]',
                      tier.highlight
                        ? 'bg-white text-brand-700 hover:bg-white/90 shadow-sm'
                        : 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-700/40 hover:bg-brand-100 dark:hover:bg-brand-900/40',
                    )}
                  >
                    <Smartphone size={14} />
                    {t('landlordsPage.pricing.ctaButton')}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-sm text-ink-400 dark:text-gray-500 mt-10">
            {t('landlordsPage.pricing.footnote')}
          </p>
        </div>
      </div>
    </section>
  );
}
