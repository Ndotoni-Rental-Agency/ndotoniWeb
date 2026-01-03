'use client';

import { useState, useEffect } from 'react';
import { client } from '@/lib/graphql';

interface MediaItem {
  mediaId: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  uploadedAt: string;
  tags?: string[];
}

export default function MediaLibrary() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');

  useEffect(() => {
    fetchMediaLibrary();
  }, []);

  const fetchMediaLibrary = async () => {
    try {
      // Mock data for now - replace with actual GraphQL query
      const mockMedia: MediaItem[] = [
        {
          mediaId: '1',
          fileName: 'apartment-living-room.jpg',
          fileUrl: '/api/placeholder/400/300',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-15T10:30:00Z',
          tags: ['apartment', 'living-room', 'masaki']
        },
        {
          mediaId: '2',
          fileName: 'house-exterior.jpg',
          fileUrl: '/api/placeholder/400/300',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-14T15:20:00Z',
          tags: ['house', 'exterior', 'mikocheni']
        },
        {
          mediaId: '3',
          fileName: 'studio-kitchen.jpg',
          fileUrl: '/api/placeholder/400/300',
          contentType: 'image/jpeg',
          uploadedAt: '2024-01-13T09:45:00Z',
          tags: ['studio', 'kitchen', 'upanga']
        },
        {
          mediaId: '4',
          fileName: 'property-tour.mp4',
          fileUrl: '/api/placeholder/video',
          contentType: 'video/mp4',
          uploadedAt: '2024-01-12T14:15:00Z',
          tags: ['tour', 'video', 'apartment']
        }
      ];
      
      setMediaItems(mockMedia);
    } catch (error) {
      console.error('Error fetching media library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // TODO: Implement actual file upload using GraphQL mutation
        console.log('Uploading file:', file.name);
        
        // Mock upload - replace with actual implementation
        const newMediaItem: MediaItem = {
          mediaId: Date.now().toString(),
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          contentType: file.type,
          uploadedAt: new Date().toISOString(),
          tags: []
        };
        
        setMediaItems(prev => [newMediaItem, ...prev]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const toggleItemSelection = (mediaId: string) => {
    setSelectedItems(prev => 
      prev.includes(mediaId)
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  const deleteSelectedItems = () => {
    if (confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
      setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.mediaId)));
      setSelectedItems([]);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'images') return item.contentType.startsWith('image/');
    if (filter === 'videos') return item.contentType.startsWith('video/');
    return true;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Photo library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your property photos and videos</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedItems.length > 0 && (
            <button
              onClick={deleteSelectedItems}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete ({selectedItems.length})</span>
            </button>
          )}
          
          {/* <label className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload photos</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label> */}
        </div>
      </div>

      {/* Filters and View Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'images' | 'videos')}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Media</option>
                <option value="images">Images Only</option>
                <option value="videos">Videos Only</option>
              </select>
            </div>
            
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
      >
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop files here, or click to select</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Supports images and videos</p>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.mediaId}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                selectedItems.includes(item.mediaId)
                  ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => toggleItemSelection(item.mediaId)}
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {item.contentType.startsWith('image/') ? (
                  <img
                    src={item.fileUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs">Video</span>
                  </div>
                )}
              </div>
              
              {/* Selection Checkbox */}
              <div className="absolute top-2 left-2">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedItems.includes(item.mediaId)
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-0 group-hover:opacity-100'
                } transition-opacity`}>
                  {selectedItems.includes(item.mediaId) && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* File Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs truncate">{item.fileName}</p>
                <p className="text-xs text-gray-300">{formatDate(item.uploadedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredItems.map(item => item.mediaId));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.mediaId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.mediaId)}
                      onChange={() => toggleItemSelection(item.mediaId)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center mr-3">
                        {item.contentType.startsWith('image/') ? (
                          <img
                            src={item.fileUrl}
                            alt={item.fileName}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.fileName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.contentType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {item.tags?.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No media files found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Upload photos and videos to get started</p>
        </div>
      )}
    </div>
  );
}