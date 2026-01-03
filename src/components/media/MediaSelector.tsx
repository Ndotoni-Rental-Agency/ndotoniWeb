'use client';

import { useState, useEffect } from 'react';
import { client, getMediaLibrary } from '@/lib/graphql';
import MediaUpload from './MediaUpload';

interface MediaItem {
  mediaId: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  uploadedAt: string;
  tags?: string[];
}

interface MediaSelectorProps {
  selectedMedia: string[];
  onMediaChange: (mediaUrls: string[]) => void;
  maxSelection?: number;
  className?: string;
}

export default function MediaSelector({
  selectedMedia,
  onMediaChange,
  maxSelection = 10,
  className = ''
}: MediaSelectorProps) {
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMediaLibrary();
  }, []);

  const fetchMediaLibrary = async () => {
    try {
      const response = await client.graphql({
        query: getMediaLibrary,
        variables: { userId: 'landlord-1' } // Replace with actual user ID
      });

      const items = (response as any).data?.getMediaLibrary || [];
      setMediaLibrary(items);
    } catch (error) {
      console.error('Error fetching media library:', error);
      // Mock data for development - each image needs a unique URL
      const mockMedia: MediaItem[] = [
        {
          mediaId: '1',
          fileName: 'apartment-living-room.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-15T10:30:00Z',
          tags: ['apartment', 'living-room', 'masaki']
        },
        {
          mediaId: '2',
          fileName: 'house-exterior.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-14T15:20:00Z',
          tags: ['house', 'exterior', 'mikocheni']
        },
        {
          mediaId: '3',
          fileName: 'studio-kitchen.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-13T09:45:00Z',
          tags: ['studio', 'kitchen', 'upanga']
        },
        {
          mediaId: '4',
          fileName: 'bedroom-view.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-12T14:15:00Z',
          tags: ['bedroom', 'view', 'apartment']
        },
        {
          mediaId: '5',
          fileName: 'bathroom-modern.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-11T09:20:00Z',
          tags: ['bathroom', 'modern', 'tiles']
        },
        {
          mediaId: '6',
          fileName: 'balcony-sunset.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-10T18:45:00Z',
          tags: ['balcony', 'sunset', 'view']
        }
      ];
      setMediaLibrary(mockMedia);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaToggle = (mediaUrl: string) => {
    const isSelected = selectedMedia.includes(mediaUrl);
    
    if (isSelected) {
      // Remove from selection
      onMediaChange(selectedMedia.filter(url => url !== mediaUrl));
    } else {
      // Add to selection if under limit
      if (selectedMedia.length < maxSelection) {
        onMediaChange([...selectedMedia, mediaUrl]);
      } else {
        alert(`You can select up to ${maxSelection} images`);
      }
    }
  };

  const handleNewMediaUploaded = (fileUrl: string, fileName: string, contentType: string) => {
    // Add new media to library
    const newMediaItem: MediaItem = {
      mediaId: Date.now().toString(),
      fileName,
      fileUrl,
      contentType,
      uploadedAt: new Date().toISOString(),
      tags: []
    };
    
    setMediaLibrary(prev => [newMediaItem, ...prev]);
    
    // Auto-select the newly uploaded media
    if (selectedMedia.length < maxSelection) {
      onMediaChange([...selectedMedia, fileUrl]);
    }
  };

  const filteredMedia = mediaLibrary.filter(item => {
    if (!searchTerm) return true;
    return (
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const imageMedia = filteredMedia.filter(item => item.contentType.startsWith('image/'));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Property Images</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
          {selectedMedia.length} / {maxSelection} selected
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 transition-colors">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('library')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'library'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Media Library ({imageMedia.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Upload New
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'library' ? (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search images by name or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
            />
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Media Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse transition-colors"></div>
              ))}
            </div>
          ) : imageMedia.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageMedia.map((item) => {
                const isSelected = selectedMedia.includes(item.fileUrl);
                return (
                  <div
                    key={item.mediaId}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleMediaToggle(item.fileUrl)}
                  >
                    <img
                      src={item.fileUrl}
                      alt={item.fileName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection Overlay */}
                    <div className={`absolute inset-0 bg-black transition-opacity ${
                      isSelected ? 'bg-opacity-30' : 'bg-opacity-0 hover:bg-opacity-20'
                    }`}>
                      {/* Selection Checkbox */}
                      <div className="absolute top-2 right-2">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {/* File Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 dark:bg-black dark:bg-opacity-85 text-white p-2">
                        <p className="text-xs truncate">{item.fileName}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs bg-blue-600 dark:bg-blue-500 px-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 mb-2 transition-colors">No images found</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors">
                {searchTerm ? 'Try adjusting your search' : 'Upload some images to get started'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <MediaUpload
            onMediaUploaded={handleNewMediaUploaded}
            accept="image/*"
            multiple={true}
            maxFiles={maxSelection - selectedMedia.length}
          />
          
          {selectedMedia.length >= maxSelection && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 transition-colors">
              <p className="text-sm text-yellow-800 dark:text-yellow-400 transition-colors">
                You've reached the maximum of {maxSelection} images. Remove some selections to upload more.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Selected Media Preview */}
      {selectedMedia.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">Selected Images ({selectedMedia.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedMedia.map((url) => {
              const mediaItem = mediaLibrary.find(item => item.fileUrl === url);
              return (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt={mediaItem?.fileName || 'Selected image'}
                    className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-700 transition-colors"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMediaToggle(url);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}