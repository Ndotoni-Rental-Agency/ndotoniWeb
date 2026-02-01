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
      tagline: 'text-[8px] sm:text-[9px]'
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      title: 'text-xl',
      tagline: 'text-[9px] sm:text-[10px]'
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-2xl',
      tagline: 'text-[10px] sm:text-xs'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <Link href={href} className={`flex items-center ${iconOnly ? 'justify-center' : 'gap-3'} group ${className}`}>
      <div className="relative">
        {/* Main logo container with professional styling */}
        <div className={`${sizes.container} bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-red-500 dark:via-red-600 dark:to-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-lg group-hover:shadow-xl border border-gray-600/20 dark:border-red-400/20`}>
          {/* Font Awesome bed icon - professional and recognizable */}
          <svg className={`${sizes.icon} text-white drop-shadow-sm`} fill="currentColor" viewBox="0 0 640 640">
            <path d="M64 96C81.7 96 96 110.3 96 128L96 352L320 352L320 224C320 206.3 334.3 192 352 192L512 192C565 192 608 235 608 288L608 512C608 529.7 593.7 544 576 544C558.3 544 544 529.7 544 512L544 448L96 448L96 512C96 529.7 81.7 544 64 544C46.3 544 32 529.7 32 512L32 128C32 110.3 46.3 96 64 96zM144 256C144 220.7 172.7 192 208 192C243.3 192 272 220.7 272 256C272 291.3 243.3 320 208 320C172.7 320 144 291.3 144 256z"/>
          </svg>
          
          {/* Subtle inner highlight */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-md pointer-events-none"></div>
        </div>
        
        {/* Professional glow effect */}
        <div className={`absolute inset-0 ${sizes.container} bg-gradient-to-br from-gray-700 to-gray-900 dark:from-red-500 dark:to-orange-500 rounded-lg blur-sm opacity-20 group-hover:opacity-30 transition-opacity -z-10`}></div>
      </div>
      
      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <span className={`${sizes.title} font-bold tracking-tight bg-gradient-to-r from-gray-900 via-red-600 to-red-700 dark:from-white dark:via-red-300 dark:to-orange-300 bg-clip-text text-transparent`}>
            Ndotoni
          </span>
          {showTagline && (
            <span className={`${sizes.tagline} text-gray-600 dark:text-gray-400 font-medium tracking-wide -mt-0.5`}>
              Find Your Home
            </span>
          )}
        </div>
      )}
    </Link>
  );
}