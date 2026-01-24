'use client';

import {
  ContactHeader,
  ContactForm,
  ContactCTA,
  ContactFormData
} from '@/components/contact';

export default function ContactPage() {
  const handleFormSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', data);
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors">
      <ContactHeader />

      <div className="py-8 sm:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm onSubmit={handleFormSubmit} />
        </div>
      </div>

      <ContactCTA />
    </div>
  );
}
