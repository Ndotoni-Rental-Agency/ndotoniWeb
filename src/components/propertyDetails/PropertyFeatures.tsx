'use client';

import React from 'react';
import { Property } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  property: Property;
};

export default function PropertyFeatures({ property }: Props) {
  const { t } = useLanguage();
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

  if (features.length === 0) return null;

  const getIcon = (iconType: string) => {
    switch (iconType) {
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