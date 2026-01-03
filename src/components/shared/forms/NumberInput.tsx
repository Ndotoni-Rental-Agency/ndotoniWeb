import { useState, useEffect } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
}

export function NumberInput({ 
  value, 
  onChange, 
  label, 
  description, 
  placeholder, 
  min = 0,
  max,
  required = false 
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  // Sync display value with prop value
  useEffect(() => {
    if (value === 0 || (min !== undefined && value === min && min === 0)) {
      setDisplayValue('');
    } else {
      setDisplayValue(value.toString());
    }
  }, [value, min]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    
    // Convert to number, but allow empty string to represent the minimum value
    let numericValue = inputValue === '' ? (min || 0) : parseInt(inputValue);
    
    // Apply constraints
    if (isNaN(numericValue)) {
      numericValue = min || 0;
    }
    if (min !== undefined && numericValue < min) {
      numericValue = min;
    }
    if (max !== undefined && numericValue > max) {
      numericValue = max;
    }
    
    onChange(numericValue);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step="1"
        value={displayValue}
        onChange={handleChange}
        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
        placeholder={placeholder}
        required={required}
      />
      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}