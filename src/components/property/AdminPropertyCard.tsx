'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
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

  const [successMessage, setSuccessMessage] = useState('');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const router = useRouter();
  const admin = useAdmin();
  const thumbnail = property.media?.images?.[0];

  /** =========================
   * Action handlers
   * ========================= */
  const changeStatus = async (newStatus: PropertyStatus) => {
    setIsProcessing(true);
    setIsActionsOpen(false);
    try {
      if (newStatus === PropertyStatus.DELETED) {
        await admin.deleteProperty(property.propertyId);
      } else {
        await admin.updateThisProperty(property.propertyId, { status: newStatus });
      }

      onStatusChange?.(newStatus);
      setSuccessMessage(`Property status changed to "${newStatus}"`);
      setTimeout(() => setSuccessMessage(''), 3000);
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

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await admin.deleteProperty(property.propertyId);
      onDeleteSuccess?.();
      setSuccessMessage('Property deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal({ type: null });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const navigateToDetails = () => router.push(`/property/${property.propertyId}`);

  /** =========================
   * Status actions
   * ========================= */
  const statusActions: { label: string; value: PropertyStatus }[] = [
    { label: 'Available', value: PropertyStatus.AVAILABLE },
    { label: 'Rented', value: PropertyStatus.RENTED },
    { label: 'Maintenance', value: PropertyStatus.MAINTENANCE },
    { label: 'Draft', value: PropertyStatus.DRAFT },
    {
      label: property.status === PropertyStatus.DELETED ? 'Restore' : 'Delete',
      value: PropertyStatus.DELETED,
    },
  ];

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200',
        className
      )}
    >
      {/* Success message */}
      {successMessage && (
        <div className="absolute top-2 right-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 px-3 py-1 rounded text-xs z-10">
          {successMessage}
        </div>
      )}

      <div className="flex cursor-pointer" onClick={navigateToDetails}>
        {/* Image */}
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
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400 dark:text-gray-500 text-sm">No image</span>
            </div>
          )}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 sm:p-4 min-h-[6rem] sm:min-h-[8rem] flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white line-clamp-2 leading-tight flex-1 mr-2">
                {property.title}
              </h3>
              <PropertyStatusBadge status={property.status || 'DRAFT'} size="sm" />
            </div>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              {property.address?.district || 'Unknown'}, {property.address?.region || 'Unknown'}
            </div>

            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
              {property.specifications?.bedrooms || 0} bed •{' '}
              {property.specifications?.bathrooms || 0} bath
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(
                  property.pricing?.monthlyRent || 0,
                  property.pricing?.currency || 'TZS'
                )}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">
                /mo
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {/* Duplicate */}
              <button
                onClick={() => setShowModal({ type: 'duplicate' })}
                className="px-2 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs flex items-center gap-1"
              >
                <Copy className="h-4 w-4" /> Duplicate
              </button>

              {/* Actions dropdown */}
              <div className="relative">
                <button
                  className="px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800"
                  onClick={() => setIsActionsOpen((prev) => !prev)}
                >
                  Actions
                </button>

                {isActionsOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-20">
                    {statusActions.map((action) => (
                      <button
                        key={action.value}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                        onClick={() => {
                          setShowModal({ type: 'status', targetStatus: action.value });
                          setIsActionsOpen(false);
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Modals
      ========================= */}
      <LazyConfirmationModal
        isOpen={showModal.type === 'delete'}
        onClose={() => setShowModal({ type: null })}
        onConfirm={handleDelete}
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
