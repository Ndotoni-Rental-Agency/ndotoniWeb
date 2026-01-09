'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/Button';
import { DynamicAuthModal, DynamicBecomeLandlordModal } from '@/components/ui/DynamicModal';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface HeaderProps {
  isHidden?: boolean;
}

export default function Header({ isHidden = false }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isBecomeLandlordModalOpen, setIsBecomeLandlordModalOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const { unreadCount } = useChat();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // For now, we'll assume user has properties if they are a landlord
  // This could be replaced with actual property count from API
  const hasProperties = user?.userType === 'LANDLORD' || user?.userType === 'ADMIN';
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isUserMenuOpen || isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMoreMenuOpen]);

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
      <header className={`sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-[0_1px_3px_0_rgb(0,0,0,0.05),0_1px_2px_-1px_rgb(0,0,0,0.05)] dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.3),0_1px_2px_-1px_rgb(0,0,0,0.2)] transition-all duration-300 ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] group-hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.1)] transition-all duration-200 group-hover:scale-[1.02]">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  {/* Sleeping person head */}
                  <circle cx="12" cy="14" r="3" fill="currentColor" opacity="0.9"/>
                  {/* Closed eyes */}
                  <path d="M10.5 13.5c0.5-0.2 1-0.2 1.5 0M12.5 13.5c0.5-0.2 1-0.2 1.5 0" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.7"/>
                  {/* Sunrise/sun rays */}
                  <path d="M12 3v2M19.07 4.93l-1.41 1.41M21 12h-2M19.07 19.07l-1.41-1.41M5.93 4.93l1.41 1.41M3 12h2" stroke="currentColor" strokeWidth="1.2" opacity="0.8"/>
                  {/* Sun circle */}
                  <circle cx="12" cy="6" r="1.5" fill="currentColor" opacity="0.6"/>
                </svg>
              </div>
              <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">ndotoni</span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-1.5">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Chat Icon - Only show for authenticated users */}
              {isAuthenticated && (
                <Link
                  href="/chat"
                  className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200"
                  title="Messages"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {/* Dynamic notification badge */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-[0_1px_2px_0_rgb(0,0,0,0.2)]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* More Menu - Contains About and Contact */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200"
                  title="More"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {/* More Menu Dropdown */}
                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-1px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.3),0_2px_4px_-1px_rgb(0,0,0,0.2)] border border-gray-200/80 dark:border-gray-700/80 py-1.5 transition-all duration-200 z-50 backdrop-blur-sm">
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700/50 my-1.5"></div>
                    <div className="px-4 py-1.5">
                      <LanguageSwitcher variant="menu" />
                    </div>
                  </div>
                )}
              </div>

              {/* List Property Button - Always show, redirect to auth if needed */}
              {isAuthenticated ? (
                <Button 
                  variant="primary" 
                  size="md" 
                  className="hidden md:inline-flex rounded-full shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.1)] transition-all duration-200 font-medium"
                  onClick={handleListPropertyClick}
                >
                  {hasProperties ? "My Properties" : "List your property"}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  size="md" 
                  className="hidden md:inline-flex rounded-full shadow-[0_1px_2px_0_rgb(0,0,0,0.05)] hover:shadow-[0_2px_4px_0_rgb(0,0,0,0.1)] transition-all duration-200 font-medium"
                  onClick={() => openAuthModal('signin')}
                >
                  List your property
                </Button>
              )}
              
              {/* User Profile/Auth */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2.5 p-1.5 rounded-lg border border-gray-200/80 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-[0_1px_2px_0_rgb(0,0,0,0.05)]">
                      <span className="text-white text-sm font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-1px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.3),0_2px_4px_-1px_rgb(0,0,0,0.2)] border border-gray-200/80 dark:border-gray-700/80 py-1.5 transition-all duration-200 z-50 backdrop-blur-sm">
                      <div className="px-4 py-3 border-b border-gray-100/80 dark:border-gray-700/50">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
                      </div>
                      
                      {/* Conditional List Property / My Properties */}
                      <button
                        onClick={handleListPropertyMenuClick}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        {hasProperties ? "My Properties" : "List your property"}
                      </button>
                      
                      <div className="border-t border-gray-100/80 dark:border-gray-700/50 my-1.5"></div>
                      
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {user.userType === 'ADMIN' && (
                          <Link
                            href="/admin/properties"
                            className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin Panel
                          </Link>
                        )}
                        <Link
                          href="/chat"
                          className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span>Messages</span>
                          {unreadCount > 0 && (
                            <span className="ml-2 h-5 w-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-[0_1px_2px_0_rgb(0,0,0,0.2)]">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </Link>
                        <Link
                          href="/bookings"
                          className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <Link
                          href="/favorites"
                          className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Favorites
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100/80 dark:border-gray-700/50 my-1.5"></div>
                      
                      <div className="py-1">
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2.5 p-1.5 rounded-lg border border-gray-200/80 dark:border-gray-700/80 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Guest User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-1px_rgb(0,0,0,0.06)] dark:shadow-[0_4px_6px_-1px_rgb(0,0,0,0.3),0_2px_4px_-1px_rgb(0,0,0,0.2)] border border-gray-200/80 dark:border-gray-700/80 py-1.5 transition-all duration-200 z-50 backdrop-blur-sm">
                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        List your property
                      </button>
                      <div className="border-t border-gray-100/80 dark:border-gray-700/50 my-1.5"></div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            openAuthModal('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          Sign in
                        </button>
                        <button
                          onClick={() => {
                            openAuthModal('signup');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                        >
                          Sign up
                        </button>
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
      <DynamicAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Become Landlord Modal */}
      <DynamicBecomeLandlordModal
        isOpen={isBecomeLandlordModalOpen}
        onClose={() => setIsBecomeLandlordModalOpen(false)}
      />
    </>
  );
}