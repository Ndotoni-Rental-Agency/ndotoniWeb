import { useState, useEffect } from 'react';
import { formatNumberWithCommas, parseFormattedNumber } from '@/lib/utils/common';

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

  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatNumberWithCommas(value.toString()));
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFormattedNumber(e.target.value);
    if (rawValue !== '' && !/^\d+$/.test(rawValue)) return;

    setDisplayValue(formatNumberWithCommas(rawValue));
    onChange(rawValue === '' ? 0 : parseInt(rawValue, 10) || 0);
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
          type="text"
          inputMode="numeric"
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