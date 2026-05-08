'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraphQLClient } from '@/lib/graphql-client';
import { checkListingEntitlement } from '@/graphql/queries';
import { CreatePropertyDraft } from '@/components/property/CreatePropertyDraft';

export default function QuickDraftPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    GraphQLClient.executeAuthenticated<{ checkListingEntitlement: { canList: boolean } }>(
      checkListingEntitlement
    ).then((data) => {
      if (data.checkListingEntitlement.canList) {
        setAllowed(true);
      } else {
        router.replace('/landlord/subscription');
      }
    }).catch(() => {
      // Graceful fallback — allow on error
      setAllowed(true);
    }).finally(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-emerald-600" />
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        <CreatePropertyDraft />
      </div>
    </div>
  );
}
