'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthRequiredView } from '@/components/profile';
import { GraphQLClient } from '@/lib/graphql-client';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '@/graphql/communication';
import type { InAppNotification } from '@/types/communication-user';
import { cn } from '@/lib/utils/common';

export const dynamic = 'force-dynamic';

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-TZ', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = useCallback(
    async (append = false) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await GraphQLClient.executeAuthenticated<{
          getMyNotifications: {
            notifications: InAppNotification[];
            nextToken?: string | null;
          };
        }>(getMyNotifications, {
          limit: 30,
          nextToken: append ? nextToken : undefined,
        });

        const fetched = data.getMyNotifications.notifications ?? [];
        setNextToken(data.getMyNotifications.nextToken ?? null);
        setNotifications((prev) => (append ? [...prev, ...fetched] : fetched));
      } catch (error) {
        console.error('[NotificationsPage] load failed:', error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [nextToken]
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadPage(false);
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMarkRead = async (notification: InAppNotification) => {
    if (notification.isRead) {
      if (notification.actionUrl) router.push(notification.actionUrl);
      return;
    }

    try {
      await GraphQLClient.executeAuthenticated(markNotificationRead, {
        sortKey: notification.sortKey,
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.sortKey === notification.sortKey
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      if (notification.actionUrl) router.push(notification.actionUrl);
    } catch (error) {
      console.error('[NotificationsPage] mark read failed:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await GraphQLClient.executeAuthenticated(markAllNotificationsRead);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() }))
      );
    } catch (error) {
      console.error('[NotificationsPage] mark all failed:', error);
    }
  };

  if (!isAuthenticated) {
    return <AuthRequiredView />;
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-white">
            {t('notifications.title')}
          </h1>
          <p className="text-sm text-ink-500 dark:text-gray-400 mt-1">
            {t('notifications.pageSubtitle')}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 shrink-0"
          >
            {t('notifications.markAllRead')}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-stone-200 dark:border-gray-700 overflow-hidden shadow-soft">
        {loading && notifications.length === 0 ? (
          <p className="px-6 py-12 text-sm text-center text-gray-500">{t('notifications.loading')}</p>
        ) : notifications.length === 0 ? (
          <p className="px-6 py-12 text-sm text-center text-gray-500">{t('notifications.empty')}</p>
        ) : (
          <ul className="divide-y divide-stone-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <li key={notification.sortKey}>
                <button
                  type="button"
                  onClick={() => handleMarkRead(notification)}
                  className={cn(
                    'w-full text-left px-5 py-4 hover:bg-brand-50/50 dark:hover:bg-gray-700/40 transition-colors',
                    !notification.isRead && 'bg-brand-50/30 dark:bg-brand-900/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    )}
                    <div className={cn('min-w-0 flex-1', notification.isRead && 'pl-5')}>
                      <p className="font-medium text-ink-900 dark:text-white">{notification.title}</p>
                      <p className="text-sm text-ink-500 dark:text-gray-400 mt-1">{notification.body}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.createdAt)}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {nextToken && (
          <div className="p-4 border-t border-stone-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => loadPage(true)}
              disabled={loadingMore}
              className="w-full rounded-xl border border-stone-200 dark:border-gray-600 py-2.5 text-sm font-medium text-ink-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              {loadingMore ? t('notifications.loading') : t('notifications.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
