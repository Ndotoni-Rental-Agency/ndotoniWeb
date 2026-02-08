'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/common';
import Logo from '@/components/ui/Logo';
import {
  HomeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
}

interface AdminSidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function AdminSidebar({ className, isMobileOpen: externalMobileOpen, onMobileClose, isCollapsed: externalCollapsed, onCollapseChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isMobileOpen = externalMobileOpen !== undefined ? externalMobileOpen : internalMobileOpen;
  const setIsMobileOpen = onMobileClose ? () => onMobileClose() : setInternalMobileOpen;
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleCollapseToggle = () => {
    const newCollapsed = !isCollapsed;
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    } else {
      setInternalCollapsed(newCollapsed);
    }
  };

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      exact: true,
    },
    {
      name: 'Properties',
      href: '/admin/properties',
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UserGroupIcon,
    },
    {
      name: 'Applications',
      href: '/admin/applications',
      icon: DocumentTextIcon,
    },
    {
      name: 'Landlord Applications',
      href: '/admin/landlord-applications',
      icon: ClipboardDocumentCheckIcon,
    },
    {
      name: 'Inquiries',
      href: '/admin/inquiries',
      icon: EnvelopeIcon,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
    },
    {
      name: 'Notifications',
      href: '/admin/notifications',
      icon: BellIcon,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Cog6ToothIcon,
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button - Removed, now handled by AdminHeader */}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <Logo href="/" size="md" showTagline={false} className="flex-1" />
            )}
            {isCollapsed && (
              <Logo href="/" size="sm" showTagline={false} iconOnly={true} className="w-full" />
            )}
          </div>

     

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative group',
                    active
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Collapse Button - Desktop Only */}
          <div className="hidden lg:flex items-center justify-center p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCollapseToggle}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
