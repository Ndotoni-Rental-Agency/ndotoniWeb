import type { WhatsAppChatEntry } from '@/API';
import { resolveButtonLabel } from '@/lib/utils/whatsapp-actions';

// ── Step badge ─────────────────────────────────────────────────────────────
const STEP_COLOR: Record<string, string> = {
  GREETING:          'bg-gray-100 text-gray-500',
  AWAITING_LOCATION: 'bg-yellow-100 text-yellow-700',
  AWAITING_BUDGET:   'bg-yellow-100 text-yellow-700',
  SHOWING_RESULTS:   'bg-blue-100 text-blue-700',
  LISTING_PHOTOS:    'bg-purple-100 text-purple-700',
  LISTING_CONFIRM:   'bg-purple-100 text-purple-700',
  COMPLETED:         'bg-green-100 text-green-700',
};

export function StepBadge({ step }: { step: string }) {
  const cls = STEP_COLOR[step] ?? 'bg-stone-100 text-stone-500';
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cls}`}>
      {step.replace(/_/g, ' ')}
    </span>
  );
}

// ── Time helpers ───────────────────────────────────────────────────────────
export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function formatTime(ts: string) {
  return new Date(ts).toLocaleString('en-TZ', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString('en-TZ', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
}

// ── Date separator ─────────────────────────────────────────────────────────
export function DateSeparator({ ts }: { ts: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-[#d1d7db]" />
      <span className="text-[11px] text-[#667781] bg-[#e9edef] px-3 py-1 rounded-full font-medium">
        {formatDate(ts)}
      </span>
      <div className="flex-1 h-px bg-[#d1d7db]" />
    </div>
  );
}

// ── Chat bubble ────────────────────────────────────────────────────────────
interface ChatBubbleProps {
  entry: WhatsAppChatEntry;
}

export function ChatBubble({ entry }: ChatBubbleProps) {
  const isUser = entry.direction === 'in';

  return (
    <div className={`flex items-end gap-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
      {/* User avatar dot */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-[#dfe5e7] flex items-center justify-center flex-shrink-0 mb-1">
          <svg className="w-4 h-4 text-[#aebac1]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className="relative max-w-[65%]"
        style={{
          filter: 'drop-shadow(0 1px 0.5px rgba(11,20,26,.13))',
        }}
      >
        {/* WhatsApp-style tail */}
        <div
          className={`absolute top-0 w-2 h-2 ${isUser ? '-left-1.5' : '-right-1.5'}`}
          style={{
            width: 0, height: 0,
            borderTop: isUser
              ? '8px solid #ffffff'
              : '8px solid #d9fdd3',
            borderLeft: isUser ? '8px solid transparent' : undefined,
            borderRight: !isUser ? '8px solid transparent' : undefined,
          }}
        />

        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            isUser ? 'bg-white text-[#111b21]' : 'bg-[#d9fdd3] text-[#111b21]'
          }`}
          style={{ borderRadius: isUser ? '0 8px 8px 8px' : '8px 0 8px 8px' }}
        >
          {/* Message content */}
          {entry.text && (
            <p className="whitespace-pre-wrap leading-relaxed text-[14px]">{entry.text}</p>
          )}
          {!entry.text && entry.replyId && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#667781] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
              </svg>
              <span className="text-[13px] font-medium text-[#111b21]">
                {resolveButtonLabel(entry.replyId)}
              </span>
            </div>
          )}
          {!entry.text && !entry.replyId && (
            <p className="italic text-[#667781] text-[13px]">[{entry.type}]</p>
          )}

          {/* Timestamp + step row */}
          <div className="flex items-center justify-end gap-1.5 mt-1">
            {entry.step && (
              <span className="text-[10px] text-[#667781] truncate max-w-[120px]">
                {entry.step.replace(/_/g, ' ')}
              </span>
            )}
            <span className="text-[11px] text-[#667781] flex-shrink-0">{formatTime(entry.ts)}</span>
            {/* Read tick (bot messages only) */}
            {!isUser && (
              <svg className="w-4 h-3 text-[#53bdeb] flex-shrink-0" viewBox="0 0 16 11" fill="currentColor">
                <path d="M11.071.653a.75.75 0 0 1 .025 1.06l-6.5 7a.75.75 0 0 1-1.085 0l-3-3.5a.75.75 0 1 1 1.138-.976L4.07 7.194l5.94-6.516a.75.75 0 0 1 1.061-.025z"/>
                <path d="M14.571.653a.75.75 0 0 1 .025 1.06l-6.5 7a.75.75 0 0 1-1.085 0l-.5-.583a.75.75 0 1 1 1.138-.976l.007.008 5.854-6.484a.75.75 0 0 1 1.061-.025z"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Bot avatar dot */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#25d366] flex items-center justify-center flex-shrink-0 mb-1">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 32 32">
            <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.782 6.86L2 30l7.347-1.757A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/>
          </svg>
        </div>
      )}
    </div>
  );
}
