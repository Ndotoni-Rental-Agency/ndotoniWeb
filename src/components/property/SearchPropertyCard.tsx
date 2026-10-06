'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { ListingImage } from './ListingImage';
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
import { Heart, MessageCircle, Play, ArrowUpRight, MapPin } from 'lucide-react';
import VerifiedPropertyBadge from './VerifiedPropertyBadge';
import { locationLine } from '@/lib/location/format';

interface SearchPropertyCardProps {
  property: PropertyCardType;
  className?: string;
  showFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: boolean;
  /** Load the photo immediately (first cards in view). */
  priority?: boolean;
}

const SearchPropertyCard: React.FC<SearchPropertyCardProps> = memo(
  ({
    property,
    className,
    showFavorite = true,
    onFavoriteToggle,
    isFavorited = false,
    priority = false,
  }) => {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [isInitializingChat, setIsInitializingChat] = useState(false);
    const { isAuthenticated } = useAuth();
    const { requireAuth } = useAuthPrompt();
    const { initializeChat } = useChat();

    const propertyLink = `/property/${property.propertyId}`;
    const price = property.monthlyRent;
    const priceLabel = t('properties.perMonthShort');
    const bedrooms = property.bedrooms;
    const isVerified = property.verified;

    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
          requireAuth({
            action: { type: 'favorite', propertyId: property.propertyId },
          });
          return;
        }
        onFavoriteToggle?.(property.propertyId);
      },
      [isAuthenticated, onFavoriteToggle, property.propertyId, requireAuth],
    );

    const handleChatClick = useCallback(
      async (e: React.MouseEvent) => {
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
      },
      [
        isAuthenticated,
        property.propertyId,
        isInitializingChat,
        initializeChat,
        router,
        requireAuth,
      ],
    );

    const isVideoThumbnail =
      property.thumbnail &&
      (property.thumbnail.includes('/video/') ||
        property.thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i));

    const typeLabel = t(
      `properties.propertyTypes.${property.propertyType.toLowerCase()}`,
    );

    return (
      <div className={cn('group cursor-pointer', className)}>
        <Link
          href={propertyLink}
          className="block rounded-2xl bg-white dark:bg-gray-800 border border-stone-200/80 dark:border-gray-700 overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_16px_40px_-16px_rgba(17,24,39,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 motion-reduce:hover:translate-y-0"
        >
          {/* Image — 4:3 aspect, full width */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-gray-700">
            {property.thumbnail && !isVideoThumbnail ? (
              <ListingImage
                src={property.thumbnail}
                alt={property.title}
                priority={priority}
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                imageClassName="group-hover:scale-105"
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-stone-300 dark:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                }
              />
            ) : property.thumbnail && isVideoThumbnail ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-brand-50 text-brand-800 dark:bg-gray-700 dark:text-brand-200">
                <Play className="h-9 w-9" />
                <span className="text-sm font-semibold">
                  {language === 'sw' ? 'Angalia video' : 'View video'}
                </span>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-stone-300 dark:text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
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
                  aria-label={t('properties.messageAboutProperty')}
                  title={t('properties.messageAboutProperty')}
                  type="button"
                  className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {isInitializingChat ? (
                    <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-clay-500 rounded-full animate-spin" />
                  ) : (
                    <MessageCircle
                      className="w-4 h-4 text-ink-700 dark:text-gray-200"
                      strokeWidth={1.75}
                    />
                  )}
                </button>
              )}
              {showFavorite && (
                <button
                  onClick={handleFavoriteClick}
                  aria-label={
                    isFavorited
                      ? t('properties.removeFromFavorites')
                      : t('properties.addToFavorites')
                  }
                  aria-pressed={isFavorited}
                  title={
                    isFavorited
                      ? t('properties.removeFromFavorites')
                      : t('properties.addToFavorites')
                  }
                  type="button"
                  className="w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isFavorited
                        ? 'text-brand-600 fill-brand-600'
                        : 'text-ink-700 dark:text-gray-200',
                    )}
                    strokeWidth={isFavorited ? 0 : 2}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            <div className="mb-3 flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight tabular-nums text-ink-900 dark:text-white">
                {formatCurrency(price, property.currency)}
              </span>
              <span className="text-xs text-ink-500 dark:text-gray-400">
                {priceLabel}
              </span>
            </div>
            <h3 className="line-clamp-1 text-sm font-semibold leading-6 text-ink-900 dark:text-white">
              {property.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500 dark:text-gray-400">
              <MapPin size={13} aria-hidden="true" />
              <span className="truncate">{locationLine(property)}</span>
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 dark:border-gray-700">
              <p className="text-xs text-ink-500 dark:text-gray-400">
                {typeLabel}
                {bedrooms && bedrooms > 0
                  ? ` · ${bedrooms} ${t(bedrooms === 1 ? 'properties.bed' : 'properties.beds')}`
                  : ''}
              </p>
              <ArrowUpRight
                size={17}
                className="text-brand-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-brand-300"
                aria-hidden="true"
              />
            </div>
          </div>
        </Link>
      </div>
    );
  },
);

SearchPropertyCard.displayName = 'SearchPropertyCard';
export default SearchPropertyCard;
