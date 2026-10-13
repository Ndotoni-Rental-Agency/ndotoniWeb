/**
 * Guest & host chats (admin): the in-app conversations between guests and hosts, read-only.
 * Admins observe them here; nothing is sent or marked read.
 */

import { GraphQLClient } from '@/lib/graphql-client';

export interface AppChatParticipant {
  userId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  userType?: string | null;
}

export interface AppChat {
  conversationId: string;
  kind: 'property' | 'direct';
  propertyId?: string | null;
  propertyTitle?: string | null;
  guest: AppChatParticipant;
  host: AppChatParticipant;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  lastMessageFrom?: 'guest' | 'host' | null;
  createdAt?: string | null;
  awaitingHost: boolean;
}

export interface AppChatMessage {
  messageId: string;
  senderId: string;
  from: 'guest' | 'host' | 'assistant';
  senderName: string;
  content: string;
  timestamp: string;
  isAutomated: boolean;
  containsContactInfo: boolean;
  replyToContent?: string | null;
  replyToSenderName?: string | null;
}

const PARTICIPANT = 'userId name email phone userType';
const CHAT_FIELDS = `conversationId kind propertyId propertyTitle lastMessage lastMessageAt lastMessageFrom createdAt awaitingHost
  guest { ${PARTICIPANT} } host { ${PARTICIPANT} }`;

export class AppChatsApi {
  static async list(): Promise<AppChat[]> {
    const data = await GraphQLClient.executeAuthenticated<{ listAppChats: AppChat[] }>(
      `query ListAppChats($limit: Int) { listAppChats(limit: $limit) { ${CHAT_FIELDS} } }`, { limit: 300 });
    return data.listAppChats;
  }

  static async get(conversationId: string): Promise<{ conversation: AppChat; messages: AppChatMessage[] }> {
    const data = await GraphQLClient.executeAuthenticated<{ getAppChat: { conversation: AppChat; messages: AppChatMessage[] } }>(
      `query GetAppChat($conversationId: ID!) { getAppChat(conversationId: $conversationId) {
        conversation { ${CHAT_FIELDS} }
        messages { messageId senderId from senderName content timestamp isAutomated containsContactInfo replyToContent replyToSenderName } } }`,
      { conversationId });
    return data.getAppChat;
  }

  static errorText(err: any, fallback: string): string {
    return err?.errors?.[0]?.message || err?.message || fallback;
  }

  /** "Today", "Yesterday", or a date */
  static dayLabel(iso: string): string {
    const d = new Date(iso);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86_400_000);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric' });
  }

  static timeLabel(iso: string): string {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  static initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('') || '?';
  }
}
