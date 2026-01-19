import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/common';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  description,
  iconBgColor = 'bg-red-100 dark:bg-red-900/20',
  className 
}: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1.5">
              {value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={cn(
                    'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium',
                    trend.isPositive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  vs last period
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn('p-2 rounded-lg flex-shrink-0', iconBgColor)}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
