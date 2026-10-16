'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { AppChat } from '@/lib/admin/appChats';
import { timeAgo } from '@/lib/admin/groupImports';

export type AppChatFilter = 'all' | 'awaiting';

interface AppChatListProps {
  chats: AppChat[] | null;
  shown: AppChat[];
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
  search: string;
  onSearch: (value: string) => void;
  filter: AppChatFilter;
  onFilter: (value: AppChatFilter) => void;
  awaitingCount: number;
  error?: string | null;
  onRetry: () => void;
}

export function AppChatList({ chats, shown, selectedId, onSelect, search, onSearch, filter, onFilter, awaitingCount, error, onRetry }: AppChatListProps) {
  return (
    <aside
      aria-label="Conversations"
      className={`min-h-0 flex-col border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:flex md:w-80 md:shrink-0 md:border-r lg:w-96 ${selectedId ? 'hidden' : 'flex flex-1'}`}
    >
      <div className="space-y-3 border-b border-gray-200 p-4 dark:border-gray-700">
        <label className="relative block">
          <span className="sr-only">Search chats</span>
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Guest, host or listing"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
        </label>
        <div className="flex items-center gap-1.5" role="group" aria-label="Filter">
          {(['all', 'awaiting'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => onFilter(value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filter === value
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              {value === 'all' ? 'All' : `Awaiting host${awaitingCount ? ` · ${awaitingCount}` : ''}`}
            </button>
          ))}
          {chats && (
            <span className="ml-auto text-xs tabular-nums text-gray-500 dark:text-gray-400">
              {shown.length === chats.length ? `${chats.length} chats` : `${shown.length} of ${chats.length}`}
            </span>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {error ? (
          <div role="alert" className="p-4 text-sm text-red-700 dark:text-red-400">
            {error}{' '}
            <button type="button" onClick={onRetry} className="font-medium underline">Try again</button>
          </div>
        ) : !chats ? (
          <ul aria-busy className="divide-y divide-gray-100 dark:divide-gray-700">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} className="flex animate-pulse gap-3 px-4 py-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-700" />
                </div>
              </li>
            ))}
          </ul>
        ) : shown.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {filter === 'awaiting' ? 'Every guest has an answer.' : search ? 'No chats match.' : 'No chats yet.'}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {shown.map((chat) => {
              const selected = chat.conversationId === selectedId;
              return (
                <li key={chat.conversationId}>
                  <button
                    type="button"
                    onClick={() => onSelect(chat.conversationId)}
                    aria-current={selected ? 'true' : undefined}
                    className={`flex w-full gap-3 px-4 py-3.5 text-left transition-colors focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-700/50 ${selected
                      ? 'bg-brand-50 dark:bg-brand-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {chat.kind === 'direct' ? 'Direct message' : chat.propertyTitle || 'Listing'}
                        </p>
                        <span className="shrink-0 text-xs tabular-nums text-gray-500 dark:text-gray-400">{timeAgo(chat.lastMessageAt)}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {chat.guest.name} <span aria-hidden>→</span><span className="sr-only">to</span> {chat.host.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm text-gray-600 dark:text-gray-300">
                          {chat.lastMessageFrom === 'host' && <span className="text-gray-400 dark:text-gray-500">Host: </span>}
                          {chat.lastMessage}
                        </p>
                        {chat.awaitingHost && (
                          <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800">
                            Awaiting host
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
