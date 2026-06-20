'use client';

import React, { useState, useEffect } from 'react';
import { PropertyData } from './types';

export interface EditSectionProps {
  title: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  onSave: (updates: Partial<PropertyData>) => Promise<void>;
  fields: (keyof PropertyData)[];
  property: PropertyData;
  children: (form: PropertyData, set: (field: keyof PropertyData, value: any) => void) => React.ReactNode;
}

export function EditSection({ title, icon, expanded, onToggle, onSave, fields, property, children }: EditSectionProps) {
  const [form, setForm] = useState<PropertyData>({ ...property });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setForm({ ...property }); }, [property]);

  const hasChanges = fields.some((f) => JSON.stringify(form[f]) !== JSON.stringify(property[f]));

  const set = (field: keyof PropertyData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updates: Partial<PropertyData> = {};
      fields.forEach((f) => { (updates as any)[f] = form[f]; });
      await onSave(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...property });
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
          {hasChanges && !expanded && (
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="Unsaved changes" />
          )}
          {saved && <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Saved</span>}
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <>
          <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700">
            <div className="pt-4">{children(form, set)}</div>
          </div>

          {error && (
            <div className="mx-5 mb-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{error}</div>
          )}

          <div className="flex gap-3 px-5 pb-5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!hasChanges || saving}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
