'use client';

import design from '@/components/design/Brand.module.css';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth';
import { UserType } from '@/API';
import { LandlordSidebar } from '@/components/landlord/LandlordSidebar';

// Force dynamic rendering for all landlord pages (AuthGuard uses useSearchParams)
export const dynamic = 'force-dynamic';

// Known sub-routes that use the dashboard layout
const DASHBOARD_ROUTES = ['properties', 'calendar', 'subscription', 'whatsapp', 'inbox', 'media'];

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

  // Detect detail pages (edit, calendar) that need more width
  const isDetailPage = segments.length > 3; // e.g. /host/properties/[id]/edit

  return (
    <AuthGuard requiredRole={[UserType.TENANT, UserType.LANDLORD, UserType.AGENT, UserType.ADMIN]}>
      <div className={design.hostShell}>
        <LandlordSidebar />

        {/* Main content */}
        <div className="lg:pl-60 pb-20 lg:pb-0">
          <div className={`${design.hostContent} ${isDetailPage ? '!max-w-7xl' : ''}`}>
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
