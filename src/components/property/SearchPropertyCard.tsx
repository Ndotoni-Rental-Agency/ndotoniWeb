'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType, ShortTermProperty } from '@/API';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import LazyAuthModal from '@/components/auth/LazyAuthModal';
import { logger } from '@/lib/utils/logger';
import { featureFlags } from '@/config/features';
import { Heart, MessageCircle } from 'lucide-react';
import VerifiedPropertyBadge from './VerifiedPropertyBadge';

interface SearchPropertyCardProps {
  property: PropertyCardType | ShortTermProperty;
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'chat' | 'favorite' | null>(null);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const { isAuthenticated } = useAuth();
  const { initializeChat } = useChat();

  const isShortTermProperty = (prop: PropertyCardType | ShortTermProperty): prop is ShortTermProperty =>
    'nightlyRate' in prop;

  const isShortTerm = isShortTermProperty(property);
  const propertyLink = isShortTerm ? `/short-property/${property.propertyId}` : `/property/${property.propertyId}`;
  const price = isShortTerm ? property.nightlyRate : property.monthlyRent;
  const priceLabel = isShortTerm ? '/night' : '/mo';
  const bedrooms = isShortTerm ? undefined : (property as PropertyCardType).bedrooms;
  const isVerified = !isShortTerm && (property as PropertyCardType).verified;

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setPendingAction('favorite');
      setIsAuthModalOpen(true);
      return;
    }
    onFavoriteToggle?.(property.propertyId);
  }, [isAuthenticated, onFavoriteToggle, property.propertyId]);

  const handleChatClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setPendingAction('chat');
      setIsAuthModalOpen(true);
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
  }, [isAuthenticated, property.propertyId, isInitializingChat, initializeChat, router]);

  const handleAuthSuccess = useCallback(async () => {
    setIsAuthModalOpen(false);
    if (pendingAction === 'chat') {
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
    } else if (pendingAction === 'favorite') {
      onFavoriteToggle?.(property.propertyId);
    }
    setPendingAction(null);
  }, [pendingAction, property.propertyId, onFavoriteToggle, initializeChat, router]);

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
                type="button"
                className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
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
                type="button"
                className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Heart
                  className={cn('w-4 h-4 transition-colors', isFavorited ? 'text-brand-600 fill-brand-600' : 'text-ink-700 dark:text-gray-200')}
                  strokeWidth={isFavorited ? 0 : 2}
                />
              </button>
            )}
          </div>

          {/* Short-term badge */}
          {isShortTerm && (
            <div className="absolute top-3 left-3">
              <span className="text-[11px] font-semibold bg-ink-900/80 text-cream-50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                Nightly
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-1">
          {/* Location */}
          <p className="text-sm font-semibold text-ink-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {property.district}, {property.region}
          </p>

          {/* Type + bedrooms */}
          <p className="text-xs sm:text-sm text-ink-500 dark:text-gray-400 line-clamp-1">
            {typeLabel[property.propertyType] || property.propertyType}
            {bedrooms && bedrooms > 0 ? ` · ${bedrooms} bed${bedrooms > 1 ? 's' : ''}` : ''}
          </p>

          {/* Price */}
          <p className="text-sm text-ink-900 dark:text-white pt-1">
            <span className="font-bold">{formatCurrency(price, property.currency)}</span>
            <span className="text-ink-400 dark:text-gray-500 font-normal"> {priceLabel}</span>
          </p>
        </div>
      </Link>

      <LazyAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => { setIsAuthModalOpen(false); setPendingAction(null); }}
        initialView="signin"
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
});

SearchPropertyCard.displayName = 'SearchPropertyCard';
export default SearchPropertyCard;
