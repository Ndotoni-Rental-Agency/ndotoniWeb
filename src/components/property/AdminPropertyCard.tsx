'use client';

import React, { useState, memo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { createPortal } from 'react-dom';

import { Property, PropertyStatus } from '@/API';
import { formatCurrency, cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import LazyConfirmationModal from '@/components/ui/LazyConfirmationModal';
import { useAdmin } from '@/hooks/useAdmin';

interface AdminPropertyCardProps {
  property: Property;
  className?: string;
  onDeleteSuccess?: () => void;
  onStatusChange?: (newStatus: PropertyStatus) => void;
}

const AdminPropertyCard: React.FC<AdminPropertyCardProps> = memo(({
  property,
  className,
  onDeleteSuccess,
  onStatusChange,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState<{
    type: 'delete' | 'duplicate' | 'status' | null;
    targetStatus?: PropertyStatus;
  }>({ type: null });

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  const router = useRouter();
  const admin = useAdmin();
  const thumbnail = property.media?.images?.[0] || property.media?.videos?.[0];

  const isVideoThumbnail = thumbnail && (
    thumbnail.includes('/video/') ||
    thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i)
  );

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  useEffect(() => {
    if (!isActionsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsActionsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isActionsOpen]);

  const changeStatus = async (newStatus: PropertyStatus) => {
    setIsProcessing(true);
    try {
      if (newStatus === PropertyStatus.DELETED) {
        await admin.deleteProperty(property.propertyId);
      } else {
        await admin.updateThisProperty(property.propertyId, { status: newStatus });
      }
      onStatusChange?.(newStatus);
      if (newStatus === PropertyStatus.DELETED) {
        onDeleteSuccess?.();
      }
      setShowModal({ type: null });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDuplicate = async () => {
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
    router.push('/admin/properties/create?template=true');
  };

  const navigateToDetails = () => router.push(`/property/${property.propertyId}`);

  const statusActions = [
    { label: 'Duplicate', value: 'duplicate' },
    { label: 'Available', value: PropertyStatus.AVAILABLE },
    { label: 'Rented', value: PropertyStatus.RENTED },
    { label: 'Maintenance', value: PropertyStatus.MAINTENANCE },
    { label: 'Draft', value: PropertyStatus.DRAFT },
    {
      label: property.status === PropertyStatus.DELETED ? 'Restore' : 'Delete',
      value: PropertyStatus.DELETED,
    },
  ];

  const getDropdownPosition = useCallback(() => {
    if (!actionsRef.current) return { top: 0, left: 0, width: 160 };
    const rect = actionsRef.current.getBoundingClientRect();
    const menuWidth = 160;
    const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8);
    return {
      top: rect.bottom + 4,
      left: Math.max(8, left),
      width: menuWidth,
    };
  }, []);

  const renderMedia = () => {
    if (!imageError && thumbnail && !isVideoThumbnail) {
      return (
        <Image
          src={thumbnail}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className={cn(
            'object-cover transition-opacity duration-300',
            isImageLoading && 'opacity-0'
          )}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setImageError(true);
            setIsImageLoading(false);
          }}
          quality={60}
          loading="lazy"
        />
      );
    }

    if (!imageError && thumbnail && isVideoThumbnail) {
      return (
        <>
          <video
            src={thumbnail}
            className="h-full w-full object-cover"
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
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="rounded-full bg-white/90 p-1.5">
              <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
        <span className="text-xs text-gray-400 dark:text-gray-500">No media</span>
      </div>
    );
  };

  const dropdownPosition = isActionsOpen ? getDropdownPosition() : null;

  return (
    <div
      className={cn(
        'group cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow duration-200',
        'hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-lg',
        className
      )}
      onClick={navigateToDetails}
    >
      <div className="flex flex-col sm:flex-row">
        <div
          className={cn(
            'relative shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800',
            'aspect-[21/9] max-h-[120px] w-full',
            'sm:aspect-auto sm:h-28 sm:max-h-none sm:w-36 lg:w-40'
          )}
        >
          {renderMedia()}
          {isImageLoading && !imageError && thumbnail && (
            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between p-3 sm:p-3 lg:p-4">
          <div className="space-y-1">
            <div className="flex items-start gap-2">
              <h3 className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-900 line-clamp-2 dark:text-white sm:text-base">
                {property.title}
              </h3>
              <span className="shrink-0 sm:hidden">
                <PropertyStatusBadge status={property.status || 'DRAFT'} size="xs" />
              </span>
              <span className="hidden shrink-0 sm:inline-flex">
                <PropertyStatusBadge status={property.status || 'DRAFT'} size="sm" />
              </span>
            </div>

            <p className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              {property.address?.district || 'Unknown'}, {property.address?.region || 'Unknown'}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              {property.specifications?.bedrooms || 0} bed • {property.specifications?.bathrooms || 0} bath
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-sm font-bold text-gray-900 dark:text-white sm:text-base lg:text-lg">
                {formatCurrency(property.pricing?.monthlyRent || 0, property.pricing?.currency || 'TZS')}
              </span>
              <span className="ml-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">/mo</span>
            </div>

            <div ref={actionsRef} className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
              {/* Mobile: icon menu */}
              <button
                type="button"
                aria-label="Property actions"
                aria-expanded={isActionsOpen}
                aria-haspopup="menu"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg sm:hidden',
                  'border border-gray-200 bg-white text-gray-700',
                  'hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
                  'transition-colors'
                )}
                onClick={() => setIsActionsOpen((prev) => !prev)}
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {/* Desktop: text menu */}
              <button
                type="button"
                aria-expanded={isActionsOpen}
                aria-haspopup="menu"
                className={cn(
                  'hidden h-8 items-center gap-1 rounded-lg border px-2.5 sm:inline-flex',
                  'border-gray-200 bg-white text-xs font-medium text-gray-900',
                  'hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
                  'transition-colors'
                )}
                onClick={() => setIsActionsOpen((prev) => !prev)}
              >
                Actions
                <ChevronDownIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isActionsOpen && portalContainer && dropdownPosition && createPortal(
        <div
          role="menu"
          className="fixed z-[1000] flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
          }}
        >
          {statusActions.map((action) => (
            <button
              key={action.value}
              role="menuitem"
              type="button"
              className="w-full truncate px-3 py-2.5 text-left text-xs text-gray-900 transition hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                if (action.value === 'duplicate') setShowModal({ type: 'duplicate' });
                else {
                  setShowModal({
                    type: action.value === PropertyStatus.DELETED ? 'delete' : 'status',
                    targetStatus: action.value as PropertyStatus,
                  });
                }
                setIsActionsOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>,
        portalContainer
      )}

      <LazyConfirmationModal
        isOpen={showModal.type === 'delete'}
        onClose={() => setShowModal({ type: null })}
        onConfirm={() => changeStatus(PropertyStatus.DELETED)}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isProcessing}
      />

      <LazyConfirmationModal
        isOpen={showModal.type === 'duplicate'}
        onClose={() => setShowModal({ type: null })}
        onConfirm={handleDuplicate}
        title="Duplicate Property"
        message="Do you want to create a duplicate of this property?"
        confirmText="Duplicate"
        cancelText="Cancel"
        isLoading={isProcessing}
      />

      <LazyConfirmationModal
        isOpen={showModal.type === 'status'}
        onClose={() => setShowModal({ type: null })}
        onConfirm={() => changeStatus(showModal.targetStatus!)}
        title="Change Property Status"
        message={`Are you sure you want to change this property to "${showModal.targetStatus}"?`}
        confirmText="Yes"
        cancelText="Cancel"
        isLoading={isProcessing}
      />
    </div>
  );
});

AdminPropertyCard.displayName = 'AdminPropertyCard';
export default AdminPropertyCard;
