'use client';

import React, { useState } from 'react';
import { Play, GripVertical, X } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

interface MediaReorderProps {
  images: string[];
  videos: string[];
  onReorder: (images: string[], videos: string[]) => void;
  onSave: () => Promise<void>;
  className?: string;
}

export default function MediaReorder({
  images,
  videos,
  onReorder,
  onSave,
  className = ''
}: MediaReorderProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Combine images and videos into a single array
  const mediaItems: MediaItem[] = [
    ...images.map(url => ({ url, type: 'image' as const })),
    ...videos.map(url => ({ url, type: 'video' as const }))
  ];

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newMediaItems = [...mediaItems];
    const draggedItem = newMediaItems[draggedIndex];
    
    // Remove from old position
    newMediaItems.splice(draggedIndex, 1);
    // Insert at new position
    newMediaItems.splice(index, 0, draggedItem);

    // Split back into images and videos
    const newImages = newMediaItems.filter(item => item.type === 'image').map(item => item.url);
    const newVideos = newMediaItems.filter(item => item.type === 'video').map(item => item.url);

    onReorder(newImages, newVideos);
    setDraggedIndex(index);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleRemove = (index: number) => {
    const newMediaItems = mediaItems.filter((_, i) => i !== index);
    const newImages = newMediaItems.filter(item => item.type === 'image').map(item => item.url);
    const newVideos = newMediaItems.filter(item => item.type === 'video').map(item => item.url);
    
    onReorder(newImages, newVideos);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave();
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving media order:', error);
      alert('Failed to save media order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (mediaItems.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center ${className}`}>
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600 dark:text-gray-400">No media files yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Upload images and videos to get started</p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Media Gallery</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Drag to reorder • First image is the cover photo
          </p>
        </div>
        
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Order
              </>
            )}
          </button>
        )}
      </div>

      {/* Media Grid */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mediaItems.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative group cursor-move rounded-lg overflow-hidden border-2 transition-all ${
              draggedIndex === index
                ? 'border-red-500 opacity-50 scale-95'
                : 'border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-600'
            }`}
          >
            {/* Position Badge */}
            <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
              {index + 1}
            </div>

            {/* Cover Badge */}
            {index === 0 && (
              <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                COVER
              </div>
            )}

            {/* Drag Handle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                <GripVertical className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 z-20 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Media Content */}
            <div className="aspect-square bg-gray-100 dark:bg-gray-700">
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={`Media ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              ) : (
                <div className="relative w-full h-full">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-8 h-8 text-white" fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600 dark:text-gray-400">
            {images.length} image{images.length !== 1 ? 's' : ''} • {videos.length} video{videos.length !== 1 ? 's' : ''}
          </div>
          {hasChanges && (
            <div className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Unsaved changes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
