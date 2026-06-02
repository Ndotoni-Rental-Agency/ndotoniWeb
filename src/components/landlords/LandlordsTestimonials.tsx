'use client';

import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/data/landlords';
import { useFadeIn } from '@/hooks/useFadeIn';
import { useLanguage } from '@/contexts/LanguageContext';

export function LandlordsTestimonials() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });
  const { t } = useLanguage();

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
          <div className="text-center space-y-3 mb-14">
            <span className="eyebrow">{t('landlordsPage.testimonials.eyebrow')}</span>
            <h2 className="section-heading">
              {t('landlordsPage.testimonials.heading1')}{' '}
              <span className="text-brand-600 dark:text-brand-400">
                {t('landlordsPage.testimonials.headingHighlight')}
              </span>
            </h2>
            <p className="section-sub max-w-md mx-auto">
              {t('landlordsPage.testimonials.subheading')}
            </p>
          </div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {TESTIMONIALS.map((testimonial, index) => {
              const propertyLabel =
                testimonial.propertiesListed === 1
                  ? t('landlordsPage.testimonials.propertyLabel_one')
                  : t('landlordsPage.testimonials.propertyLabel_other');

              return (
                <div
                  key={testimonial.name}
                  className="card flex flex-col gap-4 hover:shadow-editorial transition-shadow duration-300"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <Quote size={20} className="text-brand-400 flex-shrink-0" />

                  <p className="text-sm text-ink-700 dark:text-gray-300 leading-relaxed flex-1">
                    &ldquo;{t(`landlordsPage.testimonials.${testimonial.quoteKey}`)}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-stone-100 dark:border-gray-800">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${testimonial.color}`}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-ink-500 dark:text-gray-400">
                        {testimonial.location} · {testimonial.propertiesListed} {propertyLabel}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
