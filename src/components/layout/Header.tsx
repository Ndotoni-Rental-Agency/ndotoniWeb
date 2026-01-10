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
      <header className={`sticky top-0 z-50 bg-gradient-to-r from-white/95 via-amber-50/95 to-white/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-md border-b border-amber-100/50 dark:border-gray-700/50 shadow-sm transition-all duration-300 ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Enhanced with gradient and shadow */}
            <Logo />

            {/* Right Side Actions - Enhanced styling */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle - Enhanced */}
              <div className="p-2 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200 hover:shadow-md">
                <ThemeToggle />
              </div>
              
              {/* Chat Icon - Enhanced */}
              {isAuthenticated && (
                <Link
                  href="/chat"
                  className="relative p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200 hover:shadow-md group"
                  title="Messages"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* More Menu - Enhanced */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl transition-all duration-200 hover:shadow-md group"
                  title="More"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 py-2 z-50">
                    <Link
                      href="/about"
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
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
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-red-300 dark:hover:border-red-600 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <span className="text-white text-sm font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg blur-sm opacity-30 group-hover:opacity-50 transition-opacity -z-10"></div>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 py-2 z-50 max-w-[calc(100vw-1rem)] mr-2 sm:mr-0">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mx-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={handleListPropertyMenuClick}
                        className="block w-full text-left px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200 mx-2 rounded-lg shadow-sm hover:shadow-md"
                      >
                        <span className="truncate block">{hasProperties ? "My Properties" : "List Property"}</span>
                      </button>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                      
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      {user.userType === 'ADMIN' && (
                        <Link
                          href="/admin/properties"
                          className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/chat"
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span>Messages</span>
                        {unreadCount > 0 && (
                          <span className="h-5 min-w-[20px] px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Favorites
                      </Link>
                      
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                      
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 hover:border-red-300 dark:hover:border-red-600 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 hover:shadow-md group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 py-2 z-50 max-w-[calc(100vw-1rem)] mr-2 sm:mr-0">
                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all duration-200 mx-2 rounded-lg shadow-sm hover:shadow-md"
                      >
                        <span className="truncate block">List Property</span>
                      </button>
                      <div className="border-t border-gray-100 dark:border-gray-700 my-2 mx-2"></div>
                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => {
                          openAuthModal('signup');
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 mx-2 rounded-lg"
                      >
                        Sign up
                      </button>
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
