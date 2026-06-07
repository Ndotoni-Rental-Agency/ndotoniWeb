'use client';

import React from 'react';
import { BadgeCheck } from 'lucide-react';
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
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
  };

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full font-semibold',
        'bg-emerald-600/95 text-white shadow-sm backdrop-blur-sm',
        sizeClasses[size],
        className
      )}
    >
      <BadgeCheck className={iconSizes[size]} strokeWidth={2.5} />
      <span className="whitespace-nowrap">{t('propertyDetails.verifiedProperty')}</span>
    </span>
  );
}
