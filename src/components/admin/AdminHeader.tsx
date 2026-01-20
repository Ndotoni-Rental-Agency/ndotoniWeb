'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileAvatar } from '@/components/auth';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils/common';
import {
  BellIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

interface AdminHeaderProps {
  title?: string;
  className?: string;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  isSidebarCollapsed?: boolean;
}

export function AdminHeader({ title = 'Dashboard', className, onMenuToggle, isMobileMenuOpen, isSidebarCollapsed = false }: AdminHeaderProps) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300',
        'left-0',
        // Adjust left position based on sidebar state
        'lg:left-64', // Default: expanded sidebar (256px)
        isSidebarCollapsed && 'lg:left-16', // Collapsed sidebar (64px)
        className
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-6 xl:px-8">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        {/* Left Section - Page Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white truncate">
            {title}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Return to main site */}
          <Link
            href="/"
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1.5" />
            <span>Return to Ndotoni</span>
          </Link>
          <Link
            href="/"
            aria-label="Return to Ndotoni"
            className="sm:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          {/* Theme Toggle */}
          <div className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ThemeToggle />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              {/* Notification Badge */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Cog6ToothIcon className="w-5 h-5" />
          </button>

          {/* User Profile */}
          {user && (
            <Link
              href="/profile"
              className="flex items-center space-x-2 sm:space-x-3 pl-2 sm:pl-3 ml-2 sm:ml-3 border-l border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <ProfileAvatar user={user} size="md" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
