'use client';

import {
  UsersIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import { DASHBOARD_METRICS } from '@/data/admin/referrals';
import { cn } from '@/lib/utils/common';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accent?: boolean;
}

function MetricCard({ label, value, icon: Icon, iconBg, iconColor, accent }: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 bg-white dark:bg-gray-800 transition-shadow hover:shadow-md',
        accent
          ? 'border-emerald-200 dark:border-emerald-800'
          : 'border-gray-200 dark:border-gray-700',
      )}
    >
      <div className={cn('p-2 rounded-lg flex-shrink-0', iconBg)}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
        <p className={cn('text-2xl font-bold', accent ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white')}>
          {value}
        </p>
      </div>
    </div>
  );
}

export function ReferralMetricsGrid() {
  const { t } = useLanguage();
  const m = DASHBOARD_METRICS;

  const metrics = [
    {
      label: t('adminReferrals.metrics.totalReferrals'),
      value: m.totalReferrals,
      icon: UsersIcon,
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
    },
    {
      label: t('adminReferrals.metrics.submitted'),
      value: m.submitted,
      icon: ClockIcon,
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: t('adminReferrals.metrics.inProgress'),
      value: m.inProgress,
      icon: ArrowPathIcon,
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      label: t('adminReferrals.metrics.propertyListed'),
      value: m.propertyListed,
      icon: BuildingOfficeIcon,
      iconBg: 'bg-violet-50 dark:bg-violet-900/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: t('adminReferrals.metrics.propertyRented'),
      value: m.propertyRented,
      icon: CheckCircleIcon,
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      accent: true,
    },
    {
      label: t('adminReferrals.metrics.totalRewardsPaid'),
      value: `TZS ${m.totalRewardsPaidTZS.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      accent: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}
