'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { createChatUrl } from '@/lib/utils/chat';

interface FloatingChatButtonProps {
  propertyId?: string;
  landlordId?: string;
  propertyTitle?: string;
  className?: string;
}

export default function FloatingChatButton({ 
  propertyId, 
  landlordId, 
  propertyTitle,
  className = "fixed bottom-6 right-6 z-40"
}: FloatingChatButtonProps) {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useChat();
  const router = useRouter();

  if (!isAuthenticated) {
    return null; // Don't show for unauthenticated users
  }

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (propertyId && propertyTitle) {
      // Navigate to chat with property context
      const chatUrl = createChatUrl(propertyId, landlordId, propertyTitle);
      router.push(chatUrl);
    } else {
      // Navigate to general chat page
      router.push('/chat');
    }
  };

  return (
    <button
      onClick={handleChatClick}
      className={`${className} bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group`}
      title="Open Messages"
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        
        {/* Notification badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 bg-yellow-400 text-red-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {propertyTitle ? `Message about ${propertyTitle}` : 'Open Messages'}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
}