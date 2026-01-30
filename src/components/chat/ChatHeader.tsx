import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface ChatHeaderProps {
  conversationCount: number;
}

export function ChatHeader({ conversationCount }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section - Logo and Back */}
        <div className="flex items-center space-x-3">
          <Logo size="sm" showTagline={false} href="/" />
        </div>
        
        {/* Right Section - Messages Count */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Messages
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {conversationCount} conversation{conversationCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}