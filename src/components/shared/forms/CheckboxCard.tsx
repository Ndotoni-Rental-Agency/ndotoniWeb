interface CheckboxCardProps {
  selected: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}

export function CheckboxCard({ 
  selected, 
  onToggle, 
  label, 
  className = "" 
}: CheckboxCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-4 border-2 rounded-xl text-left transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 ${
        selected
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 ring-2 ring-red-100 dark:ring-red-800'
          : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      } ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
          selected
            ? 'border-red-500 bg-red-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
      </div>
    </button>
  );
}