import type { Metadata } from 'next';
import { LandlordsPageContent } from '@/components/landlords/LandlordsPageContent';

export const metadata: Metadata = {
  title: 'List Your Property | Ndotoni – Find Reliable Tenants Faster',
  description:
    'Market your rental property on Ndotoni and connect with verified, qualified tenants across Tanzania. WhatsApp-first, free to start, M-Pesa payments.',
  keywords: [
    'list property Tanzania',
    'find tenants Tanzania',
    'landlord platform Tanzania',
    'rental listings Tanzania',
    'WhatsApp property listing',
  ],
  openGraph: {
    title: 'List Your Property on Ndotoni',
    description:
      "Get reliable tenants faster with Ndotoni. Tanzania's WhatsApp-first rental platform for landlords.",
    url: 'https://www.ndotoni.com/landlords',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function LandlordsPage() {
  return <LandlordsPageContent />;
}
