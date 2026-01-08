interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function getInputClassName(hasError?: string): string {
  const baseClasses =
    'w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/50 focus:border-red-500 dark:focus:border-red-400 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white';
  const errorClasses = hasError
    ? 'border-red-500 dark:border-red-500'
    : 'border-gray-200 dark:border-gray-700';
  return `${baseClasses} ${errorClasses}`;
}


