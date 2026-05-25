'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DynamicAuthModal } from '@/components/ui/DynamicModal';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Logo from '@/components/ui/Logo';
import { featureFlags } from '@/config/features';
import { MessageCircle, MoreVertical, Shield, ChevronDown, User as UserIcon } from 'lucide-react';


interface HeaderProps {
  isHidden?: boolean;
}

const iconBtn =
  'inline-flex items-center justify-center h-11 w-11 rounded-full text-ink-700 hover:text-ink-900 hover:bg-stone-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors';

const menuItem =
  'block px-4 py-2.5 text-sm text-ink-700 dark:text-gray-300 hover:bg-cream-200 dark:hover:bg-gray-700 transition-colors rounded-lg mx-2 truncate';

export default function Header({ isHidden = false }: HeaderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const { unreadCount, refreshUnreadCount } = useChat();
  const { t } = useLanguage();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const hasProperties = user?.hasProperties || false;

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

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshUnreadCount();
    }
  }, [isAuthenticated, user, refreshUnreadCount]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = () => {
    signOut();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white dark:bg-gray-900 border-stone-200/70 dark:border-gray-700/60 shadow-soft'
            : 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-transparent'
        } ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Right side */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* List your property — prominent CTA */}
              <button
                onClick={() => {
                  if (isAuthenticated && hasProperties) {
                    router.push('/landlord');
                  } else {
                    router.push('/property/create');
                  }
                }}
                className="hidden sm:inline-flex items-center h-10 px-4 rounded-full text-sm font-medium text-ink-900 hover:bg-stone-100 dark:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                {hasProperties ? t('nav.myProperties') : t('nav.listProperty')}
              </button>

              {/* Admin */}
              {isAuthenticated && user?.userType === 'ADMIN' && (
                <Link href="/admin" className={iconBtn} title="Admin Panel" aria-label="Admin">
                  <Shield className="w-5 h-5" strokeWidth={1.75} />
                </Link>
              )}

              {/* Chat */}
              {isAuthenticated && featureFlags.enableInAppChat && (
                <Link
                  href="/chat"
                  onClick={() => refreshUnreadCount()}
                  className={`relative ${iconBtn}`}
                  title="Messages"
                  aria-label="Messages"
                >
                  <MessageCircle className="w-5 h-5" strokeWidth={1.75} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1.5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* More menu */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={iconBtn}
                  title="More"
                  aria-label="More"
                >
                  <MoreVertical className="w-5 h-5" strokeWidth={1.75} />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-editorial border border-stone-100 dark:border-gray-700 py-2 z-50">
                    <Link href="/about" className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>
                      {t('nav.about')}
                    </Link>
                    <Link href="/contact" className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>
                      {t('nav.contact')}
                    </Link>
                    <div className="border-t border-stone-100 dark:border-gray-700 my-1 mx-3" />
                    <div className="px-4 py-1.5">
                      <LanguageSwitcher variant="menu" />
                    </div>
                  </div>
                )}
              </div>

              {/* User / Auth */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 h-11 rounded-full text-ink-700 hover:bg-stone-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {(user.firstName ?? '?').charAt(0)}{(user.lastName ?? '').charAt(0)}
                    </div>
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-editorial border border-stone-100 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-gray-700 mx-2 mb-1">
                        <p className="text-sm font-semibold text-ink-900 dark:text-white truncate">
                          {user.firstName ?? ''} {user.lastName ?? ''}
                        </p>
                        <p className="text-xs text-ink-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="mx-2">
                        {hasProperties ? (
                          <Link
                            href="/landlord"
                            className="block w-full text-left px-4 py-2.5 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700 transition-colors rounded-xl shadow-green-sm"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {t('nav.myProperties')}
                          </Link>
                        ) : (
                          <button
                            onClick={() => {
                              router.push('/property/create');
                              setIsUserMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2.5 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors rounded-xl shadow-green-sm"
                          >
                            {t('nav.listProperty')}
                          </button>
                        )}
                      </div>

                      <div className="border-t border-stone-100 dark:border-gray-700 my-2 mx-3" />

                      <Link href="/profile" className={menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.profile')}
                      </Link>
                      {user.userType === 'ADMIN' && (
                        <Link href="/admin/properties" className={menuItem} onClick={() => setIsUserMenuOpen(false)}>
                          {t('nav.adminPanel')}
                        </Link>
                      )}
                      {featureFlags.shortTermStays && (
                        <Link href="/stays" className={menuItem} onClick={() => setIsUserMenuOpen(false)}>
                          {t('nav.myStays')}
                        </Link>
                      )}
                      <Link href="/favorites" className={menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.favorites')}
                      </Link>

                      <div className="border-t border-stone-100 dark:border-gray-700 my-2 mx-3" />

                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2.5 text-sm font-medium text-ink-500 hover:text-ink-900 hover:bg-stone-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors rounded-lg mx-2"
                      >
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 h-11 rounded-full text-ink-700 hover:bg-stone-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-stone-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-ink-700 dark:text-gray-200" strokeWidth={1.75} />
                    </div>
                    <ChevronDown className="w-4 h-4" strokeWidth={2} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-editorial border border-stone-100 dark:border-gray-700 py-2 z-50">
                      <div className="mx-2">
                        <button
                          onClick={() => {
                            router.push('/property/create');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors rounded-xl shadow-green-sm"
                        >
                          {t('nav.listProperty')}
                        </button>
                      </div>
                      <div className="border-t border-stone-100 dark:border-gray-700 my-2 mx-3" />
                      <div className="mx-2 space-y-0.5">
                        <button
                          onClick={() => {
                            openAuthModal('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-semibold text-brand-700 hover:text-brand-800 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-gray-700 transition-colors rounded-lg"
                        >
                          {t('nav.signIn')}
                        </button>
                        <button
                          onClick={() => {
                            openAuthModal('signup');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-stone-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors rounded-lg"
                        >
                          {t('nav.signUp')}
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

      <DynamicAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
