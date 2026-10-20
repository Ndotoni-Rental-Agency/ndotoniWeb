'use client';

import React, { Suspense } from 'react';
import { ListingShell } from '@/components/design/ListingShell';
import { CreatePropertyDraft } from '@/components/property/CreatePropertyDraft';

export const dynamic = 'force-dynamic';

export default function CreatePropertyPage() {
  return (
    <ListingShell>
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />}>
          <CreatePropertyDraft />
        </Suspense>
    </ListingShell>
  );
}
