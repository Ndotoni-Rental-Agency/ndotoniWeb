'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/design-system/components/Button';
import AuthModal from '@/components/auth/AuthModal';
import BecomeLandlordModal from '@/components/auth/BecomeLandlordModal';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface HeaderProps {
  isHidden?: boolean;
}

export default function Header({ isHidden = false }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isBecomeLandlordModalOpen, setIsBecomeLandlordModalOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // For now, we'll assume user has properties if they are a landlord
  // This could be replaced with actual property count from API
  const hasProperties = user?.userType === 'LANDLORD' || user?.userType === 'ADMIN';
  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navigation = [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleListPropertyClick = () => {
    if (!isAuthenticated) {
      openAuthModal('signin');
    } else if (user?.userType === 'TENANT') {
      setIsBecomeLandlordModalOpen(true);
    } else {
      // For landlords and admins, navigate to appropriate page
      router.push(hasProperties ? "/landlord" : "/landlord/properties/create");
    }
  };

  const handleListPropertyMenuClick = () => {
    setIsUserMenuOpen(false);
    if (user?.userType === 'TENANT') {
      setIsBecomeLandlordModalOpen(true);
    } else {
      // For landlords and admins, navigate to appropriate page
      router.push(hasProperties ? "/landlord" : "/landlord/properties/create");
    }
  };

  const handleSignOut = () => {
    signOut();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className={`sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-red-500 dark:text-red-400">nest</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle />
              

              {/* List Property Button - Always show, redirect to auth if needed */}
              {isAuthenticated ? (
                <Button 
                  variant="primary" 
                  size="md" 
                  className="hidden md:inline-flex rounded-full"
                  onClick={handleListPropertyClick}
                >
                  {hasProperties ? "My Properties" : "List your property"}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="md" 
                  className="hidden md:inline-flex rounded-full"
                  onClick={() => openAuthModal('signin')}
                >
                  List your property
                </Button>
              )}
              
              {/* User Profile/Auth */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-full border-gray-300 dark:border-gray-600 hover:shadow-md transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                  </Button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 transition-colors">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{user.email}</p>
                      </div>
                      
                      {/* Conditional List Property / My Properties */}
                      <button
                        onClick={handleListPropertyMenuClick}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {hasProperties ? "My Properties" : "List your property"}
                      </button>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 transition-colors">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {user.userType === 'ADMIN' && (
                          <Link
                            href="/admin/properties"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          href="/landlord/inbox"
                          className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>Messages</span>
                          <span className="ml-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                          </span>
                        </Link>
                        <Link
                          href="/bookings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          href="/favorites"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Favorites
                        </Link>
                      </div>
                      
                      {/* About and Contact moved to bottom */}
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 transition-colors">
                        <Link
                          href="/about"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          About
                        </Link>
                        <Link
                          href="/contact"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Contact
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 transition-colors">
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  {/* User Menu Button */}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-full border-gray-300 dark:border-gray-600 hover:shadow-md transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </Button>

                  {/* Guest User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 transition-colors">
                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        List your property
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 transition-colors">
                        <button
                          onClick={() => {
                            openAuthModal('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Sign in
                        </button>
                      </div>
                      
                      {/* About and Contact for guest users */}
                      <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2 transition-colors">
                        <Link
                          href="/about"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          About
                        </Link>
                        <Link
                          href="/contact"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Contact
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Become Landlord Modal */}
      <BecomeLandlordModal
        isOpen={isBecomeLandlordModalOpen}
        onClose={() => setIsBecomeLandlordModalOpen(false)}
      />
    </>
  );
}