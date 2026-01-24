'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Property } from '@/API';
import { publishProperty, updateProperty } from '@/graphql/mutations';
import { cachedGraphQL } from '@/lib/cache';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import LazyConfirmationModal from '@/components/ui/LazyConfirmationModal';
import { Modal } from '@/components/ui/Modal';
import { NotificationModal } from '@/components/ui/NotificationModal';
import MediaSelector from '@/components/media/MediaSelector';
import { UpdatePropertyInput } from '@/API';

interface LandlordPropertyCardProps {
  property: Property;
  className?: string;
  onDelete?: (propertyId: string) => void;
}

const LandlordPropertyCard: React.FC<LandlordPropertyCardProps> = memo(({
  property,
  className,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string[]>(property.media?.images || []);
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  type PropertyStatus = 'ACTIVE' | 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DRAFT' | 'DELETED' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED';
  const [localStatus, setLocalStatus] = useState<PropertyStatus | undefined>(property.status as PropertyStatus | undefined);
  const isAvailable = (localStatus || property.status) === 'AVAILABLE';
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.(property.propertyId);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting property:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Store the property data in sessionStorage to use as a template
    const templateData = {
      title: `${property.title} (Copy)`,
      description: property.description,
      propertyType: property.propertyType,
      address: property.address,
      pricing: property.pricing,
      specifications: property.specifications,
      amenities: property.amenities,
      media: property.media,
    };
    
    sessionStorage.setItem('propertyTemplate', JSON.stringify(templateData));
    router.push('/landlord/properties/create?template=true');
  };

  const thumbnail = property.media?.images?.[0];

  return (
    <div className={cn('group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200', className)}>
      <Link href={`/property/${property.propertyId}`} className="block">
        <div className="flex">
          

          {/* Image Container - Fixed width on mobile, responsive */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-l-lg">
            {!imageError && thumbnail ? (
              <Image
                src={thumbnail}
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
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-tight flex-1 mr-2">
                  {property.title}
                </h3>
                <PropertyStatusBadge 
                  status={(localStatus || property.status || 'DRAFT') as PropertyStatus} 
                  size="sm"
                />
              </div>
              
              {/* Location */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                {property.address?.district || 'Unknown'}, {property.address?.region || 'Unknown'}
              </div>
              
              {/* Property details */}
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                {property.specifications?.bedrooms || 0} bed • {property.specifications?.bathrooms || 0} bath
              </div>

              
            </div>
            
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(property.pricing?.monthlyRent || 0, property.pricing?.currency || 'TZS')}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">/mo</span>
              </div>
              <div />
            </div>
          </div>
        </div>
      </Link>

      {/* Action buttons placed below the whole card (including image), aligned to leftmost edge */}
      <div className="w-full mt-2 pl-4 pr-3 sm:pr-4 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (isAvailable || isPublishing) return; setIsPublishModalOpen(true); }}
            disabled={isAvailable || isPublishing}
            className={cn(
              'px-3 py-2 text-sm font-semibold rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white transition',
              isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-500 dark:hover:bg-red-600 hover:text-white'
            )}
            type="button"
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>

          

          <Link
            href={`/landlord/properties/${property.propertyId}/edit`}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            Edit
          </Link>

          {/* View button removed - Publish now handles image upload then publishing */}

          <button
            onClick={handleDelete}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-red-500 dark:hover:bg-red-600 hover:text-white transition"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <LazyConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />

      {/* Publish modal - upload an image then update property and publish */}
      <Modal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} title="Select or upload image to publish" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">Choose an existing image from your media library or upload a new one, then attach it to this property and publish.</p>

          <MediaSelector
            selectedMedia={selectedMedia}
            onMediaChange={(urls) => setSelectedMedia(urls)}
            maxSelection={10}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsPublishModalOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={async () => {
                if (isPublishing) return;
                if (!selectedMedia || selectedMedia.length === 0) {
                  alert('Please select or upload at least one image to publish.');
                  return;
                }

                setIsPublishing(true);
                try {
                  // Merge selected media with existing property media, de-duplicating
                  const merged = Array.from(new Set([...(property.media?.images || []), ...selectedMedia]));

                  const updateInput: UpdatePropertyInput = {
                    media: {
                      images: merged,
                      videos: property.media?.videos || [],
                      floorPlan: property.media?.floorPlan || '',
                      virtualTour: property.media?.virtualTour || ''
                    }
                  };

                  await cachedGraphQL.mutate<{ updateProperty: any }>({
                    query: updateProperty,
                    variables: { propertyId: property.propertyId, input: updateInput }
                  });

                  const pub = await cachedGraphQL.mutate<{ publishProperty: { success: boolean; message?: string } }>({
                    query: publishProperty,
                    variables: { propertyId: property.propertyId }
                  });

                  if (pub.data?.publishProperty?.success) {
                    setLocalStatus('AVAILABLE');
                    setIsPublishModalOpen(false);
                    setShowPublishedModal(true);
                  } else {
                    console.error('Failed to publish property after attaching image:', pub.data?.publishProperty?.message);
                  }
                } catch (err) {
                  console.error('Error attaching image and publishing:', err);
                } finally {
                  setIsPublishing(false);
                }
              }}
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              {isPublishing ? 'Publishing...' : 'Attach & Publish'}
            </button>
          </div>
        </div>
      </Modal>
      {/* Publish success notification */}
      <NotificationModal
        isOpen={showPublishedModal}
        onClose={() => setShowPublishedModal(false)}
        title="Property published"
        message="Your property was successfully published and is now visible to renters."
        type="success"
      />
    </div>
  );
});

LandlordPropertyCard.displayName = 'LandlordPropertyCard';

export default LandlordPropertyCard;
