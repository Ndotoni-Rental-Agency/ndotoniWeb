'use client';

import { useState, useCallback } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { useAdminDataUpload } from '@/hooks/useAdminDataUpload';
import { DataType } from '@/API';
import {
  ArrowUpTrayIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

interface UploadResult {
  success: boolean;
  fileKey: string;
  message: string;
}

export default function BulkImportPropertiesPage() {
  const { notification, showSuccess, showError, closeNotification } = useNotification();
  const { generateUploadUrl, uploadFile, isLoading, error } = useAdminDataUpload();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((selectedFile: File) => {
    // Validate file type (only CSV for now)
    const validTypes = ['text/csv'];
    const validExtensions = ['.csv'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));

    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
      showError('Invalid File Type', 'Please upload a CSV file (.csv)');
      return;
    }

    // Validate file size (max 10MB for bulk operations)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showError('File Too Large', 'File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  }, [showError]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processUpload = useCallback(async () => {
    if (!file) {
      showError('No File', 'Please select a CSV file to upload');
      return;
    }

    setIsProcessing(true);
    setUploadResult(null);

    try {
      // Generate presigned URL for properties
      const { uploadUrl, fileKey } = await generateUploadUrl(DataType.PROPERTIES, file.name);

      // Upload file directly to S3
      await uploadFile(uploadUrl, file);

      setUploadResult({
        success: true,
        fileKey,
        message: 'File uploaded successfully. Properties will be processed by batch jobs within a few minutes.'
      });

      showSuccess(
        'Upload Successful',
        'Your CSV file has been uploaded and will be processed automatically. You will receive a notification when processing is complete.'
      );

      // Reset file selection
      setFile(null);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setUploadResult({
        success: false,
        fileKey: '',
        message: errorMessage
      });
      showError('Upload Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [file, generateUploadUrl, uploadFile, showSuccess, showError]);

  const downloadTemplate = useCallback(() => {
    const rows = [
      ['propertyId', 'eventType', 'landlordEmail', 'landlordId', 'managerId', 'title', 'description'],
      ['', 'CREATE', 'landlord@example.com', '', '', 'Luxury Ocean View Apartment', 'Stunning 3-bedroom apartment with panoramic ocean views in the prestigious Masaki Peninsula. Features modern amenities, spacious living areas, and premium finishes throughout.'],
      ['', 'CREATE', 'another.landlord@example.com', '', '', 'Modern Family House in Mikocheni', 'Spacious 4-bedroom house perfect for families. Located in the quiet residential area of Mikocheni with easy access to international schools and shopping centers.'],
      ['', 'CREATE', 'landlord@example.com', '', '', 'Cozy Studio in Upanga', 'Perfect studio apartment for young professionals. Located in the heart of Upanga with easy access to the city center and public transportation.']
    ];
    
    // Escape and quote fields that contain commas or quotes
    const escapeCSVField = (field: string): string => {
      if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
      }
      return field;
    };
    
    const csvContent = rows.map(row => 
      row.map(escapeCSVField).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-properties-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Import Properties</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload a CSV file to import multiple properties for landlords
          </p>
        </div>
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Download Template
        </Button>
      </div>

      {/* File Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragOver 
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
          >
            <input
              type="file"
              id="file-upload"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {file ? file.name : 'Drag and drop your CSV file here, or click to browse'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
            CSV files up to 10MB
          </p>
            </label>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Button */}
      {file && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={processUpload}
            disabled={isProcessing || isLoading}
            className="min-w-[150px]"
          >
            {isProcessing ? (
              <>
                <ClockIcon className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : isLoading ? (
              'Generating URL...'
            ) : (
              'Upload & Process'
            )}
          </Button>
        </div>
      )}

      {/* Upload Results */}
      {uploadResult && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {uploadResult.success ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Result
              </h3>
            </div>
            <div className="space-y-2">
              {uploadResult.success ? (
                <>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ✅ File uploaded successfully to {uploadResult.fileKey}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🔄 Properties will be processed automatically by batch jobs. Processing may take a few minutes.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    📧 You will receive a notification when processing is complete.
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  ❌ {uploadResult.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Error
              </h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
