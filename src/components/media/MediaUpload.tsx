'use client';

import { useState, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getMediaUploadUrl } from '@/graphql/mutations';

const client = generateClient();
import { useAuth } from '@/contexts/AuthContext';

interface MediaUploadProps {
  onMediaUploaded?: (fileUrl: string, fileName: string, contentType: string) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export default function MediaUpload({
  onMediaUploaded,
  accept = 'image/*,video/*',
  multiple = true,
  maxFiles = 10,
  className = ''
}: MediaUploadProps) {
  const { user } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log(`Starting upload for: ${file.name} (${file.type}, ${file.size} bytes)`);

      // Get upload URL from GraphQL
      const response = await client.graphql({
        query: getMediaUploadUrl,
        variables: {
          userId: user.userId,
          fileName: file.name,
          contentType: file.type
        }
      });

      console.log('GraphQL upload response:', response);

      // Check for GraphQL errors
      if ((response as any).errors && (response as any).errors.length > 0) {
        const errorMessage = (response as any).errors[0].message;
        throw new Error(`GraphQL error: ${errorMessage}`);
      }

      const uploadData = (response as any).data?.getMediaUploadUrl;
      if (!uploadData) {
        throw new Error('No upload data received from GraphQL');
      }

      console.log('Upload data received:', uploadData);

      // Upload file to S3 using the presigned URL
      const uploadResponse = await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log('S3 upload response status:', uploadResponse.status);

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('S3 upload error response:', errorText);
        throw new Error(`S3 upload failed (${uploadResponse.status}): ${errorText}`);
      }

      console.log(`Successfully uploaded: ${file.name}`);
      onMediaUploaded?.(uploadData.fileUrl, file.name, file.type);
      return { success: true, url: uploadData.fileUrl };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    if (!user) {
      alert('Please sign in to upload files.');
      return;
    }

    const fileArray = Array.from(files).slice(0, maxFiles);
    
    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files one by one
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      try {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('File is too large (max 10MB)');
        }

        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { ...uf, progress: 50 } 
              : uf
          )
        );

        const result = await uploadFile(file);
        
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { 
                  ...uf, 
                  progress: 100, 
                  status: 'success',
                  url: result.url 
                } 
              : uf
          )
        );
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        setUploadingFiles(prev => 
          prev.map(uf => 
            uf.file === file 
              ? { 
                  ...uf, 
                  progress: 100, 
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed'
                } 
              : uf
          )
        );
      }
    }

    // Clear completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(uf => uf.status === 'uploading'));
    }, 5000);
  }, [maxFiles, onMediaUploaded, user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Drop Zone */}
      {!user ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors">
            Please sign in to upload files
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
            You need to be authenticated to upload media
          </p>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-2 transition-colors">
            Drag and drop files here, or{' '}
            <label className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer font-medium transition-colors">
              browse
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Supports images and videos • Max {maxFiles} files • Max 10MB per file
          </p>
        </div>
      )}

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Uploading Files</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate transition-colors">
                  {uploadingFile.file.name}
                </span>
                <div className="flex items-center space-x-2">
                  {uploadingFile.status === 'uploading' && (
                    <svg className="animate-spin w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {uploadingFile.status === 'success' && (
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {uploadingFile.status === 'error' && (
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                    {uploadingFile.status === 'error' ? 'Failed' : `${uploadingFile.progress}%`}
                  </span>
                </div>
              </div>
              
              {/* Error Message */}
              {uploadingFile.status === 'error' && uploadingFile.error && (
                <div className="mb-2">
                  <p className="text-xs text-red-600 dark:text-red-400">{uploadingFile.error}</p>
                </div>
              )}
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 transition-colors">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    uploadingFile.status === 'success' 
                      ? 'bg-green-600 dark:bg-green-400' 
                      : uploadingFile.status === 'error'
                      ? 'bg-red-600 dark:bg-red-400'
                      : 'bg-blue-600 dark:bg-blue-400'
                  }`}
                  style={{ width: `${uploadingFile.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}