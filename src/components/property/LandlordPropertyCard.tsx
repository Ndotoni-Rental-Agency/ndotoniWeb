'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Property, UpdatePropertyInput } from '@/API';
import { publishProperty, updateProperty } from '@/graphql/mutations';
import { cachedGraphQL } from '@/lib/cache';
import { formatCurrency, cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import LazyConfirmationModal from '@/components/ui/LazyConfirmationModal';
import { Modal } from '@/components/ui/Modal';
import { NotificationModal } from '@/components/ui/NotificationModal';
import MediaSelector from '@/components/media/MediaSelector';
import MediaReorderModal from './MediaReorderModal';

interface LandlordPropertyCardProps {
  property: Property;
  className?: string;
  onDelete?: (propertyId: string) => void;
}

type PropertyStatus =
  | 'ACTIVE'
  | 'AVAILABLE'
  | 'RENTED'
  | 'MAINTENANCE'
  | 'DRAFT'
  | 'DELETED'
  | 'PENDING_REVIEW'
  | 'LIVE'
  | 'REJECTED'
  | 'ARCHIVED';

const LandlordPropertyCard: React.FC<LandlordPropertyCardProps> = memo(
  ({ property, className, onDelete }) => {
    const router = useRouter();

    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishedModal, setShowPublishedModal] = useState(false);

    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

    const [selectedMedia, setSelectedMedia] = useState<string[]>(
      property.media?.images || []
    );

    const [localStatus, setLocalStatus] = useState<PropertyStatus | undefined>(
      property.status as PropertyStatus
    );

    const isAvailable = (localStatus || property.status) === 'AVAILABLE';
    const thumbnail = property.media?.images?.[0] || property.media?.videos?.[0];
    
    // Check if thumbnail is a video URL
    const isVideoThumbnail = thumbnail && (
      thumbnail.includes('/video/') || 
      thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i)
    );

    /* ------------------------- helpers ------------------------- */

    const updateImagesOptimistically = (images: string[]) => {
      setSelectedMedia(images);
    };

    const handleAttachAndPublish = async (media: string[]) => {
      if (isPublishing) return;

      if (!media.length) {
        alert('Please select or upload at least one image.');
        return;
      }

      setIsPublishing(true);

      const mergedImages = Array.from(
        new Set([...(property.media?.images || []), ...media])
      );

      updateImagesOptimistically(mergedImages);

      try {
        const input: UpdatePropertyInput = {
          media: {
            images: mergedImages,
            videos: property.media?.videos || [],
            floorPlan: property.media?.floorPlan || '',
            virtualTour: property.media?.virtualTour || ''
          }
        };

        await cachedGraphQL.mutate({
          query: updateProperty,
          variables: {
            propertyId: property.propertyId,
            input
          }
        });

        const pub = await cachedGraphQL.mutate({
          query: publishProperty,
          variables: { propertyId: property.propertyId }
        });

        if (pub.data?.publishProperty?.success) {
          setLocalStatus('AVAILABLE');
          setIsPublishModalOpen(false);
          setShowPublishedModal(true);
        }
      } catch (err) {
        console.error('Publish failed:', err);
      } finally {
        setIsPublishing(false);
      }
    };

    /* ------------------------- actions ------------------------- */

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
      } finally {
        setIsDeleting(false);
      }
    };

    /* ------------------------- render ------------------------- */

    return (
      <div
        className={cn(
          'group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition',
          className
        )}
      >
        <Link href={`/property/${property.propertyId}`} className="block">
          <div className="flex flex-col sm:flex-row">
            {/* image */}
            <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-t-lg sm:rounded-l-lg bg-gray-100 dark:bg-gray-800">
              {!imageError && thumbnail && !isVideoThumbnail ? (
                <Image
                  src={thumbnail}
                  alt={property.title}
                  fill
                  className={cn(
                    'object-cover transition group-hover:scale-105',
                    isImageLoading && 'blur-sm'
                  )}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setIsImageLoading(false);
                  }}
                  quality={60}
                  loading="lazy"
                />
              ) : !imageError && thumbnail && isVideoThumbnail ? (
                <div className="relative w-full h-full">
                  <video
                    src={thumbnail}
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
                    <div className="bg-white/90 rounded-full p-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
              )}
              {isImageLoading && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
              )}
            </div>

            {/* content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {property.title}
                  </h3>
                  <PropertyStatusBadge
                    status={(localStatus || property.status || 'DRAFT') as PropertyStatus}
                    size="sm"
                  />
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.address?.district}, {property.address?.region}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.specifications?.bedrooms || 0} bed •{' '}
                  {property.specifications?.bathrooms || 0} bath
                </div>
              </div>

              <div className="font-bold mt-2 text-lg text-gray-900 dark:text-white">
                {formatCurrency(
                  property.pricing?.monthlyRent || 0,
                  property.pricing?.currency || 'TZS'
                )}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> /mo</span>
              </div>
            </div>
          </div>
        </Link>

        {/* actions */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mt-2 justify-start">
            {/* Publish button */}
            <button
              disabled={isAvailable || isPublishing}
              onClick={() => setIsPublishModalOpen(true)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500',
                isAvailable
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500'
              )}
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>

            {/* Edit button */}
            <Link
              href={`/landlord/properties/${property.propertyId}/edit`}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Edit
            </Link>

            {/* Calendar button */}
            <Link
              href={`/landlord/properties/${property.propertyId}/calendar`}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              title="Manage availability calendar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </Link>

            {/* Reorder Media button */}
            {(property.media?.images?.length || 0) + (property.media?.videos?.length || 0) > 1 && (
              <button
                onClick={() => setIsReorderModalOpen(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                title="Reorder media"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Reorder
              </button>
            )}

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 dark:hover:border-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>


        {/* delete confirm */}
        <LazyConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Property"
          message="This action cannot be undone."
          isLoading={isDeleting}
        />

        {/* publish modal */}
        <Modal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          title="Select images to publish"
          size="lg"
        >
          <MediaSelector
            selectedMedia={selectedMedia}
            onMediaChange={setSelectedMedia}
            maxSelection={10}
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsPublishModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => handleAttachAndPublish(selectedMedia)}
              disabled={isPublishing}
              className="px-4 py-2 rounded-lg bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 text-white font-medium hover:brightness-110 transition-all"
            >
              {isPublishing ? 'Publishing…' : 'Attach & Publish'}
            </button>
          </div>
        </Modal>

        {/* Reorder Media Modal */}
        <MediaReorderModal
          isOpen={isReorderModalOpen}
          onClose={() => setIsReorderModalOpen(false)}
          property={property}
          onSuccess={() => {
            // Optionally refresh the property data
            window.location.reload();
          }}
        />

        {/* success */}
        <NotificationModal
          isOpen={showPublishedModal}
          onClose={() => setShowPublishedModal(false)}
          title="Property published"
          message="Your property is now live."
          type="success"
        />
      </div>
    );
  }
);

LandlordPropertyCard.displayName = 'LandlordPropertyCard';
export default LandlordPropertyCard;
