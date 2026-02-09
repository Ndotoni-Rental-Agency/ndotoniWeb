'use client';

import {
  ContactHeader,
  ContactForm,
  ContactCTA,
  SocialMediaSection,
  ContactFormData
} from '@/components/contact';
import { graphqlClient } from '@/lib/graphql-client';
import { submitContactInquiry } from '@/graphql/mutations';

export default function ContactPage() {
  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      const result = await graphqlClient.graphql({
        query: submitContactInquiry,
        variables: {
          input: {
            name: data.name,
            email: data.email,
            phone: data.phone || undefined,
            inquiryType: data.inquiryType.toUpperCase() as 'GENERAL' | 'SUPPORT' | 'PARTNERSHIP' | 'PROPERTY',
            subject: data.subject,
            message: data.message,
          },
        },
        authMode: 'apiKey', // Public mutation - no auth required
      });

      console.log('Inquiry submitted:', result.data.submitContactInquiry);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      throw error;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <ContactHeader />

      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
      </div>

      <SocialMediaSection />

      <ContactCTA />
    </div>
  );
}
