'use client';

import React from 'react';
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

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
  };

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center font-medium text-brand-600 dark:text-brand-400',
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn('rounded-full bg-brand-600 dark:bg-brand-400', dotSizes[size])}
        aria-hidden
      />
      <span className="whitespace-nowrap">{t('propertyDetails.verifiedProperty')}</span>
    </span>
  );
}
