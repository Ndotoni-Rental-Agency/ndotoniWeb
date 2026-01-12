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
  WhyChooseUs
} from '@/components/about';

export default function AboutPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'team'>('story');

  const stats = [
    { label: t('about.stats.propertiesListed'), value: '10,000+' },
    { label: t('about.stats.happyTenants'), value: '25,000+' },
    { label: t('about.stats.citiesCovered'), value: '15+' },
    { label: t('about.stats.yearsOfExperience'), value: '8+' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former real estate executive with 15+ years of experience in property management and technology.',
      initials: 'SJ',
      color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech entrepreneur passionate about creating seamless digital experiences for property rentals.',
      initials: 'MC',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Amina Hassan',
      role: 'Head of Operations',
      bio: 'Operations expert focused on streamlining processes and ensuring excellent customer service.',
      initials: 'AH',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    },
    {
      name: 'David Mwangi',
      role: 'Head of Growth',
      bio: 'Marketing strategist dedicated to connecting property owners with quality tenants.',
      initials: 'DM',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
    }
  ];

  const values = [
    {
      title: t('about.mission.transparency'),
      description: t('about.mission.transparencyDesc'),
      icon: '👁️'
    },
    {
      title: t('about.mission.innovation'),
      description: t('about.mission.innovationDesc'),
      icon: '⚡'
    },
    {
      title: t('about.mission.community'),
      description: t('about.mission.communityDesc'),
      icon: '🤝'
    },
    {
      title: t('about.mission.quality'),
      description: t('about.mission.qualityDesc'),
      icon: '✨'
    }
  ];

  const tabs = [
    { key: 'story', label: t('about.tabs.story'), icon: '📖' },
    { key: 'mission', label: t('about.tabs.mission'), icon: '🎯' },
    { key: 'team', label: t('about.tabs.team'), icon: '👥' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      <AboutHero />
      
      <AboutStats stats={stats} />

      <AboutTabs 
        activeTab={activeTab} 
        onTabChange={(tab) => setActiveTab(tab as 'story' | 'mission' | 'team')}
        tabs={tabs}
      >
        {activeTab === 'story' && <StoryTab key="story" />}
        {activeTab === 'mission' && <MissionTab key="mission" values={values} />}
        {activeTab === 'team' && <TeamTab key="team" teamMembers={teamMembers} />}
      </AboutTabs>

      <WhyChooseUs />

      <AboutCTA />
    </div>
  );
}
