'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { CompactSearchInput } from '@/components/admin/CompactSearchInput';
import { TemplateEditor } from '@/components/admin/communication/TemplateEditor';
import { useCommunicationAdmin } from '@/hooks/useCommunicationAdmin';
import {
  createEmptyTemplate,
  templateToInput,
  type CommunicationTemplate,
  type UpsertCommunicationTemplateInput,
} from '@/types/communication-admin';
import { cn } from '@/lib/utils/common';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-TZ', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function CommunicationTemplatesPage() {
  const {
    templates,
    templatesLoading,
    templatesError,
    savingTemplate,
    loadTemplates,
    saveTemplate,
  } = useCommunicationAdmin();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<UpsertCommunicationTemplateInput>(createEmptyTemplate());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter(
      (t) =>
        t.key.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [templates, search]);

  const selected = templates.find((t) => t.templateId === selectedId) ?? null;

  const selectTemplate = useCallback((template: CommunicationTemplate) => {
    setIsCreating(false);
    setSelectedId(template.templateId);
    setDraft(templateToInput(template));
    setSaveMessage(null);
  }, []);

  const startCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setDraft(createEmptyTemplate());
    setSaveMessage(null);
  };

  const handleSave = async () => {
    setSaveMessage(null);
    const saved = await saveTemplate(draft);
    if (saved) {
      setIsCreating(false);
      setSelectedId(saved.templateId);
      setDraft(templateToInput(saved));
      setSaveMessage('Template saved.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Communication Templates
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage email, push, and in-app message templates used by the communication worker.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadTemplates()}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <PlusIcon className="h-4 w-4" />
            New template
          </button>
        </div>
      </div>

      {(templatesError || saveMessage) && (
        <div
          className={cn(
            'rounded-xl px-4 py-3 text-sm',
            templatesError
              ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
              : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
          )}
        >
          {templatesError ?? saveMessage}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr] min-h-[560px]">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <CompactSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search templates…"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {templatesLoading && templates.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">Loading templates…</p>
            ) : filtered.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No templates found.</p>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((template) => {
                  const active = selectedId === template.templateId && !isCreating;
                  return (
                    <li key={template.templateId}>
                      <button
                        type="button"
                        onClick={() => selectTemplate(template)}
                        className={cn(
                          'w-full text-left px-4 py-3 transition-colors',
                          active
                            ? 'bg-brand-50 dark:bg-brand-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {template.name}
                            </p>
                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">
                              {template.key}
                            </p>
                          </div>
                          <span
                            className={cn(
                              'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                              template.isActive
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            )}
                          >
                            {template.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {template.channels.map((ch) => (
                            <span
                              key={ch}
                              className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] text-gray-600 dark:text-gray-300"
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2">
                          Updated {formatDate(template.updatedAt)}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 overflow-y-auto">
          {isCreating || selected ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {isCreating ? 'New template' : `Edit: ${selected?.name}`}
              </h2>
              <TemplateEditor
                value={draft}
                onChange={setDraft}
                onSave={handleSave}
                onCancel={
                  isCreating
                    ? () => {
                        setIsCreating(false);
                        setDraft(createEmptyTemplate());
                      }
                    : selected
                      ? () => setDraft(templateToInput(selected))
                      : undefined
                }
                saving={savingTemplate}
                isNew={isCreating}
              />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-16">
              <MagnifyingGlassIcon className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">Select a template to edit or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
