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

  const { property, loading, error, retry } =
    usePropertyDetail(propertyId);

  const coords = usePropertyCoordinates(property);

  if (loading) return <div className="p-8">Loading…</div>;
  if (error)
    return (
      <div className="p-8">
        {error}
        <button onClick={retry}>Retry</button>
      </div>
    );
  if (!property) return null;

  const formatPrice = (monthlyRent: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(monthlyRent);
  };

  const getLocationString = () => {
    if (!property?.address) return '';
    const parts = [property.address.street, property.address.ward, property.address.district, property.address.region].filter(Boolean);
    return parts.join(', ');
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
      
      // Navigate to chat with secure URL
      const params = new URLSearchParams({
        conversationId: chatData.conversationId,
        propertyId: property.propertyId,
        propertyTitle: chatData.propertyTitle,
        landlordName: chatData.landlordName,
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
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!property) return;

    router.push(`/property/${property.propertyId}/apply`);
  };

  const handleRetryFetch = () => {
    if (params.id) {
      retry();
    }
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
    return (
      <div className="py-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 mb-6 inline-flex items-center gap-2 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </Link>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg transition-colors">
            <h3 className="font-medium">Error loading property</h3>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={handleRetryFetch}
              className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
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
              onQuickApply={handleQuickApply}
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