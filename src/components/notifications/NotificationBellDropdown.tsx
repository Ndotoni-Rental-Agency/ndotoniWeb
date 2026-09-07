'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils/common';
import type { InAppNotification } from '@/types/communication-user';

const iconBtn =
  'inline-flex items-center justify-center h-11 w-11 rounded-full text-ink-700 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors';

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationBellDropdown() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    unreadCount,
    notifications,
    loadingNotifications,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      loadNotifications();
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, loadNotifications]);

  const handleSelect = async (notification: InAppNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.sortKey);
    }
    setOpen(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn('relative', iconBtn)}
        title={t('notifications.title')}
        aria-label={t('notifications.title')}
        aria-expanded={open}
      >
        <Bell className="w-5 h-5" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1.5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 mt-2 w-[min(100vw-1.5rem,22rem)] bg-white dark:bg-gray-800 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-700 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-ink-900 dark:text-white">
                {t('notifications.title')}
              </h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
                >
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>

            <div className="max-h-[min(24rem,60vh)] overflow-y-auto">
              {loadingNotifications && notifications.length === 0 ? (
                <p className="px-4 py-8 text-sm text-center text-gray-500">
                  {t('notifications.loading')}
                </p>
              ) : notifications.length === 0 ? (
                <p className="px-4 py-8 text-sm text-center text-gray-500">
                  {t('notifications.empty')}
                </p>
              ) : (
                <ul className="divide-y divide-stone-100 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <li key={notification.sortKey}>
                      <button
                        type="button"
                        onClick={() => handleSelect(notification)}
                        className={cn(
                          'w-full text-left px-4 py-3 hover:bg-brand-50/60 dark:hover:bg-gray-700/50 transition-colors',
                          !notification.isRead && 'bg-brand-50/40 dark:bg-brand-900/10'
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {!notification.isRead && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                          )}
                          <div className={cn('min-w-0 flex-1', notification.isRead && 'pl-4')}>
                            <p className="text-sm font-medium text-ink-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-ink-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                              {notification.body}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              {formatTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-stone-100 dark:border-gray-700 px-4 py-3">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                {t('notifications.viewAll')}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
