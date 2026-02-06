interface CounterProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
  description?: string;
}

export function Counter({ 
  value, 
  min = 0, 
  max = Infinity, 
  onChange, 
  label, 
  description 
}: CounterProps) {
  const handleDecrement = () => onChange(Math.max(min, value - 1));
  const handleIncrement = () => onChange(Math.min(max, value + 1));

  return (
    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-colors w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 min-w-0">
          {label && (
            <div className="text-base font-semibold text-gray-900 dark:text-white break-words">
              {label}
            </div>
          )}
          {description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 break-words">
              {description}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-900/20 text-gray-900 dark:text-emerald-400 flex items-center justify-center hover:border-gray-300 dark:hover:border-emerald-700 hover:bg-gray-100 dark:hover:bg-emerald-900/30 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-lg font-semibold w-6 text-center text-gray-900 dark:text-white">
            {value}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-emerald-900/20 text-gray-900 dark:text-emerald-400 flex items-center justify-center hover:border-gray-300 dark:hover:border-emerald-700 hover:bg-gray-100 dark:hover:bg-emerald-900/30 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
