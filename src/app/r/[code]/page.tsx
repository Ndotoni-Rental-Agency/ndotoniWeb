import type { Metadata } from 'next';
import { ReferralWelcome } from '@/components/refer/ReferralWelcome';
export const metadata: Metadata = {
  title: 'Your invitation to Ndotoni',
  description: 'Find a rental or list your property with Ndotoni. Start on WhatsApp or download the app.',
  robots: { index: false, follow: false },
};
export default function ReferralPage({ params }: { params: { code: string } }) {
  return <ReferralWelcome code={params.code} />;
}
