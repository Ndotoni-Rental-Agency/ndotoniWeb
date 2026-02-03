'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyCard as PropertyCardType } from '@/API';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import LazyAuthModal from '@/components/auth/LazyAuthModal';
import { logger } from '@/lib/utils/logger';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'chat' | 'favorite' | null>(null);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const { isAuthenticated } = useAuth();
  const { initializeChat } = useChat();

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      logger.log('User not authenticated, showing auth modal');
      setPendingAction('favorite');
      setIsAuthModalOpen(true);
      return;
    }
    
    logger.log('Toggling favorite for property:', property.propertyId);
    onFavoriteToggle?.(property.propertyId);
  }, [isAuthenticated, onFavoriteToggle, property.propertyId]);

  const handleChatClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      logger.log('User not authenticated, showing auth modal');
      setPendingAction('chat');
      setIsAuthModalOpen(true);
      return;
    }
    
    if (isInitializingChat) {
      return; // Prevent multiple clicks
    }
    
    try {
      setIsInitializingChat(true);
      logger.log('Initializing secure chat for property:', property.propertyId);
      
      // Initialize chat securely through backend
      const chatData = await initializeChat(property.propertyId);
      
      // Navigate to chat with secure URL and indicate this is a new property inquiry
      const params = new URLSearchParams({
        conversationId: chatData.conversationId,
        propertyId: property.propertyId,
        propertyTitle: chatData.propertyTitle,
        landlordName: chatData.landlordName,
        newPropertyInquiry: 'true', // Flag to indicate this is a new property inquiry
      });
      
      router.push(`/chat?${params.toString()}`);
    } catch (error) {
      logger.error('Error initializing chat:', error);
      alert('Failed to start chat. Please try again.');
    } finally {
      setIsInitializingChat(false);
    }
  }, [isAuthenticated, property.propertyId, isInitializingChat, initializeChat, router]);

  const handleAuthSuccess = useCallback(async () => {
    logger.log('Auth successful, executing pending action:', pendingAction);
    setIsAuthModalOpen(false);
    
    if (pendingAction === 'chat') {
      try {
        setIsInitializingChat(true);
        
        // Initialize chat securely through backend
        const chatData = await initializeChat(property.propertyId);
        
        // Navigate to chat with secure URL and indicate this is a new property inquiry
        const params = new URLSearchParams({
          conversationId: chatData.conversationId,
          propertyId: property.propertyId,
          propertyTitle: chatData.propertyTitle,
          landlordName: chatData.landlordName,
          newPropertyInquiry: 'true', // Flag to indicate this is a new property inquiry
        });
        
        router.push(`/chat?${params.toString()}`);
      } catch (error) {
        logger.error('Error initializing chat:', error);
        alert('Failed to start chat. Please try again.');
      } finally {
        setIsInitializingChat(false);
      }
    } else if (pendingAction === 'favorite') {
      onFavoriteToggle?.(property.propertyId);
    }
    
    setPendingAction(null);
  }, [pendingAction, property.propertyId, onFavoriteToggle, initializeChat, router]);

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      APARTMENT: 'Apartment',
      HOUSE: 'House',
      STUDIO: 'Studio',
      ROOM: 'Room',
      COMMERCIAL: 'Commercial',
      LAND: 'Land',
    };
    return labels[type as keyof typeof labels] || type;
  };

  // Check if thumbnail is a video URL
  const isVideoThumbnail = property.thumbnail && (
    property.thumbnail.includes('/video/') || 
    property.thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i)
  );

  return (
    <div className={cn('group cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 md:hover:shadow-lg transition-all duration-200', className)}>
      <Link href={`/property/${property.propertyId}`} className="block">
        <div className="flex">
          {/* Image Container - Fixed width on mobile, responsive */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-l-lg">
            {!imageError && property.thumbnail && !isVideoThumbnail ? (
              <Image
                src={property.thumbnail}
                alt={property.title}
                fill
                className={cn(
                  'object-cover transition-transform duration-300 md:group-hover:scale-105 will-change-transform',
                  isImageLoading && 'blur-sm'
                )}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsImageLoading(false);
                }}
                quality={60}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QFLQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
              />
            ) : !imageError && property.thumbnail && isVideoThumbnail ? (
              <div className="relative w-full h-full">
                <video
                  src={property.thumbnail}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    video.currentTime = 1;
                  }}
                  onError={() => {
                    setImageError(true);
                    setIsImageLoading(false);
                  }}
                />
                {/* Video indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <div className="bg-white/90 rounded-full p-1.5">
                    <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
            
            {/* Loading overlay */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
          </div>
          
          {/* Content - Takes remaining space */}
          <div className="flex-1 p-3 sm:p-4 min-h-[6rem] sm:min-h-[8rem] flex flex-col justify-between">
            <div className="flex-1">
              {/* Location */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                {property.district}, {property.region}
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white md:group-hover:text-red-600 md:dark:group-hover:text-red-400 transition-colors mb-2 line-clamp-2 leading-tight">
                {property.title}
              </h3>
              
              {/* Property details */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                {getPropertyTypeLabel(property.propertyType)}
                {property.bedrooms && property.bedrooms > 0 && (
                  <span> • {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
            
            {/* Price - Always at bottom */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(property.monthlyRent, property.currency)}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">/mo</span>
              </div>
              
              {/* Action buttons - Horizontal layout */}
              <div className="flex items-center gap-2">
                {/* Chat button */}
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 md:hover:bg-red-50 md:dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 md:hover:border-red-200 md:dark:hover:border-red-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleChatClick}
                  title="Message about this property"
                  type="button"
                  disabled={isInitializingChat}
                >
                  {isInitializingChat ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 md:hover:text-red-600 md:dark:hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </button>
                
                {/* Favorite button */}
                {showFavorite && (
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 md:hover:bg-red-50 md:dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 md:hover:border-red-200 md:dark:hover:border-red-800 transition-all flex items-center justify-center"
                    onClick={handleFavoriteClick}
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    type="button"
                  >
                    <svg 
                      className={cn(
                        'w-4 h-4 transition-colors',
                          isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400 md:hover:text-red-600 md:dark:hover:text-red-400'
                      )} 
                      fill={isFavorited ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Auth Modal */}
      <LazyAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        initialView="signin"
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
});

SearchPropertyCard.displayName = 'SearchPropertyCard';

export default SearchPropertyCard;