'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AboutHero,
  AboutStats,
  AboutTabs,
  StoryTab,
  MissionTab,
  TeamTab,
  AboutCTA,
  WhyChooseUs,
} from '@/components/about';

export default function AboutPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('story');

  // Company values for MissionTab
  const companyValues = [
    {
      title: 'Transparency',
      description: 'We believe in open and honest communication with all our users, providing clear information about properties and processes.',
    },
    {
      title: 'Trust',
      description: 'Building trust through verified listings, secure transactions, and reliable service for both landlords and tenants.',
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our platform with new features and technologies to enhance the rental experience.',
    },
    {
      title: 'Community',
      description: 'Creating a supportive community where landlords and tenants can connect and build lasting relationships.',
    },
  ];

  // Team members for TeamTab
  const teamMembers = [
    {
      name: 'Kelvin Lameck Makoye',
      role: 'Founder & CEO',
      bio: 'Passionate about transforming the property rental experience in Tanzania through technology and innovation.',
      initials: 'KM',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    },
    {
      name: 'Development Team',
      role: 'Technology & Engineering',
      bio: 'Building and maintaining a robust platform that serves thousands of users across Tanzania.',
      initials: 'DT',
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
    },
    {
      name: 'Support Team',
      role: 'Customer Success',
      bio: 'Dedicated to providing excellent service and support to both landlords and tenants.',
      initials: 'ST',
      color: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white',
    },
    {
      name: 'Operations Team',
      role: 'Business Operations',
      bio: 'Ensuring smooth operations and continuous improvement of our services.',
      initials: 'OT',
      color: 'bg-gradient-to-br from-orange-500 to-red-600 text-white',
    },
  ];

  // Platform statistics for AboutStats
  const platformStats = [
    { label: 'Active Properties', value: '1,000+' },
    { label: 'Happy Tenants', value: '5,000+' },
    { label: 'Verified Landlords', value: '500+' },
    { label: 'Cities Covered', value: '10+' },
  ];

  const tabs = [
    { key: 'story', label: t('about.tabs.story') },
    { key: 'mission', label: t('about.tabs.mission') },
    { key: 'team', label: t('about.tabs.team') },
    { key: 'business', label: 'Business Info' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'story':
        return <StoryTab />;
      case 'mission':
        return <MissionTab values={companyValues} />;
      case 'team':
        return <TeamTab teamMembers={teamMembers} />;
      case 'business':
        return <BusinessInfoTab />;
      default:
        return <StoryTab />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AboutHero />
      {/* <AboutStats stats={platformStats} /> */}
      <AboutTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}>
        {renderTabContent()}
      </AboutTabs>
      {/* <WhyChooseUs /> */}
      <AboutCTA />
    </div>
  );
}

// Business Information Tab Component
function BusinessInfoTab() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Business Registration Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Ndotoni is a legally registered business in Tanzania, operating with full compliance 
          to local regulations and business standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Legal Business Name
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            NDOTONI ONLINE TRADERS
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Registration Number
          </h3>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            631961
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Principal Place of Business
        </h3>
        <p className="text-gray-900 dark:text-white leading-relaxed">
          Near Navanga Ward Office, Nangaru Ward<br />
          Lindi District, Lindi Region<br />
          P.O. Box 328, Postal Code 65207<br />
          Tanzania
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Email
          </h3>
          <a 
            href="mailto:info@ndotoni.com" 
            className="text-lg font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            info@ndotoni.com
          </a>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Phone
          </h3>
          <a 
            href="tel:+255782267121" 
            className="text-lg font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            +255 782 267 121
          </a>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
          Business Activities
        </h3>
        <ul className="text-gray-900 dark:text-white space-y-2">
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">•</span>
            <span>Real estate activities with own or leased property</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">•</span>
            <span>Real estate activities on a fee or contract basis</span>
          </li>
          <li className="flex items-start">
            <span className="text-emerald-500 mr-2">•</span>
            <span>Renting and leasing of machinery, equipment and tangible goods</span>
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Proprietor
        </h3>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          Kelvin Lameck Makoye
        </p>
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              Verified & Registered
            </h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              Registered under the Business Names (Registration) Act (Cap 213) of Tanzania<br />
              Registration Date: 13/02/2026<br />
              Registered with BRELA (Business Registrations and Licensing Agency)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
