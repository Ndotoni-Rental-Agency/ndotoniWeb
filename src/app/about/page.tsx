'use client';

import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'team'>('story');

  const stats = [
    { label: 'Properties Listed', value: '10,000+' },
    { label: 'Happy Tenants', value: '25,000+' },
    { label: 'Cities Covered', value: '15+' },
    { label: 'Years of Experience', value: '8+' }
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
      title: 'Transparency',
      description: 'Clear, honest communication between all parties in every transaction.',
      icon: '👁️'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our platform to make rental easier and efficient.',
      icon: '⚡'
    },
    {
      title: 'Community',
      description: 'Fostering strong relationships between landlords, tenants, and locals.',
      icon: '🤝'
    },
    {
      title: 'Quality',
      description: 'Maintaining high standards for properties and services excellence.',
      icon: '✨'
    }
  ];

  const tabs = [
    { key: 'story', label: 'Our Story', icon: '📖' },
    { key: 'mission', label: 'Mission & Vision', icon: '🎯' },
    { key: 'team', label: 'Our Team', icon: '👥' }
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
