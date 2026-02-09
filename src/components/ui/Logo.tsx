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
      icon: 'w-6 h-6',
      title: 'text-lg',
      tagline: 'text-[8px] sm:text-[9px]'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-8 h-8',
      title: 'text-xl',
      tagline: 'text-[9px] sm:text-[10px]'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-9 h-9',
      title: 'text-2xl',
      tagline: 'text-[10px] sm:text-xs'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <Link href={href} className={`flex items-center ${iconOnly ? 'justify-center' : 'gap-3'} group ${className}`}>
      <div className="relative">
        {/* Main logo container with professional styling */}
        <div className={`${sizes.container} `}>
          {/* Font Awesome bed icon - professional and recognizable */}
        
          
          {/* Subtle inner highlight */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-md pointer-events-none"></div>
        </div>
        
        {/* Professional glow effect */}
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <span className={`${sizes.title} font-bold tracking-tight`}>
            <span className="text-gray-900 dark:text-white">Ndoto</span>
            <span className="text-emerald-600 dark:text-emerald-400">ni</span>
          </span>
          {showTagline && (
            <span className={`${sizes.tagline} text-gray-900 dark:text-gray-100 font-medium tracking-wide -mt-0.5`}>
              Find Your Home
            </span>
          )}
        </div>
      )}
    </Link>
  );
}