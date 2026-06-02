import type { Metadata } from 'next';
import {
  LandlordsHero,
  LandlordsStats,
  LandlordsHowItWorks,
  LandlordsBenefits,
  LandlordsTestimonials,
  LandlordsFAQ,
  LandlordsCTA,
} from '@/components/landlords';

export const metadata: Metadata = {
  title: 'List Your Property | Ndotoni – Find Reliable Tenants Faster',
  description:
    'Market your rental property on Ndotoni and connect with verified, qualified tenants across Tanzania. Simple listing, fast occupancy, dedicated support.',
  keywords: [
    'list property Tanzania',
    'find tenants Tanzania',
    'landlord platform Tanzania',
    'rental listings Tanzania',
    'property management Tanzania',
  ],
  openGraph: {
    title: 'List Your Property on Ndotoni',
    description:
      "Get reliable tenants faster with Ndotoni. Tanzania's leading rental platform for landlords.",
    url: 'https://www.ndotoni.com/landlords',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function LandlordsPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <LandlordsHero />
      <LandlordsStats />
      <LandlordsHowItWorks />
      <LandlordsBenefits />
      <LandlordsTestimonials />
      <LandlordsFAQ />
      <LandlordsCTA />
    </div>
  );
}
