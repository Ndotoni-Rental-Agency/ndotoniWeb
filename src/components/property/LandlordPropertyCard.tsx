'use client';

import React, { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Property } from '@/API';
import { formatCurrency } from '@/lib/utils/common';
import { cn } from '@/lib/utils/common';
import PropertyStatusBadge from './PropertyStatusBadge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

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
                  status={property.status || 'DRAFT'} 
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
            
            {/* Price and Actions - Always at bottom */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  {formatCurrency(property.pricing?.monthlyRent || 0, property.pricing?.currency || 'TZS')}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1">/mo</span>
              </div>
              
              {/* Action buttons - Horizontal layout */}
              <div className="flex items-center gap-2">
                {/* Duplicate button */}
                <button
                  onClick={handleDuplicate}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-800 transition-all flex items-center justify-center"
                  title="Duplicate property"
                  type="button"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                {/* Edit button */}
                <Link
                  href={`/landlord/properties/${property.propertyId}/edit`}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-800 transition-all flex items-center justify-center"
                  title="Edit property"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
                
                {/* View button */}
                <Link
                  href={`/property/${property.propertyId}`}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 border border-gray-200 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-800 transition-all flex items-center justify-center"
                  title="View property"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
                
                {/* Delete button */}
                <button
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 transition-all flex items-center justify-center"
                  title="Delete property"
                  type="button"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
});

LandlordPropertyCard.displayName = 'LandlordPropertyCard';

export default LandlordPropertyCard;
