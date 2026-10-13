import type { Metadata } from 'next';
import { ReferPageContent } from '@/components/refer/ReferPageContent';

export const metadata: Metadata = {
  title: 'Refer a host, earn up to TZS 25,000 | Ndotoni',
  description:
    'Share your personal Link with property owners you know. Earn up to TZS 25,000: up to TZS 5,000 for each of your first five approved new hosts.',
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
      'Share your Link and earn up to TZS 25,000 for your first five approved new hosts.',
    url: 'https://www.ndotoni.com/refer',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function ReferPage() {
  return <ReferPageContent />;
}
