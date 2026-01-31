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
      className={`max-w-6xl mx-auto px-6 -mt-12 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
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

