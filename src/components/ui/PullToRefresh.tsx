import React from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
  className = ''
}: PullToRefreshProps) {
  const { containerRef, isRefreshing, pullDistance, isPulling, isTriggered } = usePullToRefresh({
    onRefresh,
    threshold,
    resistance,
    enabled
  });

  const refreshIndicatorOpacity = Math.min(pullDistance / threshold, 1);
  const refreshIndicatorScale = Math.min(0.5 + (pullDistance / threshold) * 0.5, 1);
  const refreshIndicatorRotation = isRefreshing ? 360 : pullDistance * 2;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 pull-to-refresh-indicator"
        style={{
          height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
          opacity: isPulling || isRefreshing ? 1 : 0,
        }}
      >
        <div
          className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400"
          style={{
            opacity: refreshIndicatorOpacity,
            transform: `scale(${refreshIndicatorScale})`,
          }}
        >
          {/* Refresh Icon */}
          <div
            className={`w-6 h-6 mb-1 transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${refreshIndicatorRotation}deg)`,
            }}
          >
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          
          {/* Status Text */}
          <span className="text-xs font-medium">
            {isRefreshing
              ? 'Refreshing...'
              : isTriggered
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content with padding to account for refresh indicator */}
      <div
        className="pull-to-refresh-container"
        style={{
          transform: `translateY(${isPulling || isRefreshing ? Math.max(pullDistance, isRefreshing ? 60 : 0) : 0}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}