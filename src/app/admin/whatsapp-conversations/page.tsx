'use client';

import { useState, useEffect, useRef } from 'react';
import { graphqlClient } from '@/lib/graphql-client';

export const dynamic = 'force-dynamic';

// ── GraphQL queries ────────────────────────────────────────────────────────
const LIST_CONVERSATIONS = /* GraphQL */`
  query ListWhatsAppConversations($limit: Int) {
    listWhatsAppConversations(limit: $limit) {
      phoneNumber contactName step lang lastMessageAt createdAt
    }
  }
`;

const GET_HISTORY = /* GraphQL */`
  query GetWhatsAppChatHistory($phone: String!) {
    getWhatsAppChatHistory(phone: $phone) {
      phone contactName messageCount lastMessageAt
      entries { ts direction phone type text replyId step lang }
      linkedUser { userId firstName lastName email phoneNumber whatsappNumber userType }
    }
  }
`;

// ── Types ──────────────────────────────────────────────────────────────────
interface ConversationRow {
  phoneNumber: string;
  contactName?: string;
  step: string;
  lang?: string;
  lastMessageAt: string;
  createdAt: string;
}

interface ChatEntry {
  ts: string;
  direction: 'in' | 'out';
  phone: string;
  type: string;
  text?: string;
  replyId?: string;
  step?: string;
  lang?: string;
}

interface LinkedUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  userType: string;
}

interface ConversationSummary {
  phone: string;
  contactName?: string;
  messageCount: number;
  lastMessageAt?: string;
  entries: ChatEntry[];
  linkedUser?: LinkedUser;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const stepColor: Record<string, string> = {
  GREETING: 'bg-gray-100 text-gray-500',
  AWAITING_LOCATION: 'bg-yellow-100 text-yellow-700',
  AWAITING_BUDGET: 'bg-yellow-100 text-yellow-700',
  SHOWING_RESULTS: 'bg-blue-100 text-blue-700',
  LISTING_PHOTOS: 'bg-purple-100 text-purple-700',
  LISTING_CONFIRM: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

function stepBadge(step: string) {
  const cls = stepColor[step] ?? 'bg-stone-100 text-stone-500';
  return <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cls}`}>{step.replace(/_/g, ' ')}</span>;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function WhatsAppConversationsPage() {
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [summary, setSummary] = useState<ConversationSummary | null>(null);
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load conversation list from DynamoDB
  useEffect(() => {
    graphqlClient.graphql({ query: LIST_CONVERSATIONS, variables: { limit: 300 }, authMode: 'userPool' })
      .then((r: any) => setConversations(r.data?.listWhatsAppConversations ?? []))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoadingList(false));
  }, []);

  // Load full chat history from S3 when a conversation is selected
  useEffect(() => {
    if (!selectedPhone) return;
    setLoadingChat(true);
    setSummary(null);
    graphqlClient.graphql({ query: GET_HISTORY, variables: { phone: selectedPhone }, authMode: 'userPool' })
      .then((r: any) => setSummary(r.data?.getWhatsAppChatHistory ?? null))
      .catch((e: any) => setError(e.message))
      .finally(() => setLoadingChat(false));
  }, [selectedPhone]);

  // Scroll to bottom when messages load
  useEffect(() => {
    if (summary?.entries.length) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [summary]);

  const filtered = conversations.filter(c =>
    c.phoneNumber.includes(search) ||
    (c.contactName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleString('en-TZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const entries = summary?.entries ?? [];
  const linkedUser = summary?.linkedUser;
  const selectedRow = conversations.find(c => c.phoneNumber === selectedPhone);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Sidebar: conversation list from DynamoDB ── */}
      <aside className="w-72 flex-shrink-0 border-r border-stone-200 bg-white flex flex-col">
        <div className="p-3 border-b border-stone-200">
          <input
            type="text"
            placeholder="Search name or number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="mt-1.5 text-xs text-gray-400">{conversations.length} conversations · sorted by activity</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {loadingList && <p className="p-4 text-sm text-gray-400">Loading…</p>}
          {!loadingList && filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-400">No conversations found.</p>
          )}
          {filtered.map(conv => (
            <button
              key={conv.phoneNumber}
              onClick={() => setSelectedPhone(conv.phoneNumber)}
              className={`w-full text-left px-4 py-3 transition-colors ${
                selectedPhone === conv.phoneNumber ? 'bg-brand-50' : 'hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm font-medium truncate ${selectedPhone === conv.phoneNumber ? 'text-brand-700' : 'text-ink-900'}`}>
                  {conv.contactName ?? `+${conv.phoneNumber}`}
                </span>
                <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{timeAgo(conv.lastMessageAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {stepBadge(conv.step)}
                {conv.lang && <span className="text-[10px] text-gray-400">{conv.lang}</span>}
              </div>
              {conv.contactName && (
                <p className="text-[10px] text-gray-400 mt-0.5">+{conv.phoneNumber}</p>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main: chat view (loaded from S3 on demand) ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedPhone ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a conversation to load its history
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-3 bg-white border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {(selectedRow?.contactName ?? selectedPhone)[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-ink-900 leading-tight">
                    {selectedRow?.contactName ?? `+${selectedPhone}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400">+{selectedPhone}</p>
                    {selectedRow && stepBadge(selectedRow.step)}
                    {loadingChat && <span className="text-xs text-gray-400">Loading history…</span>}
                    {!loadingChat && summary && <span className="text-xs text-gray-400">{entries.length} messages</span>}
                  </div>
                </div>
              </div>

              {/* Linked user badge */}
              {linkedUser && (
                <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-xl px-3 py-2 text-xs">
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-[10px]">
                    {linkedUser.firstName[0]}{linkedUser.lastName[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-brand-800">{linkedUser.firstName} {linkedUser.lastName}</p>
                    <p className="text-brand-600">{linkedUser.email}</p>
                    <p className="text-brand-500 capitalize">{linkedUser.userType.toLowerCase()}</p>
                  </div>
                </div>
              )}
              {!linkedUser && !loadingChat && summary && (
                <span className="text-xs text-gray-400 bg-stone-100 px-2 py-1 rounded-full">No linked account</span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2 bg-stone-50">
              {loadingChat && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-gray-400">Fetching history from S3…</p>
                </div>
              )}

              {!loadingChat && entries.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-12">No messages found in S3.</p>
              )}

              {entries.map((entry, i) => {
                const isUser = entry.direction === 'in';
                return (
                  <div key={i} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
                      isUser ? 'bg-white text-ink-900 rounded-tl-sm' : 'bg-brand-600 text-white rounded-tr-sm'
                    }`}>
                      {entry.text && <p className="whitespace-pre-wrap leading-relaxed">{entry.text}</p>}
                      {!entry.text && entry.replyId && <p className="italic opacity-70">Button: {entry.replyId}</p>}
                      {!entry.text && !entry.replyId && <p className="italic opacity-70">[{entry.type}]</p>}
                      <div className={`flex items-center gap-2 mt-1 text-[10px] ${isUser ? 'text-gray-400' : 'text-brand-100'}`}>
                        <span>{formatTime(entry.ts)}</span>
                        {entry.step && <span>· {entry.step}</span>}
                        {entry.lang && <span>· {entry.lang}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 text-sm border-t border-red-100">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}
