import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-5 h-5',
  lg: 'w-7 h-7',
  xl: 'w-10 h-10'
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm`}>
        <svg 
          className={`${iconSizes[size]} text-white`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5"
        >
          {/* Bed frame */}
          <rect x="4" y="14" width="16" height="6" rx="1" fill="currentColor" opacity="0.8"/>
          {/* Pillow */}
          <rect x="6" y="11" width="4" height="3" rx="1.5" fill="currentColor" opacity="0.6"/>
          {/* Sleeping person head */}
          <circle cx="8" cy="12.5" r="1.2" fill="currentColor" opacity="0.9"/>
          {/* Closed eyes - peaceful sleep */}
          <path 
            d="M7.4 12.2c0.2-0.1 0.4-0.1 0.6 0M8.4 12.2c0.2-0.1 0.4-0.1 0.6 0" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            fill="none" 
            opacity="0.7"
          />
          {/* Body under blanket */}
          <path 
            d="M10 13c2 0 6 0.5 8 1v4c-2-0.5-6-1-8-1z" 
            fill="currentColor" 
            opacity="0.7"
          />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-indigo-600 dark:text-indigo-400`}>
          ndotoni
        </span>
      )}
    </div>
  );
}

// Alternative version with more detailed sleeping scene
export function LogoDetailed({ size = 'lg', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          className={`${iconSizes[size]} text-white`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          strokeWidth="1.2"
        >
          {/* Bed frame with legs */}
          <rect x="3" y="15" width="18" height="5" rx="1" fill="currentColor" opacity="0.8"/>
          <path d="M5 20v1M19 20v1" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
          
          {/* Mattress */}
          <rect x="4" y="13" width="16" height="2" rx="0.5" fill="currentColor" opacity="0.6"/>
          
          {/* Pillow */}
          <rect x="5" y="10" width="5" height="3" rx="1.5" fill="currentColor" opacity="0.7"/>
          
          {/* Sleeping person head */}
          <circle cx="7.5" cy="11.5" r="1.5" fill="currentColor" opacity="0.9"/>
          
          {/* Peaceful closed eyes */}
          <path 
            d="M6.8 11.2c0.3-0.1 0.6-0.1 0.9 0M7.8 11.2c0.3-0.1 0.6-0.1 0.9 0" 
            stroke="currentColor" 
            strokeWidth="0.6" 
            fill="none" 
            opacity="0.6"
          />
          
          {/* Body under blanket */}
          <path 
            d="M9 12c3 0 8 0.5 10 1.5v3c-2-1-7-1.5-10-1.5z" 
            fill="currentColor" 
            opacity="0.7"
          />
          
          {/* Blanket edge */}
          <path 
            d="M9 12c3 0 8 0.5 10 1.5" 
            stroke="currentColor" 
            strokeWidth="0.8" 
            fill="none" 
            opacity="0.5"
          />
          
          {/* Dream bubbles */}
          <circle cx="12" cy="8" r="0.8" fill="currentColor" opacity="0.3"/>
          <circle cx="14" cy="6" r="1.2" fill="currentColor" opacity="0.2"/>
          <circle cx="16" cy="4" r="1.5" fill="currentColor" opacity="0.1"/>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-bold text-indigo-600 dark:text-indigo-400 leading-tight`}>
            ndotoni
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 italic">
            in the dream
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;