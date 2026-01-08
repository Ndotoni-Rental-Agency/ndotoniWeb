'use client';

import { useState } from 'react';
import PropertyMediaManager from './PropertyMediaManager';

interface PropertyMedia {
  images: string[];
  videos: string[];
  floorPlan: string;
  virtualTour: string;
}

export default function MediaIntegrationDemo() {
  const [media, setMedia] = useState<PropertyMedia>({
    images: [],
    videos: [],
    floorPlan: '',
    virtualTour: ''
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Media Integration Demo</h1>
        <p className="text-gray-600 dark:text-gray-400 transition-colors">
          This demonstrates how landlords can manage property media during creation
        </p>
      </div>

      <PropertyMediaManager
        media={media}
        onMediaChange={setMedia}
      />
    </div>
  );
}