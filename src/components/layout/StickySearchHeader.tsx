'use client';

import { useEffect, useState } from 'react';
import SimpleSearchBar from '@/components/ui/SimpleSearchBar';
import Logo from '@/components/ui/Logo';

export default function StickySearchHeader() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header after scrolling past hero section (approximately 400px)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md z-[9997] animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Logo />

          {/* Compact Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SimpleSearchBar variant="sticky" isScrolled={true} />
          </div>

          {/* Right side actions (optional) */}
          <div className="flex-shrink-0">
            {/* You can add user menu or other actions here */}
          </div>
        </div>
      </div>
    </div>
  );
}
