'use client';

import Link from 'next/link';
import { useFadeIn } from '@/hooks/useFadeIn';

export default function ContactCTA() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

  return (
    <div 
      ref={ref}
      className={`py-16 bg-red-500 dark:bg-red-600 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-red-100 dark:text-red-200 text-lg mb-8 max-w-2xl mx-auto transition-colors">
          Join thousands of satisfied customers who have found their perfect properties with ndotoni.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/search"
            className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors"
          >
            Browse Properties
          </Link>
          <Link 
            href="/about"
            className="border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-3 rounded-full font-medium transition-colors"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  );
}

