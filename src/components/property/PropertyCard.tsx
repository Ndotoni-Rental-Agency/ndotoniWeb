'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PropertyCard as PropertyCardType } from '@/API';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import { createChatUrl } from '@/lib/utils/chat';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

interface PropertyCardProps {
  property: PropertyCardType;
  className?: string;
  showFavorite?: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  isFavorited?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
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
  const { isAuthenticated } = useAuth();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    console.log('Favorite button clicked!'); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      console.log('User not authenticated, showing auth modal');
      setPendingAction('favorite');
      setIsAuthModalOpen(true);
      return;
    }
    
    console.log('Toggling favorite for property:', property.propertyId);
    onFavoriteToggle?.(property.propertyId);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    console.log('Chat button clicked!'); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      console.log('User not authenticated, showing auth modal');
      setPendingAction('chat');
      setIsAuthModalOpen(true);
      return;
    }
    
    console.log('Navigating to chat to start new conversation for property');
    // Use the utility function to create the chat URL
    // PropertyCard doesn't have landlordId, so it will be resolved from the property
    const chatUrl = createChatUrl(property.propertyId, undefined, property.title);
    window.location.href = chatUrl;
  };

  const handleAuthSuccess = () => {
    console.log('Auth successful, executing pending action:', pendingAction);
    setIsAuthModalOpen(false);
    
    if (pendingAction === 'chat') {
      // Navigate to chat to start new conversation for this property
      const chatUrl = createChatUrl(property.propertyId, undefined, property.title);
      window.location.href = chatUrl;
    } else if (pendingAction === 'favorite') {
      // Execute favorite toggle
      onFavoriteToggle?.(property.propertyId);
    }
    
    setPendingAction(null);
  };

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
    <div className={cn('group cursor-pointer h-full flex flex-col relative', className)}>
      {/* Clickable area for navigation */}
      <Link href={`/property/${property.propertyId}`} className="block flex-1">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-xl transition-colors">
          {!imageError && property.thumbnail ? (
            <Image
              src={property.thumbnail}
              alt={property.title}
              fill
              className={cn(
                'object-cover transition-all duration-300 md:group-hover:scale-105',
                isImageLoading && 'blur-sm'
              )}
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setImageError(true);
                setIsImageLoading(false);
              }}
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          
          {/* Loading overlay */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse transition-colors" />
          )}
        </div>
        
        {/* Content */}
        <div className="pt-3 flex flex-col flex-1">
          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2 transition-colors">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">
              {property.district}, {property.region}
            </span>
          </div>
          
          {/* Title - Fixed height with line clamp */}
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3 min-h-[3rem] flex items-start">
            {property.title}
          </h3>
          
          {/* Property details - Fixed height */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3 min-h-[1.5rem] transition-colors">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {getPropertyTypeLabel(property.propertyType)}
            </span>
            
            {property.bedrooms && property.bedrooms > 0 && (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                </svg>
                {property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          {/* Price */}
          <div className="mt-auto">
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
                {formatCurrency(property.monthlyRent, property.currency)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 transition-colors">/month</span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Action Icons - Overlaid on image, outside Link to prevent navigation conflicts */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-20 pointer-events-auto">
        {/* Chat Icon - Always show, but handle auth in click handler */}
        <button
          className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-lg flex items-center justify-center cursor-pointer"
          onClick={handleChatClick}
          title="Message about this property"
          type="button"
        >
          <svg className="w-4 h-4 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
        
        {/* Favorite Icon - Always show if enabled */}
        {showFavorite && (
          <button
            className="w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-900 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-lg flex items-center justify-center cursor-pointer"
            onClick={handleFavoriteClick}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            type="button"
          >
            <svg 
              className={cn(
                'w-4 h-4 transition-colors',
                isFavorited ? 'text-red-500 fill-current' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
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
};

export default PropertyCard;