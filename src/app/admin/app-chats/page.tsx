'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppChat, AppChatMessage, AppChatsApi } from '@/lib/admin/appChats';
import { AppChatFilter, AppChatList } from '@/components/admin/app-chats/AppChatList';
import { AppChatThread } from '@/components/admin/app-chats/AppChatThread';

export const dynamic = 'force-dynamic';

/** How often an open page checks for new messages */
const REFRESH_MS = 30_000;

export default function AppChatsPage() {
  const [chats, setChats] = useState<AppChat[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AppChatMessage[] | null>(null);
  const [threadChat, setThreadChat] = useState<AppChat | null>(null);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AppChatFilter>('all');
  const selectedRef = useRef<string | null>(null);

  const loadList = useCallback(async () => {
    try {
      setChats(await AppChatsApi.list());
      setListError(null);
    } catch (err) {
      setListError(AppChatsApi.errorText(err, 'Couldn’t load the chats.'));
    }
  }, []);

  const loadThread = useCallback(async (conversationId: string) => {
    setLoadingThread(true);
    try {
      const thread = await AppChatsApi.get(conversationId);
      // Ignore an answer for a chat the admin has already left
      if (selectedRef.current !== conversationId) return;
      setThreadChat(thread.conversation);
      setMessages(thread.messages);
      setThreadError(null);
    } catch (err) {
      if (selectedRef.current === conversationId) setThreadError(AppChatsApi.errorText(err, 'Couldn’t load this chat.'));
    } finally {
      if (selectedRef.current === conversationId) setLoadingThread(false);
    }
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return;
      loadList();
      if (selectedRef.current) loadThread(selectedRef.current);
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadList, loadThread]);

  function select(conversationId: string | null) {
    selectedRef.current = conversationId;
    setSelectedId(conversationId);
    setMessages(null);
    setThreadError(null);
    setThreadChat(conversationId ? chats?.find((c) => c.conversationId === conversationId) ?? null : null);
    if (conversationId) loadThread(conversationId);
  }

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (chats || []).filter((c) =>
      (filter === 'all' || c.awaitingHost) &&
      (!q || [c.propertyTitle, c.guest.name, c.host.name, c.guest.email, c.host.email, c.guest.phone, c.host.phone, c.lastMessage]
        .some((v) => v?.toLowerCase().includes(q))));
  }, [chats, search, filter]);

  const awaitingCount = useMemo(() => (chats || []).filter((c) => c.awaitingHost).length, [chats]);

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      <AppChatList
        chats={chats}
        shown={shown}
        selectedId={selectedId}
        onSelect={select}
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilter={setFilter}
        awaitingCount={awaitingCount}
        error={listError}
        onRetry={loadList}
      />
      <AppChatThread
        chat={threadChat}
        messages={messages}
        loading={loadingThread}
        error={threadError}
        onBack={() => select(null)}
        onRefresh={() => selectedId && loadThread(selectedId)}
      />
    </div>
  );
}
