'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Routes that should not have the header (special pages like auth callback, popups, etc.)
  const noHeaderRoutes = [
    '/auth/callback',
    '/verify-email',
    '/reset-password',
    '/chat',
    '/pitch',
    // Add other special routes here as needed
  ];

  // Routes that should be full-screen without footer spacing (like chat)
  const fullScreenRoutes = [
    '/chat',
    '/pitch',
  ];
  
  // Admin routes should not use the normal header/footer (they have their own)
  const isAdminRoute = pathname.startsWith('/admin');
  
  const shouldShowHeader = !noHeaderRoutes.includes(pathname) && !isAdminRoute;
  const isFullScreen = fullScreenRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {shouldShowHeader && <Header />}
      <main className={`flex-1 bg-white dark:bg-gray-900 transition-colors ${!isFullScreen ? 'mb-0' : ''}`}>
        {children}
      </main>
      {shouldShowHeader && <Footer />}
    </div>
  );
}