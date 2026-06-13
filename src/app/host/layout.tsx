'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth';
import { UserType } from '@/API';
import { LandlordSidebar } from '@/components/landlord/LandlordSidebar';

// Force dynamic rendering for all landlord pages (AuthGuard uses useSearchParams)
export const dynamic = 'force-dynamic';

// Known sub-routes that use the dashboard layout
const DASHBOARD_ROUTES = ['properties', 'subscription', 'whatsapp', 'inbox', 'media'];

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // /host/[landlordId] is a public page (no sidebar)
  const segments = pathname.split('/').filter(Boolean); // ['host', 'something', ...]
  const secondSegment = segments[1];
  const isPublicLandlordPage = secondSegment && !DASHBOARD_ROUTES.includes(secondSegment) && segments.length === 2;

  if (isPublicLandlordPage) {
    return <>{children}</>;
  }

  return (
    <AuthGuard requiredRole={[UserType.TENANT, UserType.LANDLORD, UserType.AGENT, UserType.ADMIN]}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <LandlordSidebar />

        {/* Main content */}
        <main className="lg:pl-56 pb-20 lg:pb-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
