'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  iconOnly?: boolean;
}

export default function Logo({ 
  className = '', 
  showTagline = true, 
  size = 'md',
  href = '/',
  iconOnly = false
}: LogoProps) {
  const sizeClasses = {
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      title: 'text-lg',
      tagline: 'text-[9px] sm:text-[10px]'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      title: 'text-xl',
      tagline: 'text-[10px] sm:text-xs'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-2xl',
      tagline: 'text-xs sm:text-sm'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <Link href={href} className={`flex items-center ${iconOnly ? 'justify-center' : 'gap-3'} group ${className}`}>
      <div className="relative">
        <div className={`${sizes.container} bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900 dark:from-orange-400 dark:via-red-500 dark:to-pink-500 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl`}>
          <svg className={`${sizes.icon} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        {/* Subtle glow effect */}
        <div className={`absolute inset-0 ${sizes.container} bg-gradient-to-br from-orange-400 to-red-500 rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity -z-10`}></div>
      </div>
      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <span className={`${sizes.title} font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-600 dark:from-white dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent`}>
            Ndotoni
          </span>
          {showTagline && (
            <span className={`${sizes.tagline} text-gray-500 dark:text-gray-400 font-medium -mt-1`}>
              Find Your Home
            </span>
          )}
        </div>
      )}
    </Link>
  );
}