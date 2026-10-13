'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

interface Stat {
  label: string;
  value: string;
}

interface AboutStatsProps {
  stats: Stat[];
}

export default function AboutStats({ stats }: AboutStatsProps) {
  const { ref, isVisible } = useFadeIn({ delay: 100 });

  return (
    <div
      ref={ref}
      className={`max-w-6xl mx-auto px-4 sm:px-6 mt-8 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-10 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="font-poster text-4xl lg:text-5xl font-bold tracking-tight text-brand-900 dark:text-brand-200">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
