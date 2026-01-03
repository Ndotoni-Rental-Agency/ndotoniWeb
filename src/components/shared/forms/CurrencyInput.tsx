import { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  placeholder?: string;
  currency?: string;
  required?: boolean;
}

export function CurrencyInput({ 
  value, 
  onChange, 
  label, 
  description, 
  placeholder, 
  currency = 'TZS',
  required = false 
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  // Sync display value with prop value
  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Convert to number, but allow empty string to represent 0
    const numericValue = inputValue === '' ? 0 : parseInt(inputValue) || 0;
    onChange(numericValue);
  };

  return (
    <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200">
      <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg font-medium">
          {currency}
        </span>
        <input
          type="number"
          min="0"
          step="1"
          value={displayValue}
          onChange={handleChange}
          className="w-full pl-16 pr-4 py-4 text-xl font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={placeholder}
          required={required}
        />
      </div>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}