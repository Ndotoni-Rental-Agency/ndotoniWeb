'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'ndotoni',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Diversity & Belonging', href: '/diversity' },
        { name: 'Accessibility', href: '/accessibility' },
        { name: 'Landlord Resources', href: '/landlord-resources' },
        { name: 'Community Center', href: '/community' },
        { name: 'Forum', href: '/forum' },
      ]
    },
    {
      title: 'Hosting',
      links: [
        { name: 'List Your Property', href: '/properties/create' },
        { name: 'Landlord Hub', href: '/landlord' },
        { name: 'Resource Center', href: '/resources' },
        { name: 'Community Forum', href: '/forum' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Safety Information', href: '/safety' },
        { name: 'Cancellation Options', href: '/cancellation' },
        { name: 'Report Issues', href: '/report' },
        { name: 'Contact Us', href: '/contact' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4 transition-colors">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 py-8 transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            {/* Left Side - Logo and Description */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
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
                <span className="text-xl font-bold text-red-500">ndotoni</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md transition-colors">
                Find your perfect home in Tanzania. Connecting tenants with quality properties across Dar es Salaam and beyond.
              </p>
            </div>

            {/* Right Side - Social Links and Language */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
              {/* Social Media Links */}
              <div className="flex items-center space-x-4">
                <a
                  href="https://facebook.com/ndotoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/ndotoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com/ndotoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323C5.902 8.198 7.053 7.708 8.35 7.708s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387zm7.718 0c-1.297 0-2.448-.49-3.323-1.297-.897-.875-1.387-2.026-1.387-3.323s.49-2.448 1.297-3.323c.875-.897 2.026-1.387 3.323-1.387s2.448.49 3.323 1.297c.897.875 1.387 2.026 1.387 3.323s-.49 2.448-1.297 3.323c-.875.897-2.026 1.387-3.323 1.387z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/ndotoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>

              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <select className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer transition-colors">
                  <option value="en">English (US)</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <select className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none focus:outline-none cursor-pointer transition-colors">
                  <option value="tzs">TZS - Tanzanian Shilling</option>
                  <option value="usd">USD - US Dollar</option>
                </select>
              </div>
            </div>
          </div>

          {/* Copyright and Legal Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 transition-colors">
                <span>© {currentYear} ndotoni, Inc.</span>
                <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/sitemap" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sitemap
                </Link>
                <Link href="/company-details" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Company Details
                </Link>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                Made with ❤️ in Tanzania
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}