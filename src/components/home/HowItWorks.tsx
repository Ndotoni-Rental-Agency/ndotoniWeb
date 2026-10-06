'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface Step {
  id: string;
  number: string;
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
}

const steps: Step[] = [
  {
    id: 'search',
    number: '1',
    titleEn: 'Search & Browse',
    titleSw: 'Tafuta & Angalia',
    descriptionEn: 'Browse verified properties by location, price, or type. Filter to find exactly what you need.',
    descriptionSw: 'Angalia nyumba zilizothibitishwa kwa eneo, bei, au aina. Chuja kupata unachohitaji.',
  },
  {
    id: 'contact',
    number: '2',
    titleEn: 'Contact & Visit',
    titleSw: 'Wasiliana & Tembelea',
    descriptionEn: 'Reach out via WhatsApp or in-app chat. Schedule a visit to see the property in person.',
    descriptionSw: 'Wasiliana kupitia WhatsApp au chat. Panga kutembelea nyumba yenyewe.',
  },
  {
    id: 'movein',
    number: '3',
    titleEn: 'Move In',
    titleSw: 'Hamia',
    descriptionEn: 'Agree on terms with the landlord and move into your new home. Simple as that.',
    descriptionSw: 'Kubaliana na mwenye nyumba na hamia. Rahisi tu.',
  },
];

export function HowItWorks() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 border-t border-stone-200/70 dark:border-gray-800">
      <h2 className="poster-heading mb-10 sm:mb-14">
        {language === 'sw' ? 'Inavyofanya kazi' : 'How it works'}
      </h2>

      <ol className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, index) => (
          <li key={step.id} className="relative flex items-start gap-5 md:block">
            <span
              aria-hidden="true"
              className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-sand-300 font-poster text-4xl font-extrabold text-ink-900 shadow-[0_10px_20px_-10px_rgba(17,24,39,0.55)] ${index % 2 ? 'rotate-2' : '-rotate-2'}`}
            >
              {step.number}
            </span>
            <div className="min-w-0 md:mt-5">
              <h3 className="font-poster text-xl sm:text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white mb-1.5">
                <span className="sr-only">{step.number}. </span>
                {language === 'sw' ? step.titleSw : step.titleEn}
              </h3>
              <p className="text-base text-ink-500 dark:text-gray-400 leading-relaxed max-w-sm">
                {language === 'sw' ? step.descriptionSw : step.descriptionEn}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
