'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AuthModal from '@/components/auth/AuthModal';
import { usePropertyDetail } from '@/hooks/propertyDetails/usePropertyDetail';
import { usePropertyCoordinates } from '@/hooks/propertyDetails/usePropertyCoordinates';
import { useRelatedProperties } from '@/hooks/useRelatedProperties';
import { PropertyLocationSection } from '@/components/propertyDetails/PropertyLocationSection';
import { PropertyDescription } from '@/components/propertyDetails/PropertyDescription';
import MediaGallery from '@/components/propertyDetails/MediaGallery';
import DetailsSidebar from '@/components/propertyDetails/DetailsSidebar';
import VerificationInfo from '@/components/propertyDetails/VerificationInfo';
import Amenities from '@/components/propertyDetails/Amenities';
import PropertyFeatures from '@/components/propertyDetails/PropertyFeatures';
import PropertyPricing from '@/components/propertyDetails/PropertyPricing';
import PropertyGrid from '@/components/property/PropertyGrid';

import AvailabilityChecker from '@/components/property/AvailabilityChecker';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { initializeChat } = useChat();
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const propertyId = params?.id as string;

  const { property, setProperty, loading, error, retry, retryCount, maxRetries } =
    usePropertyDetail(propertyId);

  // Fetch related properties with lazy loading (only when section becomes visible)
  const { data: relatedData, loading: relatedLoading, ref: relatedPropertiesRef } = useRelatedProperties(propertyId, {
    lazy: true,
    rootMargin: '400px', // Start loading 400px before section is visible
  });

  console.log('🏠 Property Details Page - Related Properties State:', {
    propertyId,
    hasRelatedData: !!relatedData,
    relatedLoading,
    landlordCount: relatedData?.landlordProperties?.length || 0,
    locationCount: relatedData?.similarLocationProperties?.length || 0,
    priceCount: relatedData?.similarPriceProperties?.length || 0,
  });

  const coords = usePropertyCoordinates(property);

  const formatPrice = (monthlyRent: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(monthlyRent);
  };

  // Get images and videos from property
  const images = property?.media?.images || [];
  const videos = property?.media?.videos || [];


  const handleContactAgent = async () => {
    if (!isAuthenticated) {
      // Show auth modal instead of redirecting
      setIsAuthModalOpen(true);
      return;
    }

    if (!property) return;

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
      console.error('Error initializing chat:', error);
      alert(t('errors.generic'));
    } finally {
      setIsInitializingChat(false);
    }
  };

  const handleQuickApply = () => {
    // Temporarily disabled - out of scope
    return;
    
    // if (!isAuthenticated) {
    //   setIsAuthModalOpen(true);
    //   return;
    // }

    // if (!property) return;

    // router.push(`/property/${property.propertyId}/apply`);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const images = property?.media?.images || [];
    const videos = property?.media?.videos || [];
    const totalMedia = images.length + videos.length;
    
    if (isLeftSwipe && selectedImageIndex < totalMedia - 1) {
      // Swipe left - next media
      setSelectedImageIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && selectedImageIndex > 0) {
      // Swipe right - previous media
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const handleNextImage = () => {
    const images = property?.media?.images || [];
    const videos = property?.media?.videos || [];
    const totalMedia = images.length + videos.length;
    
    if (selectedImageIndex < totalMedia - 1) {
      setSelectedImageIndex(prev => prev + 1);
    }
  };

  const handleAuthSuccess = async () => {
    // Close modal and proceed with contact agent flow
    setIsAuthModalOpen(false);
    
    if (property) {
      try {
        setIsInitializingChat(true);
        
        const chatData = await initializeChat(property.propertyId);
        
        const params = new URLSearchParams({
          conversationId: chatData.conversationId,
          propertyId: property.propertyId,
          propertyTitle: chatData.propertyTitle,
          landlordName: chatData.landlordName,
          newPropertyInquiry: 'true', // Flag to indicate this is a new property inquiry
        });
        
        router.push(`/chat?${params.toString()}`);
      } catch (error) {
        console.error('Error initializing chat:', error);
        alert(t('errors.generic'));
      } finally {
        setIsInitializingChat(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !property) {
    const isMaxRetriesReached = retryCount >= maxRetries;
    
    return (
      <div className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 mb-6 inline-flex items-center gap-2 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('propertyDetails.backToProperties')}
          </Link>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-8 rounded-lg transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {isMaxRetriesReached ? t('propertyDetails.unableToLoadProperty') : t('propertyDetails.errorLoadingProperty')}
                </h3>
                
                <p className="text-sm mb-4">{error}</p>
                
                {!isMaxRetriesReached ? (
                  <button 
                    onClick={retry}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('propertyDetails.retrying')}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t('propertyDetails.tryAgain')}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm">
                      {t('propertyDetails.troubleLoadingProperty')}
                    </p>
                    
                    <Link 
                      href="/"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {t('propertyDetails.goToHome')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-6">
                <svg 
                  className="w-16 h-16 text-gray-400 dark:text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
              {t('propertyDetails.propertyNotFound')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors">
              {t('propertyDetails.propertyNotFoundDesc')}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('propertyDetails.goToHome')}
              </Link>
              
              <Link 
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('propertyDetails.searchProperties')}
              </Link>
            </div>

            {/* Additional info */}
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-8 transition-colors">
              This property may have been removed or is no longer available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 mb-6 inline-flex items-center gap-2 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('propertyDetails.backToProperties')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MediaGallery
              images={images}
              videos={videos}
              selectedIndex={selectedImageIndex}
              onSelect={handleImageSelect}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              title={property.title}
            />
          </div>

          <div className="flex flex-col gap-6">
            <DetailsSidebar
              property={property}
              formatPrice={formatPrice}
              region={property.address?.region ?? ''}
              district={property.address?.district ?? ''}
              ward={property.address?.ward ?? ''}
              street={property.address?.street ?? ''}
              onContactAgent={handleContactAgent}
              isInitializingChat={isInitializingChat}
            />

            <VerificationInfo verificationStatus={(property as any)?.verificationStatus} />
          </div>
        </div>
        
        <div className="mt-10 space-y-10">
          <PropertyDescription description={property?.description ?? ''} />
          
          <PropertyPricing property={property} formatPrice={formatPrice} />
          
          <PropertyFeatures property={property} />
          
          <Amenities amenities={(property?.amenities ?? []).filter(Boolean) as string[]} />
          
          <PropertyLocationSection coords={coords} />

          {/* Related Properties Sections */}
          <div ref={relatedPropertiesRef} className="space-y-10">
            {relatedData && (
              <>
                {/* Landlord's Other Properties */}
                {relatedData.landlordProperties.length > 0 && (
                  <section className="border-t border-gray-200 dark:border-gray-700 pt-10">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                        {t('propertyDetails.moreFrom')} {property.landlord?.firstName || t('propertyDetails.thisLandlord')}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                        {t('propertyDetails.otherAvailableProperties')}
                      </p>
                    </div>
                    
                    <PropertyGrid
                      properties={relatedData.landlordProperties}
                      onFavoriteToggle={() => {}}
                      isFavorited={() => false}
                    />
                  </section>
                )}

                {/* Similar Location Properties */}
                {relatedData.similarLocationProperties.length > 0 && (
                  <section className="border-t border-gray-200 dark:border-gray-700 pt-10">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                        {t('propertyDetails.similarPropertiesIn')} {property.address?.district || property.address?.region}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                        {t('propertyDetails.propertiesInSameArea')}
                      </p>
                    </div>
                    
                    <PropertyGrid
                      properties={relatedData.similarLocationProperties}
                      onFavoriteToggle={() => {}}
                      isFavorited={() => false}
                    />
                  </section>
                )}

                {/* Similar Price Properties */}
                {relatedData.similarPriceProperties.length > 0 && (
                  <section className="border-t border-gray-200 dark:border-gray-700 pt-10">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                        Similar price in {property.address?.district || property.address?.region}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                        Properties with similar pricing in the same area
                      </p>
                    </div>
                    
                    <PropertyGrid
                      properties={relatedData.similarPriceProperties}
                      onFavoriteToggle={() => {}}
                      isFavorited={() => false}
                    />
                  </section>
                )}
              </>
            )}

            {/* Loading state for related properties */}
            {relatedLoading && (
                <section className="border-t border-gray-200 dark:border-gray-700 pt-10">
                  <div className="mb-6">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:border-gray-700 rounded w-1/2 mt-2 animate-pulse"></div>
                  </div>
                  <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-64 flex-shrink-0">
                        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="mt-2 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
          </div>
        </div>

       
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode="signin"
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}