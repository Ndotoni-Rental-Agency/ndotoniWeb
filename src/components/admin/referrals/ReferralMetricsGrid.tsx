'use client';

import {
  UsersIcon,
  ArrowPathIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import { DASHBOARD_METRICS } from '@/data/admin/referrals';
import { cn } from '@/lib/utils/common';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  trend?: { value: number; positive: boolean };
  highlighted?: boolean;
}

function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  highlighted,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border bg-white dark:bg-gray-800 p-5 transition-all duration-200 hover:shadow-md group',
        highlighted
          ? 'border-[#00CD54]/30 dark:border-[#00CD54]/20 shadow-sm'
          : 'border-gray-200 dark:border-gray-700 shadow-sm',
      )}
    >
      {/* Top row — icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2 rounded-xl', iconBg)}>
          <Icon className={cn('w-4 h-4', iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              'text-[11px] font-semibold px-1.5 py-0.5 rounded-md',
              trend.positive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
                : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
            )}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className={cn(
          'text-3xl font-bold tracking-tight leading-none mb-1.5',
          highlighted
            ? 'text-[#00CD54]'
            : 'text-gray-900 dark:text-white',
        )}
      >
        {value}
      </p>

      {/* Label */}
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-snug">
        {label}
      </p>

      {/* Subtext */}
      {subtext && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>
      )}

      {/* Subtle accent line at bottom for highlighted card */}
      {highlighted && (
        <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#00CD54]/40 to-transparent rounded-full" />
      )}
    </div>
  );
}

export function ReferralMetricsGrid() {
  const { t } = useLanguage();
  const m = DASHBOARD_METRICS;

  const metrics: MetricCardProps[] = [
    {
      label: t('adminReferrals.metrics.totalReferrals'),
      value: m.totalReferrals,
      subtext: 'All time',
      icon: UsersIcon,
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-500 dark:text-gray-400',
      trend: { value: 12, positive: true },
    },
    {
      label: t('adminReferrals.metrics.inProgress'),
      value: m.inProgress,
      subtext: 'Awaiting landlord response',
      icon: ArrowPathIcon,
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-500 dark:text-amber-400',
    },
    {
      label: t('adminReferrals.metrics.propertyListed'),
      value: m.propertyListed,
      subtext: `${m.pendingListingRewards} listing reward${m.pendingListingRewards !== 1 ? 's' : ''} pending`,
      icon: BuildingOfficeIcon,
      iconBg: 'bg-violet-50 dark:bg-violet-900/20',
      iconColor: 'text-violet-500 dark:text-violet-400',
      trend: { value: 8, positive: true },
    },
    {
      label: t('adminReferrals.metrics.totalRewardsPaid'),
      value: `TZS ${m.totalRewardsPaidTZS.toLocaleString()}`,
      subtext: 'Paid out to referrers',
      icon: CurrencyDollarIcon,
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      trend: { value: 24, positive: true },
      highlighted: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
