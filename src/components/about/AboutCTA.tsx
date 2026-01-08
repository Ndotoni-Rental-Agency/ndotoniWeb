'use client';

import Link from 'next/link';
import { useFadeIn } from '@/hooks/useFadeIn';

export default function AboutCTA() {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

  return (
    <div 
      ref={ref}
      className={`relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-5"></div>
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white">
          Ready to Find Your Perfect Home?
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Join thousands of satisfied tenants who have found their ideal properties through ndotoni.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link 
            href="/search"
            className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
          >
            Start Searching
          </Link>
          <Link 
            href="/contact"
            className="px-8 py-4 bg-transparent text-white rounded-full font-medium border-2 border-white hover:bg-white hover:text-gray-900 transition-all hover:scale-105"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

