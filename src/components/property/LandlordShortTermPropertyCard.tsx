'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShortTermProperty, PropertyStatus } from '@/API';
import { formatCurrency, cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import LazyConfirmationModal from '@/components/ui/LazyConfirmationModal';
import { GraphQLClient } from '@/lib/graphql-client';
import { publishShortTermProperty, updateShortTermProperty } from '@/graphql/mutations';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { Modal } from '@/components/ui/Modal';
import MediaSelector from '@/components/media/MediaSelector';

interface LandlordShortTermPropertyCardProps {
  property: ShortTermProperty;
  className?: string;
  onDelete?: (propertyId: string) => void;
}

const LandlordShortTermPropertyCard: React.FC<LandlordShortTermPropertyCardProps> = memo(
  ({ property, className, onDelete }) => {
    const [imageError, setImageError] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishedModal, setShowPublishedModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
    const [localStatus, setLocalStatus] = useState(property.status);
    const [localImages, setLocalImages] = useState(property.images || []);

    // Images are now just URL strings, not objects
    const thumbnail = property.thumbnail || property.images?.[0] || localImages[0];
    // Check if property is published/available (not draft)
    const isActive = localStatus && localStatus !== PropertyStatus.DRAFT && localStatus !== PropertyStatus.DELETED;
    const isDraft = localStatus === PropertyStatus.DRAFT;

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

    const handlePublish = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if property has images
      if (!property.images || property.images.length === 0) {
        // Show media selector modal
        setShowMediaModal(true);
        return;
      }

      // Validate description
      if (!property.description) {
        alert('Please add a description before publishing');
        return;
      }

      await publishProperty();
    };

    const publishProperty = async () => {
      if (isPublishing) return;

      setIsPublishing(true);

      try {
        const response = await GraphQLClient.executeAuthenticated<{
          publishShortTermProperty: ShortTermProperty;
        }>(publishShortTermProperty, {
          propertyId: property.propertyId,
        });

        if (response.publishShortTermProperty) {
          setLocalStatus(response.publishShortTermProperty.status);
          setShowPublishedModal(true);
          setShowMediaModal(false);
        }
      } catch (error) {
        console.error('Failed to publish property:', error);
        alert('Failed to publish property. Please try again.');
      } finally {
        setIsPublishing(false);
      }
    };

    const handleAttachAndPublish = async () => {
      if (!selectedMedia.length) {
        alert('Please select at least one image');
        return;
      }

      setIsPublishing(true);

      try {
        // Update property with images (now just URL strings)
        await GraphQLClient.executeAuthenticated(updateShortTermProperty, {
          propertyId: property.propertyId,
          input: {
            images: selectedMedia,
            thumbnail: selectedMedia[0],
          },
        });

        // Update local state
        setLocalImages(selectedMedia);

        // Then publish
        await publishProperty();
      } catch (error) {
        console.error('Failed to attach media and publish:', error);
        alert('Failed to attach media. Please try again.');
        setIsPublishing(false);
      }
    };

    return (
      <div
        className={cn(
          'group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow',
          className
        )}
      >
        {/* Thumbnail — clickable to view */}
        <Link href={`/short-property/${property.propertyId}`}>
          <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
            {!imageError && (thumbnail || localImages[0]) ? (
              <Image
                src={thumbnail || localImages[0]}
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
              <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
            {isImageLoading && thumbnail && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
            )}
            {/* Status badge */}
            <span className="absolute top-3 left-3">
              <PropertyStatusBadge
                status={(localStatus || PropertyStatus.DRAFT) as any}
                size="sm"
              />
            </span>
            {/* Nightly badge */}
            <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Nightly
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-3.5">
          <Link href={`/short-property/${property.propertyId}`} className="block">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm hover:text-brand-600 transition-colors">
              {property.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {property.district}, {property.region}
            </p>
          </Link>

          <div className="flex items-center justify-between mt-2.5">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(property.nightlyRate || 0, property.currency || 'TZS')}
              <span className="text-gray-400 dark:text-gray-500 font-normal">/night</span>
            </p>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {property.maxGuests || 0} guests
            </span>
          </div>

          {property.averageRating && property.averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs mt-1.5">
              <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-gray-900 dark:text-white">
                {property.averageRating.toFixed(1)}
              </span>
              {property.ratingSummary?.totalReviews && (
                <span className="text-gray-500 dark:text-gray-400">
                  ({property.ratingSummary.totalReviews})
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3">
            {/* Publish (drafts only) */}
            {isDraft && (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg font-medium transition-colors',
                  isPublishing
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                )}
              >
                {isPublishing ? 'Publishing…' : 'Publish'}
              </button>
            )}

            {/* Edit */}
            <Link
              href={`/short-property/${property.propertyId}?edit=true`}
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

            {/* Bookings (active only) */}
            {isActive && (
              <Link
                href={`/landlord/properties/${property.propertyId}/bookings`}
                className="flex items-center justify-center text-xs py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Bookings"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </Link>
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
          message="This action cannot be undone. All bookings will be cancelled."
          variant="destructive"
          isLoading={isDeleting}
        />

        {/* success */}
        <NotificationModal
          isOpen={showPublishedModal}
          onClose={() => setShowPublishedModal(false)}
          title="Property published"
          message="Your short-term property is now live and available for bookings."
          type="success"
        />

        {/* Media selector modal */}
        <Modal
          isOpen={showMediaModal}
          onClose={() => setShowMediaModal(false)}
          title="Add images to publish"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please add at least one image before publishing your property.
            </p>
            
            <MediaSelector
              selectedMedia={selectedMedia}
              onMediaChange={setSelectedMedia}
              maxSelection={10}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleAttachAndPublish}
                disabled={isPublishing || selectedMedia.length === 0}
                className="px-4 py-2 rounded-lg bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 text-white font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Publishing…' : 'Attach & Publish'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
);

LandlordShortTermPropertyCard.displayName = 'LandlordShortTermPropertyCard';
export default LandlordShortTermPropertyCard;
