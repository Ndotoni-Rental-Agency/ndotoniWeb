'use client';

import { MessageCircle, Smartphone, Clock, Shield, X } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

export function LandlordsWhatsApp() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  const advantages = [
    {
      icon: Smartphone,
      titleKey: 'whatsappAdv1Title',
      descKey: 'whatsappAdv1Desc',
    },
    {
      icon: Clock,
      titleKey: 'whatsappAdv2Title',
      descKey: 'whatsappAdv2Desc',
    },
    {
      icon: Shield,
      titleKey: 'whatsappAdv3Title',
      descKey: 'whatsappAdv3Desc',
    },
    {
      icon: MessageCircle,
      titleKey: 'whatsappAdv4Title',
      descKey: 'whatsappAdv4Desc',
    },
  ];

  const comparisons = [
    { labelKey: 'vsFacebook', key: 'vsFacebookDesc' },
    { labelKey: 'vsWebsites', key: 'vsWebsitesDesc' },
    { labelKey: 'vsApps', key: 'vsAppsDesc' },
    { labelKey: 'vsAgents', key: 'vsAgentsDesc' },
  ];

  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow">{t('landlordsPage.whatsapp.eyebrow')}</span>
            <h2 className="section-heading">
              {t('landlordsPage.whatsapp.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('landlordsPage.whatsapp.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              {t('landlordsPage.whatsapp.subheading')}
            </p>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left — advantages */}
            <div className="space-y-4">
              {advantages.map((adv, index) => {
                const Icon = adv.icon;
                return (
                  <div
                    key={adv.titleKey}
                    className="flex items-start gap-4 rounded-2xl bg-cream-50 dark:bg-gray-900 border border-stone-100 dark:border-gray-800 p-5 hover:border-brand-200 dark:hover:border-brand-800 transition-all duration-300"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-ink-900 dark:text-white mb-1">
                        {t(`landlordsPage.whatsapp.${adv.titleKey}`)}
                      </h3>
                      <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed">
                        {t(`landlordsPage.whatsapp.${adv.descKey}`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right — comparison table */}
            <div>
              <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white mb-5 tracking-tight">
                {t('landlordsPage.whatsapp.comparisonTitle')}
              </h3>
              <div className="space-y-3">
                {comparisons.map((comp, index) => (
                  <div
                    key={comp.labelKey}
                    className="flex items-start gap-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={12} className="text-red-500 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-white">
                        {t(`landlordsPage.whatsapp.${comp.labelKey}`)}
                      </p>
                      <p className="text-xs text-ink-500 dark:text-gray-400 mt-0.5">
                        {t(`landlordsPage.whatsapp.${comp.key}`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ndotoni advantage */}
              <div className="mt-5 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/40 p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle size={12} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                    {t('landlordsPage.whatsapp.ndotoniAdvantage')}
                  </p>
                  <p className="text-xs text-brand-600/80 dark:text-brand-400/80 mt-0.5">
                    {t('landlordsPage.whatsapp.ndotoniAdvantageDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
