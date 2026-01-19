'use client';

import { cn } from '@/lib/utils/common';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  height?: number;
  showValues?: boolean;
  className?: string;
}

export function SimpleBarChart({
  data,
  height = 200,
  showValues = false,
  className,
}: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end justify-between space-x-2" style={{ height }}>
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * 100;
          const barColor = point.color || 'bg-red-500';

          return (
            <div key={index} className="flex-1 flex flex-col items-center justify-end">
              <div className="w-full relative group">
                {showValues && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {point.value}
                  </div>
                )}
                <div
                  className={cn(
                    'w-full rounded-t-lg transition-all duration-300 hover:opacity-80',
                    barColor
                  )}
                  style={{ height: `${barHeight}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
                {point.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
