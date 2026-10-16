'use client';

import { useRef, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { GroupImportsApi } from '@/lib/admin/groupImports';

interface Props {
  /** Import into this group (the group page); otherwise the group is read from the export */
  groupName?: string;
  variant?: 'primary' | 'secondary';
  onUploaded: (message: string) => void;
  onError: (message: string) => void;
}

/** Choose a WhatsApp chat export (.zip or .txt, "Without media") and start importing it */
export function UploadExportButton({ groupName, variant = 'primary', onUploaded, onError }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      await GroupImportsApi.upload(file, groupName);
      onUploaded(`${file.name} is being read. New adverts and requests show up here in a minute or two.`);
    } catch (err) {
      onError(GroupImportsApi.errorText(err, 'The upload didn’t go through. Try again.'));
    } finally {
      setUploading(false);
      if (input.current) input.current.value = '';
    }
  }

  const style = variant === 'primary'
    ? 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500'
    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 focus-visible:ring-gray-400';

  return (
    <>
      <input ref={input} type="file" accept=".zip,.txt" hidden onChange={(e) => upload(e.target.files?.[0])} />
      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 ${style}`}
      >
        <ArrowUpTrayIcon className="h-4 w-4" aria-hidden />
        {uploading ? 'Uploading…' : 'Upload export'}
      </button>
    </>
  );
}
