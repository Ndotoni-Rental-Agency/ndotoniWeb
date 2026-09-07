'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/graphql/communication';
import type { InAppNotification } from '@/types/communication-user';
import { useAuth } from './AuthContext';

const POLL_INTERVAL_MS = 30_000;
const DROPDOWN_LIMIT = 15;

interface NotificationContextType {
  unreadCount: number;
  notifications: InAppNotification[];
  loadingNotifications: boolean;
  refreshUnreadCount: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  markAsRead: (sortKey: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const lastUnreadRefresh = useRef(0);
  const initialLoadDone = useRef(false);

  const refreshUnreadCount = useCallback(async () => {
    if (!user) return;

    const now = Date.now();
    if (now - lastUnreadRefresh.current < 500) return;
    lastUnreadRefresh.current = now;

    try {
      const data = await GraphQLClient.executeAuthenticated<{
        getUnreadNotificationCount: { count: number };
      }>(getUnreadNotificationCount);
      setUnreadCount(data.getUnreadNotificationCount.count ?? 0);
    } catch (error) {
      console.error('[Notifications] Failed to fetch unread count:', error);
    }
  }, [user]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      if (!initialLoadDone.current) {
        setLoadingNotifications(true);
      }
      const data = await GraphQLClient.executeAuthenticated<{
        getMyNotifications: { notifications: InAppNotification[] };
      }>(getMyNotifications, { limit: DROPDOWN_LIMIT });

      setNotifications(data.getMyNotifications.notifications ?? []);
      initialLoadDone.current = true;
    } catch (error) {
      console.error('[Notifications] Failed to load notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (sortKey: string) => {
      if (!user) return;

      try {
        await GraphQLClient.executeAuthenticated(markNotificationRead, { sortKey });
        setNotifications((prev) =>
          prev.map((n) =>
            n.sortKey === sortKey ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        await refreshUnreadCount();
      } catch (error) {
        console.error('[Notifications] Failed to mark as read:', error);
      }
    },
    [user, refreshUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      await GraphQLClient.executeAuthenticated(markAllNotificationsRead);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('[Notifications] Failed to mark all as read:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUnreadCount(0);
      setNotifications([]);
      initialLoadDone.current = false;
      return;
    }

    refreshUnreadCount();
    loadNotifications();

    const interval = setInterval(() => {
      refreshUnreadCount();
      loadNotifications();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, refreshUnreadCount, loadNotifications]);

  const value: NotificationContextType = {
    unreadCount,
    notifications,
    loadingNotifications,
    refreshUnreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

const SSR_DEFAULT: NotificationContextType = {
  unreadCount: 0,
  notifications: [],
  loadingNotifications: false,
  refreshUnreadCount: async () => {},
  loadNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    if (typeof window === 'undefined') {
      return SSR_DEFAULT;
    }
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
