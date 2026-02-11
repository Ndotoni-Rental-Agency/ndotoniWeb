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
          'group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition',
          className
        )}
      >
        <Link href={`/short-property/${property.propertyId}`} className="block">
          <div className="flex flex-col sm:flex-row">
            {/* image */}
            <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-32 flex-shrink-0 overflow-hidden rounded-t-lg sm:rounded-l-lg bg-gray-100 dark:bg-gray-800">
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
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              )}
              {isImageLoading && thumbnail && (
                <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
              )}
              
              {/* Short-term badge */}
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                Nightly
              </div>
            </div>

            {/* content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {property.title}
                  </h3>
                  <PropertyStatusBadge
                    status={(localStatus || PropertyStatus.DRAFT) as any}
                    size="sm"
                  />
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.district}, {property.region}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {property.propertyType} • {property.maxGuests || 0} guests
                </div>

                {property.averageRating && property.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
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
              </div>

              <div className="font-bold mt-2 text-lg text-gray-900 dark:text-white">
                {formatCurrency(
                  property.nightlyRate || 0,
                  property.currency || 'TZS'
                )}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> /night</span>
              </div>
            </div>
          </div>
        </Link>

        {/* actions */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2 mt-2 justify-start">
            {/* Publish button (only for drafts) */}
            {isDraft && (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500',
                  isPublishing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500'
                )}
              >
                {isPublishing ? 'Publishing…' : 'Publish'}
              </button>
            )}

            {/* Edit button */}
            <Link
              href={`/landlord/properties/${property.propertyId}/edit`}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Edit
            </Link>

            {/* View Bookings button (only for active properties) */}
            {isActive && (
              <Link
                href={`/landlord/properties/${property.propertyId}/bookings`}
                className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Bookings
              </Link>
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
          message="This action cannot be undone. All bookings will be cancelled."
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
