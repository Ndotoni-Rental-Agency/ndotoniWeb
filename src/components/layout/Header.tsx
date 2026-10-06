'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Logo from '@/components/ui/Logo';
import { featureFlags } from '@/config/features';
import { MessageCircle, Menu, Search, ChevronDown, User as UserIcon, Rocket, Banknote, Globe } from 'lucide-react';


interface HeaderProps {
  isHidden?: boolean;
}

const iconBtn =
  'inline-flex items-center justify-center h-11 w-11 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 text-ink-700 hover:text-brand-600 hover:bg-brand-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors';

const menuItem =
  'block min-h-11 px-4 py-3 text-sm text-ink-700 dark:text-gray-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-gray-700 transition-colors rounded-xl mx-2 truncate';

export default function Header({ isHidden = false }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const { openAuthModal } = useAuthPrompt();
  const { unreadCount, refreshUnreadCount } = useChat();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const sw = language === 'sw';
  const navigation = [
    { href: '/search', label: sw ? 'Tafuta nyumba' : 'Find a home' },
    { href: '/favorites', label: sw ? 'Vipendwa' : 'Saved homes' },
    { href: '/landlord', label: sw ? 'Kwa wamiliki' : 'For landlords' },
  ];
  useEffect(() => { setIsUserMenuOpen(false); setIsMoreMenuOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (isMoreMenuOpen) moreMenuRef.current?.querySelector('button')?.focus();
      else if (isUserMenuOpen) userMenuRef.current?.querySelector('button')?.focus();
      setIsMoreMenuOpen(false); setIsUserMenuOpen(false);
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [isMoreMenuOpen, isUserMenuOpen]);

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

  const openAuth = (mode: 'signin' | 'signup') => {
    openAuthModal(mode);
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
            ? 'bg-white dark:bg-gray-900 border-stone-200/60 dark:border-gray-700/60 shadow-soft'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-stone-200/70 dark:border-gray-800'
        } ${isHidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Logo */}
            <div className="flex shrink-0 items-center gap-2">
              <Logo size="sm" />
              <Link href="/" className="text-xl font-bold tracking-[-0.04em] text-brand-900 dark:text-white" aria-label="Ndotoni — home">ndotoni<span className="text-brand-600">.</span></Link>
            </div>
            <nav aria-label={sw ? 'Urambazaji mkuu' : 'Main navigation'} className="hidden lg:flex items-center gap-1">
              {navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? 'page' : undefined} className={`min-h-11 inline-flex items-center rounded-xl px-4 text-sm font-semibold transition-colors ${pathname.startsWith(item.href) ? 'bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-200' : 'text-ink-500 hover:bg-stone-50 hover:text-brand-900 dark:text-gray-300 dark:hover:bg-gray-800'}`}>{item.label}</Link>)}
            </nav>

            {/* Right side — one clear primary action, then account & secondary */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link href="/search" className={`${iconBtn} lg:hidden`} aria-label={sw ? 'Tafuta nyumba' : 'Find a home'}><Search size={20} aria-hidden="true" /></Link>
              {/* Primary CTA: the core business action, visible on mobile too */}
              {!pathname.startsWith('/host') && (
                <button
                  onClick={() => {
                    if (isAuthenticated && hasProperties) {
                      router.push('/host');
                    } else {
                      router.push('/property/create');
                    }
                  }}
                  aria-label={hasProperties ? t('nav.myProperties') : t('nav.listProperty')}
                  title={hasProperties ? t('nav.myProperties') : t('nav.listProperty')}
                  className="hidden sm:inline-flex items-center justify-center gap-1.5 h-11 w-auto rounded-xl bg-brand-800 sm:px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
                >
                  {/* Landlord action stays labeled; mobile has it in the navigation menu. */}
                  <span className="hidden sm:inline">{hasProperties ? t('nav.myProperties') : t('nav.listProperty')}</span>
                </button>
              )}

              {/* Chat stays top-level — messaging is a recurring action */}
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
                    <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[20px] px-1.5 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Compact language toggle — inline on desktop, folded into the
                  More menu on mobile to keep the phone row uncluttered */}
              <button
                onClick={() => setLanguage(language === 'sw' ? 'en' : 'sw')}
                className={`${iconBtn} hidden sm:inline-flex gap-1 w-auto px-2.5`}
                title={language === 'sw' ? 'Switch to English' : 'Badili kwa Kiswahili'}
                aria-label={language === 'sw' ? 'Switch to English' : 'Badili kwa Kiswahili'}
              >
                <Globe className="w-5 h-5" strokeWidth={1.75} />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>

              {/* More menu */}
              <div className="relative" ref={moreMenuRef}>
                <button
                  onClick={() => { setIsMoreMenuOpen(!isMoreMenuOpen); setIsUserMenuOpen(false); }}
                  className={iconBtn}
                  title={sw ? 'Menyu' : 'Menu'}
                  aria-label={sw ? 'Menyu' : 'Menu'}
                  aria-expanded={isMoreMenuOpen}
                  aria-controls="header-navigation-menu"
                >
                  <Menu className="w-5 h-5" strokeWidth={1.75} />
                </button>

                {isMoreMenuOpen && (
                  <div id="header-navigation-menu" className="absolute right-0 mt-3 w-64 max-h-[calc(100dvh-6rem)] overflow-y-auto bg-white dark:bg-gray-800 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-700 py-3 z-50">
                    <div className="lg:hidden border-b border-stone-100 pb-2 mb-2 dark:border-gray-700">
                      {navigation.map(item => <Link key={item.href} href={item.href} className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>{item.label}</Link>)}
                    </div>
                    <Link href={hasProperties ? '/host' : '/property/create'} className={`${menuItem} sm:hidden font-semibold text-brand-800`} onClick={() => setIsMoreMenuOpen(false)}>{hasProperties ? t('nav.myProperties') : t('nav.listProperty')}</Link>
                    {/* Language — only here on mobile; desktop has the inline toggle */}
                    <div className="sm:hidden px-4 pb-2">
                      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400 dark:text-gray-500">
                        Lugha / Language
                      </div>
                      <div className="flex items-center h-11 rounded-xl border border-stone-200 dark:border-gray-700 overflow-hidden">
                        <button
                          onClick={() => { setLanguage('sw'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 h-full text-xs font-semibold transition-colors ${language === 'sw' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-ink-500 dark:text-gray-400'}`}
                        >
                          Kiswahili
                        </button>
                        <div className="w-px h-4 bg-stone-200 dark:bg-gray-700" />
                        <button
                          onClick={() => { setLanguage('en'); setIsMoreMenuOpen(false); }}
                          className={`flex-1 h-full text-xs font-semibold transition-colors ${language === 'en' ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300' : 'text-ink-500 dark:text-gray-400'}`}
                        >
                          English
                        </button>
                      </div>
                      <div className="border-t border-stone-100 dark:border-gray-700 mt-3 -mx-1" />
                    </div>
                    <Link href="/invest" className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>
                      <span className="inline-flex items-center gap-1.5"><Rocket className="w-4 h-4" /> {language === 'sw' ? 'Wekeza' : 'Invest'}</span>
                    </Link>
                    <Link href="/refer" className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>
                      <span className="inline-flex items-center gap-1.5"><Banknote className="w-4 h-4" /> {language === 'sw' ? 'Pata Pesa' : 'Refer & Earn'}</span>
                    </Link>
                    <Link href="/about" className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>
                      {t('nav.about')}
                    </Link>
                    <Link href="/contact" className={menuItem} onClick={() => setIsMoreMenuOpen(false)}>
                      {t('nav.contact')}
                    </Link>
                  </div>
                )}
              </div>

              {/* User / Auth */}
              {isAuthenticated && user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsMoreMenuOpen(false); }}
                    aria-label={sw ? 'Akaunti yako' : 'Your account'}
                    aria-expanded={isUserMenuOpen}
                    aria-controls="header-account-menu"
                    className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 h-11 rounded-xl border border-stone-200 dark:border-gray-700 text-ink-700 hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-brand-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {(user.firstName ?? '?').charAt(0)}{(user.lastName ?? '').charAt(0)}
                    </div>
                    <span className="hidden xl:inline text-xs font-semibold">{sw ? 'Akaunti' : 'Account'}</span>
                    <ChevronDown className="hidden sm:block w-4 h-4" strokeWidth={2} />
                  </button>

                  {isUserMenuOpen && (
                    <div id="header-account-menu" className="absolute right-0 mt-3 w-60 bg-white dark:bg-gray-800 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-700 py-3 z-50">
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-gray-700 mx-2 mb-1">
                        <p className="text-sm font-bold text-ink-900 dark:text-white truncate">
                          {user.firstName ?? ''} {user.lastName ?? ''}
                        </p>
                        <p className="text-xs text-ink-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
                      </div>

                      <div className="mx-2">
                        {hasProperties ? (
                          <Link
                            href="/host"
                            className="block w-full text-left px-4 py-2.5 text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors rounded-xl shadow-green-sm"
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
                            className="block w-full text-left px-4 py-2.5 text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors rounded-xl shadow-green-sm"
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
                      <Link href="/favorites" className={menuItem} onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.favorites')}
                      </Link>

                      <div className="border-t border-stone-100 dark:border-gray-700 my-2 mx-3" />

                      <button
                        onClick={handleSignOut}
                        className="block w-[calc(100%-1rem)] min-h-11 text-left px-4 py-2.5 text-sm font-medium text-ink-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors rounded-xl mx-2"
                      >
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsMoreMenuOpen(false); }}
                    aria-label={sw ? 'Akaunti yako' : 'Your account'}
                    aria-expanded={isUserMenuOpen}
                    aria-controls="header-account-menu"
                    className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 h-11 rounded-xl border border-stone-200 dark:border-gray-700 text-ink-700 hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-brand-50 dark:bg-gray-700 rounded-full flex items-center justify-center border-2 border-brand-200">
                      <UserIcon className="w-4 h-4 text-brand-600 dark:text-gray-200" strokeWidth={1.75} />
                    </div>
                    <span className="hidden xl:inline text-xs font-semibold">{sw ? 'Akaunti' : 'Account'}</span>
                    <ChevronDown className="hidden sm:block w-4 h-4" strokeWidth={2} />
                  </button>

                  {isUserMenuOpen && (
                    <div id="header-account-menu" className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-3xl shadow-editorial border border-stone-100 dark:border-gray-700 py-3 z-50">
                      <div className="mx-2">
                        <button
                          onClick={() => {
                            router.push('/property/create');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 transition-colors rounded-xl shadow-green-sm"
                        >
                          {t('nav.listProperty')}
                        </button>
                      </div>
                      <div className="border-t border-stone-100 dark:border-gray-700 my-2 mx-3" />
                      <div className="mx-2 space-y-0.5">
                        <button
                          onClick={() => {
                            openAuth('signin');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-bold text-brand-600 hover:text-brand-700 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-gray-700 transition-colors rounded-xl"
                        >
                          {t('nav.signIn')}
                        </button>
                        <button
                          onClick={() => {
                            openAuth('signup');
                            setIsUserMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-stone-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors rounded-xl"
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

    </>
  );
}
