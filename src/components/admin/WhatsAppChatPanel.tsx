'use client';

import { useEffect, useRef } from 'react';
import type { WhatsAppConversationRow, WhatsAppLinkedUser } from '@/API';
import {
  ChatBubble,
  DateSeparator,
  StepBadge,
} from '@/components/admin/WhatsAppChatBubble';
import { WhatsAppMessageComposer } from '@/components/admin/WhatsAppMessageComposer';
import type { GroupedChatEntries } from '@/hooks/useWhatsAppConversations';

const CHAT_BACKGROUND_STYLE = {
  background: '#efeae2',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9b8' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
} as const;

export interface WhatsAppChatPanelProps {
  selectedPhone: string | null;
  onClearSelection: () => void;
  selectedRow: WhatsAppConversationRow | null;
  linkedUser: WhatsAppLinkedUser | null;
  groupedEntries: GroupedChatEntries[];
  messageCount: number;
  loadingChat: boolean;
  chatError?: string | null;
  sending: boolean;
  sendError?: string | null;
  isWithinSessionWindow: boolean;
  onSend: (message: string) => Promise<void>;
  onClearSendError: () => void;
}

function ChatBubbleSkeleton({ align }: { align: 'left' | 'right' }) {
  return (
    <div className={`flex items-end gap-1 ${align === 'left' ? 'justify-start' : 'justify-end'}`}>
      {align === 'left' && <div className="w-7 h-7 rounded-full bg-[#e9edef] flex-shrink-0 mb-1 animate-pulse" />}
      <div
        className={`h-12 rounded-lg bg-[#e9edef] animate-pulse ${
          align === 'left' ? 'w-[45%]' : 'w-[55%]'
        }`}
      />
      {align === 'right' && <div className="w-7 h-7 rounded-full bg-[#e9edef] flex-shrink-0 mb-1 animate-pulse" />}
    </div>
  );
}

function LinkedUserCard({ linkedUser, compact = false }: { linkedUser: WhatsAppLinkedUser; compact?: boolean }) {
  if (compact) {
    return (
      <div className="sm:hidden flex items-center gap-2 bg-white border-b border-[#d1d7db] px-4 py-2 text-xs">
        <div className="w-6 h-6 rounded-full bg-[#25d366] text-white flex items-center justify-center font-semibold text-[10px] flex-shrink-0">
          {linkedUser.firstName?.[0]}
          {linkedUser.lastName?.[0]}
        </div>
        <span className="font-semibold text-[#111b21]">
          {linkedUser.firstName} {linkedUser.lastName}
        </span>
        <span className="text-[#667781]">· {linkedUser.email}</span>
        <span className="text-[#8696a0] capitalize ml-auto">{linkedUser.userType.toLowerCase()}</span>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-2 bg-white border border-[#d1d7db] rounded-xl px-3 py-2 text-xs shadow-sm flex-shrink-0">
      <div className="w-7 h-7 rounded-full bg-[#25d366] text-white flex items-center justify-center font-semibold text-[10px]">
        {linkedUser.firstName?.[0]}
        {linkedUser.lastName?.[0]}
      </div>
      <div>
        <p className="font-semibold text-[#111b21]">
          {linkedUser.firstName} {linkedUser.lastName}
        </p>
        <p className="text-[#667781]">{linkedUser.email}</p>
        <p className="text-[#8696a0] capitalize">{linkedUser.userType.toLowerCase()}</p>
      </div>
    </div>
  );
}

export function WhatsAppChatPanel({
  selectedPhone,
  onClearSelection,
  selectedRow,
  linkedUser,
  groupedEntries,
  messageCount,
  loadingChat,
  chatError,
  sending,
  sendError,
  isWithinSessionWindow,
  onSend,
  onClearSendError,
}: WhatsAppChatPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (groupedEntries.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [groupedEntries, sending]);

  return (
    <div
      className={`
        flex-1 flex flex-col overflow-hidden
        ${!selectedPhone ? 'hidden md:flex' : 'flex'}
      `}
    >
      {!selectedPhone ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4" style={{ background: '#f0f2f5' }}>
          <div className="w-20 h-20 rounded-full bg-[#dfe5e7] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#aebac1]" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.782 6.86L2 30l7.347-1.757A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" />
            </svg>
          </div>
          <p className="text-[#667781] text-sm">Select a conversation to view messages</p>
        </div>
      ) : (
        <>
          <div className="px-3 py-3 bg-[#f0f2f5] border-b border-[#d1d7db] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={onClearSelection}
                className="md:hidden flex-shrink-0 p-1 -ml-1 text-[#54656f] hover:text-[#111b21]"
                aria-label="Back"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                  {!loadingChat && (
                    <span className="text-[12px] text-[#667781]">{messageCount} messages</span>
                  )}
                </div>
              </div>
            </div>

            {linkedUser && <LinkedUserCard linkedUser={linkedUser} />}
          </div>

          {linkedUser && <LinkedUserCard linkedUser={linkedUser} compact />}

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1" style={CHAT_BACKGROUND_STYLE}>
            {loadingChat && (
              <div className="space-y-3 py-4">
                <ChatBubbleSkeleton align="left" />
                <ChatBubbleSkeleton align="right" />
                <ChatBubbleSkeleton align="left" />
                <ChatBubbleSkeleton align="right" />
                <div className="flex flex-col items-center justify-center pt-4 gap-3">
                  <div className="w-6 h-6 border-2 border-[#25d366] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[12px] text-[#667781] bg-white px-3 py-1.5 rounded-full shadow-sm">
                    Fetching history from S3…
                  </p>
                </div>
              </div>
            )}

            {!loadingChat && chatError && (
              <div className="flex justify-center py-8">
                <p className="text-[12px] text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-full shadow-sm">
                  {chatError}
                </p>
              </div>
            )}

            {!loadingChat && !chatError && groupedEntries.length === 0 && (
              <div className="flex justify-center py-12">
                <p className="text-[12px] text-[#667781] bg-white px-4 py-2 rounded-full shadow-sm">
                  No messages found
                </p>
              </div>
            )}

            {!loadingChat &&
              groupedEntries.map(({ date, items }) => (
                <div key={date}>
                  <DateSeparator ts={`${date}T12:00:00Z`} />
                  <div className="space-y-1">
                    {items.map((entry, index) => (
                      <ChatBubble key={`${date}-${entry.ts}-${index}`} entry={entry} />
                    ))}
                  </div>
                </div>
              ))}
            <div ref={bottomRef} />
          </div>

          <WhatsAppMessageComposer
            loading={loadingChat}
            sending={sending}
            isWithinSessionWindow={isWithinSessionWindow}
            sendError={sendError}
            onSend={onSend}
            onClearError={onClearSendError}
          />
        </>
      )}
    </div>
  );
}
