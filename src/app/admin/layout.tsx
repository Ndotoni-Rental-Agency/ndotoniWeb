'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/auth';
import { AdminSidebar, AdminHeader } from '@/components/admin';
import { UserType } from '@/API';
import { cn } from '@/lib/utils/common';

// Force dynamic rendering for all admin pages (AuthGuard uses useSearchParams)
export const dynamic = 'force-dynamic';

// Map paths to page titles
const getPageTitle = (pathname: string): string => {
  const titleMap: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/properties': 'Property Management',
    '/admin/users': 'User Management',
    '/admin/inquiries': 'Contact Inquiries',
    '/admin/whatsapp-conversations': 'WhatsApp Conversations',
    '/admin/housing-requests': 'Housing Requests',
    '/admin/property-owners': 'Property Owners',
    '/admin/availability': 'Team Availability',
    '/admin/referrals': 'Referral Management',
  };
  return titleMap[pathname] || 'Dashboard';
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pageTitle = getPageTitle(pathname);
  const isWhatsAppInbox = pathname.startsWith('/admin/whatsapp-conversations');

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AuthGuard requiredRole={UserType.ADMIN}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <AdminSidebar 
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onCollapseChange={setIsSidebarCollapsed}
        />

        {/* Admin Header */}
        <AdminHeader 
          title={pageTitle}
          onMenuToggle={handleMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main Content Area */}
        <div 
          className={cn(
            'pt-16 transition-all duration-300',
            'lg:pl-64', 
            isSidebarCollapsed && 'lg:pl-16' 
          )}
        >
          {/* Page Content */}
          <main
            className={cn(
              isWhatsAppInbox
                ? 'p-0 h-[calc(100vh-4rem)] overflow-hidden'
                : 'p-4 sm:p-6 lg:p-8'
            )}
          >
            <div className={cn(!isWhatsAppInbox && 'max-w-7xl mx-auto', isWhatsAppInbox && 'h-full')}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}