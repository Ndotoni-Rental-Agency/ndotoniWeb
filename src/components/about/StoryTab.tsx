'use client';

import { useFadeIn } from '@/hooks/useFadeIn';

export default function StoryTab() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

  return (
    <div 
      ref={ref}
      className={`space-y-8 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Our Story</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
      </div>
      
      <div className="prose prose-lg max-w-none space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
        <p className="text-xl dark:text-gray-300">
          ndotoni was born out of a simple frustration: finding quality rental properties in East Africa 
          was unnecessarily complicated, time-consuming, and often unreliable.
        </p>
        <p className="dark:text-gray-300">
          In 2016, we set out to change this. We started with a vision to create a platform that would 
          connect property owners directly with tenants, eliminating the middlemen and reducing costs 
          while improving transparency and trust.
        </p>
        <p className="dark:text-gray-300">
          What began as a small startup in Tanzania has grown into the leading property rental platform 
          across East Africa. We've helped thousands of families find their perfect home and enabled 
          property owners to manage their investments more effectively.
        </p>
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-red-100 dark:border-red-800/50">
          <p className="text-gray-800 dark:text-gray-200 italic font-medium m-0">
            "Today, we continue to innovate and expand our services, always keeping our core mission at 
            heart: making quality housing accessible to everyone."
          </p>
        </div>
      </div>
    </div>
  );
}

