'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { DynamicAuthModal, DynamicBecomeLandlordModal } from '@/components/ui/DynamicModal';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Logo from '@/components/ui/Logo';

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
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

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
      router.push(hasProperties ? "/landlord" : "/landlord/properties/create");
    }
  };

  const handleListPropertyMenuClick = () => {
    setIsUserMenuOpen(false);
    if (user?.userType === 'TENANT') {
      setIsBecomeLandlordModalOpen(true);
    } else {
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
      <header className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-300 ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Enhanced with gradient and shadow */}
            <Logo />

            {/* Right Side Actions - Enhanced styling */}
            <div className="flex items-center gap-3">
              {/* Chat Icon - Enhanced and Prominent */}
              {isAuthenticated && (
                <Link
                  href="/chat"
                  className="relative p-3 text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-red-500 hover:to-orange-500 dark:hover:from-red-500 dark:hover:to-orange-500 rounded-xl transition-all duration-200 group border border-gray-200/50 dark:border-gray-600/50 hover:border-red-300 dark:hover:border-red-400"
                  title="Messages"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 min-w-[24px] px-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-white dark:border-gray-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* More Menu - Enhanced and Prominent */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="p-3 text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-red-500 hover:to-orange-500 dark:hover:from-red-500 dark:hover:to-orange-500 rounded-xl transition-all duration-200 group border border-gray-200/50 dark:border-gray-600/50 hover:border-red-300 dark:hover:border-red-400"
                  title="More"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 py-2 z-50 max-w-[calc(100vw-1rem)] mr-2 sm:mr-0">
                    {/* Theme Toggle - All screen sizes */}
                    <div className="mx-2">
                      <button
                        onClick={() => {
                          toggleTheme();
                          setIsMoreMenuOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 rounded-lg min-w-0"
                      >
                        <span className="truncate pr-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        <div className="flex-shrink-0">
                          {/* Sun Icon for Light Mode */}
                          <svg className={`w-4 h-4 ${theme === 'dark' ? 'hidden' : 'block'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {/* Moon Icon for Dark Mode */}
                          <svg className={`w-4 h-4 ${theme === 'light' ? 'hidden' : 'block'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                    
                    <Link
                      href="/about"
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg truncate"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg truncate"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      Contact
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                    <div className="px-4 py-1.5">
                      <LanguageSwitcher variant="menu" />
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile/Auth - Enhanced */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-2 pl-2.5 pr-3 text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-red-500 hover:to-orange-500 dark:hover:from-red-500 dark:hover:to-orange-500 rounded-xl transition-all duration-200 group border border-gray-200/50 dark:border-gray-600/50 hover:border-red-300 dark:hover:border-red-400"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-200">
                        <span className="text-sm font-bold bg-gradient-to-r from-gray-900 via-red-600 to-orange-600 dark:from-white dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 py-2 z-50 max-w-[calc(100vw-1rem)] mr-2 sm:mr-0">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mx-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <div className="mx-2">
                        <button
                          onClick={handleListPropertyMenuClick}
                          className="block w-full text-left px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md min-w-0"
                        >
                          <span className="truncate block">{hasProperties ? "My Properties" : "List Property"}</span>
                        </button>
                      </div>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                      
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg truncate"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {user.userType === 'ADMIN' && (
                        <Link
                          href="/admin/properties"
                          className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg truncate"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/chat"
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg min-w-0"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="truncate">Messages</span>
                        {unreadCount > 0 && (
                          <span className="h-5 min-w-[20px] px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm ml-2 flex-shrink-0">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg truncate"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg truncate"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                      
                      <div className="mx-2">
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 rounded-lg min-w-0"
                        >
                          <span className="truncate block">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-2 pl-2.5 pr-3 text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-red-500 hover:to-orange-500 dark:hover:from-red-500 dark:hover:to-orange-500 rounded-xl transition-all duration-200 group border border-gray-200/50 dark:border-gray-600/50 hover:border-red-300 dark:hover:border-red-400"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 rounded-lg flex items-center justify-center transition-shadow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 py-2 z-50 max-w-[calc(100vw-1rem)] mr-2 sm:mr-0">
                      <div className="mx-2">
                        <button
                          onClick={() => {
                            openAuthModal('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200 rounded-lg shadow-sm hover:shadow-md min-w-0"
                        >
                          <span className="truncate block">List Property</span>
                        </button>
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                      <div className="mx-2 space-y-1">
                        <button
                          onClick={() => {
                            openAuthModal('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-lg min-w-0"
                        >
                          <span className="truncate block">Sign in</span>
                        </button>
                        <button
                          onClick={() => {
                            openAuthModal('signup');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 rounded-lg min-w-0"
                        >
                          <span className="truncate block">Sign up</span>
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
