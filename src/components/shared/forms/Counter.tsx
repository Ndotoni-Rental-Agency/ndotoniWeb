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
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + 1));
  };

  return (
    <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl transition-colors">
      <div className="flex items-center justify-between">
        <div>
          {label && <div className="text-lg font-semibold text-gray-900 dark:text-white">{label}</div>}
          {description && <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>}
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className="w-12 h-12 rounded-full border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-xl font-semibold w-8 text-center text-gray-900 dark:text-white">{value}</span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className="w-12 h-12 rounded-full border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:border-red-300 dark:hover:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-95 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}