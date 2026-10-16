'use client';

import { useEffect, useMemo, useRef } from 'react';
import { ArrowLeftIcon, ArrowPathIcon, ArrowTopRightOnSquareIcon, EyeIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { AppChat, AppChatMessage, AppChatParticipant, AppChatsApi } from '@/lib/admin/appChats';
import { STAYS_URL } from '@/lib/admin/groupImports';

interface AppChatThreadProps {
  chat: AppChat | null;
  messages: AppChatMessage[] | null;
  loading: boolean;
  error?: string | null;
  onBack: () => void;
  onRefresh: () => void;
}

function Person({ role, person }: { role: string; person: AppChatParticipant }) {
  const contact = [person.phone, person.email].filter(Boolean).join(' · ');
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{role}</p>
      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{person.name}</p>
      {contact && <p className="truncate text-xs text-gray-500 dark:text-gray-400" title={contact}>{contact}</p>}
    </div>
  );
}

function Bubble({ message, guestSide }: { message: AppChatMessage; guestSide: boolean }) {
  const assistant = message.from === 'assistant';
  return (
    <div className={`flex ${guestSide ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[85%] sm:max-w-[70%] ${guestSide ? '' : 'items-end'} flex flex-col`}>
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm shadow-sm ${guestSide
            ? 'rounded-bl-md bg-white text-gray-900 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700'
            : assistant
              ? 'rounded-br-md bg-violet-50 text-gray-900 ring-1 ring-violet-200 dark:bg-violet-900/30 dark:text-gray-100 dark:ring-violet-800'
              : 'rounded-br-md bg-brand-600 text-white'}`}
        >
          {message.replyToContent && (
            <div className={`mb-1.5 border-l-2 pl-2 text-xs ${guestSide || assistant ? 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400' : 'border-white/50 text-white/80'}`}>
              {message.replyToSenderName && <span className="font-medium">{message.replyToSenderName}: </span>}
              <span className="line-clamp-2">{message.replyToContent}</span>
            </div>
          )}
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className={`mt-1 flex flex-wrap items-center gap-1.5 px-1 text-[11px] text-gray-500 dark:text-gray-400 ${guestSide ? '' : 'justify-end'}`}>
          {assistant && (
            <span className="inline-flex items-center gap-0.5 font-medium text-violet-700 dark:text-violet-300">
              <SparklesIcon className="h-3 w-3" aria-hidden />Assistant
            </span>
          )}
          {!assistant && <span>{message.senderName}</span>}
          <span aria-hidden>·</span>
          <time dateTime={message.timestamp}>{AppChatsApi.timeLabel(message.timestamp)}</time>
          {message.containsContactInfo && (
            <span className="rounded-full bg-amber-50 px-1.5 py-px font-medium text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800"
              title="This message had a phone number, email or social handle. The other person saw it masked.">
              Contact shared
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AppChatThread({ chat, messages, loading, error, onBack, onRefresh }: AppChatThreadProps) {
  const endRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => {
    const groups: Array<{ day: string; label: string; items: AppChatMessage[] }> = [];
    for (const m of messages || []) {
      const day = new Date(m.timestamp).toDateString();
      if (groups.at(-1)?.day !== day) groups.push({ day, label: AppChatsApi.dayLabel(m.timestamp), items: [] });
      groups.at(-1)!.items.push(m);
    }
    return groups;
  }, [messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  if (!chat) {
    return (
      <section className="hidden flex-1 flex-col items-center justify-center gap-3 bg-gray-50 px-6 text-center dark:bg-gray-900 md:flex">
        <EyeIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" aria-hidden />
        <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
          Pick a chat to read what guests and hosts are saying to each other.
        </p>
      </section>
    );
  }

  const direct = chat.kind === 'direct';

  return (
    <section aria-label="Conversation" className="flex min-h-0 flex-1 flex-col bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} aria-label="Back to chats"
            className="-ml-1 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white md:hidden">
            <ArrowLeftIcon className="h-5 w-5" aria-hidden />
          </button>
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-gray-900 dark:text-white">
            {direct ? 'Direct message' : chat.propertyTitle || 'Listing'}
          </h2>
          {!direct && chat.propertyId && (
            <a href={`${STAYS_URL}/property/${chat.propertyId}`} target="_blank" rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20">
              Listing<ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
          <button type="button" onClick={onRefresh} aria-label="Refresh" disabled={loading}
            className="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-white">
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Person role={direct ? 'Started by' : 'Guest'} person={chat.guest} />
          <div className="text-right [&>div]:ml-auto"><Person role={direct ? 'With' : 'Host'} person={chat.host} /></div>
        </div>
      </header>

      <div role="log" aria-label="Messages" aria-busy={loading} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {error ? (
          <p role="alert" className="mx-auto mt-8 max-w-sm rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </p>
        ) : !messages ? (
          <div className="space-y-4" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 ? 'justify-end' : 'justify-start'}`}>
                <div className={`h-10 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700 ${i % 2 ? 'w-1/2' : 'w-2/5'}`} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">No messages in this chat.</p>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {days.map((group) => (
              <div key={group.day} className="space-y-3">
                <div className="flex items-center gap-3" role="separator">
                  <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{group.label}</span>
                  <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>
                <ul className="space-y-3">
                  {group.items.map((m) => (
                    <li key={m.messageId}><Bubble message={m} guestSide={m.from === 'guest'} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <footer className="border-t border-gray-200 bg-white px-4 py-2.5 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
        Read-only. You see contact details unmasked; the guest and host don’t.
      </footer>
    </section>
  );
}
