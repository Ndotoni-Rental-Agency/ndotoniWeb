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
  onSend: (message: string) => Promise<void>;
  onClearError?: () => void;
}

export function WhatsAppMessageComposer({
  disabled = false,
  loading = false,
  sending = false,
  isWithinSessionWindow,
  sendError,
  onSend,
  onClearError,
}: WhatsAppMessageComposerProps) {
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize: reset to auto so shrinking works, then expand to scrollHeight
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [draft]);

  const trimmedDraft = draft.trim();
  const isComposerDisabled = disabled || loading || sending || !isWithinSessionWindow;
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
    setDraft(event.target.value.slice(0, MAX_MESSAGE_LENGTH));
  };

  return (
    <div className="border-t border-[#d1d7db] bg-[#f0f2f5]">
      {!isWithinSessionWindow && (
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#fff8e6] border-b border-[#f0e6c8] text-[12px] text-[#54656f]">
          <div className="flex items-center gap-2 min-w-0">
            <span aria-hidden="true">⏱</span>
            <span className="truncate">24-hour session expired · Template messages only</span>
          </div>
          <button
            type="button"
            disabled
            title="Coming soon"
            className="flex-shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#8696a0] bg-white/70 border border-[#e9edef] cursor-not-allowed"
          >
            Send Template
          </button>
        </div>
      )}

      <div className="px-3 py-3">
        {sendError && (
          <p className="mb-2 text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {sendError}
          </p>
        )}

        <div className="flex items-end gap-2">
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
                  ? 'Type a message'
                  : 'Session expired — free-form replies unavailable'
              }
              aria-label="WhatsApp message"
              role="textbox"
              className="w-full resize-none overflow-y-auto bg-transparent text-[14px] leading-relaxed text-[#111b21] placeholder-[#8696a0] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <div className="mt-1 flex justify-end">
              <span className="text-[10px] text-[#8696a0]">
                {draft.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
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
