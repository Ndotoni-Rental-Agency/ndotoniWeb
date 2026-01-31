'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import AuthModal from '@/components/auth/AuthModal';
import { usePropertyDetail } from '@/hooks/propertyDetails/usePropertyDetail';
import { usePropertyCoordinates } from '@/hooks/propertyDetails/usePropertyCoordinates';
import { PropertyLocationSection } from '@/components/propertyDetails/PropertyLocationSection';
import { PropertyDescription } from '@/components/propertyDetails/PropertyDescription';
import ImageGallery from '@/components/propertyDetails/ImageGallery';
import DetailsSidebar from '@/components/propertyDetails/DetailsSidebar';
import VerificationInfo from '@/components/propertyDetails/VerificationInfo';
import Amenities from '@/components/propertyDetails/Amenities';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { initializeChat } = useChat();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const propertyId = params?.id as string;

  const { property, loading, error, retry, retryCount, maxRetries } =
    usePropertyDetail(propertyId);

  const coords = usePropertyCoordinates(property);

  const formatPrice = (monthlyRent: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(monthlyRent);
  };


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
      alert('Failed to start chat. Please try again.');
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
    
    if (isLeftSwipe && selectedImageIndex < images.length - 1) {
      // Swipe left - next image
      setSelectedImageIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && selectedImageIndex > 0) {
      // Swipe right - previous image
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
    if (selectedImageIndex < images.length - 1) {
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
        alert('Failed to start chat. Please try again.');
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
          <Link href="/" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mb-6 inline-flex items-center gap-2 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
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
                  {isMaxRetriesReached ? 'Unable to Load Property' : 'Error Loading Property'}
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
                        Retrying...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Try Again
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm">
                      We're having trouble loading this property. You'll be redirected to the home page shortly.
                    </p>
                    
                    <Link 
                      href="/"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Go to Home
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
      <div className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white transition-colors">Property not found</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">The property you're looking for doesn't exist.</p>
            <Link href="/" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mt-4 inline-block transition-colors">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = property.media?.images || [];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mb-6 inline-flex items-center gap-2 font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ImageGallery
              images={images}
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

          <div className="space-y-6">
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

            <Amenities amenities={(property?.amenities ?? []).filter(Boolean) as string[]} />
          </div>
        </div>
        
        <div className="mt-10 space-y-10">
        <PropertyDescription description={property?.description ?? ''} />
        <PropertyLocationSection coords={coords} />
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