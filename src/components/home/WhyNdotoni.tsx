'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Camera, MessageCircle, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const steps = [
  {
    id: 'search',
    titleEn: 'Search & Browse',
    titleSw: 'Tafuta & Angalia',
    descriptionEn: 'Browse verified properties by location, price, or type. Filter to find exactly what you need.',
    descriptionSw: 'Angalia nyumba zilizothibitishwa kwa eneo, bei, au aina. Chuja kupata unachohitaji.',
  },
  {
    id: 'contact',
    titleEn: 'Contact & Visit',
    titleSw: 'Wasiliana & Tembelea',
    descriptionEn: 'Reach out via WhatsApp or in-app chat. Schedule a visit to see the property in person.',
    descriptionSw: 'Wasiliana kupitia WhatsApp au chat. Panga kutembelea nyumba yenyewe.',
  },
  {
    id: 'movein',
    titleEn: 'Move In',
    titleSw: 'Hamia',
    descriptionEn: 'Agree on terms with the landlord and move into your new home. Simple as that.',
    descriptionSw: 'Kubaliana na mwenye nyumba na hamia. Rahisi tu.',
  },
];

const trustPoints: {
  id: string;
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  icon: LucideIcon;
}[] = [
  {
    id: 'verified',
    titleEn: 'Verified Listings',
    titleSw: 'Nyumba Zilizothibitishwa',
    descriptionEn: 'Every property is visited and photographed. Real photos, accurate descriptions.',
    descriptionSw: 'Kila nyumba imetembelewa na kupigwa picha. Picha halisi, maelezo sahihi.',
    icon: Shield,
  },
  {
    id: 'photos',
    titleEn: 'Real Photos',
    titleSw: 'Picha Halisi',
    descriptionEn: 'We take the photos ourselves. What you see is exactly what you get.',
    descriptionSw: 'Sisi wenyewe tunapiga picha. Unachokiona ndicho unachokipata.',
    icon: Camera,
  },
  {
    id: 'whatsapp',
    titleEn: 'WhatsApp Support',
    titleSw: 'Msaada wa WhatsApp',
    descriptionEn: 'Questions? Chat with us directly on WhatsApp. Fast responses guaranteed.',
    descriptionSw: 'Maswali? Tuandikie WhatsApp moja kwa moja. Majibu ya haraka.',
    icon: MessageCircle,
  },
  {
    id: 'fair',
    titleEn: 'Fair & Transparent',
    titleSw: 'Bei Wazi',
    descriptionEn: 'All costs shown upfront. No hidden fees or surprise charges.',
    descriptionSw: 'Gharama zote zinaonekana. Hakuna ada za siri.',
    icon: Wallet,
  },
];

export function WhyNdotoni() {
  const { language } = useLanguage();
  const sw = language === 'sw';

  return (
    <section
      className="border-t border-stone-200 py-14 sm:py-20 dark:border-gray-800"
      aria-labelledby="why-ndotoni-title"
    >
      <h2 id="why-ndotoni-title" className="poster-heading">
        {sw ? 'Kwanini Ndotoni' : 'Why Ndotoni'}
      </h2>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h3 className="text-sm font-semibold text-ink-700 dark:text-gray-300">
            {sw ? 'Inavyofanya kazi' : 'How it works'}
          </h3>
          <ol className="mt-5 space-y-7">
            {steps.map((step, index) => (
              <li key={step.id} className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-ink-900"
                >
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-lg font-bold text-ink-900 dark:text-white">
                    <span className="sr-only">{index + 1}. </span>
                    {sw ? step.titleSw : step.titleEn}
                  </p>
                  <p className="mt-1 max-w-md text-base leading-relaxed text-ink-500 dark:text-gray-400">
                    {sw ? step.descriptionSw : step.descriptionEn}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink-700 dark:text-gray-300">
            {sw ? 'Unachopata' : 'What you get'}
          </h3>
          <dl className="mt-5 divide-y divide-stone-200 border-y border-stone-200 dark:divide-gray-800 dark:border-gray-800">
            {trustPoints.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.id} className="flex items-start gap-4 py-4">
                  <Icon
                    size={22}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-300"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="font-bold text-ink-900 dark:text-white">
                      {sw ? point.titleSw : point.titleEn}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-relaxed text-ink-500 dark:text-gray-400">
                      {sw ? point.descriptionSw : point.descriptionEn}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
