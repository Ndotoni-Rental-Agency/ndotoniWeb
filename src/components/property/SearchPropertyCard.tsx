'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard as PropertyCardType, PropertyUser } from '@/API';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import { createChatUrl } from '@/lib/utils/chat';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import { logger } from '@/lib/utils/logger';
import { cachedGraphQL } from '@/lib/cache';
import { getProperty } from '@/graphql/queries';

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
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'chat' | 'favorite' | null>(null);
  const [isFetchingProperty, setIsFetchingProperty] = useState(false);
  const { isAuthenticated } = useAuth();

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
    
    if (isFetchingProperty) {
      return; // Prevent multiple clicks
    }
    
    try {
      setIsFetchingProperty(true);
      logger.log('Fetching property details to get landlord info');
      
      // Fetch full property details to get landlord info
      const response = await cachedGraphQL.query({
        query: getProperty,
        variables: { propertyId: property.propertyId }
      });
      
      const fullProperty = response.data?.getProperty;
      
      if (fullProperty) {
        // Use landlord info from full property, or fallback
        const landlordInfo: PropertyUser = fullProperty.landlord || {
          __typename: 'PropertyUser',
          firstName: 'Landlord',
          lastName: '',
        };
        
        const chatUrl = createChatUrl(
          property.propertyId, 
          fullProperty.landlordId, 
          property.title,
          landlordInfo
        );
        
        logger.log('Navigating to chat with landlord info');
        window.location.href = chatUrl;
      } else {
        logger.error('Failed to fetch property details');
        // Fallback: navigate without landlord info
        const chatUrl = createChatUrl(
          property.propertyId, 
          '', 
          property.title,
          {
            __typename: 'PropertyUser',
            firstName: 'Landlord',
            lastName: '',
          }
        );
        window.location.href = chatUrl;
      }
    } catch (error) {
      logger.error('Error fetching property details:', error);
      // Fallback: navigate without landlord info
      const chatUrl = createChatUrl(
        property.propertyId, 
        '', 
        property.title,
        {
          __typename: 'PropertyUser',
          firstName: 'Landlord',
          lastName: '',
        }
      );
      window.location.href = chatUrl;
    } finally {
      setIsFetchingProperty(false);
    }
  }, [isAuthenticated, property.propertyId, property.title, isFetchingProperty]);

  const handleAuthSuccess = useCallback(async () => {
    logger.log('Auth successful, executing pending action:', pendingAction);
    setIsAuthModalOpen(false);
    
    if (pendingAction === 'chat') {
      try {
        setIsFetchingProperty(true);
        
        // Fetch full property details to get landlord info
        const response = await cachedGraphQL.query({
          query: getProperty,
          variables: { propertyId: property.propertyId }
        });
        
        const fullProperty = response.data?.getProperty;
        
        if (fullProperty) {
          const landlordInfo: PropertyUser = fullProperty.landlord || {
            __typename: 'PropertyUser',
            firstName: 'Landlord',
            lastName: '',
          };
          
          const chatUrl = createChatUrl(
            property.propertyId, 
            fullProperty.landlordId, 
            property.title,
            landlordInfo
          );
          window.location.href = chatUrl;
        } else {
          // Fallback
          const chatUrl = createChatUrl(
            property.propertyId, 
            '', 
            property.title,
            {
              __typename: 'PropertyUser',
              firstName: 'Landlord',
              lastName: '',
            }
          );
          window.location.href = chatUrl;
        }
      } catch (error) {
        logger.error('Error fetching property details:', error);
        // Fallback
        const chatUrl = createChatUrl(
          property.propertyId, 
          '', 
          property.title,
          {
            __typename: 'PropertyUser',
            firstName: 'Landlord',
            lastName: '',
          }
        );
        window.location.href = chatUrl;
      } finally {
        setIsFetchingProperty(false);
      }
    } else if (pendingAction === 'favorite') {
      onFavoriteToggle?.(property.propertyId);
    }
    
    setPendingAction(null);
  }, [pendingAction, property.propertyId, property.title, onFavoriteToggle]);

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

  return (
    <div className={cn('group cursor-pointer bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200', className)}>
      <Link href={`/property/${property.propertyId}`} className="block">
        <div className="flex">
          {/* Image Container - Fixed width on mobile, responsive */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-l-lg">
            {!imageError && property.thumbnail ? (
              <Image
                src={property.thumbnail}
                alt={property.title}
                fill
                className={cn(
                  'object-cover transition-all duration-300 group-hover:scale-105',
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
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
              />
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
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-2 line-clamp-2 leading-tight">
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
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleChatClick}
                  title="Message about this property"
                  type="button"
                  disabled={isFetchingProperty}
                >
                  {isFetchingProperty ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </button>
                
                {/* Favorite button */}
                {showFavorite && (
                  <button
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center"
                    onClick={handleFavoriteClick}
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    type="button"
                  >
                    <svg 
                      className={cn(
                        'w-4 h-4 transition-colors',
                        isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        initialMode="signin"
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
});

SearchPropertyCard.displayName = 'SearchPropertyCard';

export default SearchPropertyCard;