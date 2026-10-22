'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { Menu as MenuIcon, ChevronDown, UserRound, Globe, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';
import { useChat } from '@/contexts/ChatContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { featureFlags } from '@/config/features';

const itemClass = 'flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium text-ink-700 data-[focus]:bg-brand-50 data-[focus]:text-brand-900 dark:text-gray-200 dark:data-[focus]:bg-gray-800';

export default function Header({ isHidden = false }: { isHidden?: boolean }) {
  const { user, isAuthenticated, signOut } = useAuth();
  const { openAuthModal } = useAuthPrompt();
  const { unreadCount } = useChat();
  const { t, language, setLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const sw = language === 'sw';
  const hasProperties = !!user?.hasProperties;
  const listingHref = hasProperties ? '/host' : '/property/create';
  const listingLabel = hasProperties ? t('nav.myProperties') : t('nav.listProperty');
  const navigation = [
    { href: '/search', label: sw ? 'Tafuta nyumba' : 'Find a home' },
    { href: '/favorites', label: sw ? 'Vipendwa' : 'Saved homes' },
    { href: '/landlord', label: sw ? 'Kwa wamiliki' : 'For landlords' },
  ];
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const badge = unreadCount > 0 && <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>;

  return (
    <header className={`sticky top-0 z-50 border-b border-stone-200 bg-white transition-transform duration-200 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label={sw ? 'Ndotoni — Nyumbani' : 'Ndotoni — Home'} className="inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700">
          <Image src="/images/logo-light-mode.png" alt="" width={38} height={38} priority className="dark:hidden" />
          <Image src="/images/logo-dark-mode.png" alt="" width={38} height={38} priority className="hidden dark:block" />
          <span className="text-[29px] font-bold leading-none tracking-[-0.055em] text-brand-900 dark:text-white">ndotoni<span className="text-brand-500">.</span></span>
        </Link>

        <nav aria-label={sw ? 'Urambazaji mkuu' : 'Main navigation'} className="hidden h-full items-center gap-6 xl:gap-8 lg:flex">
          {navigation.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? 'page' : undefined}
            className={`relative inline-flex h-full items-center whitespace-nowrap text-sm font-semibold transition-colors hover:text-brand-800 focus-visible:outline-brand-700 dark:hover:text-brand-300 ${active(item.href) ? 'text-brand-900 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t-full after:bg-brand-700 dark:text-brand-200' : 'text-ink-500 dark:text-gray-300'}`}>
            {item.label}
          </Link>)}
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          {!pathname.startsWith('/host') && <Link href={listingHref} className="hidden min-h-11 items-center justify-center whitespace-nowrap rounded-full bg-brand-800 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 lg:inline-flex">{listingLabel}</Link>}
          <button onClick={() => setLanguage(sw ? 'en' : 'sw')} aria-label={sw ? 'Switch to English' : 'Badili kwa Kiswahili'}
            className="hidden h-11 items-center gap-1.5 rounded-full px-2 text-ink-500 hover:bg-stone-50 focus-visible:outline-brand-700 dark:text-gray-300 dark:hover:bg-gray-800 lg:inline-flex">
            <Globe size={18} aria-hidden="true" /><span className="text-xs font-semibold uppercase">{language}</span>
          </button>
          <Menu as="div" className="relative">
            <MenuButton aria-label={sw ? 'Menyu na akaunti' : 'Menu and account'} className="relative flex h-11 items-center gap-2 rounded-full border border-stone-200 px-3 text-ink-700 transition-colors hover:border-brand-300 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
              <MenuIcon size={21} strokeWidth={1.75} className="lg:hidden" aria-hidden="true" />
              {isAuthenticated && user ? <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-900">{(user.firstName || '?').charAt(0)}{user.lastName?.charAt(0)}</span> : <UserRound size={20} className="hidden lg:block" aria-hidden="true" />}
              <span className="hidden text-sm font-semibold lg:inline">{sw ? 'Akaunti' : 'Account'}</span>
              <ChevronDown size={14} className="hidden lg:block" aria-hidden="true" />
              {unreadCount > 0 && <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-600 dark:border-gray-900" />}
            </MenuButton>
            <MenuItems key={pathname} transition className="absolute right-0 top-full mt-3 max-h-[calc(100dvh-6rem)] w-72 max-w-[calc(100vw-2rem)] origin-top-right overflow-y-auto rounded-2xl border border-stone-200 bg-white p-2 shadow-xl transition duration-150 data-[closed]:translate-y-1 data-[closed]:opacity-0 focus:outline-none motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-stone-100 pb-2 lg:hidden dark:border-gray-800">
                {navigation.map(item => <MenuItem key={item.href}><Link href={item.href} aria-current={active(item.href) ? 'page' : undefined} className={`${itemClass} ${active(item.href) ? 'bg-brand-50 text-brand-900 dark:bg-gray-800' : ''}`}>{item.label}</Link></MenuItem>)}
                <MenuItem><Link href={listingHref} className={`${itemClass} font-bold text-brand-800 dark:text-brand-300`}>{listingLabel}</Link></MenuItem>
              </div>
              {isAuthenticated && user ? <>
                <p className="truncate px-4 pb-1 pt-3 text-sm font-bold text-ink-900 dark:text-white">{user.firstName} {user.lastName}</p>
                {featureFlags.enableInAppChat && <MenuItem><Link href="/chat" className={itemClass}><MessageCircle size={17} />{sw ? 'Ujumbe' : 'Messages'}{badge}</Link></MenuItem>}
                <MenuItem><Link href="/profile" className={itemClass}>{t('nav.profile')}</Link></MenuItem>
                {user.userType === 'ADMIN' && <MenuItem><Link href="/admin/properties" className={itemClass}>{t('nav.adminPanel')}</Link></MenuItem>}
              </> : <div className="py-2">
                <MenuItem><button onClick={() => openAuthModal('signin')} className={`${itemClass} font-bold text-brand-800 dark:text-brand-300`}>{t('nav.signIn')}</button></MenuItem>
                <MenuItem><button onClick={() => openAuthModal('signup')} className={itemClass}>{t('nav.signUp')}</button></MenuItem>
              </div>}
              <div className="my-2 border-t border-stone-100 dark:border-gray-800" />
              {[{ href: '/refer', label: sw ? 'Pata pesa kwa kututambulisha' : 'Refer & earn' }, { href: '/about', label: t('nav.about') }, { href: '/contact', label: t('nav.contact') }, { href: '/invest', label: sw ? 'Wekeza' : 'Invest' }].map(item => <MenuItem key={item.href}><Link href={item.href} className={itemClass}>{item.label}</Link></MenuItem>)}
              <div className="lg:hidden"><MenuItem><button onClick={() => setLanguage(sw ? 'en' : 'sw')} className={itemClass}><Globe size={17} />{sw ? 'Switch to English' : 'Badili kwa Kiswahili'}</button></MenuItem></div>
              {isAuthenticated && <><div className="my-2 border-t border-stone-100 dark:border-gray-800" /><MenuItem><button onClick={async () => { await signOut(); router.push('/'); }} className={itemClass}>{t('nav.signOut')}</button></MenuItem></>}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
}
