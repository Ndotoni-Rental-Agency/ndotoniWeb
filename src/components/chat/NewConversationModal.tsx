'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, Search, MessageCircle, User, MapPin } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { searchChatUsers } from '@/graphql/queries';
import { initializeDirectChat } from '@/graphql/mutations';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';

interface ChatUser {
  userId: string;
  firstName: string;
  lastName: string;
  businessName?: string | null;
  profileImage?: string | null;
  userType: string;
}

interface NewConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationCreated: (conversationId: string, otherPartyName: string) => void;
}

export function NewConversationModal({
  isOpen,
  onClose,
  onConversationCreated,
}: NewConversationModalProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChatUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitializing, setIsInitializing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Location filter state
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<FlattenedLocation | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const { results: locationResults } = useRegionSearch(locationQuery, 200);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      setLocationQuery('');
      setSelectedLocation(null);
      setShowLocationDropdown(false);
    }
  }, [isOpen]);

  const searchUsers = useCallback(async (searchQuery: string, location?: FlattenedLocation | null) => {
    if (searchQuery.trim().length < 2 && !location) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const variables: any = { query: searchQuery.trim() || '', limit: 10, source: 'ndotoniweb' };
      
      if (location) {
        if (location.type === 'district') {
          variables.region = location.regionName;
          variables.district = location.name;
        } else {
          variables.region = location.name;
        }
      }

      const data = await GraphQLClient.executeAuthenticated<{ searchChatUsers: ChatUser[] }>(
        searchChatUsers,
        variables
      );
      setResults(data.searchChatUsers || []);
    } catch (err) {
      console.error('Error searching chat users:', err);
      setError('Failed to search users. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchUsers(value, selectedLocation);
    }, 300);
  };

  const handleSelectLocation = (location: FlattenedLocation) => {
    setSelectedLocation(location);
    setLocationQuery(location.displayName);
    setShowLocationDropdown(false);
    // Re-search with location filter
    searchUsers(query, location);
  };

  const handleClearLocation = () => {
    setSelectedLocation(null);
    setLocationQuery('');
    // Re-search without location filter
    if (query.trim().length >= 2) {
      searchUsers(query, null);
    } else {
      setResults([]);
    }
  };

  const handleSelectUser = async (user: ChatUser) => {
    setIsInitializing(user.userId);
    setError(null);

    try {
      const data = await GraphQLClient.executeAuthenticated<{
        initializeDirectChat: {
          conversationId: string;
          targetUserInfo: ChatUser;
        };
      }>(initializeDirectChat, { targetUserId: user.userId });

      const { conversationId, targetUserInfo } = data.initializeDirectChat;
      const displayName = targetUserInfo.businessName ||
        `${targetUserInfo.firstName} ${targetUserInfo.lastName}`.trim();

      onConversationCreated(conversationId, displayName);
      onClose();
    } catch (err: any) {
      console.error('Error initializing direct chat:', err);
      setError(err?.message || 'Failed to start conversation. Please try again.');
    } finally {
      setIsInitializing(null);
    }
  };

  const getUserDisplayName = (user: ChatUser): string => {
    if (user.businessName) return user.businessName;
    return `${user.firstName} ${user.lastName}`.trim() || 'Unknown User';
  };

  const getUserTypeLabel = (userType: string): string => {
    switch (userType) {
      case 'LANDLORD': return 'Landlord';
      case 'ADMIN': return 'Admin';
      default: return userType;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            New Conversation
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inputs */}
        <div className="p-4 space-y-3">
          {/* Name search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name or business..."
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
          </div>

          {/* Location filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by location (region or district)..."
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setShowLocationDropdown(true);
                if (!e.target.value) {
                  handleClearLocation();
                }
              }}
              onFocus={() => setShowLocationDropdown(true)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
            />
            {selectedLocation && (
              <button
                onClick={handleClearLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Location dropdown */}
            {showLocationDropdown && locationQuery && !selectedLocation && locationResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-lg max-h-40 overflow-y-auto z-10">
                {locationResults.slice(0, 8).map((location, idx) => (
                  <button
                    key={`${location.type}-${location.name}-${idx}`}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                  >
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white truncate">
                      {location.displayName}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto flex-shrink-0 capitalize">
                      {location.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active location badge */}
          {selectedLocation && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded-full">
                <MapPin className="w-3 h-3" />
                {selectedLocation.displayName}
                <button onClick={handleClearLocation} className="ml-0.5 hover:text-brand-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto px-4 pb-4">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
              <span className="ml-2 text-sm text-gray-500">Searching...</span>
            </div>
          )}

          {!isSearching && (query.length >= 2 || selectedLocation) && results.length === 0 && (
            <div className="text-center py-8">
              <User className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedLocation
                  ? `No landlords found in ${selectedLocation.displayName}`
                  : `No users found matching "${query}"`}
              </p>
            </div>
          )}

          {!isSearching && query.length < 2 && !selectedLocation && (
            <div className="text-center py-8">
              <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Search for a landlord or admin to start a conversation
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                You can also filter by location to find nearby landlords
              </p>
            </div>
          )}

          {results.map((user) => (
            <button
              key={user.userId}
              onClick={() => handleSelectUser(user)}
              disabled={isInitializing !== null}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={getUserDisplayName(user)}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      {(user.firstName || '?')[0]}{(user.lastName || '?')[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {getUserDisplayName(user)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getUserTypeLabel(user.userType)}
                </p>
              </div>

              {/* Loading indicator */}
              {isInitializing === user.userId ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4 text-gray-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
