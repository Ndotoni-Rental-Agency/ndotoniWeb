'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import MediaReorder from './MediaReorder';
import { Property, UpdatePropertyInput } from '@/API';
import { GraphQLClient } from '@/lib/graphql-client';
import { updateProperty } from '@/graphql/mutations';

interface MediaReorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  onSuccess?: () => void;
}

export default function MediaReorderModal({
  isOpen,
  onClose,
  property,
  onSuccess
}: MediaReorderModalProps) {
  const [images, setImages] = useState<string[]>(property.media?.images || []);
  const [videos, setVideos] = useState<string[]>(property.media?.videos || []);

  const handleReorder = (newImages: string[], newVideos: string[]) => {
    setImages(newImages);
    setVideos(newVideos);
  };

  const handleSave = async () => {
    try {
      const input: UpdatePropertyInput = {
        media: {
          images,
          videos,
          floorPlan: property.media?.floorPlan || '',
          virtualTour: property.media?.virtualTour || ''
        }
      };

      await GraphQLClient.executeAuthenticated<{ updateProperty: Property }>(
        updateProperty,
        {
          propertyId: property.propertyId,
          input
        }
      );

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error updating media order:', error);
      throw error;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reorder Property Media"
      size="xl"
    >
      <div className="p-6">
        <MediaReorder
          images={images}
          videos={videos}
          onReorder={handleReorder}
          onSave={handleSave}
        />
      </div>
    </Modal>
  );
}
