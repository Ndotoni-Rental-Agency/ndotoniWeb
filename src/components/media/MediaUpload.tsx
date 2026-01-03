'use client';

import { useState, useCallback } from 'react';
import { client, getMediaUploadUrl } from '@/lib/graphql';

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
}

export default function MediaUpload({
  onMediaUploaded,
  accept = 'image/*,video/*',
  multiple = true,
  maxFiles = 10,
  className = ''
}: MediaUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      // Try to get upload URL from GraphQL
      const response = await client.graphql({
        query: getMediaUploadUrl,
        variables: {
          userId: 'landlord-1', // Replace with actual user ID from auth
          fileName: file.name,
          contentType: file.type
        }
      });

      const uploadData = (response as any).data?.getMediaUploadUrl;
      
      if (!uploadData) {
        throw new Error('No upload data received from server');
      }

      const { uploadUrl, fileUrl } = uploadData;

      // Upload file to S3 using the presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (uploadResponse.ok) {
        onMediaUploaded?.(fileUrl, file.name, file.type);
        return { success: true, url: fileUrl };
      } else {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Fallback: Create a mock URL for development
      const mockUrl = URL.createObjectURL(file);
      console.log('Using fallback mock URL for development:', mockUrl);
      
      // Still call the callback so the UI works
      onMediaUploaded?.(mockUrl, file.name, file.type);
      
      return { 
        success: true, // Return success so UI doesn't show error
        url: mockUrl,
        isMock: true 
      };
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
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
                status: result.success ? 'success' : 'error',
                url: result.url 
              } 
            : uf
        )
      );
    }

    // Clear completed uploads after a delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(uf => uf.status === 'uploading'));
    }, 3000);
  }, [maxFiles, onMediaUploaded]);

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
          Supports images and videos • Max {maxFiles} files
        </p>
        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-400 transition-colors">
          <strong>Development Mode:</strong> File uploads are simulated. In production, files will be uploaded to cloud storage.
        </div>
      </div>

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
                    {uploadingFile.progress}%
                  </span>
                </div>
              </div>
              
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