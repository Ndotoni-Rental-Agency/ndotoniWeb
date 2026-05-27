'use client';

import type { WhatsAppConversationRow } from '@/API';
import { StepBadge, timeAgo } from '@/components/admin/WhatsAppChatBubble';
import { avatarColor } from '@/lib/utils/whatsapp';

export interface WhatsAppConversationSidebarProps {
  conversations: WhatsAppConversationRow[];
  filteredConversations: WhatsAppConversationRow[];
  selectedPhone: string | null;
  onSelectPhone: (phone: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  loadingList: boolean;
  listError?: string | null;
}

function ConversationRowSkeleton() {
  return (
    <div className="px-4 py-3 border-b border-[#f0f2f5]">
      <div className="flex items-center gap-3 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-[#e9edef] flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-3.5 bg-[#e9edef] rounded w-3/4" />
          <div className="h-3 bg-[#e9edef] rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function WhatsAppConversationSidebar({
  conversations,
  filteredConversations,
  selectedPhone,
  onSelectPhone,
  search,
  onSearchChange,
  loadingList,
  listError,
}: WhatsAppConversationSidebarProps) {
  return (
    <aside
      className={`
        flex flex-col bg-white
        w-full md:w-72 md:flex-shrink-0 md:border-r md:border-[#d1d7db]
        ${selectedPhone ? 'hidden md:flex' : 'flex'}
      `}
    >
      <div className="p-3 bg-[#f0f2f5] border-b border-[#d1d7db]">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#54656f]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white rounded-lg border-0 focus:outline-none focus:ring-1 focus:ring-[#25d366] text-[#111b21] placeholder-[#8696a0]"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-[#8696a0]">{conversations.length} conversations</p>
      </div>

      {listError && (
        <div className="px-4 py-3 text-[12px] text-red-600 bg-red-50 border-b border-red-100">
          {listError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loadingList && (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <ConversationRowSkeleton key={index} />
            ))}
          </>
        )}

        {!loadingList && filteredConversations.length === 0 && (
          <p className="p-4 text-sm text-[#8696a0]">No conversations found.</p>
        )}

        {!loadingList &&
          filteredConversations.map((conversation) => {
            const isSelected = selectedPhone === conversation.phoneNumber;

            return (
              <button
                key={conversation.phoneNumber}
                type="button"
                onClick={() => onSelectPhone(conversation.phoneNumber)}
                className={`w-full text-left px-4 py-3 border-b border-[#f0f2f5] transition-colors ${
                  isSelected ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-lg"
                    style={{ background: avatarColor(conversation.phoneNumber).bg, color: avatarColor(conversation.phoneNumber).fg }}
                  >
                    {(conversation.contactName ?? conversation.phoneNumber)[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] font-medium text-[#111b21] truncate">
                        {conversation.contactName ?? `+${conversation.phoneNumber}`}
                      </span>
                      <span className="text-[12px] text-[#667781] flex-shrink-0 ml-2">
                        {timeAgo(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <StepBadge step={conversation.step} />
                      {conversation.lang && (
                        <span className="text-[11px] text-[#8696a0]">{conversation.lang}</span>
                      )}
                    </div>
                    {conversation.contactName && (
                      <p className="text-[12px] text-[#8696a0] truncate">+{conversation.phoneNumber}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </aside>
  );
}
