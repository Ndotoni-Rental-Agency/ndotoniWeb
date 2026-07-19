'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listWhatsAppConversations, getWhatsAppChatHistory } from '@/graphql/queries';
import { sendWhatsAppMessage } from '@/graphql/mutations';
import type {
  WhatsAppChatEntry,
  WhatsAppConversationRow,
  GetWhatsAppChatHistoryQuery,
  ListWhatsAppConversationsQuery,
  SendWhatsAppMessageMutation,
} from '@/API';

export const SESSION_WINDOW_MS = 24 * 60 * 60 * 1000;
export const POLL_INTERVAL_MS = 30_000;
export const LIFT_HOLD_COMMAND = 'LIFT_HOLD';
const CONVERSATION_LIST_LIMIT = 300;

export const SEND_RESPONSE = {
  SESSION_STARTER_SENT: 'SESSION_STARTER_SENT',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
} as const;

export const SEND_NOTICE = {
  SESSION_STARTER_SENT:
    'Session expired. Conversation starter sent — your message will be delivered when they reply.',
  SESSION_EXPIRED: 'Cannot reply — 24h session expired. User must message first.',
} as const;

export type WhatsAppChatSummary = GetWhatsAppChatHistoryQuery['getWhatsAppChatHistory'];
export type GroupedChatEntries = { date: string; items: WhatsAppChatEntry[] };

export function computeIsWithinSessionWindow(entries: WhatsAppChatEntry[]): boolean {
  const lastInbound = [...entries].reverse().find((entry) => entry.direction === 'in');
  if (!lastInbound?.ts) return false;
  return Date.now() - new Date(lastInbound.ts).getTime() < SESSION_WINDOW_MS;
}

function groupEntriesByDate(entries: WhatsAppChatEntry[]): GroupedChatEntries[] {
  return entries.reduce<GroupedChatEntries[]>((acc, entry) => {
    const date = entry.ts.slice(0, 10);
    const last = acc[acc.length - 1];
    if (last?.date === date) {
      last.items.push(entry);
    } else {
      acc.push({ date, items: [entry] });
    }
    return acc;
  }, []);
}

function createOptimisticEntry(phone: string, text: string): WhatsAppChatEntry {
  return {
    __typename: 'WhatsAppChatEntry',
    ts: new Date().toISOString(),
    direction: 'out',
    phone,
    type: 'text',
    text,
    source: 'admin',
  };
}

