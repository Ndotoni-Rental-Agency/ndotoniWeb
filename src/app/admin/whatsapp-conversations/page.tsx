'use client';

import { useState, useEffect, useRef } from 'react';
import { graphqlClient } from '@/lib/graphql-client';
import { GraphQLClient } from '@/lib/graphql-client';
import { listWhatsAppConversations, getWhatsAppChatHistory } from '@/graphql/queries';
import { sendWhatsAppMessage } from '@/graphql/mutations';
import { ChatBubble, DateSeparator, StepBadge, timeAgo } from '@/components/admin/WhatsAppChatBubble';
import type {
  WhatsAppConversationRow,
  WhatsAppChatEntry,
  WhatsAppLinkedUser,
  ListWhatsAppConversationsQuery,
  GetWhatsAppChatHistoryQuery,
} from '@/API';

export const dynamic = 'force-dynamic';

export default function WhatsAppConversationsPage() {
  const [conversations, setConversations] = useState<WhatsAppConversationRow[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [chatSummary, setChatSummary] = useState<GetWhatsAppChatHistoryQuery['getWhatsAppChatHistory'] | null>(null);
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    graphqlClient
      .graphql({ query: listWhatsAppConversations, variables: { limit: 300 }, authMode: 'userPool' })
      .then((r: { data: ListWhatsAppConversationsQuery }) => setConversations(r.data.listWhatsAppConversations ?? []))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (!selectedPhone) return;
    setLoadingChat(true);
    setChatSummary(null);
    graphqlClient
      .graphql({ query: getWhatsAppChatHistory, variables: { phone: selectedPhone }, authMode: 'userPool' })
      .then((r: { data: GetWhatsAppChatHistoryQuery }) => setChatSummary(r.data.getWhatsAppChatHistory ?? null))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoadingChat(false));
  }, [selectedPhone]);

  useEffect(() => {
    if (chatSummary?.entries?.length) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatSummary]);

  const handleSendReply = async () => {
    if (!selectedPhone || !replyText.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await GraphQLClient.executeAuthenticated<{
        sendWhatsAppMessage: { success: boolean; message: string };
      }>(sendWhatsAppMessage, { phone: selectedPhone, message: replyText.trim() });

      if (result.sendWhatsAppMessage.success) {
        setReplyText('');
        // Refresh chat to show the sent message
        const r = await graphqlClient.graphql({
          query: getWhatsAppChatHistory,
          variables: { phone: selectedPhone },
          authMode: 'userPool',
        }) as { data: GetWhatsAppChatHistoryQuery };
        setChatSummary(r.data.getWhatsAppChatHistory ?? null);
      } else {
        const msg = result.sendWhatsAppMessage.message;
        setError(msg === 'SESSION_EXPIRED'
          ? 'Cannot reply — 24h session expired. User must message first.'
          : msg);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const filtered = conversations.filter(
    (c) => c.phoneNumber.includes(search) || (c.contactName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const entries: WhatsAppChatEntry[] = chatSummary?.entries ?? [];
  const linkedUser: WhatsAppLinkedUser | null = chatSummary?.linkedUser ?? null;
  const selectedRow = conversations.find((c) => c.phoneNumber === selectedPhone);

  const groupedEntries = entries.reduce<{ date: string; items: WhatsAppChatEntry[] }[]>((acc, entry) => {
    const date = entry.ts.slice(0, 10);
    const last = acc[acc.length - 1];
    if (last?.date === date) { last.items.push(entry); }
    else { acc.push({ date, items: [entry] }); }
    return acc;
  }, []);

  // ── Sidebar (conversation list) ──────────────────────────────────────────
  const sidebar = (
    <aside
      className={`
        flex flex-col bg-white
        w-full md:w-72 md:flex-shrink-0 md:border-r md:border-[#d1d7db]
        ${selectedPhone ? 'hidden md:flex' : 'flex'}
      `}
    >
      <div className="p-3 bg-[#f0f2f5] border-b border-[#d1d7db]">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#54656f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#25d366] text-[#111b21] placeholder-[#8696a0]"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-[#8696a0]">{conversations.length} conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingList && <p className="p-4 text-sm text-[#8696a0]">Loading…</p>}
        {!loadingList && filtered.length === 0 && (
          <p className="p-4 text-sm text-[#8696a0]">No conversations found.</p>
        )}
        {filtered.map((conv) => {
          const isSelected = selectedPhone === conv.phoneNumber;
          return (
            <button
              key={conv.phoneNumber}
              onClick={() => setSelectedPhone(conv.phoneNumber)}
              className={`w-full text-left px-4 py-3 border-b border-[#f0f2f5] transition-colors ${
                isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#dfe5e7] flex items-center justify-center flex-shrink-0 text-[#aebac1] font-semibold text-lg">
                  {(conv.contactName ?? conv.phoneNumber)[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-medium text-[#111b21] truncate">
                      {conv.contactName ?? `+${conv.phoneNumber}`}
                    </span>
                    <span className="text-[12px] text-[#667781] flex-shrink-0 ml-2">
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <StepBadge step={conv.step} />
                    {conv.lang && <span className="text-[11px] text-[#8696a0]">{conv.lang}</span>}
                  </div>
                  {conv.contactName && (
                    <p className="text-[12px] text-[#8696a0] truncate">+{conv.phoneNumber}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );

  // ── Chat panel ───────────────────────────────────────────────────────────
  const chatPanel = (
    <div
      className={`
        flex-1 flex flex-col overflow-hidden
        ${!selectedPhone ? 'hidden md:flex' : 'flex'}
      `}
    >
      {!selectedPhone ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ background: '#f0f2f5' }}>
          <div className="w-20 h-20 rounded-full bg-[#dfe5e7] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#aebac1]" fill="currentColor" viewBox="0 0 32 32">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.782 6.86L2 30l7.347-1.757A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
            </svg>
          </div>
          <p className="text-[#667781] text-sm">Select a conversation to view messages</p>
        </div>
      ) : (
        <>
          {/* Chat header — back button on mobile */}
          <div className="px-3 py-3 bg-[#f0f2f5] border-b border-[#d1d7db] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Back button (mobile only) */}
              <button
                onClick={() => setSelectedPhone(null)}
                className="md:hidden flex-shrink-0 p-1 -ml-1 text-[#54656f] hover:text-[#111b21]"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center text-[#aebac1] font-semibold flex-shrink-0">
                {(selectedRow?.contactName ?? selectedPhone)[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[#111b21] text-[15px] leading-tight truncate">
                  {selectedRow?.contactName ?? `+${selectedPhone}`}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12px] text-[#667781]">+{selectedPhone}</p>
                  {selectedRow && <StepBadge step={selectedRow.step} />}
                  {loadingChat && <span className="text-[12px] text-[#667781]">loading…</span>}
                  {!loadingChat && chatSummary && (
                    <span className="text-[12px] text-[#667781]">{entries.length} messages</span>
                  )}
                </div>
              </div>
            </div>

            {/* Linked user — hidden on small mobile, shown on md+ */}
            {linkedUser && (
              <div className="hidden sm:flex items-center gap-2 bg-white border border-[#d1d7db] rounded-xl px-3 py-2 text-xs shadow-sm flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-[#25d366] text-white flex items-center justify-center font-semibold text-[10px]">
                  {linkedUser.firstName?.[0]}{linkedUser.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#111b21]">{linkedUser.firstName} {linkedUser.lastName}</p>
                  <p className="text-[#667781]">{linkedUser.email}</p>
                  <p className="text-[#8696a0] capitalize">{linkedUser.userType.toLowerCase()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Linked user — full width on small mobile */}
          {linkedUser && (
            <div className="sm:hidden flex items-center gap-2 bg-white border-b border-[#d1d7db] px-4 py-2 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#25d366] text-white flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
                {linkedUser.firstName?.[0]}{linkedUser.lastName?.[0]}
              </div>
              <span className="font-semibold text-[#111b21]">{linkedUser.firstName} {linkedUser.lastName}</span>
              <span className="text-[#667781]">· {linkedUser.email}</span>
              <span className="text-[#8696a0] capitalize ml-auto">{linkedUser.userType.toLowerCase()}</span>
            </div>
          )}

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 space-y-1"
            style={{
              background: '#efeae2',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9b8' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {loadingChat && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-6 h-6 border-2 border-[#25d366] border-t-transparent rounded-full animate-spin" />
                <p className="text-[12px] text-[#667781] bg-white px-3 py-1.5 rounded-full shadow-sm">
                  Fetching history from S3…
                </p>
              </div>
            )}

            {!loadingChat && entries.length === 0 && (
              <div className="flex justify-center py-12">
                <p className="text-[12px] text-[#667781] bg-white px-4 py-2 rounded-full shadow-sm">
                  No messages found
                </p>
              </div>
            )}

            {groupedEntries.map(({ date, items }) => (
              <div key={date}>
                <DateSeparator ts={`${date}T12:00:00Z`} />
                <div className="space-y-1">
                  {items.map((entry, i) => (
                    <ChatBubble key={`${date}-${i}`} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Reply input */}
          <div className="px-3 py-2 bg-[#f0f2f5] border-t border-[#d1d7db] flex items-end gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-[#d1d7db] bg-white px-3 py-2 text-sm text-[#111b21] placeholder-[#667781] focus:outline-none focus:border-[#25d366] max-h-32"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={handleSendReply}
              disabled={sending || !replyText.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-[#25d366] hover:bg-[#1fb855] disabled:bg-[#d1d7db] flex items-center justify-center transition-colors"
              aria-label="Send"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
            </button>
          </div>
        </>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm border-t border-red-100">
          Error: {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {sidebar}
      {chatPanel}
    </div>
  );
}
