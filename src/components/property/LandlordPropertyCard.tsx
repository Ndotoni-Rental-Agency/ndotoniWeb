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
          'group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow',
          className
        )}
      >
        {/* Thumbnail — clickable to view */}
        <Link href={`/property/${property.propertyId}`}>
          <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <div className="bg-white/90 rounded-full p-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0h-4m-2 0H3" />
                </svg>
              </div>
            )}
            {isImageLoading && thumbnail && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
            )}
            {/* Status badge */}
            <span className="absolute top-3 left-3">
              <PropertyStatusBadge
                status={(localStatus || property.status || 'DRAFT') as PropertyStatus}
                size="sm"
              />
            </span>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3.5">
          <Link href={`/property/${property.propertyId}`} className="block">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm hover:text-brand-600 transition-colors">
              {property.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {property.address?.district}, {property.address?.region}
            </p>
          </Link>

          <div className="flex items-center justify-between mt-2.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(
                property.pricing?.monthlyRent || 0,
                property.pricing?.currency || 'TZS'
              )}
              <span className="text-gray-400 dark:text-gray-500 font-normal">/mo</span>
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {property.specifications?.bedrooms || 0} bed • {property.specifications?.bathrooms || 0} bath
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            {/* Publish */}
            <button
              disabled={isAvailable || isPublishing}
              onClick={() => setIsPublishModalOpen(true)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-medium transition-colors',
                isAvailable
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              )}
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>

            {/* Edit */}
            <Link
              href={`/landlord/properties/${property.propertyId}/edit`}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-medium border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Edit
            </Link>

            {/* Calendar */}
            <Link
              href={`/landlord/properties/${property.propertyId}/calendar`}
              className="flex items-center justify-center text-xs py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Calendar"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </Link>

            {/* Reorder */}
            {(property.media?.images?.length || 0) + (property.media?.videos?.length || 0) > 1 && (
              <button
                onClick={() => setIsReorderModalOpen(true)}
                className="flex items-center justify-center text-xs py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Reorder media"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center text-xs py-2 px-3 rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
              aria-label="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
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
          variant="destructive"
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
