'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { cachedGraphQL, getProperty } from '@/lib/graphql';
import { Property } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';
import FloatingChatButton from '@/components/chat/FloatingChatButton';

export default function PropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      console.log('Property detail page loaded for ID:', params.id);
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching property with ID:', propertyId);
      
      const response = await cachedGraphQL.query({
        query: getProperty,
        variables: { propertyId }
      });
      
      const propertyData = response.data?.getProperty;
      
      if (propertyData) {
        console.log('Property data received:', propertyData);
        setProperty(propertyData);
      } else {
        console.log('No property data found for ID:', propertyId);
        setError('Property not found');
      }
    } catch (err) {
      console.error('GraphQL error fetching property:', err);
      setError('Failed to load property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleContactAgent = () => {
    if (!isAuthenticated) {
      // Show auth modal instead of redirecting
      setIsAuthModalOpen(true);
      return;
    }

    if (!property) return;

    // Create URL with property context for chat
    const chatUrl = `/chat?propertyId=${property.propertyId}&landlordId=${property.landlordId}&propertyTitle=${encodeURIComponent(property.title)}`;
    router.push(chatUrl);
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
      fetchProperty(params.id as string);
    }
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    // Close modal and proceed with contact agent flow
    setIsAuthModalOpen(false);
    
    if (property) {
      const chatUrl = `/chat?propertyId=${property.propertyId}&landlordId=${property.landlordId}&propertyTitle=${encodeURIComponent(property.title)}`;
      router.push(chatUrl);
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
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
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
          {/* Images Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-colors">
              {images.length > 0 ? (
                <>
                  <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={images[selectedImageIndex] || images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                      quality={95}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  
                  {images.length > 1 && (
                    <div className="p-4">
                      <div className="grid grid-cols-5 gap-2">
                        {images.slice(0, 5).map((image, index) => (
                          <button
                            key={index}
                            onClick={() => handleImageSelect(index)}
                            className={`aspect-square relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 transition-all ${
                              selectedImageIndex === index ? 'ring-2 ring-red-500' : 'hover:ring-1 hover:ring-gray-300'
                            }`}
                          >
                            <Image
                              src={image}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover transition-transform hover:scale-105"
                              quality={85}
                              sizes="(max-width: 768px) 20vw, 120px"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors">
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{property.title}</h1>
                
                {/* Verification Badge - Only show in property details */}
                {(property as any).verificationStatus === 'VERIFIED' && (
                  <div className="flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm font-medium transition-colors">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Property
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {getLocationString()}
              </div>

              {property.pricing && (
                <div className="mb-6">
                  <div className="text-3xl font-bold text-red-600">
                    {formatPrice(property.pricing.monthlyRent, property.pricing.currency)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 transition-colors">per month</div>
                  {property.pricing.deposit && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                      Deposit: {formatPrice(property.pricing.deposit, property.pricing.currency)}
                    </div>
                  )}
                </div>
              )}

              {/* Property Specs */}
              {property.specifications && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                  {property.specifications.bedrooms && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{property.specifications.bedrooms}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Bedrooms</div>
                    </div>
                  )}
                  {property.specifications.bathrooms && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{property.specifications.bathrooms}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Bathrooms</div>
                    </div>
                  )}
                  {property.specifications.squareMeters && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{property.specifications.squareMeters}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">m² Area</div>
                    </div>
                  )}
                  {property.specifications.parkingSpaces && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{property.specifications.parkingSpaces}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Parking</div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <button 
                  onClick={handleQuickApply}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-full font-medium transition-colors"
                >
                  Quick Apply
                </button>
                <button 
                  onClick={handleContactAgent}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-full font-medium transition-colors"
                >
                  Contact Agent
                </button>
              </div>
            </div>

            {/* Verification Info */}
            {(property as any).verificationStatus && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Property Verification</h3>
                <div className="space-y-3">
                  {(property as any).verificationStatus === 'VERIFIED' ? (
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-green-800 dark:text-green-400 transition-colors">Verified Property</div>
                        <div className="text-sm text-green-700 dark:text-green-300 transition-colors">This property has been verified by our team and the landlord's identity has been confirmed.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-yellow-800 dark:text-yellow-400 transition-colors">Unverified Property</div>
                        <div className="text-sm text-yellow-700 dark:text-yellow-300 transition-colors">This property is pending verification. Please exercise caution and verify details independently.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Property Features */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                      <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {property.description && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors">{property.description}</p>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        initialMode="signin"
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Floating Chat Button - Mobile friendly */}
      <FloatingChatButton
        propertyId={property?.propertyId}
        landlordId={property?.landlordId}
        propertyTitle={property?.title}
      />
    </div>
  );
}