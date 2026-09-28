'use client';

import { AuthGuard } from '@/components/auth';
import { UserType } from '@/API';
import { ManagedRentalWizard } from '@/components/admin/managed/ManagedRentalWizard';

// AuthGuard uses useSearchParams
export const dynamic = 'force-dynamic';

/** Full-page flow for listing a rental on behalf of an owner (admins only). */
export default function NewManagedRentalPage() {
  return (
    <AuthGuard requiredRole={UserType.ADMIN}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <ManagedRentalWizard />
        </div>
      </div>
    </AuthGuard>
  );
}
