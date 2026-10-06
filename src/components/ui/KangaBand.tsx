'use client';

import { useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

/** A restrained khanga-inspired border and saying, shared across the site. */
export function KangaBand({
  variant = 'full',
  className,
}: {
  variant?: 'full' | 'thin';
  className?: string;
}) {
  const { language } = useLanguage();
  const patternId = `khanga-${useId().replace(/:/g, '')}`;
  const thin = variant === 'thin';
  const height = thin ? 12 : 20;
  const center = height / 2;

  const pindo = (
    <svg aria-hidden="true" className="block h-full w-full">
      <defs>
        <pattern
          id={patternId}
          width="40"
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M20 ${center - 4} L24 ${center} L20 ${center + 4} L16 ${center} Z`}
            fill="none"
            stroke="#F4F0E6"
            strokeOpacity="0.65"
            strokeWidth="0.8"
          />
          <path
            d={`M0 ${center} H8 M32 ${center} H40`}
            stroke="#F4F0E6"
            strokeOpacity="0.22"
            strokeWidth="0.8"
          />
          <circle
            cx="20"
            cy={center}
            r="0.9"
            fill="#F4F0E6"
            fillOpacity="0.8"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );

  if (thin) {
    return (
      <div
        className={cn(
          'h-3 w-full overflow-hidden rounded-sm bg-[#163b2c]',
          className,
        )}
      >
        {pindo}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative flex h-9 w-full items-center overflow-hidden border-y border-[#f4f0e6]/15 bg-[#163b2c] sm:h-10',
        className,
      )}
    >
      <div className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2">
        {pindo}
      </div>
      <p
        className="relative mx-auto max-w-[calc(100%-2rem)] bg-[#163b2c] px-4 text-center text-[10px] font-medium tracking-[0.1em] text-[#f4f0e6]/85 sm:px-8 sm:text-xs sm:tracking-[0.14em]"
        title={
          language === 'en' ? 'Little by little fills the measure' : undefined
        }
        aria-label={
          language === 'en'
            ? 'Haba na haba hujaza kibaba — Little by little fills the measure'
            : undefined
        }
      >
        Haba na haba hujaza kibaba
      </p>
    </div>
  );
}
