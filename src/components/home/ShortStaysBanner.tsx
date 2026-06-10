'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, ArrowRight } from 'lucide-react';

export function ShortStaysBanner() {
  const { language } = useLanguage();

  return (
    <section className="py-12 sm:py-14 border-t border-stone-200/70 dark:border-gray-800">
      <div className="rounded-2xl bg-gradient-to-r from-ink-900 to-ink-800 dark:from-gray-800 dark:to-gray-700 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Decorative moon */}
        <div className="absolute top-4 right-6 w-20 h-20 rounded-full bg-secondary-500/10 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary-500/20 border border-secondary-400/20 flex items-center justify-center">
            <Moon size={28} className="text-secondary-400" strokeWidth={1.75} />
          </div>

          {/* Text */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-1.5">
              {language === 'sw'
                ? 'Unatafuta kulala usiku mmoja au miwili?'
                : 'Looking for a short stay?'}
            </h3>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg">
              {language === 'sw'
                ? 'Pata nyumba za kulala kwa usiku, sherehe, picha, na zaidi kwenye ndotoni Stays.'
                : 'Book nightly stays, party venues, photoshoot locations, and more on ndotoni Stays.'}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <a
              href="https://www.ndotonistays.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary-500 hover:bg-secondary-600 text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-rose-sm hover:shadow-rose"
            >
              {language === 'sw' ? 'Tembelea ndotoni Stays' : 'Visit ndotoni Stays'}
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
