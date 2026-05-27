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
const CONVERSATION_LIST_LIMIT = 300;

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
      setChatSummary(data.getWhatsAppChatHistory ?? null);
    } catch (error) {
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

    const optimisticEntry = createOptimisticEntry(selectedPhone, trimmedMessage);
    const optimisticTimestamp = optimisticEntry.ts;

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

    try {
      const data = await GraphQLClient.executeAuthenticated<SendWhatsAppMessageMutation>(
        sendWhatsAppMessage,
        { phone: selectedPhone, message: trimmedMessage }
      );

      if (!data.sendWhatsAppMessage.success) {
        throw new Error(data.sendWhatsAppMessage.message || 'Failed to send message');
      }

      await refreshHistory(selectedPhone, { silent: true });
    } catch (error) {
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

      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setSendError(errorMessage);
      throw error;
    } finally {
      setSending(false);
    }
  }, [selectedPhone, refreshHistory]);

  const clearSendError = useCallback(() => {
    setSendError(null);
  }, []);

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
    clearSendError,
    sendMessage,
    refreshHistory,
    loadConversations,
    isWithinSessionWindow,
  };
}
