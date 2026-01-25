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
  const formatter = new Intl.NumberFormat('en-US');

  useEffect(() => {
    if (!value || value === min) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatter.format(value));
    }
  }, [value, min]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === '') {
      setDisplayValue('');
      onChange(min);
      return;
    }

    const numericValue = parseInt(rawValue.replace(/,/g, ''), 10);

    if (isNaN(numericValue)) return;

    let constrained = numericValue;
    if (numericValue < min) constrained = min;
    if (max !== undefined && numericValue > max) constrained = max;

    setDisplayValue(formatter.format(constrained));
    onChange(constrained);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
      />

      {description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
    </div>
  );
}
