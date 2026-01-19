import React, { useState, useEffect } from 'react';
import { PropertyCardSkeletonGrid } from './PropertyCardSkeleton';

interface PropertyLoadingWrapperProps {
  isLoading: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
}

/**
 * Wrapper component that smoothly transitions between skeleton loading and actual content
 * Prevents the "blink" effect by using opacity transitions
 */
export default function PropertyLoadingWrapper({ 
  isLoading, 
  skeletonCount = 8, 
  children 
}: PropertyLoadingWrapperProps) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const [contentOpacity, setContentOpacity] = useState(isLoading ? 0 : 1);

  useEffect(() => {
    if (isLoading) {
      // Show skeleton immediately when loading starts
      setShowSkeleton(true);
      setContentOpacity(0);
    } else {
      // Fade out skeleton, then fade in content
      setContentOpacity(0);
      
      // Small delay to ensure skeleton fades out first
      const fadeOutTimer = setTimeout(() => {
        setShowSkeleton(false);
        
        // Start fading in content
        requestAnimationFrame(() => {
          setContentOpacity(1);
        });
      }, 100);

      return () => clearTimeout(fadeOutTimer);
    }
  }, [isLoading]);

  return (
    <div className="relative">
      {/* Skeleton Layer */}
      {showSkeleton && (
        <div 
          className="transition-opacity duration-200"
          style={{ 
            opacity: isLoading ? 1 : 0,
            pointerEvents: isLoading ? 'auto' : 'none'
          }}
        >
          <PropertyCardSkeletonGrid count={skeletonCount} />
        </div>
      )}

      {/* Content Layer */}
      {!isLoading && (
        <div 
          className="transition-opacity duration-300"
          style={{ opacity: contentOpacity }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
