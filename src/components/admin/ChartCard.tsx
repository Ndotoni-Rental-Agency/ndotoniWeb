'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils/common';

interface ChartCardProps {
  title: string;
  value?: string | number;
  change?: {
    value: number;
    label: string;
  };
  chart?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  value,
  change,
  chart,
  icon,
  className,
}: ChartCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
          {icon && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {value && (
          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {change && (
              <div className="flex items-center mt-1">
                <span
                  className={cn(
                    'text-xs font-medium flex items-center',
                    change.value >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  )}
                >
                  {change.value >= 0 ? '↑' : '↓'}
                  <span className="ml-1">{Math.abs(change.value)}%</span>
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {change.label}
                </span>
              </div>
            )}
          </div>
        )}
        {chart && <div className="w-full">{chart}</div>}
      </CardContent>
    </Card>
  );
}
