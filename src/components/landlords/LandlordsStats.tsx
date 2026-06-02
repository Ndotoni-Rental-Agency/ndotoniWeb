'use client';

import { STATS } from '@/data/landlords';
import { useFadeIn } from '@/hooks/useFadeIn';

export function LandlordsStats() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

  return (
    <section className="bg-ink-900 dark:bg-gray-950">
      <div className="container py-14 sm:py-16">
        <div
          ref={ref}
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section label */}
          <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-brand-400 mb-10">
            Ndotoni by the numbers
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center space-y-1"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <p className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-brand-400">{stat.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed hidden sm:block">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
