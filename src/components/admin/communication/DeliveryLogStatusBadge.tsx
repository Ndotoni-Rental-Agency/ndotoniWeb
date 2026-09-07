'use client';

import { cn } from '@/lib/utils/common';
import type { DeliveryStatus } from '@/types/communication-admin';

const STATUS_STYLES: Record<DeliveryStatus, string> = {
  SENT: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  DELIVERED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  SUPPRESSED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  BOUNCED: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

interface DeliveryLogStatusBadgeProps {
  status: DeliveryStatus;
  className?: string;
}

export function DeliveryLogStatusBadge({ status, className }: DeliveryLogStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
        className
      )}
    >
      {status}
    </span>
  );
}
