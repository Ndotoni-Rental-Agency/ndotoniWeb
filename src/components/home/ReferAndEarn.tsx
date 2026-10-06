'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gift, ArrowRight } from 'lucide-react';

export function ReferAndEarn() {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-14 border-t border-stone-200/70 dark:border-gray-800">
      <div className="rounded-3xl bg-sand-300 p-7 sm:p-10 lg:p-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-ink-900 flex items-center justify-center rotate-3">
            <Gift size={28} className="text-sand-300" strokeWidth={2} />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="font-poster text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-ink-900 mb-2">
              {language === 'sw'
                ? 'Unajua mtu anayepangisha? Pata pesa!'
                : 'Know a landlord? Get paid!'}
            </h3>
            <p className="text-ink-800 text-base sm:text-lg leading-relaxed max-w-xl">
              {language === 'sw'
                ? 'Tuunganishe na mwenye nyumba na upate TZS 2,000 kwa kila nyumba inayoorodheshwa. Hadi nyumba 5 kwa mtu.'
                : 'Connect us with a landlord and earn TZS 2,000 for every property listed. Up to 5 referrals per person.'}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/refer"
              className="inline-flex min-h-12 items-center gap-2 px-6 py-3 rounded-full bg-ink-900 hover:bg-brand-800 text-sand-300 text-sm font-bold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-300"
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
