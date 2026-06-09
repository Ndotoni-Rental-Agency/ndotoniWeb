'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Phone, Home } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
  id: string;
  number: string;
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  {
    id: 'search',
    number: '1',
    titleEn: 'Search & Browse',
    titleSw: 'Tafuta & Angalia',
    descriptionEn: 'Browse verified properties by location, price, or type. Filter to find exactly what you need.',
    descriptionSw: 'Angalia nyumba zilizothibitishwa kwa eneo, bei, au aina. Chuja kupata unachohitaji.',
    icon: Search,
  },
  {
    id: 'contact',
    number: '2',
    titleEn: 'Contact & Visit',
    titleSw: 'Wasiliana & Tembelea',
    descriptionEn: 'Reach out via WhatsApp or in-app chat. Schedule a visit to see the property in person.',
    descriptionSw: 'Wasiliana kupitia WhatsApp au chat. Panga kutembelea nyumba yenyewe.',
    icon: Phone,
  },
  {
    id: 'movein',
    number: '3',
    titleEn: 'Move In',
    titleSw: 'Hamia',
    descriptionEn: 'Agree on terms with the landlord and move into your new home. Simple as that.',
    descriptionSw: 'Kubaliana na mwenye nyumba na hamia. Rahisi tu.',
    icon: Home,
  },
];

export function HowItWorks() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 border-t border-stone-200/70 dark:border-gray-800">
      <div className="text-center mb-10 sm:mb-12">
        <p className="text-sm font-bold tracking-wide uppercase text-brand-500 mb-3">
          {language === 'sw' ? 'Rahisi kama 1-2-3' : 'Simple as 1-2-3'}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 dark:text-white">
          {language === 'sw' ? 'Inavyofanya kazi' : 'How it works'}
        </h2>
      </div>

      {/* Mobile: vertical timeline, Desktop: 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.id} className="flex items-start gap-4 md:flex-col md:items-center md:text-center">
              {/* Step number + icon */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shadow-green-sm">
                  <Icon size={22} className="text-white" strokeWidth={2} />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-gray-900 border-2 border-brand-500 rounded-full flex items-center justify-center text-xs font-bold text-brand-600">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1 md:pt-0 md:mt-4">
                <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-white mb-1.5">
                  {language === 'sw' ? step.titleSw : step.titleEn}
                </h3>
                <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed max-w-xs md:mx-auto">
                  {language === 'sw' ? step.descriptionSw : step.descriptionEn}
                </p>
              </div>

              {/* Connector line for mobile (between steps) */}
              {index < steps.length - 1 && (
                <div className="hidden" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
