'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { formatCurrency, toTitleCase } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';
import { useChat } from '@/contexts/ChatContext';
import { logger } from '@/lib/utils/logger';
import { featureFlags } from '@/config/features';
import { Heart, MessageCircle } from 'lucide-react';
import VerifiedPropertyBadge from './VerifiedPropertyBadge';

interface SearchPropertyCardProps {
  property: PropertyCardType;
  className?: string;
  showFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: boolean;
}

const SearchPropertyCard: React.FC<SearchPropertyCardProps> = memo(({
  property,
  className,
  showFavorite = true,
  onFavoriteToggle,
  isFavorited = false,
}) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthPrompt();
  const { initializeChat } = useChat();

  const propertyLink = `/property/${property.propertyId}`;
  const price = property.monthlyRent;
  const priceLabel = '/ month';
  const bedrooms = property.bedrooms;
  const isVerified = property.verified;

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      requireAuth({
        action: { type: 'favorite', propertyId: property.propertyId },
      });
      return;
    }
    onFavoriteToggle?.(property.propertyId);
  }, [isAuthenticated, onFavoriteToggle, property.propertyId, requireAuth]);

  const handleChatClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      requireAuth({
        action: { type: 'chat', propertyId: property.propertyId },
      });
      return;
    }
    if (isInitializingChat) return;
    try {
      setIsInitializingChat(true);
      const chatData = await initializeChat(property.propertyId);
      const params = new URLSearchParams({
        conversationId: chatData.conversationId,
        propertyId: property.propertyId,
        propertyTitle: chatData.propertyTitle,
        landlordName: chatData.landlordName,
        newPropertyInquiry: 'true',
      });
      router.push(`/chat?${params.toString()}`);
    } catch (error) {
      logger.error('Error initializing chat:', error);
    } finally {
      setIsInitializingChat(false);
    }
  }, [isAuthenticated, property.propertyId, isInitializingChat, initializeChat, router, requireAuth]);

  const isVideoThumbnail = property.thumbnail && (
    property.thumbnail.includes('/video/') ||
    property.thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i)
  );

  const typeLabel: Record<string, string> = {
    APARTMENT: 'Apartment', HOUSE: 'House', STUDIO: 'Studio',
    ROOM: 'Room', COMMERCIAL: 'Commercial', LAND: 'Land',
  };

  return (
    <div className={cn('group cursor-pointer', className)}>
      <Link href={propertyLink} className="block rounded-2xl bg-white dark:bg-gray-800 border border-stone-100 dark:border-gray-700 shadow-soft overflow-hidden transition-all duration-300 hover:shadow-editorial hover:border-stone-200 dark:hover:border-gray-600">
        {/* Image — 4:3 aspect, full width */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-gray-700">
          {!imageError && property.thumbnail && !isVideoThumbnail ? (
            <Image
              src={property.thumbnail}
              alt={property.title}
              fill
              className={cn(
                'object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform',
                isImageLoading && 'opacity-0'
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => { setImageError(true); setIsImageLoading(false); }}
              quality={70}
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : !imageError && property.thumbnail && isVideoThumbnail ? (
            <video
              src={property.thumbnail}
              className="w-full h-full object-cover"
              preload="metadata"
              muted
              playsInline
              onLoadedMetadata={(e) => { e.currentTarget.currentTime = 1; }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
          )}

          {/* Skeleton shimmer */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-stone-200 dark:bg-gray-700 animate-pulse" />
          )}

          {isVerified && (
            <div className="absolute top-3 left-3 z-10">
              <VerifiedPropertyBadge verified={isVerified} size="sm" />
            </div>
          )}

          {/* Top overlay: favorite + chat */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {featureFlags.enableInAppChat && (
              <button
                onClick={handleChatClick}
                disabled={isInitializingChat}
                title="Message about this property"
                aria-label="Message about this property"
                type="button"
                className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors hover:bg-white disabled:opacity-50"
              >
                {isInitializingChat ? (
                  <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-clay-500 rounded-full animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4 text-ink-700 dark:text-gray-200" strokeWidth={1.75} />
                )}
              </button>
            )}
            {showFavorite && (
              <button
                onClick={handleFavoriteClick}
                title={isFavorited ? 'Remove from favorites' : 'Save'}
                aria-label={isFavorited ? 'Remove from favorites' : 'Save'}
                aria-pressed={isFavorited}
                type="button"
                className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors hover:bg-white"
              >
                <Heart
                  className={cn('w-4 h-4 transition-colors', isFavorited ? 'text-brand-600 fill-brand-600' : 'text-ink-700 dark:text-gray-200')}
                  strokeWidth={isFavorited ? 0 : 2}
                />
              </button>
            )}
          </div>
        </div>

        {/* Content: price first, it is what renters scan for */}
        <div className="p-3 sm:p-4 space-y-1">
          <p className="text-base text-ink-900 dark:text-white tabular-nums">
            <span className="font-bold">{formatCurrency(price, property.currency)}</span>
            <span className="text-ink-600 dark:text-gray-400 font-normal"> {priceLabel}</span>
          </p>
          <p className="text-sm text-ink-700 dark:text-gray-300 line-clamp-1">
            {typeLabel[property.propertyType] || property.propertyType}
            {bedrooms && bedrooms > 0 ? ` · ${bedrooms} bedroom${bedrooms > 1 ? 's' : ''}` : ''}
          </p>
          <p className="text-sm text-ink-600 dark:text-gray-400 truncate">
            {toTitleCase([property.district, property.region].filter(Boolean).join(', '))}
          </p>
        </div>
      </Link>
    </div>
  );
});

SearchPropertyCard.displayName = 'SearchPropertyCard';
export default SearchPropertyCard;
