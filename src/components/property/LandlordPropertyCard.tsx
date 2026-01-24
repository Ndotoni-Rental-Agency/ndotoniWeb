'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Property, UpdatePropertyInput } from '@/API';
import { publishProperty, updateProperty } from '@/graphql/mutations';
import { getProperty } from '@/graphql/queries';
import { cachedGraphQL } from '@/lib/cache';
import { formatCurrency, cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import LazyConfirmationModal from '@/components/ui/LazyConfirmationModal';
import { Modal } from '@/components/ui/Modal';
import { NotificationModal } from '@/components/ui/NotificationModal';
import MediaSelector from '@/components/media/MediaSelector';

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

    const [selectedMedia, setSelectedMedia] = useState<string[]>(
      property.media?.images || []
    );

    const [localStatus, setLocalStatus] = useState<PropertyStatus | undefined>(
      property.status as PropertyStatus
    );

    const isAvailable = (localStatus || property.status) === 'AVAILABLE';
    const thumbnail = property.media?.images?.[0];

    /* ------------------------- helpers ------------------------- */

    const updateImagesOptimistically = (images: string[]) => {
      // Fallback: update local selected media so UI reflects the optimistic change
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

      // 🚀 optimistic UI
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
          <div className="flex">
            {/* image */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-32 flex-shrink-0 overflow-hidden rounded-l-lg bg-gray-100 dark:bg-gray-800">
              {!imageError && thumbnail ? (
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

                <div className="text-sm text-gray-500">
                  {property.address?.district}, {property.address?.region}
                </div>

                <div className="text-sm text-gray-500">
                  {property.specifications?.bedrooms || 0} bed •{' '}
                  {property.specifications?.bathrooms || 0} bath
                </div>
              </div>

              <div className="font-bold">
                {formatCurrency(
                  property.pricing?.monthlyRent || 0,
                  property.pricing?.currency || 'TZS'
                )}
                <span className="text-sm font-normal text-gray-500"> /mo</span>
              </div>
            </div>
          </div>
        </Link>

        {/* actions */}
        <div className="px-4 pb-4">
          <div className="inline-flex gap-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <button
              disabled={isAvailable || isPublishing}
              onClick={() => setIsPublishModalOpen(true)}
              className={cn(
                'px-4 py-2 rounded-md text-sm',
                isAvailable
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              )}
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </button>

            <Link
              href={`/landlord/properties/${property.propertyId}/edit`}
              className="px-3 py-2 text-sm border rounded-md"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-500"
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

        {/* publish modal (UI ONLY) */}
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
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={() => handleAttachAndPublish(selectedMedia)}
              disabled={isPublishing}
              className="px-4 py-2 rounded-md bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 text-white"
            >
              {isPublishing ? 'Publishing…' : 'Attach & Publish'}
            </button>
          </div>
        </Modal>

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
