'use client';

import { useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

/**
 * Kanga-style border band — Ndotoni's signature divider.
 * A kanga has a patterned pindo (border) and a jina (saying); the full band
 * carries both, the thin variant only the pindo.
 */
export function KangaBand({
  variant = 'full',
  className,
}: {
  variant?: 'full' | 'thin';
  className?: string;
}) {
  const { language } = useLanguage();
  const patternId = useId().replace(/:/g, '');
  const thin = variant === 'thin';
  const tile = thin ? 14 : 24;

  const pindo = (
    <svg aria-hidden="true" className="block h-full w-full" preserveAspectRatio="none">
      <defs>
        <pattern id={patternId} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <rect width={tile} height={tile} fill="#111827" />
          <path
            d={`M${tile / 2} ${tile * 0.14} L${tile * 0.86} ${tile / 2} L${tile / 2} ${tile * 0.86} L${tile * 0.14} ${tile / 2} Z`}
            fill="#FACC15"
          />
          <circle cx={tile / 2} cy={tile / 2} r={tile * 0.11} fill="#111827" />
          <circle cx="0" cy="0" r={tile * 0.12} fill="#3DCC7E" />
          <circle cx={tile} cy="0" r={tile * 0.12} fill="#3DCC7E" />
          <circle cx="0" cy={tile} r={tile * 0.12} fill="#3DCC7E" />
          <circle cx={tile} cy={tile} r={tile * 0.12} fill="#3DCC7E" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );

  if (thin) {
    return <div className={cn('h-3.5 w-full overflow-hidden rounded-sm', className)}>{pindo}</div>;
  }

  return (
    <div className={cn('relative h-12 w-full overflow-hidden bg-ink-900 sm:h-14', className)}>
      <div className="absolute inset-x-0 top-1.5 bottom-1.5 sm:top-2 sm:bottom-2">{pindo}</div>
      <div className="absolute inset-x-0 top-0 h-px bg-sand-400/60" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-sand-400/60" />
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-ink-900 px-4 font-poster text-[11px] font-bold uppercase tracking-[0.16em] text-sand-300 sm:px-6 sm:text-sm">
        {language === 'sw' ? 'Haba na haba hujaza kibaba' : 'Little by little fills the measure'}
      </p>
    </div>
  );
}
