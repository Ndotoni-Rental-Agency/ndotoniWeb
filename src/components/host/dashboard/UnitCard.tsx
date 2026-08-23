'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PencilSquareIcon,
  CalendarDaysIcon,
  TrashIcon,
  MegaphoneIcon,
  Bars3Icon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { UpdatePropertyInput } from '@/API';
import { publishProperty, updateProperty } from '@/graphql/mutations';
import { cachedGraphQL } from '@/lib/cache';
import { formatCurrency } from '@/lib/utils/common';
import PropertyStatusBadge from '@/components/property/PropertyStatusBadge';
import LazyConfirmationModal from '@/components/ui/LazyConfirmationModal';
import { Modal } from '@/components/ui/Modal';
import { NotificationModal } from '@/components/ui/NotificationModal';
import MediaSelector from '@/components/media/MediaSelector';
import MediaReorderModal from '@/components/property/MediaReorderModal';
import { HostProperty } from './types';

type PropertyStatus =
  | 'ACTIVE' | 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DRAFT'
  | 'DELETED' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED';

interface Props {
  property: HostProperty;
  onDelete: (propertyId: string) => void;
  /** Label shown instead of the unit's own title — e.g. "Unit 2B" within a group list. */
  label?: string;
}

/** One unit: full-bleed cover photo, title/location/price, then vertical, explicit action rows. */
export default function UnitCard({ property, onDelete, label }: Props) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPublishedModal, setShowPublishedModal] = useState(false);

  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);

  const [selectedMedia, setSelectedMedia] = useState<string[]>(property.media?.images || []);
  const [localStatus, setLocalStatus] = useState<PropertyStatus | undefined>(property.status as PropertyStatus);

  const isAvailable = (localStatus || property.status) === 'AVAILABLE';
  const thumbnail = property.media?.images?.[0] || property.media?.videos?.[0];
  const isVideoThumbnail = thumbnail && (
    thumbnail.includes('/video/') || thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i)
  );
  const mediaCount = (property.media?.images?.length || 0) + (property.media?.videos?.length || 0);

  const handleAttachAndPublish = async (media: string[]) => {
    if (isPublishing) return;
    if (!media.length) {
      alert('Please select or upload at least one image.');
      return;
    }
    setIsPublishing(true);
    const mergedImages = Array.from(new Set([...(property.media?.images || []), ...media]));
    setSelectedMedia(mergedImages);

    try {
      const input: UpdatePropertyInput = {
        media: {
          images: mergedImages,
          videos: property.media?.videos || [],
          floorPlan: property.media?.floorPlan || '',
          virtualTour: property.media?.virtualTour || '',
        },
      };
      await cachedGraphQL.mutate({
        query: updateProperty,
        variables: { propertyId: property.propertyId, input },
      });
      const pub = await cachedGraphQL.mutate({
        query: publishProperty,
        variables: { propertyId: property.propertyId },
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

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(property.propertyId);
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Link href={`/property/${property.propertyId}`} className="block">
        <div className="relative h-40 bg-gray-100 dark:bg-gray-900">
          {!imageError && thumbnail && !isVideoThumbnail ? (
            <Image
              src={thumbnail}
              alt={property.title}
              fill
              className={`object-cover transition ${isImageLoading ? 'blur-sm' : ''}`}
              onLoad={() => setIsImageLoading(false)}
              onError={() => { setImageError(true); setIsImageLoading(false); }}
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
                onLoadedMetadata={(e) => { e.currentTarget.currentTime = 1; }}
                onError={() => { setImageError(true); setIsImageLoading(false); }}
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
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800">
              <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-2 0h-4m-2 0H3" />
              </svg>
            </div>
          )}
          {isImageLoading && thumbnail && (
            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-800" />
          )}
          <span className="absolute top-3 left-3">
            <PropertyStatusBadge status={(localStatus || property.status || 'DRAFT') as PropertyStatus} size="sm" />
          </span>
        </div>
      </Link>

      <div className="px-4 pt-3.5 pb-1">
        <Link href={`/property/${property.propertyId}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            {label || property.unitLabel || property.title}
          </h3>
        </Link>
        <p className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{property.address?.district}, {property.address?.region}</span>
        </p>
        <p className="mt-2.5">
          <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {formatCurrency(property.pricing?.monthlyRent || 0, property.pricing?.currency || 'TZS')}
          </span>
          <span className="text-sm font-medium text-gray-400 dark:text-gray-500"> /mo</span>
        </p>
      </div>

      <div className="mx-4 mt-3 border-t border-gray-100 dark:border-gray-700" />

      <div className="p-3 space-y-1">
        {!isAvailable && (
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            disabled={isPublishing}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors disabled:opacity-50"
          >
            <span className="h-8 w-8 shrink-0 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <MegaphoneIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1 text-left">
              {isPublishing ? 'Publishing…' : 'Publish'}
            </span>
            <ChevronRightIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          </button>
        )}

        <Link
          href={`/host/properties/${property.propertyId}/edit`}
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span className="h-8 w-8 shrink-0 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
            <PencilSquareIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1">Edit</span>
          <ChevronRightIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        </Link>

        <Link
          href={`/host/properties/${property.propertyId}/calendar`}
          className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span className="h-8 w-8 shrink-0 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
            <CalendarDaysIcon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1">Calendar</span>
          <ChevronRightIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        </Link>

        {mediaCount > 1 && (
          <button
            type="button"
            onClick={() => setIsReorderModalOpen(true)}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <span className="h-8 w-8 shrink-0 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
              <Bars3Icon className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1 text-left">Reorder photos</span>
            <ChevronRightIcon className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
          className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
          <span className="h-8 w-8 shrink-0 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
            {isDeleting ? (
              <span className="h-3.5 w-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4 text-red-500" />
            )}
          </span>
          <span className="text-sm font-semibold text-red-600 dark:text-red-400 flex-1 text-left">Delete</span>
          <ChevronRightIcon className="h-4 w-4 text-red-200 dark:text-red-800" />
        </button>
      </div>

      <LazyConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="This action cannot be undone."
        variant="destructive"
        isLoading={isDeleting}
      />

      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Select images to publish"
        size="lg"
      >
        <MediaSelector selectedMedia={selectedMedia} onMediaChange={setSelectedMedia} maxSelection={10} />
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

      <MediaReorderModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        property={property}
        onSuccess={() => { window.location.reload(); }}
      />

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
