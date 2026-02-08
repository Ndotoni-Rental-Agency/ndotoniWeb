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
    '/admin/properties/bulk-import': 'Bulk Import Properties',
    '/admin/users': 'User Management',
    '/admin/applications': 'Applications Management',
    '/admin/landlord-applications': 'Landlord Applications',
    '/admin/inquiries': 'Contact Inquiries',
    '/admin/analytics': 'Analytics',
    '/admin/notifications': 'Notifications',
    '/admin/settings': 'Settings',
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
          <main className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}