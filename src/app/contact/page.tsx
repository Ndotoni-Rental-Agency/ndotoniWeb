'use client';

import { useState } from 'react';
import {
  ContactHeader,
  ContactTabs,
  ContactForm,
  OfficesTab,
  HoursTab,
  ContactCTA,
  ContactTab,
  Office,
  ContactFormData
} from '@/components/contact';

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<ContactTab>('message');

  const offices: Office[] = [
    {
      city: 'Dar es Salaam',
      country: 'Tanzania',
      address: 'Masaki Peninsula, Plot 123, Toure Drive',
      phone: '+255 123 456 789',
      email: 'dar@ndotoni.co.tz',
      isMain: true
    },
    {
      city: 'Arusha',
      country: 'Tanzania', 
      address: 'Njiro Road, Block C',
      phone: '+255 123 456 792',
      email: 'arusha@ndotoni.co.tz',
      isMain: false
    },
    {
      city: 'Mwanza',
      country: 'Tanzania',
      address: 'Nyerere Road, Building 45',
      phone: '+255 123 456 793', 
      email: 'mwanza@ndotoni.co.tz',
      isMain: false
    }
  ];

  const handleFormSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', data);
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <ContactHeader />

      <ContactTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'message' && (
          <ContactForm onSubmit={handleFormSubmit} />
        )}
        {activeTab === 'offices' && (
          <OfficesTab offices={offices} />
        )}
        {activeTab === 'hours' && (
          <HoursTab />
        )}
      </ContactTabs>

      <ContactCTA />
    </div>
  );
}
