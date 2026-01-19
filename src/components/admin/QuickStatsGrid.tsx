'use client';

import { StatCard } from './StatCard';
import { cn } from '@/lib/utils/common';

interface QuickStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

interface QuickStatsGridProps {
  stats: QuickStat[];
  className?: string;
}

export function QuickStatsGrid({ stats, className }: QuickStatsGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6',
        className
      )}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          className={stat.color}
        />
      ))}
    </div>
  );
}
