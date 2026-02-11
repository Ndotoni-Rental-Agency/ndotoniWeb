'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/common';
import { NotificationModal } from '@/components/ui/NotificationModal';

interface EditableSectionProps {
  title: string;
  isEditMode: boolean;
  onSave: () => Promise<void>;
  children: React.ReactNode;
  editContent: React.ReactNode;
  className?: string;
}

export function EditableSection({
  title,
  isEditMode,
  onSave,
  children,
  editContent,
  className,
}: EditableSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setShowSuccess(true);
      setShowModal(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className={cn('bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm', className)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </div>
          )}
        </div>
        
        {isEditMode ? (
          <div className="space-y-4">
            {editContent}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <SaveButton onClick={handleSave} isSaving={isSaving} />
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {/* Success Notification Modal */}
      <NotificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Changes Saved"
        message={`Your ${title.toLowerCase()} have been successfully updated.`}
        type="success"
      />
    </>
  );
}

interface EditableTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

export function EditableTextField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
}: EditableTextFieldProps) {
  const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={inputClasses}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClasses}
        />
      )}
    </div>
  );
}

interface EditableNumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

export function EditableNumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: EditableNumberFieldProps) {
  // Format number with commas for display
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // Parse formatted string back to number
  const parseNumber = (str: string) => {
    return Number(str.replace(/,/g, ''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (rawValue === '' || !isNaN(Number(rawValue))) {
      onChange(rawValue === '' ? 0 : Number(rawValue));
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={formatNumber(value)}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all",
            suffix && "pr-16"
          )}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface SaveButtonProps {
  onClick: () => void;
  isSaving: boolean;
  disabled?: boolean;
}

export function SaveButton({ onClick, isSaving, disabled }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isSaving || disabled}
      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
    >
      {isSaving ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </>
      )}
    </button>
  );
}
