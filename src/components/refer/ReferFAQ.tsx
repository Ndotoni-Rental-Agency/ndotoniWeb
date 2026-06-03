'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { REFER_FAQS } from '@/data/refer';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

export function ReferFAQ() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-cream-50 dark:bg-gray-900">
      <div className="container py-20 sm:py-24">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Heading */}
          <div className="text-center space-y-3 mb-12 sm:mb-14">
            <span className="eyebrow">{t('referPage.faq.eyebrow')}</span>
            <h2 className="section-heading">
              {t('referPage.faq.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('referPage.faq.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-md mx-auto">
              {t('referPage.faq.subheading')}
            </p>
          </div>

          {/* Accordion */}
          <div className="max-w-2xl mx-auto divide-y divide-stone-100 dark:divide-gray-800 border border-stone-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-soft">
            {REFER_FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="bg-white dark:bg-gray-900">
                  <button
                    className={cn(
                      'w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset',
                      isOpen
                        ? 'bg-brand-50 dark:bg-brand-900/20'
                        : 'hover:bg-stone-50 dark:hover:bg-gray-800',
                    )}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        'text-sm font-semibold leading-snug',
                        isOpen
                          ? 'text-brand-700 dark:text-brand-400'
                          : 'text-ink-900 dark:text-white',
                      )}
                    >
                      {t(`referPage.faq.${faq.questionKey}`)}
                    </span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        'flex-shrink-0 transition-transform duration-300',
                        isOpen
                          ? 'rotate-180 text-brand-600 dark:text-brand-400'
                          : 'text-ink-400 dark:text-gray-500',
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                    )}
                    aria-hidden={!isOpen}
                  >
                    <p className="px-6 pb-5 pt-2 text-sm text-ink-500 dark:text-gray-400 leading-relaxed">
                      {t(`referPage.faq.${faq.answerKey}`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center mt-8 text-sm text-ink-500 dark:text-gray-400">
            {t('referPage.faq.stillHaveQuestions')}{' '}
            <a
              href="/contact"
              className="text-brand-600 dark:text-brand-400 font-semibold hover:underline underline-offset-2"
            >
              {t('referPage.faq.chatWithTeam')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
