'use client';

import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function ReferCTA() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* CTA card */}
          <div className="relative rounded-3xl overflow-hidden bg-ink-900 dark:bg-gray-950 border border-gray-800 shadow-editorial">
            {/* Background grid */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            {/* Green glow left */}
            <div
              className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-20 blur-3xl"
              style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            {/* Green glow right */}
            <div
              className="pointer-events-none absolute -right-24 bottom-0 w-60 h-60 rounded-full opacity-10 blur-3xl"
              style={{ background: 'radial-gradient(circle, #00CD54 0%, transparent 70%)' }}
              aria-hidden="true"
            />

            <div className="relative px-8 py-16 sm:py-20 text-center space-y-7">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 mx-auto">
                <Gift size={26} className="text-brand-400" />
              </div>

              <div className="space-y-3">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                  {t('referPage.cta.heading1')}
                  <br />
                  <span className="text-brand-400">
                    {t('referPage.cta.headingHighlight')}
                  </span>
                </h2>
                <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                  {t('referPage.cta.subheading')}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link
                  href="#referral-form"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-semibold text-sm transition-all hover:scale-[1.03] shadow-green focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-ink-900"
                >
                  {t('referPage.cta.ctaPrimary')}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition-all hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-ink-900"
                >
                  {t('referPage.cta.ctaSecondary')}
                </Link>
              </div>

              <p className="text-gray-500 text-xs">
                {t('referPage.cta.microcopy')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
