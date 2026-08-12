'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, ArrowRight } from 'lucide-react';

export function ReferAndEarn() {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-14 border-t border-stone-200/70 dark:border-gray-800">
      <div className="rounded-3xl bg-gradient-to-br from-brand-50 via-white to-brand-50/60 dark:from-brand-950/30 dark:via-gray-900 dark:to-brand-950/20 border border-brand-200/70 dark:border-brand-800/40 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Soft ambient glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-brand-200/25 dark:bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-brand-100/40 dark:bg-brand-800/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-gray-800 border border-brand-100 dark:border-brand-800/50 shadow-soft flex items-center justify-center">
            <Gift size={28} className="text-brand-600 dark:text-brand-400" strokeWidth={1.75} />
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-lg sm:text-xl font-bold text-ink-900 dark:text-white mb-1.5">
              {language === 'sw'
                ? 'Unajua mtu anayepangisha? Pata pesa!'
                : 'Know a landlord? Get paid!'}
            </h3>
            <p className="text-ink-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg">
              {language === 'sw'
                ? 'Tuunganishe na mwenye nyumba na upate TZS 2,000 kwa kila nyumba inayoorodheshwa. Hadi nyumba 5 kwa mtu.'
                : 'Connect us with a landlord and earn TZS 2,000 for every property listed. Up to 5 referrals per person.'}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/refer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-green-sm hover:shadow-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            >
              {language === 'sw' ? 'Anza sasa' : 'Start earning'}
              <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
