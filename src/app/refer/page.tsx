import type { Metadata } from 'next';
import { ReferPageContent } from '@/components/refer/ReferPageContent';

export const metadata: Metadata = {
  title: 'Refer & earn up to TZS 50,000 | Ndotoni',
  description:
    'Follow us on Instagram and download the Ndotoni app. Earn up to TZS 50,000 for booking referrals and TZS 30,000 for host referrals. Terms apply.',
  keywords: [
    'pata pesa Tanzania',
    'refer landlord Tanzania',
    'earn money referral Tanzania',
    'Ndotoni referral program',
    'tambulisha mwenye nyumba',
    'kupata pesa kwa referral',
  ],
  openGraph: {
    title: 'Know someone with a place to rent? | Ndotoni',
    description:
      'Follow us on Instagram and download the Ndotoni app. Earn up to TZS 50,000 for booking referrals and TZS 30,000 for host referrals. Terms apply.',
    url: 'https://www.ndotoni.com/refer',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function ReferPage() {
  return <ReferPageContent />;
}
