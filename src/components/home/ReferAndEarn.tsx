'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, ArrowRight } from 'lucide-react';

export function ReferAndEarn() {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-14 border-t border-stone-200/70 dark:border-gray-800">
      <div className="rounded-2xl bg-gradient-to-r from-secondary-50 to-secondary-100/50 dark:from-secondary-900/10 dark:to-secondary-800/10 border border-secondary-200/60 dark:border-secondary-800/30 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center">
            <Gift size={28} className="text-secondary-500 dark:text-secondary-400" strokeWidth={1.75} />
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-lg sm:text-xl font-bold text-ink-900 dark:text-white mb-1.5">
              {language === 'sw'
                ? 'Unajua mtu anayepangisha? Pata pesa!'
                : 'Know a landlord? Get paid!'}
            </h3>
            <p className="text-ink-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg">
              {language === 'sw'
                ? 'Tuunganishe na mwenye nyumba na upate TZS 2,000 kwa kila nyumba inayoorodheshwa. Hadi nyumba 5 kwa mtu.'
                : 'Connect us with a landlord and earn TZS 2,000 for every property listed. Up to 5 referrals per person.'}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/refer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-rose-sm hover:shadow-rose"
            >
              {language === 'sw' ? 'Anza sasa' : 'Start earning'}
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
