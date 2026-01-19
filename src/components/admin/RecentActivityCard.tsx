'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/common';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    color: string;
  };
}

interface RecentActivityCardProps {
  title: string;
  items: ActivityItem[];
  viewAllHref?: string;
  emptyMessage?: string;
  className?: string;
}

export function RecentActivityCard({
  title,
  items,
  viewAllHref,
  emptyMessage = 'No recent activity',
  className,
}: RecentActivityCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>{title}</CardTitle>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-start space-x-3 pb-4',
                  index < items.length - 1 &&
                    'border-b border-gray-200 dark:border-gray-700'
                )}
              >
                {item.icon && (
                  <div className="flex-shrink-0 w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          item.badge.color
                        )}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
