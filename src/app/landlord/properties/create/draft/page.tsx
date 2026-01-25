'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreatePropertyDraft } from '@/components/property/CreatePropertyDraft';

export default function QuickDraftPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <CreatePropertyDraft />
      </div>
    </div>
  );
}
