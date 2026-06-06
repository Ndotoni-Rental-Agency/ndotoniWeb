'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useLanguage } from '@/contexts/LanguageContext';

const BANNER_DISMISS_KEY = 'ndotoni_banner_dismissed_v1';

export default function TopBanner() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISS_KEY);
    if (!dismissed) {
      setVisible(true);
    } else {
      // Re-show after 1 hour
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt > 3600000) {
        localStorage.removeItem(BANNER_DISMISS_KEY);
        setVisible(true);
      }
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(BANNER_DISMISS_KEY, Date.now().toString());
  };

  if (!visible) return null;

  return (
    <div className="relative bg-brand-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-x-4 gap-y-1 flex-wrap text-center text-xs sm:text-sm">
        <span className="font-medium">
          {language === 'sw'
            ? '🎉 Je, Unajua Mtu Anayepangisha? Tuunganishe Upate Pesa'
            : '🎉 Do You Know a Landlord? Get Paid for Connecting Them to Us'}
        </span>
        <Link
          href="/refer"
          onClick={dismiss}
          className="inline-flex items-center px-3 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
        >
          {language === 'sw' ? 'Anza sasa →' : 'Start now →'}
        </Link>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
      >
        <XMarkIcon className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
