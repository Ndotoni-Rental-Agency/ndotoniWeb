'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/common';
import {
  COMMUNICATION_CHANNELS,
  TEMPLATE_CATEGORIES,
  type CommunicationChannel,
  type UpsertCommunicationTemplateInput,
} from '@/types/communication-admin';

interface TemplateEditorProps {
  value: UpsertCommunicationTemplateInput;
  onChange: (value: UpsertCommunicationTemplateInput) => void;
  onSave: () => void;
  onCancel?: () => void;
  saving?: boolean;
  isNew?: boolean;
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-stone-200 dark:border-gray-600',
          'bg-white dark:bg-gray-800 text-sm text-ink-900 dark:text-white',
          'px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500'
        )}
      />
    </div>
  );
}

export function TemplateEditor({
  value,
  onChange,
  onSave,
  onCancel,
  saving = false,
  isNew = false,
}: TemplateEditorProps) {
  const [variablesText, setVariablesText] = useState('');

  useEffect(() => {
    setVariablesText((value.variables ?? []).join(', '));
  }, [value.templateId, value.key, value.variables]);

  const toggleChannel = (channel: CommunicationChannel) => {
    const has = value.channels.includes(channel);
    onChange({
      ...value,
      channels: has
        ? value.channels.filter((c) => c !== channel)
        : [...value.channels, channel],
    });
  };

  const handleVariablesBlur = () => {
    const parsed = variablesText
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    onChange({ ...value, variables: parsed });
  };

  const showEmail = value.channels.includes('EMAIL');
  const showPush = value.channels.includes('PUSH');
  const showInApp = value.channels.includes('IN_APP');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Template key"
          value={value.key}
          onChange={(e) => onChange({ ...value, key: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
          placeholder="WELCOME"
          disabled={!isNew && !!value.templateId}
        />
        <Input
          label="Display name"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="Welcome to Ndotoni"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={value.category}
            onChange={(e) =>
              onChange({
                ...value,
                category: e.target.value as UpsertCommunicationTemplateInput['category'],
              })
            }
            className="w-full h-10 rounded-xl border border-stone-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 text-sm"
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={value.isActive !== false}
              onChange={(e) => onChange({ ...value, isActive: e.target.checked })}
              className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            Active (used by dispatcher)
          </label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Channels</p>
        <div className="flex flex-wrap gap-2">
          {COMMUNICATION_CHANNELS.map((channel) => {
            const selected = value.channels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium border transition-colors',
                  selected
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                )}
              >
                {channel}
              </button>
            );
          })}
        </div>
      </div>

      <Input
        label="Variables (comma-separated hints for admins)"
        value={variablesText}
        onChange={(e) => setVariablesText(e.target.value)}
        onBlur={handleVariablesBlur}
        placeholder="user.name, user.firstName, property.title"
      />

      {(showEmail || showPush || showInApp) && (
        <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Channel content</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Use {'{{user.firstName}}'}, {'{{user.name}}'}, {'{{property.title}}'} etc.
          </p>

          {showEmail && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
              <Input
                label="Subject"
                value={value.emailSubject ?? ''}
                onChange={(e) => onChange({ ...value, emailSubject: e.target.value })}
              />
              <TextArea
                label="Body"
                value={value.emailBody ?? ''}
                onChange={(v) => onChange({ ...value, emailBody: v })}
                rows={6}
              />
            </div>
          )}

          {showPush && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Push</p>
              <Input
                label="Title"
                value={value.pushTitle ?? ''}
                onChange={(e) => onChange({ ...value, pushTitle: e.target.value })}
              />
              <TextArea
                label="Body"
                value={value.pushBody ?? ''}
                onChange={(v) => onChange({ ...value, pushBody: v })}
                rows={3}
              />
            </div>
          )}

          {showInApp && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">In-app</p>
              <Input
                label="Title"
                value={value.inAppTitle ?? ''}
                onChange={(e) => onChange({ ...value, inAppTitle: e.target.value })}
              />
              <TextArea
                label="Body"
                value={value.inAppBody ?? ''}
                onChange={(v) => onChange({ ...value, inAppBody: v })}
                rows={3}
              />
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button onClick={onSave} disabled={saving || !value.key.trim() || !value.name.trim()}>
          {saving ? 'Saving…' : isNew ? 'Create template' : 'Save changes'}
        </Button>
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
