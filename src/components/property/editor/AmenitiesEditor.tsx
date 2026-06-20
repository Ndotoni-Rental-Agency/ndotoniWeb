'use client';

import React, { useState, useRef } from 'react';
import { PRESET_AMENITIES } from './constants';

interface AmenitiesEditorProps {
  value: string[];
  onChange: (v: string[]) => void;
}

export function AmenitiesEditor({ value, onChange }: AmenitiesEditorProps) {
  const [custom, setCustom] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (a: string) =>
    onChange(value.includes(a) ? value.filter((x) => x !== a) : [...value, a]);

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustom('');
    inputRef.current?.focus();
  };

  const customAmenities = value.filter((a) => !PRESET_AMENITIES.includes(a));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESET_AMENITIES.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              value.includes(a)
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
            {a}
          </button>
        ))}
        {customAmenities.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className="px-3 py-1.5 rounded-full text-sm font-medium border bg-green-600 text-white border-green-600 flex items-center gap-1"
          >
            {a}
            <span className="text-green-200 text-xs">✕</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="input flex-1"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom amenity…"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="px-4 py-2 rounded-xl bg-gray-800 dark:bg-gray-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
