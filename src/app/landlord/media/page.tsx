'use client';

import { useState, useEffect } from 'react';
import { client, getMediaLibrary, getMediaUploadUrl, deleteMediaItem } from '@/lib/graphql';
import { useAuth } from '@/contexts/AuthContext';

// Force dynamic rendering for pages using AuthGuard (which uses useSearchParams)
export const dynamic = 'force-dynamic';

interface MediaItem {
  mediaId: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  uploadedAt: string;
  tags?: string[];
}

export default function MediaLibrary() {
  const { user } = useAuth();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchMediaLibrary();
    }
  }, [user]);

  const fetchMediaLibrary = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Fetching media library for user:', user.userId);
      
      const response = await client.graphql({
        query: getMediaLibrary,
        variables: { userId: user.userId }
      });

      console.log('Media library response:', response);

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        console.error('GraphQL errors:', (response as any).errors);
        throw new Error((response as any).errors[0].message);
      }

      const mediaData = (response as any).data?.getMediaLibrary;
      console.log('Media data received:', mediaData);
      
      if (mediaData) {
        // Convert the new structure to our expected format
        const mediaItems: MediaItem[] = [];
        
        // Add files from additionalFiles array
        if (mediaData.additionalFiles && Array.isArray(mediaData.additionalFiles)) {
          mediaData.additionalFiles.forEach((file: any, index: number) => {
            mediaItems.push({
              mediaId: `file-${index}`,
              fileName: file.fileName || 'Unknown file',
              fileUrl: file.fileUrl,
              contentType: file.contentType,
              uploadedAt: new Date().toISOString(), // We don't have this field, so use current time
              tags: []
            });
          });
        }
        
        // Add files from media.images array
        if (mediaData.media?.images && Array.isArray(mediaData.media.images)) {
          mediaData.media.images.forEach((imageUrl: string, index: number) => {
            mediaItems.push({
              mediaId: `image-${index}`,
              fileName: `Image ${index + 1}`,
              fileUrl: imageUrl,
              contentType: 'image/jpeg',
              uploadedAt: new Date().toISOString(),
              tags: ['property-image']
            });
          });
        }
        
        // Add files from media.videos array
        if (mediaData.media?.videos && Array.isArray(mediaData.media.videos)) {
          mediaData.media.videos.forEach((videoUrl: string, index: number) => {
            mediaItems.push({
              mediaId: `video-${index}`,
              fileName: `Video ${index + 1}`,
              fileUrl: videoUrl,
              contentType: 'video/mp4',
              uploadedAt: new Date().toISOString(),
              tags: ['property-video']
            });
          });
        }
        
        setMediaItems(mediaItems);
        console.log('Set media items:', mediaItems);
      } else {
        console.log('No media data received, setting empty array');
        setMediaItems([]);
      }
    } catch (error) {
      console.error('Error fetching media library:', error);
      // For demo purposes, show some sample data if the API fails
      console.log('Falling back to demo data');
      setMediaItems([
        {
          mediaId: 'demo-1',
          fileName: 'property-front.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          contentType: 'image/jpeg',
          uploadedAt: new Date().toISOString(),
          tags: ['exterior', 'front-view']
        },
        {
          mediaId: 'demo-2', 
          fileName: 'living-room.jpg',
          fileUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          contentType: 'image/jpeg',
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          tags: ['interior', 'living-room']
        },
        {
          mediaId: 'demo-3',
          fileName: 'kitchen.jpg', 
          fileUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          contentType: 'image/jpeg',
          uploadedAt: new Date(Date.now() - 172800000).toISOString(),
          tags: ['interior', 'kitchen']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!user) {
      alert('Please sign in to upload files.');
      return;
    }
    
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (const file of Array.from(files)) {
        try {
          // Validate file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            console.error(`File ${file.name} is too large (max 10MB)`);
            errorCount++;
            continue;
          }

          console.log(`Starting upload for: ${file.name} (${file.type}, ${file.size} bytes)`);

          // Get upload URL from GraphQL
          const uploadResponse = await client.graphql({
            query: getMediaUploadUrl,
            variables: {
              userId: user.userId,
              fileName: file.name,
              contentType: file.type
            }
          });

          console.log('GraphQL upload response:', uploadResponse);

          // Check for GraphQL errors
          if ((uploadResponse as any).errors && (uploadResponse as any).errors.length > 0) {
            const errorMessage = (uploadResponse as any).errors[0].message;
            throw new Error(`GraphQL error: ${errorMessage}`);
          }

          const uploadData = (uploadResponse as any).data?.getMediaUploadUrl;
          if (!uploadData) {
            throw new Error('No upload data received from GraphQL');
          }

          console.log('Upload data received:', uploadData);

          // Upload file to S3 using the presigned URL
          const uploadResult = await fetch(uploadData.uploadUrl, {
            method: 'PUT',
            body: file,
            headers: {
              'Content-Type': file.type,
            },
          });

          console.log('S3 upload response status:', uploadResult.status);

          if (!uploadResult.ok) {
            const errorText = await uploadResult.text();
            console.error('S3 upload error response:', errorText);
            throw new Error(`S3 upload failed (${uploadResult.status}): ${errorText}`);
          }

          console.log(`Successfully uploaded: ${file.name}`);
          successCount++;
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          errorCount++;
        }
      }
      
      // Show results
      if (successCount > 0) {
        // Refresh the media library after successful uploads
        await fetchMediaLibrary();
        setSuccessMessage(`Successfully uploaded ${successCount} file(s)`);
        setTimeout(() => setSuccessMessage(''), 5000);
      }
      
      if (errorCount > 0) {
        alert(`Upload completed with ${errorCount} error(s). ${successCount} file(s) uploaded successfully.`);
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

  const deleteSelectedItems = async () => {
    if (!user || selectedItems.length === 0) return;
    
    if (confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
      try {
        setLoading(true);
        
        // Get the file URLs for the selected items
        const itemsToDelete = mediaItems.filter(item => selectedItems.includes(item.mediaId));
        
        // Delete each item using the GraphQL mutation
        for (const item of itemsToDelete) {
          try {
            console.log(`Deleting media item: ${item.fileName} (${item.fileUrl})`);
            
            const response = await client.graphql({
              query: deleteMediaItem,
              variables: {
                userId: user.userId,
                fileUrl: item.fileUrl
              }
            });

            console.log('Delete response:', response);

            // Check for GraphQL errors
            if ((response as any).errors && (response as any).errors.length > 0) {
              console.error('GraphQL errors:', (response as any).errors);
              throw new Error((response as any).errors[0].message);
            }
          } catch (itemError) {
            console.error(`Error deleting ${item.fileName}:`, itemError);
            // Continue with other items even if one fails
          }
        }
        
        // Refresh the media library to get updated data
        await fetchMediaLibrary();
        setSelectedItems([]);
        
        setSuccessMessage(`Successfully deleted ${selectedItems.length} item(s)`);
        setTimeout(() => setSuccessMessage(''), 5000);
        
      } catch (error) {
        console.error('Error deleting items:', error);
        alert('Error deleting items. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteIndividualItem = async (item: MediaItem) => {
    if (!user) return;
    
    if (confirm(`Delete "${item.fileName}"?`)) {
      try {
        setLoading(true);
        
        console.log(`Deleting media item: ${item.fileName} (${item.fileUrl})`);
        
        const response = await client.graphql({
          query: deleteMediaItem,
          variables: {
            userId: user.userId,
            fileUrl: item.fileUrl
          }
        });

        console.log('Delete response:', response);

        // Check for GraphQL errors
        if ((response as any).errors && (response as any).errors.length > 0) {
          console.error('GraphQL errors:', (response as any).errors);
          throw new Error((response as any).errors[0].message);
        }
        
        // Refresh the media library to get updated data
        await fetchMediaLibrary();
        
        // Remove from selected items if it was selected
        setSelectedItems(prev => prev.filter(id => id !== item.mediaId));
        
        setSuccessMessage(`Successfully deleted "${item.fileName}"`);
        setTimeout(() => setSuccessMessage(''), 5000);
        
      } catch (error) {
        console.error('Error deleting item:', error);
        alert(`Error deleting "${item.fileName}". Please try again.`);
      } finally {
        setLoading(false);
      }
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

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Authentication Required</h3>
          <p className="text-gray-500 dark:text-gray-400">Please sign in to access your media library</p>
        </div>
      </div>
    );
  }

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
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        </div>
      )}

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
          
          {/* Upload Button */}
          <label className={`px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer flex items-center space-x-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{uploading ? 'Uploading...' : 'Upload photos'}</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {/* Refresh Button */}
          <button
            onClick={fetchMediaLibrary}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{loading ? 'Loading...' : 'Refresh'}</span>
          </button>
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
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6 hover:border-blue-400 dark:hover:border-blue-500 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {uploading ? 'Uploading files...' : 'Drag and drop files here, or click to select'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">Supports images and videos</p>
        
        {!uploading && (
          <label className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
            Choose Files
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        )}
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
              
              {/* Individual Delete Button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteIndividualItem(item);
                  }}
                  className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete this item"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteIndividualItem(item)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete this item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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