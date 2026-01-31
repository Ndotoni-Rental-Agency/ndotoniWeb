'use client';

import React from 'react';
import PhoneInputComponent from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  label?: string | React.ReactNode;
  helperText?: string;
  error?: string;
}

export function PhoneInput({
  value,
  onChange,
  placeholder = "Enter phone number",
  disabled = false,
  required = false,
  className = "",
  label,
  helperText,
  error,
}: PhoneInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <PhoneInputComponent
          international
          defaultCountry="TZ" // Default to Tanzania
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`phone-input ${className} ${error ? 'phone-input-error' : ''}`}
        />
      </div>
      
      {helperText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
      
      <style jsx global>{`
        .phone-input .PhoneInputInput {
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          background-color: white;
          color: rgb(17 24 39);
          font-size: 1rem;
          transition: all 0.2s;
        }
        
        .phone-input .PhoneInputInput:focus {
          outline: none;
          border-color: rgb(239 68 68);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
        
        .phone-input .PhoneInputInput:disabled {
          background-color: rgb(249 250 251);
          color: rgb(107 114 128);
          cursor: not-allowed;
        }
        
        .phone-input-error .PhoneInputInput {
          border-color: rgb(239 68 68);
        }
        
        .phone-input .PhoneInputCountrySelect {
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem 0 0 0.5rem;
          border-right: none;
          padding: 0.75rem 0.5rem;
          background-color: white;
          color: rgb(17 24 39);
          font-size: 1rem;
        }
        
        .phone-input .PhoneInputCountrySelect:focus {
          outline: none;
          border-color: rgb(239 68 68);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
        
        .phone-input .PhoneInputInput {
          border-radius: 0 0.5rem 0.5rem 0;
          border-left: none;
        }
        
        /* Dark mode styles */
        .dark .phone-input .PhoneInputInput {
          border-color: rgb(75 85 99);
          background-color: rgb(55 65 81);
          color: white;
        }
        
        .dark .phone-input .PhoneInputInput:focus {
          border-color: rgb(239 68 68);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
        
        .dark .phone-input .PhoneInputInput:disabled {
          background-color: rgb(31 41 55);
          color: rgb(156 163 175);
        }
        
        .dark .phone-input .PhoneInputCountrySelect {
          border-color: rgb(75 85 99);
          background-color: rgb(55 65 81);
          color: white;
        }
        
        .dark .phone-input .PhoneInputCountrySelect:focus {
          border-color: rgb(239 68 68);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
        }
        
        .dark .phone-input-error .PhoneInputInput {
          border-color: rgb(239 68 68);
        }
      `}</style>
    </div>
  );
}