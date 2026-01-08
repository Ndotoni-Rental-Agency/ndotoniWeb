'use client';

import { useState, ReactNode } from 'react';
import { ContactTab } from './types';
import { useFadeIn } from '@/hooks/useFadeIn';

interface ContactTabsProps {
  activeTab: ContactTab;
  onTabChange: (tab: ContactTab) => void;
  children: ReactNode;
}

export default function ContactTabs({ activeTab, onTabChange, children }: ContactTabsProps) {
  const { ref, isVisible } = useFadeIn({ delay: 0 });

  const tabs = [
    { key: 'message' as ContactTab, label: 'Send Message' },
    { key: 'offices' as ContactTab, label: 'Our Offices' },
    { key: 'hours' as ContactTab, label: 'Business Hours' }
  ];

  return (
    <div 
      ref={ref}
      className={`py-8 sm:py-16 bg-gray-50 dark:bg-gray-800 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg w-full max-w-md sm:max-w-none sm:w-auto overflow-x-auto transition-colors">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-red-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

