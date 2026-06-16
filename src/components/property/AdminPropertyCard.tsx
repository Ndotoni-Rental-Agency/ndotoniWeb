'use client';

import React, { useState, memo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { Property, PropertyStatus } from '@/API';
import { formatCurrency, cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import VerifiedPropertyBadge from './VerifiedPropertyBadge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { useAdmin } from '@/hooks/useAdmin';
import { useNotification } from '@/hooks/useNotification';

interface AdminPropertyCardProps {
  property: Property;
  isShortTerm?: boolean;
  className?: string;
  onDeleteSuccess?: () => void;
  onStatusChange?: (newStatus: PropertyStatus) => void;
  onVerifiedChange?: (verified: boolean) => void;
}

const AdminPropertyCard: React.FC<AdminPropertyCardProps> = memo(({
  property,
  isShortTerm = false,
  className,
  onDeleteSuccess,
  onStatusChange,
  onVerifiedChange,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showModal, setShowModal] = useState<{
    type: 'delete' | 'duplicate' | 'status' | 'verify' | null;
    targetStatus?: PropertyStatus;
    targetVerified?: boolean;
  }>({ type: null });

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const admin = useAdmin();
  const { notification, showError, showSuccess, closeNotification } = useNotification();

  // Handle both property types for thumbnail
  const thumbnail = isShortTerm
    ? (property as any).thumbnail || (property as any).images?.[0]
    : property.media?.images?.[0] || property.media?.videos?.[0];

  const isVideoThumbnail = thumbnail && (
    thumbnail.includes('/video/') ||
    thumbnail.match(/\.(mp4|mov|avi|webm)(\?|$)/i)
  );

  useEffect(() => {
    if (!isActionsOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (actionsRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setIsActionsOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsActionsOpen(false);
    };

    // Use "click" (not "mousedown") so portal menu item handlers run before close
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isActionsOpen]);

  const changeVerified = async (verified: boolean) => {
    setIsProcessing(true);
    try {
      await admin.updateThisProperty(property.propertyId, { verified });
      onVerifiedChange?.(verified);
      setShowModal({ type: null });
      showSuccess(
        'Success',
        verified ? 'Property verified. Badge will appear on listings.' : 'Property unverified.'
      );
    } catch (err) {
      console.error(err);
      showError('Update Failed', 'Could not update verification status. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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

  const navigateToDetails = () => {
    if (isShortTerm) {
      router.push(`/short-property/${property.propertyId}`);
      return;
    }
    router.push(`/property/${property.propertyId}`);
  };

  const statusActions = [
    { label: 'Edit', value: 'edit' },
    { label: 'Duplicate', value: 'duplicate' },
    ...(!isShortTerm
      ? [{
          label: property.verified ? 'Unverify' : 'Verify',
          value: property.verified ? 'unverify' : 'verify',
        }]
      : []),
    { label: 'Available', value: PropertyStatus.AVAILABLE },
    { label: 'Rented', value: PropertyStatus.RENTED },
    { label: 'Maintenance', value: PropertyStatus.MAINTENANCE },
    { label: 'Draft', value: PropertyStatus.DRAFT },
    {
      label: property.status === PropertyStatus.DELETED ? 'Restore' : 'Delete',
      value: PropertyStatus.DELETED,
    },
  ];

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

  const handleAction = (action: (typeof statusActions)[number]) => {
    if (action.value === 'edit') {
      router.push(`/admin/properties/${property.propertyId}/edit`);
    } else if (action.value === 'duplicate') {
      setShowModal({ type: 'duplicate' });
    } else if (action.value === 'verify' || action.value === 'unverify') {
      setShowModal({
        type: 'verify',
        targetVerified: action.value === 'verify',
      });
    } else {
      setShowModal({
        type: action.value === PropertyStatus.DELETED ? 'delete' : 'status',
        targetStatus: action.value as PropertyStatus,
      });
    }
    setIsActionsOpen(false);
  };

  return (
    <>
    <NotificationModal
      isOpen={notification.isOpen}
      onClose={closeNotification}
      title={notification.title}
      message={notification.message}
      type={notification.type}
    />

    <ConfirmationModal
      isOpen={showModal.type === 'delete'}
      onClose={() => setShowModal({ type: null })}
      onConfirm={() => changeStatus(PropertyStatus.DELETED)}
      title="Delete Property"
      message="Are you sure you want to delete this property? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      isLoading={isProcessing}
    />

    <ConfirmationModal
      isOpen={showModal.type === 'duplicate'}
      onClose={() => setShowModal({ type: null })}
      onConfirm={handleDuplicate}
      title="Duplicate Property"
      message="Do you want to create a duplicate of this property?"
      confirmText="Duplicate"
      cancelText="Cancel"
      isLoading={isProcessing}
    />

    <ConfirmationModal
      isOpen={showModal.type === 'status'}
      onClose={() => setShowModal({ type: null })}
      onConfirm={() => changeStatus(showModal.targetStatus!)}
      title="Change Property Status"
      message={`Are you sure you want to change this property to "${showModal.targetStatus}"?`}
      confirmText="Yes"
      cancelText="Cancel"
      isLoading={isProcessing}
    />

    <ConfirmationModal
      isOpen={showModal.type === 'verify'}
      onClose={() => setShowModal({ type: null })}
      onConfirm={() => changeVerified(showModal.targetVerified!)}
      title={showModal.targetVerified ? 'Verify Property' : 'Unverify Property'}
      message={
        showModal.targetVerified
          ? 'Mark this property as verified? A verified badge will appear on listings.'
          : 'Remove verified status from this property?'
      }
      confirmText={showModal.targetVerified ? 'Verify' : 'Unverify'}
      cancelText="Cancel"
      isLoading={isProcessing}
    />

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
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-1.5">
                {property.verified && (
                  <VerifiedPropertyBadge verified={property.verified} size="sm" />
                )}
                <span className="sm:hidden">
                  <PropertyStatusBadge status={property.status || 'DRAFT'} size="xs" />
                </span>
                <span className="hidden sm:inline-flex">
                  <PropertyStatusBadge status={property.status || 'DRAFT'} size="sm" />
                </span>
              </div>
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
                {isShortTerm
                  ? `${formatCurrency((property as any).nightlyRate || 0, (property as any).currency || 'TZS')}`
                  : formatCurrency(property.pricing?.monthlyRent || 0, property.pricing?.currency || 'TZS')
                }
              </span>
              <span className="ml-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{isShortTerm ? '/night' : '/mo'}</span>
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

      {isActionsOpen && (
        <>
          <div
            className="fixed inset-0 z-[999] bg-black/30"
            onClick={() => setIsActionsOpen(false)}
          />
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
            <div
              ref={menuRef}
              role="menu"
              className="w-full max-w-xs rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800 pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{property.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Choose an action</p>
              </div>
              <div className="py-1">
                {statusActions.map((action) => (
                  <button
                    key={action.value}
                    role="menuitem"
                    type="button"
                    className="w-full truncate px-4 py-3 text-left text-sm text-gray-900 transition hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                <button
                  type="button"
                  onClick={() => setIsActionsOpen(false)}
                  className="w-full rounded-xl py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
});

AdminPropertyCard.displayName = 'AdminPropertyCard';
export default AdminPropertyCard;
