'use client';

import { Button } from '@/design-system/components/Button';
import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
    type: 'tenant' | 'prospect' | 'maintenance' | 'system';
  };
  propertyId?: string;
  propertyTitle?: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  category: 'inquiry' | 'maintenance' | 'payment' | 'complaint' | 'general' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

interface ComposeMessage {
  to: string;
  subject: string;
  content: string;
  propertyId?: string;
}

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeMessage, setComposeMessage] = useState<ComposeMessage>({
    to: '',
    subject: '',
    content: '',
    propertyId: ''
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape key handling
      if (event.key === 'Escape') {
        if (showCompose) {
          setShowCompose(false);
        } else if (selectedMessage) {
          setSelectedMessage(null);
        } else if (searchTerm) {
          setSearchTerm('');
        }
      }
      
      // Ctrl/Cmd + K for search focus
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Ctrl/Cmd + N for new message
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        setShowCompose(true);
        setSelectedMessage(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedMessage, showCompose, searchTerm]);



  useEffect(() => {
    // Messages fetching to be implemented with actual API calls
    setMessages([]);
    setLoading(false);
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !message.isRead) ||
      (filter === 'starred' && message.isStarred) ||
      message.category === filter;
    
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.propertyTitle && message.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Function to highlight search terms
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const unreadCount = messages.filter(m => !m.isRead).length;
  const starredCount = messages.filter(m => m.isStarred).length;

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ));
  };

  const toggleStar = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Here you would typically send the reply to your backend
    console.log('Sending reply:', replyText);
    
    // Clear the reply text
    setReplyText('');
    setIsSending(false);
    
    // Show success message (you could add a toast notification here)
    alert('Reply sent successfully!');
  };

  const handleSendMessage = async () => {
    if (!composeMessage.to.trim() || !composeMessage.subject.trim() || !composeMessage.content.trim()) return;
    
    setIsSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new message object
    const newMessage: Message = {
      id: Date.now().toString(),
      subject: composeMessage.subject,
      content: composeMessage.content,
      sender: {
        name: 'You',
        email: 'landlord@ndotoniproperties.com',
        type: 'system'
      },
      propertyId: composeMessage.propertyId || undefined,
      propertyTitle: composeMessage.propertyId ? 'Selected Property' : undefined,
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      category: 'general',
      priority: 'medium'
    };
    
    // Add to messages (in real app, this would be handled by the backend)
    setMessages(prev => [newMessage, ...prev]);
    
    // Reset compose form
    setComposeMessage({
      to: '',
      subject: '',
      content: '',
      propertyId: ''
    });
    
    setShowCompose(false);
    setIsSending(false);
    
    // Show success message
    alert('Message sent successfully!');
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredMessages.map(m => m.id));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="animate-pulse p-6">
          <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl mb-6"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Top Navigation */}
      <div className={`lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 ${selectedMessage || showCompose ? 'hidden' : 'block'}`}>
        {/* Mobile Compose Button */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
          <Button 
            onClick={() => {
              setShowCompose(true);
              setSelectedMessage(null);
            }}
            variant="primary"
            size="md"
            fullWidth={true}
            className="rounded-lg"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Compose
          </Button>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <div className="flex p-2 min-w-max">
            {[
              { key: 'all', label: 'Inbox', count: messages.length },
              { key: 'starred', label: 'Starred', count: starredCount },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'inquiry', label: 'Inquiries' },
              { key: 'maintenance', label: 'Maintenance' },
              { key: 'payment', label: 'Payments' },
              { key: 'complaint', label: 'Complaints' },
              { key: 'general', label: 'General' },
            ].map(({ key, label, count }) => {
              const categoryCount = key === 'all' || key === 'starred' || key === 'unread' 
                ? (count ?? 0)
                : messages.filter(m => m.category === key).length;
              
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`flex items-center space-x-1 px-3 py-1 mx-1 rounded whitespace-nowrap text-sm transition-colors ${
                    filter === key 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span>{label}</span>
                  {categoryCount > 0 && (
                    <span className={`text-xs ${
                      filter === key 
                        ? 'text-blue-600 dark:text-blue-300' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      ({categoryCount})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-col ${selectedMessage ? 'lg:flex' : 'flex'} ${showCompose ? 'hidden lg:flex' : ''}`}>
        {/* Compose Button */}
        <div className="p-4">
          <Button
            onClick={() => {
              setShowCompose(true);
              setSelectedMessage(null);
            }}
            variant="primary"
            size="lg"
            fullWidth={true}
            className="rounded-full shadow-sm hover:shadow-md"
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Compose
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2">
          <div className="space-y-1">
            {[
              { key: 'all', label: 'Inbox', count: messages.length, icon: 'inbox' },
              { key: 'starred', label: 'Starred', count: starredCount, icon: 'star' },
              { key: 'unread', label: 'Unread', count: unreadCount, icon: 'unread' },
            ].map(({ key, label, count, icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-r-full transition-colors ${
                  filter === key 
                    ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {icon === 'inbox' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  )}
                  {icon === 'star' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  {icon === 'unread' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span>{label}</span>
                </div>
                {count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    filter === key 
                      ? 'bg-white/20 text-white dark:bg-white/10 dark:text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-8">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Categories
            </div>
            <div className="space-y-1">
              {[
                { key: 'inquiry', label: 'Inquiries' },
                { key: 'maintenance', label: 'Maintenance' },
                { key: 'payment', label: 'Payments' },
                { key: 'complaint', label: 'Complaints' },
                { key: 'general', label: 'General' },
              ].map(({ key, label }) => {
                const count = messages.filter(m => m.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-r-full transition-colors ${
                      filter === key 
                        ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{label}</span>
                    {count > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        filter === key 
                          ? 'bg-white/20 text-white dark:bg-white/10 dark:text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:min-w-0">
        {!selectedMessage && !showCompose ? (
          <>
            {/* Gmail-style Search Bar */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  placeholder="Search mail"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}

                  className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-full focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:shadow-md transition-all"
                />
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-4"
                  >
                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Gmail-style Toolbar */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMessages.length === filteredMessages.length && filteredMessages.length > 0}
                  onChange={selectAllMessages}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                />
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              
              {selectedMessages.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex-1"></div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredMessages.length} of {messages.length}
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* Gmail-style Message List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length > 0 ? (
                <div>
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800 hover:shadow-sm cursor-pointer transition-all ${
                        !message.isRead ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'
                      } ${selectedMessages.includes(message.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => {
                        setSelectedMessage(message);
                        setReplyText('');
                        if (!message.isRead) {
                          markAsRead(message.id);
                        }
                      }}
                    >
                      {/* Checkbox */}
                      <div className="flex items-center space-x-3 mr-4">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleMessageSelection(message.id);
                          }}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-800"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(message.id);
                          }}
                          className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ${
                            message.isStarred ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500'
                          }`}
                        >
                          <svg className="w-4 h-4" fill={message.isStarred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>

                      {/* Sender */}
                      <div className="w-48 flex-shrink-0">
                        <div className={`text-sm truncate ${!message.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                          {searchTerm ? highlightSearchTerm(message.sender.name, searchTerm) : message.sender.name}
                        </div>
                      </div>

                      {/* Subject and Content */}
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm truncate ${!message.isRead ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                            {searchTerm ? highlightSearchTerm(message.subject, searchTerm) : message.subject}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            - {searchTerm ? highlightSearchTerm(message.content.substring(0, 100), searchTerm) : message.content.substring(0, 100)}...
                          </span>
                        </div>
                        {message.propertyTitle && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{searchTerm && message.propertyTitle ? highlightSearchTerm(message.propertyTitle, searchTerm) : message.propertyTitle}</span>
                          </div>
                        )}
                      </div>

                      {/* Attachments and Timestamp */}
                      <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                        {message.attachments && message.attachments.length > 0 && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        )}
                        <span className="w-16 text-right">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">No messages found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      {searchTerm || filter !== 'all' 
                        ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                        : 'Your inbox is empty. New messages will appear here when they arrive.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : showCompose ? (
          /* Inline Compose View */
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            {/* Compose Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </button>
                  <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">New Message</h1>
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* Compose Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* To Field */}
                <div className="flex items-center space-x-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">To</label>
                  <input
                    type="email"
                    placeholder="recipient@email.com"
                    value={composeMessage.to}
                    onChange={(e) => setComposeMessage(prev => ({ ...prev, to: e.target.value }))}
                    className="flex-1 px-3 py-2 border-0 focus:outline-none text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Property Field */}
                <div className="flex items-center space-x-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">Property</label>
                  <select
                    value={composeMessage.propertyId}
                    onChange={(e) => setComposeMessage(prev => ({ ...prev, propertyId: e.target.value }))}
                    className="flex-1 px-3 py-2 border-0 focus:outline-none text-gray-900 dark:text-gray-100 bg-transparent"
                  >
                    <option value="">Select a property (optional)...</option>
                    <option value="1">Modern Apartment in Masaki</option>
                    <option value="2">Family House in Mikocheni</option>
                    <option value="3">Studio in Upanga</option>
                  </select>
                </div>

                {/* Subject Field */}
                <div className="flex items-center space-x-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-16">Subject</label>
                  <input
                    type="text"
                    placeholder="Enter subject..."
                    value={composeMessage.subject}
                    onChange={(e) => setComposeMessage(prev => ({ ...prev, subject: e.target.value }))}
                    className="flex-1 px-3 py-2 border-0 focus:outline-none text-gray-900 dark:text-gray-100 bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Message Content */}
                <div className="mt-6">
                  <textarea
                    rows={12}
                    placeholder="Type your message..."
                    value={composeMessage.content}
                    onChange={(e) => setComposeMessage(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Send Actions */}
                <div className="flex items-center justify-between pt-4">
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-sm">Attach files</span>
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowCompose(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!composeMessage.to.trim() || !composeMessage.subject.trim() || !composeMessage.content.trim() || isSending}
                      variant="primary"
                      size="md"
                      loading={isSending}
                      rightIcon={
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      }
                    >
                      {isSending ? 'Sending...' : 'Send'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedMessage ? (
          /* Simplified Message View */
          <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
            {/* Message Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setReplyText('');
                  }}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{selectedMessage.subject}</h1>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleStar(selectedMessage.id)}
                  className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors ${
                    selectedMessage.isStarred ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill={selectedMessage.isStarred ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <ThemeToggle />
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Property Info */}
                {selectedMessage.propertyTitle && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-4">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm font-medium">Property: {selectedMessage.propertyTitle}</span>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {selectedMessage.sender.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{selectedMessage.sender.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.sender.email}</div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(selectedMessage.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.content}
                  </div>
                  
                  {/* Attachments */}
                  {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Attachments</div>
                      <div className="space-y-2">
                        {selectedMessage.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{attachment.name}</span>
                            <Button variant="primary" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Section */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-10 h-10 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">You</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        placeholder="Reply to this message..."
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span className="text-sm">Attach files</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <button className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-medium transition-colors">
                        Save Draft
                      </button>
                      <Button 
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || isSending}
                        variant="primary"
                        size="md"
                        loading={isSending}
                        rightIcon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        }
                      >
                        {isSending ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}