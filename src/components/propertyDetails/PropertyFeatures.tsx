'use client';

import React from 'react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  property: Property;
};

export default function PropertyFeatures({ property }: Props) {
  const { t } = useLanguage();
  const specs = [];
  const features = [];

  // Helper function to get translated status
  const getStatusTranslation = (status: string) => {
    const statusKey = status.toUpperCase();
    switch (statusKey) {
      case 'AVAILABLE':
        return t('propertyDetails.statusAvailable');
      case 'RENTED':
        return t('propertyDetails.statusRented');
      case 'MAINTENANCE':
        return t('propertyDetails.statusMaintenance');
      case 'DRAFT':
        return t('propertyDetails.statusDraft');
      default:
        return status.toLowerCase().replace('_', ' ');
    }
  };

  // Build specs array (bedrooms, bathrooms, area, etc.)
  if (property.specifications?.bedrooms !== undefined && property.specifications?.bedrooms !== null) {
    specs.push({
      label: t('propertyDetails.bedrooms'),
      value: property.specifications.bedrooms.toString(),
      icon: 'bed'
    });
  }

  if (property.specifications?.bathrooms !== undefined && property.specifications?.bathrooms !== null) {
    specs.push({
      label: t('propertyDetails.bathrooms'),
      value: property.specifications.bathrooms.toString(),
      icon: 'bath'
    });
  }

  if (property.specifications?.squareMeters) {
    specs.push({
      label: t('propertyDetails.area'),
      value: `${property.specifications.squareMeters} m²`,
      icon: 'area'
    });
  }

  if (property.specifications?.parkingSpaces !== undefined && property.specifications?.parkingSpaces !== null) {
    specs.push({
      label: t('propertyDetails.parking'),
      value: property.specifications.parkingSpaces > 0 ? `${property.specifications.parkingSpaces}` : t('propertyDetails.no'),
      icon: 'parking'
    });
  }

  if (property.specifications?.floors !== undefined && property.specifications?.floors !== null) {
    specs.push({
      label: t('propertyDetails.floors'),
      value: property.specifications.floors.toString(),
      icon: 'floors'
    });
  }

  if (property.specifications?.furnished === true) {
    specs.push({
      label: t('propertyDetails.furnished'),
      value: t('propertyDetails.yes'),
      icon: 'furnished'
    });
  }

  // Add property status
  if (property.status) {
    features.push({
      label: t('propertyDetails.status'),
      value: getStatusTranslation(property.status),
      icon: 'status'
    });
  }

  // Add creation date
  if (property.createdAt) {
    features.push({
      label: t('propertyDetails.listed'),
      value: new Date(property.createdAt).toLocaleDateString(),
      icon: 'calendar'
    });
  }

  // Add floor plan if available
  if (property.media?.floorPlan) {
    features.push({
      label: t('propertyDetails.floorPlan'),
      value: t('propertyDetails.availableNow'),
      icon: 'floorplan'
    });
  }

  if (specs.length === 0 && features.length === 0) return null;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'bed':
        return (
          <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'bath':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
      case 'area':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        );
      case 'parking':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case 'floors':
        return (
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'furnished':
        return (
          <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'status':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'calendar':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'floorplan':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="transition-colors">
      <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">
        {t('propertyDetails.propertyFeatures')}
      </h3>
      
      {/* Key Specs Grid */}
      {specs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center gap-3">
              {getIcon(spec.icon)}
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {spec.label}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {spec.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Additional Features */}
      {features.length > 0 && (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              {getIcon(feature.icon)}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {feature.label}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {feature.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floor Plan Link */}
      {property.media?.floorPlan && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <a
            href={property.media.floorPlan}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('propertyDetails.viewFloorPlan')}
          </a>
        </div>
      )}
    </div>
  );
}