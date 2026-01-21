'use client';

import { useState, useCallback } from 'react';
import { Button, Card, CardContent } from '@/components/ui';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { parseCSV, readFileAsText, BulkPropertyRow } from '@/lib/utils/csvParser';
import { GraphQLClient } from '@/lib/graphql-client';
import { importPropertiesFromCSV } from '@/graphql/mutations';
import { 
  ArrowUpTrayIcon, 
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
  message: string;
}

export default function BulkImportPropertiesPage() {
  const { notification, showSuccess, showError, closeNotification } = useNotification();
  
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<BulkPropertyRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
    
    if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
      showError('Invalid File Type', 'Please upload a CSV or Excel file (.csv, .xlsx, .xls)');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      showError('File Too Large', 'File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setImportResult(null);
    setValidationErrors([]);
    setParsedRows([]);

    try {
      // Read and parse CSV
      const csvContent = await readFileAsText(selectedFile);
      const result = parseCSV(csvContent);

      if (result.errors.length > 0) {
        setValidationErrors(result.errors);
        showError('Validation Errors', `Found ${result.errors.length} validation error(s). Please check the file format.`);
      } else {
        setParsedRows(result.rows);
        showSuccess('File Parsed', `Successfully parsed ${result.rows.length} property row(s).`);
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      showError('Parse Error', error instanceof Error ? error.message : 'Failed to parse file');
    }
  }, [showError, showSuccess]);

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

  const processImport = useCallback(async () => {
    if (parsedRows.length === 0) {
      showError('No Data', 'Please upload and parse a valid CSV file first');
      return;
    }

    if (validationErrors.length > 0) {
      showError('Validation Errors', 'Please fix validation errors before importing');
      return;
    }

    if (!file) {
      showError('No File', 'Please select a file to import');
      return;
    }

    setIsProcessing(true);
    setImportResult(null);

    try {
      // Read the CSV file content
      const csvContent = await readFileAsText(file);
      
      const result = await GraphQLClient.executeAuthenticated<{
        importPropertiesFromCSV: {
          success: boolean;
          imported: number;
          skipped: number;
          updated: number;
          errors: string[];
          message: string;
        };
      }>(importPropertiesFromCSV, {
        csvData: csvContent
      });

      const importData = result.importPropertiesFromCSV;
      
      setImportResult({
        success: importData.success,
        imported: importData.imported,
        skipped: importData.skipped,
        errors: importData.errors || [],
        message: importData.message
      });

      if (importData.success) {
        showSuccess(
          'Import Complete',
          `Successfully imported ${importData.imported} property/properties. ${importData.skipped} skipped.`
        );
      } else {
        showError('Import Failed', importData.message || 'Some properties failed to import');
      }
    } catch (error) {
      console.error('Error calling import mutation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to import properties';
      showError('Import Error', errorMessage);
      setImportResult({
        success: false,
        imported: 0,
        skipped: parsedRows.length,
        errors: [errorMessage],
        message: 'Import failed'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [parsedRows, validationErrors, file, showError, showSuccess]);

  const downloadTemplate = useCallback(() => {
    const rows = [
      ['propertyId', 'eventType', 'landlordEmail', 'managerId', 'title', 'description'],
      ['', 'CREATE', 'landlord@example.com', '', 'Luxury Ocean View Apartment', 'Stunning 3-bedroom apartment with panoramic ocean views in the prestigious Masaki Peninsula. Features modern amenities, spacious living areas, and premium finishes throughout.'],
      ['', 'CREATE', 'another.landlord@example.com', '', 'Modern Family House in Mikocheni', 'Spacious 4-bedroom house perfect for families. Located in the quiet residential area of Mikocheni with easy access to international schools and shopping centers.'],
      ['', 'CREATE', 'landlord@example.com', '', 'Cozy Studio in Upanga', 'Perfect studio apartment for young professionals. Located in the heart of Upanga with easy access to the city center and public transportation.']
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
                CSV or Excel files up to 5MB
              </p>
            </label>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setParsedRows([]);
                    setValidationErrors([]);
                    setImportResult(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Validation Errors ({validationErrors.length})
              </h3>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {validationErrors.map((error, index) => (
                <p key={index} className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsed Rows Preview */}
      {parsedRows.length > 0 && validationErrors.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Preview ({parsedRows.length} properties)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {parsedRows.slice(0, 10).map((row, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white">{row.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Landlord: {row.landlordEmail}
                  </p>
                </div>
              ))}
              {parsedRows.length > 10 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  ... and {parsedRows.length - 10} more
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Button */}
      {parsedRows.length > 0 && validationErrors.length === 0 && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            onClick={processImport}
            disabled={isProcessing}
            className="min-w-[150px]"
          >
            {isProcessing ? 'Importing...' : `Import ${parsedRows.length} Properties`}
          </Button>
        </div>
      )}

      {/* Import Results */}
      {importResult && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {importResult.success ? (
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
              ) : (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Import Results
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Imported:</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {importResult.imported}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Skipped:</span>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  {importResult.skipped}
                </span>
              </div>
              {importResult.errors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Errors ({importResult.errors.length}):
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {importResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {importResult.message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {importResult.message}
                </p>
              )}
            </div>
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
