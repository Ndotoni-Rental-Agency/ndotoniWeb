'use client';

import { useWhatsAppConversations } from '@/hooks/useWhatsAppConversations';
import { WhatsAppChatPanel } from '@/components/admin/WhatsAppChatPanel';
import { WhatsAppConversationSidebar } from '@/components/admin/WhatsAppConversationSidebar';

export const dynamic = 'force-dynamic';

export default function WhatsAppConversationsPage() {
  const {
    conversations,
    filteredConversations,
    selectedPhone,
    setSelectedPhone,
    search,
    setSearch,
    linkedUser,
    selectedRow,
    groupedEntries,
    entries,
    loadingList,
    loadingChat,
    listError,
    chatError,
    sending,
    sendError,
    clearSendError,
    sendMessage,
    isWithinSessionWindow,
  } = useWhatsAppConversations();

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-white">
      <WhatsAppConversationSidebar
        conversations={conversations}
        filteredConversations={filteredConversations}
        selectedPhone={selectedPhone}
        onSelectPhone={setSelectedPhone}
        search={search}
        onSearchChange={setSearch}
        loadingList={loadingList}
        listError={listError}
      />
      <WhatsAppChatPanel
        selectedPhone={selectedPhone}
        onClearSelection={() => setSelectedPhone(null)}
        selectedRow={selectedRow}
        linkedUser={linkedUser}
        groupedEntries={groupedEntries}
        messageCount={entries.length}
        loadingChat={loadingChat}
        chatError={chatError}
        sending={sending}
        sendError={sendError}
        isWithinSessionWindow={isWithinSessionWindow}
        onSend={sendMessage}
        onClearSendError={clearSendError}
      />
    </div>
  );
}
