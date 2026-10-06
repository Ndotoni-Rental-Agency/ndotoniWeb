'use client';

import Link from 'next/link';
import { ArrowRight, Gift, Moon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { KangaBand } from '@/components/ui/KangaBand';

function SideTile({
  icon: Icon,
  title,
  body,
  cta,
  href,
  external,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  cta: string;
  href: string;
  external?: boolean;
}) {
  const className =
    'group flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-6 transition-colors hover:border-ink-900 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-white';
  const content = (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white dark:bg-white dark:text-ink-900">
        <Icon size={20} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="mt-4 block text-lg font-bold text-ink-900 dark:text-white">{title}</span>
      <span className="mt-1 block flex-1 text-sm leading-relaxed text-ink-500 dark:text-gray-400">
        {body}
      </span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-800 dark:text-brand-300">
        {cta}
        <ArrowRight
          size={16}
          strokeWidth={2.5}
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function ForLandlords() {
  const { language } = useLanguage();
  const sw = language === 'sw';

  return (
    <section className="pb-12 pt-4 sm:pb-16" aria-labelledby="for-landlords-title">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-3xl bg-brand-500 lg:col-span-2 dark:bg-brand-800">
          <KangaBand variant="thin" className="h-4 rounded-none" />
          <div className="p-8 sm:p-10 lg:p-12">
            <h2
              id="for-landlords-title"
              className="max-w-2xl font-poster text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] text-ink-900 sm:text-5xl dark:text-white"
              style={{ fontStretch: '88%' }}
            >
              {sw ? 'Una nyumba ambayo watu wangeipenda?' : 'Got a place people would love?'}
            </h2>
            <p className="mt-4 max-w-lg text-base font-medium leading-relaxed text-ink-800 sm:text-lg dark:text-brand-50">
              {sw
                ? 'Tangaza nyumba yako bure. Anza kupata wapangaji. Sisi tunasimamia yote.'
                : 'List your property for free. Start getting tenants. We handle the rest.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/property/create"
                className="inline-flex min-h-12 items-center rounded-full bg-ink-900 px-7 text-sm font-bold text-white transition-colors hover:bg-ink-800 active:scale-[0.98]"
              >
                {sw ? 'Tangaza Nyumba – Bure' : 'List Your Place – Free'}
              </Link>
              <a
                href={`https://wa.me/255790720329?text=${encodeURIComponent(sw ? 'Habari, nataka kutangaza nyumba yangu kwenye Ndotoni.' : 'Hi, I want to list my property on Ndotoni.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-white px-7 text-sm font-bold text-ink-900 transition-colors hover:bg-cream-100"
              >
                {sw ? 'Tuandikie WhatsApp' : 'Chat on WhatsApp'}
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <SideTile
            icon={Gift}
            title={sw ? 'Unajua mtu anayepangisha? Pata pesa!' : 'Know a landlord? Get paid!'}
            body={
              sw
                ? 'Tuunganishe na mwenye nyumba na upate TZS 2,000 kwa kila nyumba inayoorodheshwa. Hadi nyumba 5 kwa mtu.'
                : 'Connect us with a landlord and earn TZS 2,000 for every property listed. Up to 5 referrals per person.'
            }
            cta={sw ? 'Anza sasa' : 'Start earning'}
            href="/refer"
          />
          <SideTile
            icon={Moon}
            title={sw ? 'Unatafuta makazi ya muda mfupi?' : 'Looking for a short stay?'}
            body={
              sw
                ? 'Pata nyumba za siku moja moja, sherehe, picha, na zaidi ndotoni Stays.'
                : 'Book nightly stays, party venues, photoshoot locations, and more on ndotoni Stays.'
            }
            cta={sw ? 'Tembelea ndotoni Stays' : 'Visit ndotoni Stays'}
            href="https://www.ndotonistays.com"
            external
          />
        </div>
      </div>
    </section>
  );
}
