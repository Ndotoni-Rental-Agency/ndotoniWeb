import { cn } from '@/lib/utils/common';
import type { ReferralStatus, RewardStatus } from '@/data/admin/referrals';

const REFERRAL_STATUS_STYLES: Record<ReferralStatus, string> = {
  SUBMITTED:
    'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  IN_PROGRESS:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  PROPERTY_LISTED:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  PROPERTY_RENTED:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
};

const REFERRAL_STATUS_DOTS: Record<ReferralStatus, string> = {
  SUBMITTED: 'bg-gray-400',
  IN_PROGRESS: 'bg-blue-500',
  PROPERTY_LISTED: 'bg-amber-500',
  PROPERTY_RENTED: 'bg-emerald-500',
};

const REWARD_STATUS_STYLES: Record<RewardStatus, string> = {
  PENDING:
    'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  ELIGIBLE:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  PAID:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
};

interface ReferralStatusBadgeProps {
  status: ReferralStatus;
  label: string;
  size?: 'sm' | 'md';
}

export function ReferralStatusBadge({ status, label, size = 'md' }: ReferralStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        REFERRAL_STATUS_STYLES[status],
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', REFERRAL_STATUS_DOTS[status])} />
      {label}
    </span>
  );
}

interface RewardStatusBadgeProps {
  status: RewardStatus;
  label: string;
  size?: 'sm' | 'md';
}

export function RewardStatusBadge({ status, label, size = 'md' }: RewardStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        REWARD_STATUS_STYLES[status],
      )}
    >
      {label}
    </span>
  );
}
