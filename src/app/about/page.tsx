'use client';

import { useState } from 'react';
import Link from 'next/link';

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
      image: '/images/team/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech entrepreneur passionate about creating seamless digital experiences for property rentals.',
      image: '/images/team/michael.jpg'
    },
    {
      name: 'Amina Hassan',
      role: 'Head of Operations',
      bio: 'Operations expert focused on streamlining processes and ensuring excellent customer service.',
      image: '/images/team/amina.jpg'
    },
    {
      name: 'David Mwangi',
      role: 'Head of Growth',
      bio: 'Marketing strategist dedicated to connecting property owners with quality tenants.',
      image: '/images/team/david.jpg'
    }
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in clear, honest communication between all parties in every transaction.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform to make property rental easier and more efficient.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Community',
      description: 'We foster strong relationships between landlords, tenants, and local communities.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Quality',
      description: 'We maintain high standards for properties and services to ensure the best experience.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="relative py-12 sm:py-16 lg:py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">
              About <span className="text-red-500 dark:text-red-400">nest</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 sm:mb-8 px-4 transition-colors">
              We're revolutionizing the way people find, rent, and manage properties across East Africa. 
              Our mission is to make quality housing accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Link 
                href="/contact"
                className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-colors text-center"
              >
                Get in Touch
              </Link>
              <Link 
                href="/search"
                className="border-2 border-red-500 dark:border-red-400 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-colors text-center"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500 dark:text-red-400 mb-2 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="py-12 sm:py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="bg-white dark:bg-gray-700 rounded-full p-1 shadow-lg w-full max-w-md sm:max-w-none sm:w-auto overflow-x-auto transition-colors">
              {[
                { key: 'story', label: 'Our Story' },
                { key: 'mission', label: 'Mission & Vision' },
                { key: 'team', label: 'Our Team' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-colors text-sm sm:text-base whitespace-nowrap ${
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
            {activeTab === 'story' && (
              <div className="rounded-2xl p-4 sm:p-8 transition-colors">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">Our Story</h2>
                <div className="prose prose-lg text-gray-600 dark:text-white space-y-6 transition-colors">
                  <p>
                    nest was born out of a simple frustration: finding quality rental properties in East Africa 
                    was unnecessarily complicated, time-consuming, and often unreliable. Our founders experienced 
                    this firsthand when searching for apartments in Dar es Salaam.
                  </p>
                  <p>
                    In 2016, we set out to change this. We started with a vision to create a platform that would 
                    connect property owners directly with tenants, eliminating the middlemen and reducing costs 
                    while improving transparency and trust.
                  </p>
                  <p>
                    What began as a small startup in Tanzania has grown into the leading property rental platform 
                    across East Africa. We've helped thousands of families find their perfect home and enabled 
                    property owners to manage their investments more effectively.
                  </p>
                  <p>
                    Today, we continue to innovate and expand our services, always keeping our core mission at 
                    heart: making quality housing accessible to everyone.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="p-4 sm:p-8 transition-colors">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">Mission & Vision</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Our Mission</h3>
                    <p className="text-gray-600 dark:text-white text-lg transition-colors">
                      To democratize access to quality housing by creating a transparent, efficient, and 
                      trustworthy platform that connects property owners with tenants across East Africa.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors">Our Vision</h3>
                    <p className="text-gray-600 dark:text-white text-lg transition-colors">
                      A future where everyone has access to safe, affordable, and quality housing, supported 
                      by technology that makes property rental simple, transparent, and fair for all parties.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 transition-colors">Our Values</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {values.map((value, index) => (
                        <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                          <div className="text-red-500 dark:text-red-400 mt-1 transition-colors">
                            {value.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors">{value.title}</h4>
                            <p className="text-gray-600 dark:text-gray-400 transition-colors">{value.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="p-4 sm:p-8 transition-colors">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 transition-colors">Meet Our Team</h2>
                <p className="text-gray-600 dark:text-white text-lg mb-8 transition-colors">
                  We're a diverse team of passionate individuals committed to transforming the property rental experience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="text-center">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center transition-colors">
                        <svg className="w-16 h-16 text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 transition-colors">{member.name}</h3>
                      <p className="text-red-500 dark:text-white font-medium mb-3 transition-colors">{member.role}</p>
                      <p className="text-gray-600 dark:text-white transition-colors">{member.bio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-red-500 dark:bg-red-600 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-red-100 dark:text-red-200 text-lg mb-8 max-w-2xl mx-auto transition-colors">
            Join thousands of satisfied tenants who have found their ideal properties through nest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search"
              className="bg-white text-red-500 hover:bg-gray-100 px-8 py-3 rounded-full font-medium transition-colors"
            >
              Start Searching
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-3 rounded-full font-medium transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}