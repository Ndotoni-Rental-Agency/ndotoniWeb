'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────────

interface TokenValidationResult {
  valid: boolean;
  conversationId?: string;
  participantPhone?: string;
  participantName?: string;
  propertyId?: string;
  propertyTitle?: string;
  expired?: boolean;
  canRefresh?: boolean;
}

interface TokenRefreshResult {
  token: string;
  url: string;
  conversationId: string;
  participantPhone: string;
  expiresAt: string;
}

interface ChatMessage {
  messageId: string;
  senderPhone: string;
  senderName: string;
  content: string;
  createdAt: string;
  isMine: boolean;
}

// ─── Constants ───────────────────────────────────────────────

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || '';
const CHAT_WS_URL = process.env.NEXT_PUBLIC_CHAT_WS_URL || '';

// ─── Main Page ───────────────────────────────────────────────

export default function GuestChatPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [status, setStatus] = useState<'loading' | 'valid' | 'expired' | 'invalid'>('loading');
  const [validationResult, setValidationResult] = useState<TokenValidationResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Token Validation ────────────────────────────────────────

  useEffect(() => {
    if (!token) return;
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const res = await fetch(`${CHAT_API_URL}/chat/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          setError('Too many attempts. Please try again later.');
          setStatus('invalid');
          return;
        }
        setStatus('invalid');
        return;
      }

      const result: TokenValidationResult = await res.json();

      if (result.valid) {
        setValidationResult(result);
        setStatus('valid');
        return;
      }

      if (result.expired && result.canRefresh) {
        // Token is expired but refreshable — attempt refresh
        await refreshAndRedirect();
        return;
      }

      // Expired and not refreshable, or invalid
      if (result.expired) {
        setStatus('expired');
      } else {
        setStatus('invalid');
      }
    } catch {
      setStatus('invalid');
      setError('Unable to verify your chat link. Please check your connection and try again.');
    }
  };

  const refreshAndRedirect = async () => {
    try {
      const res = await fetch(`${CHAT_API_URL}/chat/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        setStatus('expired');
        return;
      }

      const result: TokenRefreshResult = await res.json();
      // Redirect to the new token URL
      router.replace(`/c/${result.token}`);
    } catch {
      setStatus('expired');
    }
  };

  // ─── Load Messages ───────────────────────────────────────────

  useEffect(() => {
    if (status === 'valid' && validationResult?.conversationId) {
      loadMessages();
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [status, validationResult?.conversationId]);

  const loadMessages = async () => {
    if (!validationResult?.conversationId) return;

    setLoadingMessages(true);
    try {
      const res = await fetch(
        `${CHAT_API_URL}/chat/${validationResult.conversationId}/messages`,
        {
          headers: { 'x-chat-token': token },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch {
      // Silently fail — messages will load via WebSocket
    } finally {
      setLoadingMessages(false);
    }
  };

  // ─── WebSocket Connection ────────────────────────────────────

  const connectWebSocket = useCallback(() => {
    if (!CHAT_WS_URL || !token) return;

    const wsUrl = `${CHAT_WS_URL}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          const newMessage: ChatMessage = {
            messageId: data.messageId,
            senderPhone: data.senderPhone,
            senderName: data.senderName,
            content: data.content,
            createdAt: data.createdAt,
            isMine: data.senderPhone === validationResult?.participantPhone,
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      // Attempt reconnection after 3 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        if (status === 'valid') {
          connectWebSocket();
        }
      }, 3000);
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, [token, validationResult?.participantPhone, status]);

  const disconnectWebSocket = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // ─── Send Message ────────────────────────────────────────────

  const handleSendMessage = async () => {
    const content = messageInput.trim();
    if (!content || !validationResult?.conversationId || sendingMessage) return;

    setSendingMessage(true);
    const optimisticMessage: ChatMessage = {
      messageId: `temp-${Date.now()}`,
      senderPhone: validationResult.participantPhone || '',
      senderName: validationResult.participantName || 'You',
      content,
      createdAt: new Date().toISOString(),
      isMine: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setMessageInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await fetch(
        `${CHAT_API_URL}/chat/${validationResult.conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-chat-token': token,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.messageId !== optimisticMessage.messageId));
        setMessageInput(content);
      } else {
        const data = await res.json();
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) =>
            m.messageId === optimisticMessage.messageId
              ? { ...m, messageId: data.messageId }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.messageId !== optimisticMessage.messageId));
      setMessageInput(content);
    } finally {
      setSendingMessage(false);
    }
  };

  // ─── Auto-scroll ─────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── Textarea Auto-resize ────────────────────────────────────

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Render States ───────────────────────────────────────────

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'invalid') {
    return <ErrorState message={error} />;
  }

  if (status === 'expired') {
    return <ExpiredState />;
  }

  // ─── Valid: Render Chat UI ───────────────────────────────────

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(validationResult?.participantName || 'G')}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {validationResult?.propertyTitle || 'Chat'}
            </h1>
            <div className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-500' : 'bg-gray-300'}`}
                aria-hidden="true"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {wsConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-3">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Loading messages...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <GuestMessageBubble key={msg.messageId} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <footer className="flex-shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            value={messageInput}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 resize-none transition-all"
            style={{ minHeight: '42px', maxHeight: '120px' }}
            disabled={sendingMessage}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || sendingMessage}
            className="flex-shrink-0 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            {sendingMessage ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function GuestMessageBubble({ message }: { message: ChatMessage }) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] sm:max-w-[65%]`}>
        {!message.isMine && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
            {message.senderName}
          </p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            message.isMine
              ? 'bg-green-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${message.isMine ? 'text-right mr-1' : 'ml-1'}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Opening your chat...</p>
      </div>
    </div>
  );
}

function ExpiredState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Chat Link Expired
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          This chat link has expired. Please contact the landlord again via WhatsApp to get a new link.
        </p>
        <a
          href="https://wa.me/255753000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contact via WhatsApp
        </a>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message?: string | null }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Invalid Chat Link
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {message || 'This chat link is not valid. It may have been revoked or is incorrect.'}
        </p>
        <a
          href="https://wa.me/255753000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Contact via WhatsApp
        </a>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}
