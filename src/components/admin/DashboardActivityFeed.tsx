'use client';

import {
  EnvelopeIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  UserPlusIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/common';
import Link from 'next/link';
import type { ActivityItem } from '@/hooks/useDashboardData';

const STATUS_BADGE: Record<string, string> = {
  SUBMITTED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  UNDER_REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  RESOLVED: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  AVAILABLE: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  DRAFT: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  RENTED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
};

const TYPE_ICON: Record<ActivityItem['type'], React.FC<React.SVGProps<SVGSVGElement>>> = {
  inquiry: EnvelopeIcon,
  application: DocumentTextIcon,
  property: BuildingOfficeIcon,
  user: UserPlusIcon,
};

const TYPE_ICON_COLOR: Record<ActivityItem['type'], string> = {
  inquiry: 'text-purple-600 dark:text-purple-400',
  application: 'text-blue-600 dark:text-blue-400',
  property: 'text-red-600 dark:text-red-400',
  user: 'text-green-600 dark:text-green-400',
};

const TYPE_ICON_BG: Record<ActivityItem['type'], string> = {
  inquiry: 'bg-purple-50 dark:bg-purple-900/20',
  application: 'bg-blue-50 dark:bg-blue-900/20',
  property: 'bg-red-50 dark:bg-red-900/20',
  user: 'bg-green-50 dark:bg-green-900/20',
};

interface DashboardActivityFeedProps {
  items: ActivityItem[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DashboardActivityFeed({
  items,
  isLoading,
  onRefresh,
}: DashboardActivityFeedProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle>Recent Activity</CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh"
            >
              <ArrowPathIcon className={cn('w-4 h-4', isLoading && 'animate-spin')} />
            </button>
          )}
          <Link href="/admin/inquiries">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No recent activity to display</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              const Icon = TYPE_ICON[item.type];
              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-start space-x-3 pb-4',
                    index < items.length - 1 &&
                      'border-b border-gray-100 dark:border-gray-800'
                  )}
                >
                  <div
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      TYPE_ICON_BG[item.type]
                    )}
                  >
                    <Icon className={cn('w-5 h-5', TYPE_ICON_COLOR[item.type])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {item.description}
                        </p>
                      </div>
                      {item.status && (
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0',
                            STATUS_BADGE[item.status] ?? 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {formatStatus(item.status)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {item.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
