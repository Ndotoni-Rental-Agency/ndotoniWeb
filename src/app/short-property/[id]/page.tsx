'use client';

import { useState, Suspense, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShortTermProperty } from '@/API';
import AuthModal from '@/components/auth/AuthModal';
import { useShortTermPropertyDetail } from '@/hooks/propertyDetails/useShortTermPropertyDetail';
import { usePropertyCoordinates } from '@/hooks/propertyDetails/usePropertyCoordinates';
import { PropertyLocationSection } from '@/components/propertyDetails/PropertyLocationSection';
import { PropertyDescription } from '@/components/propertyDetails/PropertyDescription';
import MediaGallery from '@/components/propertyDetails/MediaGallery';
import ShortTermDetailsSidebar from '@/components/propertyDetails/ShortTermDetailsSidebar';
import Amenities from '@/components/propertyDetails/Amenities';
import { ShortTermPropertyPricing } from '@/components/propertyDetails/ShortTermPropertyPricing';
import { ShortTermPropertyFeatures } from '@/components/propertyDetails/ShortTermPropertyFeatures';
import HierarchicalLocationSelector from '@/components/location/HierarchicalLocationSelector';
import LocationMapPicker from '@/components/location/LocationMapPicker';
import MediaSelector from '@/components/media/MediaSelector';
import {
  EditableSection,
  EditableTextField,
  EditableNumberField,
  SaveButton,
} from '@/components/propertyDetails/EditableSection';
import { updateShortTermProperty } from '@/graphql/mutations';
import { GraphQLClient } from '@/lib/graphql-client';
import { cn } from '@/lib/utils/common';

// Force dynamic rendering for pages using useSearchParams
export const dynamic = 'force-dynamic';

function ShortTermPropertyDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { initializeChat } = useChat();
  const { t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showMobileBooking, setShowMobileBooking] = useState(false);

  // Edit mode
  const isEditMode = searchParams?.get('edit') === 'true';

  // Editable fields state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editNightlyRate, setEditNightlyRate] = useState(0);
  const [editCleaningFee, setEditCleaningFee] = useState(0);
  const [editMaxGuests, setEditMaxGuests] = useState(1);
  const [editMinimumStay, setEditMinimumStay] = useState(1);
  const [editMaximumStay, setEditMaximumStay] = useState(0);
  const [editAmenities, setEditAmenities] = useState<string[]>([]);
  const [editHouseRules, setEditHouseRules] = useState<string[]>([]);
  const [editCheckInTime, setEditCheckInTime] = useState('');
  const [editCheckOutTime, setEditCheckOutTime] = useState('');
  const [editCancellationPolicy, setEditCancellationPolicy] = useState('');
  const [editAllowsPets, setEditAllowsPets] = useState(false);
  const [editAllowsChildren, setEditAllowsChildren] = useState(false);
  const [editAllowsInfants, setEditAllowsInfants] = useState(false);
  const [editAllowsSmoking, setEditAllowsSmoking] = useState(false);
  const [editRegion, setEditRegion] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editCoordinates, setEditCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const propertyId = params?.id as string;

  const { property, setProperty, loading, error, retry, retryCount, maxRetries } =
    useShortTermPropertyDetail(propertyId);

  const coords = usePropertyCoordinates(property);

  // Initialize edit state when property loads or edit mode changes
  useEffect(() => {
    if (property && isEditMode) {
      setEditTitle(property.title || '');
      setEditDescription(property.description || '');
      setEditNightlyRate(property.nightlyRate || 0);
      setEditCleaningFee(property.cleaningFee || 0);
      setEditMaxGuests(property.maxGuests || 1);
      setEditMinimumStay(property.minimumStay || 1);
      setEditMaximumStay(property.maximumStay || 0);
      setEditAmenities(property.amenities || []);
      setEditHouseRules(property.houseRules || []);
      setEditCheckInTime(property.checkInTime || '');
      setEditCheckOutTime(property.checkOutTime || '');
      setEditCancellationPolicy(property.cancellationPolicy || '');
      setEditAllowsPets(property.allowsPets || false);
      setEditAllowsChildren(property.allowsChildren || false);
      setEditAllowsInfants(property.allowsInfants || false);
      setEditAllowsSmoking(property.allowsSmoking || false);
      setEditRegion(property.region || '');
      setEditDistrict(property.district || '');
      setEditImages(property.images || []);
      setEditCoordinates(property.coordinates || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property?.propertyId, isEditMode]);

  // Save handlers for each section
  const handleSaveTitleDescription = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          title: editTitle,
          description: editDescription,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSavePricing = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          nightlyRate: editNightlyRate,
          cleaningFee: editCleaningFee,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSavePropertyDetails = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          maxGuests: editMaxGuests,
          minimumStay: editMinimumStay,
          maximumStay: editMaximumStay > 0 ? editMaximumStay : undefined,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveAmenities = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          amenities: editAmenities,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveHouseRules = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          houseRules: editHouseRules,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveCheckInOut = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          checkInTime: editCheckInTime,
          checkOutTime: editCheckOutTime,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveCancellationPolicy = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          cancellationPolicy: editCancellationPolicy as any,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveGuestPolicies = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          allowsPets: editAllowsPets,
          allowsChildren: editAllowsChildren,
          allowsInfants: editAllowsInfants,
          allowsSmoking: editAllowsSmoking,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveLocation = async () => {
    if (!property) return;
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          region: editRegion,
          district: editDistrict,
          coordinates: editCoordinates ? {
            latitude: editCoordinates.latitude,
            longitude: editCoordinates.longitude,
          } : undefined,
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const handleSaveImages = async () => {
    if (!property) return;
    
    if (editImages.length === 0) {
      alert('Please select at least one image');
      return;
    }
    
    const response = await GraphQLClient.executeAuthenticated<{
      updateShortTermProperty: ShortTermProperty;
    }>(
      updateShortTermProperty,
      {
        propertyId: property.propertyId,
        input: {
          images: editImages,
          thumbnail: editImages[0], // First image becomes thumbnail
        },
      }
    );
    
    // Update local property with response
    if (response.updateShortTermProperty) {
      setProperty(response.updateShortTermProperty);
    }
  };

  const formatPrice = (amount: number, currency: string = 'TZS') => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get images and videos (images are now just URL strings)
  const images = property?.images || [];
  const videos: string[] = []; // Short-term properties don't support videos yet

  const handleContactAgent = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!property) return;

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
      console.error('Error initializing chat:', error);
      alert(t('errors.generic'));
    } finally {
      setIsInitializingChat(false);
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
    
    const totalMedia = images.length + videos.length;
    
    if (isLeftSwipe && selectedImageIndex < totalMedia - 1) {
      setSelectedImageIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const handleNextImage = () => {
    const totalMedia = images.length + videos.length;
    
    if (selectedImageIndex < totalMedia - 1) {
      setSelectedImageIndex(prev => prev + 1);
    }
  };

  const handleAuthSuccess = async () => {
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
          newPropertyInquiry: 'true',
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
                      We're having trouble loading this property. Please try again later.
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
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
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

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">
              Property Not Found
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors">
              This short-term property may have been removed or is no longer available.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Home
              </Link>
              
              <Link 
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors",
      isEditMode ? "pb-0" : "pb-20 lg:pb-0"
    )}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">
            Home
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/search-short-stay" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors">
            Short-Term Stays
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600 dark:text-gray-400">{property.title}</span>
        </nav>

        {/* Title and Badge */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Short-Term Stay
              </span>
            </div>
            
            {/* Edit/Done button - shown when in edit mode or when user navigates with ?edit=true */}
            {isEditMode && (
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(window.location.search);
                  newParams.delete('edit');
                  router.push(`?${newParams.toString()}`);
                }}
                className="px-4 py-2 rounded-lg border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Done Editing
              </button>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {property.title}
          </h1>
          <div className="flex items-center gap-4 text-sm">
            {property.averageRating && property.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {property.averageRating.toFixed(1)}
                </span>
                {property.ratingSummary?.totalReviews && (
                  <span className="text-gray-500 dark:text-gray-400">
                    ({property.ratingSummary.totalReviews} {property.ratingSummary.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {property.district}, {property.region}
            </div>
          </div>
        </div>

        {/* Main Content Grid - Sidebar only for top sections */}
        <div className={cn(
          "grid grid-cols-1 gap-8",
          isEditMode ? "lg:grid-cols-1" : "lg:grid-cols-3"
        )}>
          {/* Left Column - Images and Description */}
          <div className={cn(
            "space-y-8",
            isEditMode ? "lg:col-span-1" : "lg:col-span-2"
          )}>
            {/* Image Gallery */}
            <EditableSection
              title="Property Images"
              isEditMode={isEditMode}
              onSave={handleSaveImages}
              editContent={
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Select images for your property. The first image will be used as the thumbnail.
                  </div>
                  <MediaSelector
                    selectedMedia={editImages}
                    onMediaChange={setEditImages}
                    maxSelection={20}
                  />
                  {editImages.length > 0 && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                        {editImages.length} image{editImages.length !== 1 ? 's' : ''} selected
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                        First image will be the thumbnail
                      </div>
                    </div>
                  )}
                </div>
              }
            >
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
            </EditableSection>

            {/* Description */}
            {(property.description || isEditMode) && (
              <EditableSection
                title="About this place"
                isEditMode={isEditMode}
                onSave={handleSaveTitleDescription}
                editContent={
                  <div className="space-y-4">
                    <EditableTextField
                      label="Title"
                      value={editTitle}
                      onChange={setEditTitle}
                      placeholder="Enter property title"
                    />
                    <EditableTextField
                      label="Description"
                      value={editDescription}
                      onChange={setEditDescription}
                      multiline
                      rows={6}
                      placeholder="Describe your property..."
                    />
                  </div>
                }
              >
                <PropertyDescription description={property.description || undefined} />
              </EditableSection>
            )}
          </div>

          {/* Right Column - Booking Sidebar (Desktop only, sticky, hidden in edit mode) */}
          {!isEditMode && (
            <div className="hidden lg:block lg:col-span-1">
              <ShortTermDetailsSidebar
                property={property}
                formatPrice={formatPrice}
                onContactHost={handleContactAgent}
                isInitializingChat={isInitializingChat}
              />
            </div>
          )}
        </div>

        {/* Full Width Sections Below */}
        <div className="mt-8 space-y-8">
          {/* Features */}
          <EditableSection
            title="What this place offers"
            isEditMode={isEditMode}
            onSave={handleSavePropertyDetails}
            editContent={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableNumberField
                  label="Maximum Guests"
                  value={editMaxGuests}
                  onChange={setEditMaxGuests}
                  min={1}
                />
                <EditableNumberField
                  label="Minimum Stay (nights)"
                  value={editMinimumStay}
                  onChange={setEditMinimumStay}
                  min={1}
                />
                <EditableNumberField
                  label="Maximum Stay (nights, 0 = no limit)"
                  value={editMaximumStay}
                  onChange={setEditMaximumStay}
                  min={0}
                />
              </div>
            }
          >
            <ShortTermPropertyFeatures property={property} />
          </EditableSection>

          {/* Amenities */}
          {(property.amenities && property.amenities.length > 0) || isEditMode ? (
            <EditableSection
              title="Amenities"
              isEditMode={isEditMode}
              onSave={handleSaveAmenities}
              editContent={
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Select amenities available at your property:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'WiFi',
                      'Kitchen',
                      'Washer',
                      'Dryer',
                      'Air conditioning',
                      'Heating',
                      'TV',
                      'Hot water',
                      'Iron',
                      'Hair dryer',
                      'Workspace',
                      'Pool',
                      'Gym',
                      'Free parking',
                      'Paid parking',
                      'EV charger',
                      'Crib',
                      'BBQ grill',
                      'Outdoor furniture',
                      'Backyard',
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className={cn(
                          "flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-colors",
                          editAmenities.includes(amenity)
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={editAmenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditAmenities([...editAmenities, amenity]);
                            } else {
                              setEditAmenities(editAmenities.filter((a) => a !== amenity));
                            }
                          }}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-900 dark:text-white">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add custom amenity
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="custom-amenity"
                        placeholder="Enter amenity name"
                        className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            const value = input.value.trim();
                            if (value && !editAmenities.includes(value)) {
                              setEditAmenities([...editAmenities, value]);
                              input.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById('custom-amenity') as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !editAmenities.includes(value)) {
                            setEditAmenities([...editAmenities, value]);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {editAmenities.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected amenities:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editAmenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm"
                          >
                            {amenity}
                            <button
                              onClick={() => setEditAmenities(editAmenities.filter((a) => a !== amenity))}
                              className="hover:text-emerald-900 dark:hover:text-emerald-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              }
            >
              <Amenities amenities={(property.amenities ?? []).filter(Boolean) as string[]} />
            </EditableSection>
          ) : null}

          {/* Pricing Details */}
          <EditableSection
            title="Pricing & Policies"
            isEditMode={isEditMode}
            onSave={handleSavePricing}
            editContent={
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableNumberField
                    label="Nightly Rate"
                    value={editNightlyRate}
                    onChange={setEditNightlyRate}
                    min={0}
                  />
                  <EditableNumberField
                    label="Cleaning Fee"
                    value={editCleaningFee}
                    onChange={setEditCleaningFee}
                    min={0}
                  />
                </div>
                
                {/* Check-in/Check-out Times */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Check-in & Check-out
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-in Time
                      </label>
                      <input
                        type="time"
                        value={editCheckInTime}
                        onChange={(e) => setEditCheckInTime(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-out Time
                      </label>
                      <input
                        type="time"
                        value={editCheckOutTime}
                        onChange={(e) => setEditCheckOutTime(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Cancellation Policy
                  </h3>
                  <select
                    value={editCancellationPolicy}
                    onChange={(e) => setEditCancellationPolicy(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  >
                    <option value="FLEXIBLE">Flexible - Full refund 24 hours before check-in</option>
                    <option value="MODERATE">Moderate - Full refund 5 days before check-in</option>
                    <option value="STRICT">Strict - 50% refund up to 7 days before check-in</option>
                    <option value="SUPER_STRICT">Super Strict - 50% refund up to 30 days before check-in</option>
                  </select>
                </div>

                {/* Guest Policies */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Guest Policies
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Pets allowed', value: editAllowsPets, setter: setEditAllowsPets },
                      { label: 'Children allowed', value: editAllowsChildren, setter: setEditAllowsChildren },
                      { label: 'Infants allowed', value: editAllowsInfants, setter: setEditAllowsInfants },
                      { label: 'Smoking allowed', value: editAllowsSmoking, setter: setEditAllowsSmoking },
                    ].map((policy) => (
                      <label
                        key={policy.label}
                        className={cn(
                          "flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors",
                          policy.value
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={policy.value}
                          onChange={(e) => policy.setter(e.target.checked)}
                          className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="text-gray-900 dark:text-white">{policy.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* House Rules */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    House Rules
                  </h3>
                  <div className="space-y-3">
                    {editHouseRules.map((rule, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={rule}
                          onChange={(e) => {
                            const newRules = [...editHouseRules];
                            newRules[index] = e.target.value;
                            setEditHouseRules(newRules);
                          }}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => setEditHouseRules(editHouseRules.filter((_, i) => i !== index))}
                          className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setEditHouseRules([...editHouseRules, ''])}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add House Rule
                    </button>
                  </div>
                </div>
              </div>
            }
          >
            <ShortTermPropertyPricing property={property} formatPrice={formatPrice} />
          </EditableSection>

          {/* Location */}
          <EditableSection
            title="Where you'll be"
            isEditMode={isEditMode}
            onSave={handleSaveLocation}
            editContent={
              <div className="space-y-6">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Select the location of your property:
                </div>
                
                {/* Current Location Display */}
                {editRegion && editDistrict && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                      Current Location:
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">
                      {editDistrict}, {editRegion}
                    </div>
                    {editCoordinates && (
                      <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                        Coordinates: {editCoordinates.latitude.toFixed(6)}, {editCoordinates.longitude.toFixed(6)}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Location Selector */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Change Location
                  </h3>
                  <HierarchicalLocationSelector
                    onLocationChange={(location) => {
                      if (location.regionName) setEditRegion(location.regionName);
                      if (location.districtName) setEditDistrict(location.districtName);
                    }}
                  />
                </div>
                
                {/* Map Picker - Only show if region and district are selected */}
                {editRegion && editDistrict && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Set Exact Location
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Drag the pin to mark the exact location of your property on the map.
                    </div>
                    <LocationMapPicker
                      location={{
                        region: editRegion,
                        district: editDistrict,
                      }}
                      onChange={(coords) => {
                        setEditCoordinates({
                          latitude: coords.lat,
                          longitude: coords.lng,
                        });
                      }}
                    />
                  </div>
                )}
                
                {/* Save Reminder */}
                {editRegion && editDistrict && editCoordinates && (
                  <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          Location Ready
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">
                          Click "Save Changes" below to update your property location.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            }
          >
            <PropertyLocationSection coords={coords} />
          </EditableSection>
        </div>
      </main>

      {/* Mobile Sticky Bottom Bar - Only on mobile, hidden in edit mode */}
      {!isEditMode && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {formatPrice(property.nightlyRate, property.currency)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">/ night</span>
            </div>
            {property.averageRating && property.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {property.averageRating.toFixed(1)}
                </span>
                {property.ratingSummary?.totalReviews && (
                  <span className="text-gray-500 dark:text-gray-400">
                    ({property.ratingSummary.totalReviews})
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowMobileBooking(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition whitespace-nowrap"
          >
            Check availability
          </button>
        </div>
      </div>
      )}

      {/* Mobile Booking Modal - hidden in edit mode */}
      {!isEditMode && showMobileBooking && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-[9999] flex items-end">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl max-h-[90vh] overflow-y-auto relative z-[10000]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Book your stay
              </h2>
              <button
                onClick={() => setShowMobileBooking(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Booking Form */}
            <div className="p-4">
              <ShortTermDetailsSidebar
                property={property}
                formatPrice={formatPrice}
                onContactHost={handleContactAgent}
                isInitializingChat={isInitializingChat}
              />
            </div>
          </div>
        </div>
      )}

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


export default function ShortTermPropertyDetail() {
  return (
    <Suspense fallback={
      <div className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading property...</p>
          </div>
        </div>
      </div>
    }>
      <ShortTermPropertyDetailContent />
    </Suspense>
  );
}
