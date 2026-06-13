'use client';

import React, { Suspense } from 'react';
import { CreatePropertyDraft } from '@/components/property/CreatePropertyDraft';

export const dynamic = 'force-dynamic';

export default function CreatePropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />}>
          <CreatePropertyDraft />
        </Suspense>
      </div>
    </div>
  );
}
