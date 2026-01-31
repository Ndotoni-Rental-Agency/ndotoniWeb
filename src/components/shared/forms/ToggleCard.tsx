interface ToggleCardProps {
  selected: boolean;
  onToggle: () => void;
  title: string;
  description: string;
  className?: string;
}

export function ToggleCard({ 
  selected, 
  onToggle, 
  title, 
  description, 
  className = "" 
}: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full p-6 border-2 rounded-2xl text-left transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 ${
        selected
          ? 'border-gray-500 bg-gray-50 dark:bg-gray-800 ring-4 ring-gray-200 dark:ring-gray-600'
          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      } ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          selected
            ? 'border-gray-500 bg-gray-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {selected && (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
        </div>
      </div>
    </button>
  );
}