export function useWhatsAppConversations() {
  const [conversations, setConversations] = useState<WhatsAppConversationRow[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [chatSummary, setChatSummary] = useState<WhatsAppChatSummary | null>(null);
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendNotice, setSendNotice] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    setLoadingList(true);
    setListError(null);

    try {
      const data = await GraphQLClient.executeAuthenticated<ListWhatsAppConversationsQuery>(
        listWhatsAppConversations,
        { limit: CONVERSATION_LIST_LIMIT }
      );
      setConversations(data.listWhatsAppConversations ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load conversations';
      setListError(message);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const refreshHistory = useCallback(async (phone: string, options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;
    if (!silent) {
      setLoadingChat(true);
      setChatError(null);
    }

    try {
      const data = await GraphQLClient.executeAuthenticated<GetWhatsAppChatHistoryQuery>(
        getWhatsAppChatHistory,
        { phone }
      );
      console.log('[WhatsApp] Chat history response for', phone, JSON.stringify(data, null, 2));
      setChatSummary(data.getWhatsAppChatHistory ?? null);
    } catch (error) {
      console.error('[WhatsApp] Chat history error for', phone, error);
      const message = error instanceof Error ? error.message : 'Failed to load chat history';
      if (!silent) {
        setChatError(message);
      }
    } finally {
      if (!silent) {
        setLoadingChat(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedPhone) {
      setChatSummary(null);
      setChatError(null);
      setSendError(null);
      setSendNotice(null);
      return;
    }

    void refreshHistory(selectedPhone);
  }, [selectedPhone, refreshHistory]);

  useEffect(() => {
    if (!selectedPhone) return;

    const tick = () => {
      if (document.hidden) return;
      void refreshHistory(selectedPhone, { silent: true });
    };

    const intervalId = window.setInterval(tick, POLL_INTERVAL_MS);

    // When the tab becomes visible again after being hidden, poll immediately
    // so the admin sees fresh data without waiting a full interval.
    const handleVisibilityChange = () => {
      if (!document.hidden) void refreshHistory(selectedPhone, { silent: true });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedPhone, refreshHistory]);

  const sendMessage = useCallback(async (message: string) => {
    if (!selectedPhone) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setSending(true);
    setSendError(null);
    setSendNotice(null);

    const withinSession = computeIsWithinSessionWindow(chatSummary?.entries ?? []);
    let optimisticTimestamp: string | null = null;

    if (withinSession) {
      const optimisticEntry = createOptimisticEntry(selectedPhone, trimmedMessage);
      optimisticTimestamp = optimisticEntry.ts;

      setChatSummary((current) => {
        if (!current) return current;
        const entries = [...(current.entries ?? []), optimisticEntry];
        return {
          ...current,
          entries,
          messageCount: entries.length,
          lastMessageAt: optimisticEntry.ts,
        };
      });
    }

    try {
      const data = await GraphQLClient.executeAuthenticated<SendWhatsAppMessageMutation>(
        sendWhatsAppMessage,
        { phone: selectedPhone, message: trimmedMessage }
      );

      const responseMessage = data.sendWhatsAppMessage.message;

      if (!data.sendWhatsAppMessage.success) {
        if (responseMessage === SEND_RESPONSE.SESSION_EXPIRED) {
          throw new Error(SEND_NOTICE.SESSION_EXPIRED);
        }
        throw new Error(responseMessage || 'Failed to send message');
      }

      if (responseMessage === SEND_RESPONSE.SESSION_STARTER_SENT) {
        if (optimisticTimestamp) {
          setChatSummary((current) => {
            if (!current) return current;
            const entries = (current.entries ?? []).filter((entry) => entry.ts !== optimisticTimestamp);
            return {
              ...current,
              entries,
              messageCount: entries.length,
              lastMessageAt: entries.length ? entries[entries.length - 1].ts : current.lastMessageAt,
            };
          });
        }

        setSendNotice(SEND_NOTICE.SESSION_STARTER_SENT);
        await refreshHistory(selectedPhone, { silent: true });
        return;
      }

      await refreshHistory(selectedPhone, { silent: true });
    } catch (error) {
      if (optimisticTimestamp) {
        setChatSummary((current) => {
          if (!current) return current;
          const entries = (current.entries ?? []).filter((entry) => entry.ts !== optimisticTimestamp);
          return {
            ...current,
            entries,
            messageCount: entries.length,
            lastMessageAt: entries.length ? entries[entries.length - 1].ts : current.lastMessageAt,
          };
        });
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setSendError(errorMessage);
      throw error;
    } finally {
      setSending(false);
    }
  }, [selectedPhone, chatSummary?.entries, refreshHistory]);

  const clearSendError = useCallback(() => {
    setSendError(null);
  }, []);

  const clearSendNotice = useCallback(() => {
    setSendNotice(null);
  }, []);

  const liftHold = useCallback(async () => {
    if (!selectedPhone) return;

    setSending(true);
    setSendError(null);
    setSendNotice(null);

    try {
      const data = await GraphQLClient.executeAuthenticated<SendWhatsAppMessageMutation>(
        sendWhatsAppMessage,
        { phone: selectedPhone, message: LIFT_HOLD_COMMAND }
      );

      if (!data.sendWhatsAppMessage.success) {
        throw new Error(data.sendWhatsAppMessage.message || 'Failed to lift hold');
      }

      await refreshHistory(selectedPhone, { silent: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to lift hold';
      setSendError(errorMessage);
      throw error;
    } finally {
      setSending(false);
    }
  }, [selectedPhone, refreshHistory]);

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.phoneNumber.includes(query) ||
        (conversation.contactName ?? '').toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const entries = chatSummary?.entries ?? [];
  const linkedUser = chatSummary?.linkedUser ?? null;
  const selectedRow = conversations.find((conversation) => conversation.phoneNumber === selectedPhone) ?? null;
  const groupedEntries = useMemo(() => groupEntriesByDate(entries), [entries]);
  const isWithinSessionWindow = useMemo(() => computeIsWithinSessionWindow(entries), [entries]);

  return {
    conversations,
    filteredConversations,
    selectedPhone,
    setSelectedPhone,
    search,
    setSearch,
    chatSummary,
    entries,
    linkedUser,
    selectedRow,
    groupedEntries,
    loadingList,
    loadingChat,
    listError,
    chatError,
    sending,
    sendError,
    sendNotice,
    clearSendError,
    clearSendNotice,
    sendMessage,
    liftHold,
    refreshHistory,
    loadConversations,
    isWithinSessionWindow,
  };
}
