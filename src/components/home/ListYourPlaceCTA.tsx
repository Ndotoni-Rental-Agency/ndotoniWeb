'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function ListYourPlaceCTA() {
  const { language } = useLanguage();

  return (
    <section className="pt-16 sm:pt-20 pb-8 sm:pb-12 border-t border-stone-200/70 dark:border-gray-800">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 sm:p-12 lg:p-16 text-center">
        {/* Decorative shapes */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white mb-4">
            {language === 'sw'
              ? 'Una nyumba ambayo watu wangeipenda?'
              : 'Got a place people would love?'}
          </h2>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            {language === 'sw'
              ? 'Tangaza nyumba yako bure. Anza kupata wapangaji. Sisi tunasimamia yote.'
              : 'List your property for free. Start getting tenants. We handle the rest.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link
              href="/property/create"
              className="inline-flex items-center px-7 py-3.5 bg-white text-brand-600 rounded-full text-sm font-bold hover:bg-stone-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {language === 'sw' ? 'Tangaza Nyumba – Bure' : 'List Your Place – Free'}
            </Link>
            <a
              href="https://wa.me/255790720329?text=Hi%2C%20I%20want%20to%20list%20my%20property%20on%20ndotoni"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/15 border border-white/30 text-white rounded-full text-sm font-bold hover:bg-white/25 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              {language === 'sw' ? 'Tuandikie' : 'Chat with us'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
