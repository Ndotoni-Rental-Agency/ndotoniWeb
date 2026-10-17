'use client';

import React from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';

interface VerifiedPropertyBadgeProps {
  verified: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export default function VerifiedPropertyBadge({
  verified,
  size = 'sm',
  className,
}: VerifiedPropertyBadgeProps) {
  const { t } = useLanguage();

  if (!verified) return null;

  const sizeClasses = {
    sm: 'text-[11px] gap-1.5',
    md: 'text-sm gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
        sizeClasses[size],
        className
      )}
    >
      <ShieldCheckIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="whitespace-nowrap">{t('propertyDetails.verifiedProperty')}</span>
    </span>
  );
}
