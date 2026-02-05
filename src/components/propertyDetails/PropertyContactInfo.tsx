'use client';

import React from 'react';
import { Property } from '@/API';

type Props = {
  property: Property;
};

export default function PropertyContactInfo({ property }: Props) {
  const contact = property.landlord || property.agent;
  const contactType = property.landlord ? 'Landlord' : 'Agent';

  if (!contact) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors">
        Contact {contactType}
      </h3>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
        </div>
        
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {contact.firstName} {contact.lastName}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Property {contactType}
          </div>
        </div>
      </div>
    </div>
  );
}