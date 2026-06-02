'use client';

import { Building2, Megaphone, Users, type LucideIcon } from 'lucide-react';
import { HOW_IT_WORKS } from '@/data/landlords';
import { useFadeIn } from '@/hooks/useFadeIn';

const ICON_MAP: Record<string, LucideIcon> = {
  building: Building2,
  megaphone: Megaphone,
  users: Users,
};

export function LandlordsHowItWorks() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

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
          <div className="text-center space-y-3 mb-14 sm:mb-16">
            <span className="eyebrow">How it works</span>
            <h2 className="section-heading">
              Three steps to your
              <br />
              <span className="text-brand-600 dark:text-brand-400">next great tenant</span>
            </h2>
            <p className="section-sub max-w-lg mx-auto">
              We&apos;ve simplified the entire process so you can focus on owning, not managing.
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connector line — desktop only */}
            <div
              className="hidden lg:block absolute top-14 left-[calc(16.666%+2rem)] right-[calc(16.666%+2rem)] h-px bg-gradient-to-r from-transparent via-brand-200 dark:via-brand-800 to-transparent"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {HOW_IT_WORKS.map((step, index) => {
                const Icon = ICON_MAP[step.icon] ?? Building2;
                return (
                  <div
                    key={step.number}
                    className="relative flex flex-col items-center text-center group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Step badge */}
                    <div className="relative mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 shadow-soft flex items-center justify-center group-hover:shadow-green-sm group-hover:border-brand-200 dark:group-hover:border-brand-700 transition-all duration-300">
                        <Icon size={22} className="text-brand-600 dark:text-brand-400" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                        {index + 1}
                      </span>
                    </div>

                    {/* Step number label */}
                    <span className="text-xs font-semibold tracking-widest uppercase text-brand-500 dark:text-brand-400 mb-1">
                      Step {step.number}
                    </span>

                    <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white mb-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-ink-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
