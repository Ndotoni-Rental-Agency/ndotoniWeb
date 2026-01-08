'use client';

import { ReactNode } from 'react';
import { useFadeIn } from '@/hooks/useFadeIn';

interface Tab {
  key: string;
  label: string;
  icon: string;
}

interface AboutTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
  children: ReactNode;
}

export default function AboutTabs({ activeTab, onTabChange, tabs, children }: AboutTabsProps) {
  const { ref, isVisible } = useFadeIn({ delay: 200 });

  return (
    <div 
      ref={ref}
      className={`max-w-6xl mx-auto px-6 py-20 transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Tab Navigation */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 lg:p-16 border border-gray-100 dark:border-gray-700">
        {children}
      </div>
    </div>
  );
}

