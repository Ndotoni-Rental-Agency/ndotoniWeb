'use client';

import React from 'react';
import { CreatePropertyDraft } from '@/components/property/CreatePropertyDraft';

export default function CreatePropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <CreatePropertyDraft />
      </div>
    </div>
  );
}
