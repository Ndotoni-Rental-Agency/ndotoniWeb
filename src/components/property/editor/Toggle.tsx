import React from 'react';

interface ToggleProps {
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, sub, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
