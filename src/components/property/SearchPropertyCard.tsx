'use client';

import React, { useState, memo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';
import { useChat } from '@/contexts/ChatContext';
import { logger } from '@/lib/utils/logger';
import { featureFlags } from '@/config/features';
import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, MessageCircle, Play } from 'lucide-react';
import VerifiedPropertyBadge from './VerifiedPropertyBadge';
import { locationLine } from '@/lib/location/format';

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
  const { t, language } = useLanguage();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  useEffect(() => { setImageError(false); setIsImageLoading(true); }, [property.thumbnail]);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useAuthPrompt();
  const { initializeChat } = useChat();

  const propertyLink = `/property/${property.propertyId}`;
  const price = property.monthlyRent;
  const priceLabel = t('properties.perMonthShort');
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

  const typeLabel = t(`properties.propertyTypes.${property.propertyType.toLowerCase()}`);

  return (
    <div className={cn('group cursor-pointer', className)}>
      <Link href={propertyLink} className="block rounded-2xl bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 overflow-hidden transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(17,24,39,0.45)] motion-reduce:hover:translate-y-0">
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
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
            />
          ) : !imageError && property.thumbnail && isVideoThumbnail ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-brand-50 text-brand-800 dark:bg-gray-700 dark:text-brand-200">
              <Play className="h-9 w-9" />
              <span className="text-sm font-semibold">{language === 'sw' ? 'Angalia video' : 'View video'}</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-stone-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
          )}

          {/* Skeleton shimmer */}
          {isImageLoading && !imageError && property.thumbnail && !isVideoThumbnail && (
            <div className="absolute inset-0 bg-stone-200 dark:bg-gray-700 animate-pulse" />
          )}

          {isVerified && (
            <div className="absolute top-3 left-3 z-10">
              <VerifiedPropertyBadge verified={isVerified} size="sm" />
            </div>
          )}

          {/* Sticker price — the brand's poster tag */}
          <p className="absolute bottom-3 left-3 z-10 inline-flex -rotate-2 items-baseline gap-1 rounded-md bg-sand-300 px-2.5 py-1 text-ink-900 shadow-[0_8px_16px_-6px_rgba(17,24,39,0.5)] transition-transform duration-300 ease-out group-hover:rotate-0">
            <span className="font-poster text-lg font-extrabold tabular-nums leading-tight tracking-tight">
              {formatCurrency(price, property.currency)}
            </span>
            <span className="text-xs font-semibold">{priceLabel}</span>
          </p>

          {/* Top overlay: favorite + chat */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {featureFlags.enableInAppChat && (
              <button
                onClick={handleChatClick}
                disabled={isInitializingChat}
                aria-label={t('properties.messageAboutProperty')}
                title={t('properties.messageAboutProperty')}
                type="button"
                className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
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
                aria-label={isFavorited ? t('properties.removeFromFavorites') : t('properties.addToFavorites')}
                aria-pressed={isFavorited}
                title={isFavorited ? t('properties.removeFromFavorites') : t('properties.addToFavorites')}
                type="button"
                className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
              >
                <Heart
                  className={cn('w-4 h-4 transition-colors', isFavorited ? 'text-brand-600 fill-brand-600' : 'text-ink-700 dark:text-gray-200')}
                  strokeWidth={isFavorited ? 0 : 2}
                />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 pt-3 space-y-0.5">
          {/* Location */}
          <p className="font-poster text-base sm:text-lg font-bold tracking-tight text-ink-900 dark:text-white truncate group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
            {locationLine(property)}
          </p>

          {/* Type + bedrooms */}
          <p className="text-xs sm:text-sm text-ink-500 dark:text-gray-400 line-clamp-1">
            {typeLabel}
            {bedrooms && bedrooms > 0 ? ` · ${bedrooms} ${t(bedrooms === 1 ? 'properties.bed' : 'properties.beds')}` : ''}
          </p>

        </div>
      </Link>
    </div>
  );
});

SearchPropertyCard.displayName = 'SearchPropertyCard';
export default SearchPropertyCard;
