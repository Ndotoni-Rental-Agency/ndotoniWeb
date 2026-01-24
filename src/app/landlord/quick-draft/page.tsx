"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { CreatePropertyDraft } from '@/components/property/CreatePropertyDraft';

export default function QuickDraftPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <CreatePropertyDraft
        onSuccess={() => {
          router.push('/landlord/properties');
        }}
        onCancel={() => router.push('/landlord')}
      />
    </div>
  );
}
