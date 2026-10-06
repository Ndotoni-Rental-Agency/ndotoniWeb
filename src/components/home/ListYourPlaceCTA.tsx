'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { KangaBand } from '@/components/ui/KangaBand';

export function ListYourPlaceCTA() {
  const { language } = useLanguage();

  return (
    <section className="pt-16 sm:pt-20 pb-8 sm:pb-12 border-t border-stone-200/70 dark:border-gray-800">
      <div className="overflow-hidden rounded-3xl bg-brand-500 dark:bg-brand-800">
        <KangaBand variant="thin" className="h-4 rounded-none" />
        <div className="p-8 sm:p-12 lg:p-16">
          <h2 className="font-poster text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] tracking-[-0.035em] text-ink-900 max-w-3xl mb-5 dark:text-white" style={{ fontStretch: '88%' }}>
            {language === 'sw'
              ? 'Una nyumba ambayo watu wangeipenda?'
              : 'Got a place people would love?'}
          </h2>
          <p className="text-ink-800 text-base sm:text-lg max-w-xl mb-8 leading-relaxed font-medium dark:text-brand-50">
            {language === 'sw'
              ? 'Tangaza nyumba yako bure. Anza kupata wapangaji. Sisi tunasimamia yote.'
              : 'List your property for free. Start getting tenants. We handle the rest.'}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/property/create"
              className="inline-flex min-h-12 items-center px-7 py-3.5 bg-ink-900 text-sand-300 rounded-full text-sm font-bold hover:bg-ink-800 transition-colors active:scale-[0.98]"
            >
              {language === 'sw' ? 'Tangaza Nyumba – Bure' : 'List Your Place – Free'}
            </Link>
            <a
              href={`https://wa.me/255790720329?text=${encodeURIComponent(language === 'sw' ? 'Habari, nataka kutangaza nyumba yangu kwenye Ndotoni.' : 'Hi, I want to list my property on Ndotoni.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 px-7 py-3.5 bg-white text-ink-900 rounded-full text-sm font-bold hover:bg-cream-100 transition-colors"
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
