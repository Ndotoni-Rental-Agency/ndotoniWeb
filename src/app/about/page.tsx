'use client';

import { COMPANY_INFO } from '@/config/company';
import {
  AboutHero,
  StoryTab,
  AboutCTA
} from '@/components/about';

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <AboutHero />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 lg:p-16 border border-gray-100 dark:border-gray-700">
          <StoryTab />
        </div>
      </div>

      <AboutCTA />
    </div>
  );
}
