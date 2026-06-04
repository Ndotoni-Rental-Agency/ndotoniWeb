import type { Metadata } from 'next';
import { ReferHero, ReferQuickEarn, ReferFAQ } from '@/components/refer';

export const metadata: Metadata = {
  title: 'Referral Program | Ndotoni – Earn Money by Referring Landlords',
  description:
    'Know a landlord? Tell us about them and earn TZS 2,000 when they list on Ndotoni. Up to 5 referrals per person. Paid via M-Pesa.',
  keywords: [
    'refer landlord Tanzania',
    'earn money referral Tanzania',
    'Ndotoni referral program',
    'landlord referral reward',
    'make money Tanzania',
  ],
  openGraph: {
    title: 'Know a Landlord? Earn Free Money with Ndotoni',
    description:
      'Refer up to 5 landlords. Earn TZS 2,000 when they list, plus 10% of rental profits.',
    url: 'https://www.ndotoni.com/refer',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function ReferPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <ReferHero />
      <ReferQuickEarn />
      <ReferFAQ />
    </div>
  );
}
