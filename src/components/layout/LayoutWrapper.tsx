'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import StickySearchHeader from './StickySearchHeader';
import { useScroll } from '@/contexts/ScrollContext';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const { isScrolled } = useScroll();
  
  // Routes that should not have the header (special pages like auth callback, popups, etc.)
  const noHeaderRoutes = [
    '/auth/callback',
    '/chat',
    // Add other special routes here as needed
  ];
  
  // Routes that should be full-screen without footer spacing (like chat)
  const fullScreenRoutes = [
    '/chat',
  ];
  
  // Admin routes should not use the normal header/footer (they have their own)
  const isAdminRoute = pathname.startsWith('/admin');
  
  const shouldShowHeader = !noHeaderRoutes.includes(pathname) && !isAdminRoute;
  const isFullScreen = fullScreenRoutes.includes(pathname);
  
  // Hide header when scrolled on the home page (where sticky search appears)
  const shouldHideHeader = pathname === '/' && isScrolled;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      {shouldShowHeader && <Header isHidden={shouldHideHeader} />}
      {pathname === '/' && <StickySearchHeader />}
      <main className={`flex-1 bg-white dark:bg-gray-900 transition-colors ${!isFullScreen ? 'mb-16' : ''}`}>
        {children}
      </main>
      {shouldShowHeader && <Footer />}
    </div>
  );
}