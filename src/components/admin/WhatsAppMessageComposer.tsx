'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const MAX_MESSAGE_LENGTH = 1000;

export interface WhatsAppMessageComposerProps {
  disabled?: boolean;
  loading?: boolean;
  sending?: boolean;
  isWithinSessionWindow: boolean;
  sendError?: string | null;
  sendNotice?: string | null;
  onSend: (message: string) => Promise<void>;
  onLiftHold: () => Promise<void>;
  onClearError?: () => void;
  onClearNotice?: () => void;
}

export function WhatsAppMessageComposer({
  disabled = false,
  loading = false,
  sending = false,
  isWithinSessionWindow,
  sendError,
  sendNotice,
  onSend,
  onLiftHold,
  onClearError,
  onClearNotice,
}: WhatsAppMessageComposerProps) {
  const [draft, setDraft] = useState('');
  const [holdLifted, setHoldLifted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const holdLiftedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-resize: reset to auto so shrinking works, then expand to scrollHeight
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  useEffect(() => {
    return () => {
      if (holdLiftedTimeoutRef.current) {
        clearTimeout(holdLiftedTimeoutRef.current);
      }
    };
  }, []);

  const trimmedDraft = draft.trim();
  const isComposerDisabled = disabled || loading || sending;
  const canSend = !isComposerDisabled && trimmedDraft.length > 0 && trimmedDraft.length <= MAX_MESSAGE_LENGTH;

  const handleSend = useCallback(async () => {
    if (!canSend) return;

    try {
      await onSend(trimmedDraft);
      setDraft('');
      textareaRef.current?.focus();
    } catch {
      // Parent surfaces sendError; keep draft so nothing is lost.
    }
  }, [canSend, onSend, trimmedDraft]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (sendError) onClearError?.();
    if (sendNotice) onClearNotice?.();
    setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH));
  };

  const handleLiftHold = useCallback(async () => {
    if (disabled || loading || sending) return;

    try {
      await onLiftHold();
      setHoldLifted(true);
      if (holdLiftedTimeoutRef.current) {
        clearTimeout(holdLiftedTimeoutRef.current);
      }
      holdLiftedTimeoutRef.current = setTimeout(() => setHoldLifted(false), 3000);
    } catch {
      // Parent surfaces sendError.
    }
  }, [disabled, loading, onLiftHold, sending]);

  return (
    <div className="border-t border-[#d1d7db] bg-[#f0f2f5]">
      {!isWithinSessionWindow && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#fff8e6] border-b border-[#f0e6c8] text-[12px] text-[#54656f]">
          <span aria-hidden="true">⏱</span>
          <span>
            24-hour session expired — sending will deliver a conversation starter first; your message goes out when they reply.
          </span>
        </div>
      )}

      <div className="px-3 py-3">
        {sendNotice && (
          <p
            role="status"
            className="mb-2 text-[12px] text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2"
          >
            {sendNotice}
          </p>
        )}

        {sendError && (
          <p role="alert" className="mb-2 text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {sendError}
          </p>
        )}

        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => void handleLiftHold()}
            disabled={disabled || loading || sending}
            title="When you send a message, the bot is paused. Click here to resume the bot for this user."
            aria-label={holdLifted ? 'Bot hold lifted' : 'Lift bot hold and resume auto-replies'}
            className="flex-shrink-0 px-3 h-10 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {holdLifted ? '✅ Lifted' : '🤖 Lift'}
          </button>

          <div className="flex-1 min-w-0 rounded-2xl bg-white border border-[#e9edef] shadow-sm px-3 py-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={MAX_MESSAGE_LENGTH}
              disabled={isComposerDisabled}
              placeholder={
                isWithinSessionWindow
                  ? 'Type a message...'
                  : 'Type a message — conversation starter will be sent first'
              }
              aria-label="WhatsApp message"
              role="textbox"
              className="w-full resize-none overflow-y-auto bg-transparent text-[14px] leading-relaxed text-[#111b21] placeholder-[#8696a0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            {draft.length >= 800 && (
              <div className="mt-1 flex justify-end">
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color:
                      draft.length >= MAX_MESSAGE_LENGTH
                        ? '#dc2626'
                        : draft.length >= 950
                        ? '#d97706'
                        : '#8696a0',
                  }}
                >
                  {draft.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!canSend}
            aria-label="Send message"
            className="flex-shrink-0 w-11 h-11 rounded-full bg-[#25d366] text-white flex items-center justify-center transition-opacity hover:bg-[#20bd5a] disabled:bg-[#aebac1] disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <PaperAirplaneIcon className="w-5 h-5 translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
