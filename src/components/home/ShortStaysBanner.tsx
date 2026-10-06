'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, ArrowRight } from 'lucide-react';

export function ShortStaysBanner() {
  const { language } = useLanguage();

  return (
    <section className="py-6 sm:py-8">
      <div className="rounded-3xl border-2 border-ink-900 p-6 sm:p-8 lg:p-10 dark:border-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-ink-900 flex items-center justify-center -rotate-3 dark:bg-white">
            <Moon size={28} className="text-sand-300 dark:text-ink-900" strokeWidth={2} />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h3 className="font-poster text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white mb-1.5">
              {language === 'sw'
                ? 'Unatafuta makazi ya muda mfupi?'
                : 'Looking for a short stay?'}
            </h3>
            <p className="text-ink-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg">
              {language === 'sw'
                ? 'Pata nyumba za siku moja moja, sherehe, picha, na zaidi ndotoni Stays.'
                : 'Book nightly stays, party venues, photoshoot locations, and more on ndotoni Stays.'}
            </p>
          </div>

          {/* CTA */}
          <div className="flex-shrink-0">
            <a
              href="https://www.ndotonistays.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 px-6 py-3 rounded-full bg-ink-900 hover:bg-brand-800 text-sand-300 text-sm font-bold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 dark:bg-white dark:text-ink-900 dark:focus-visible:ring-offset-gray-900"
            >
              {language === 'sw' ? 'Tembelea ndotoni Stays' : 'Visit ndotoni Stays'}
              <ArrowRight size={16} strokeWidth={2.5} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
