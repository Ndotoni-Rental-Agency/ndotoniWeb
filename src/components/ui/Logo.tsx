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
      title: 'text-xl',
      tagline: 'text-[8px] sm:text-[9px]'
    },
    md: {
      title: 'text-2xl',
      tagline: 'text-[9px] sm:text-[10px]'
    },
    lg: {
      title: 'text-3xl',
      tagline: 'text-[10px] sm:text-xs'
    }
  };

  const sizes = sizeClasses[size];

  return (
    <Link
      href={href}
      className={`group inline-flex items-center ${className}`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Wordmark */}
        <span
          className={`
            ${sizes.title}
            font-bold
            tracking-tight
            transition-all
            duration-300
          `}
        >
          <span className="text-gray-900 dark:text-white">
            Ndoto
          </span>
          <span className="text-emerald-600 dark:text-emerald-400">
            ni
          </span>
        </span>
      </div>
    </Link>
  );
}
