import React from 'react';
import Logo from '@/components/ui/Logo';

interface ChatHeaderProps {
  conversationCount: number;
}

export function ChatHeader({ conversationCount }: ChatHeaderProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ndotoni Brand with Back Arrow - Left */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2 hover:bg-white/60 dark:hover:bg-slate-700/60 rounded-xl transition-all duration-200 group"
            title="Go to homepage"
          >
            <svg className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <Logo size="sm" showTagline={false} href="/" />
        </div>
        
        {/* Messages Count - Right */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Messages
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}