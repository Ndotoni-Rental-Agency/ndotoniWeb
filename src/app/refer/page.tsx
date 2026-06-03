import type { Metadata } from 'next';
import {
  ReferHero,
  ReferRewards,
  ReferHowItWorks,
  ReferForm,
  ReferTrust,
  ReferExamples,
  ReferFAQ,
  ReferCTA,
} from '@/components/refer';

export const metadata: Metadata = {
  title: 'Referral Program | Ndotoni – Earn Money by Referring Landlords',
  description:
    'Know a landlord? Refer them to Ndotoni and earn TZS 2,000 when they list a property, plus 10% of profits when it rents. Free to join, no limits.',
  keywords: [
    'refer landlord Tanzania',
    'earn money referral Tanzania',
    'Ndotoni referral program',
    'landlord referral reward',
    'make money Tanzania',
  ],
  openGraph: {
    title: 'Earn Money by Referring Landlords to Ndotoni',
    description:
      'Refer a landlord, earn TZS 2,000 when they list, plus 10% of rental profits. Free to join.',
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
      <ReferRewards />
      <ReferHowItWorks />
      <ReferTrust />
      <ReferExamples />
      <ReferForm />
      <ReferFAQ />
      <ReferCTA />
    </div>
  );
}
