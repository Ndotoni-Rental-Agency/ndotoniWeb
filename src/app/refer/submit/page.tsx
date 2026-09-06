import type { Metadata } from 'next';
import { ReferSubmitHeader } from '@/components/refer/ReferSubmitHeader';
import { ReferSubmitJourney } from '@/components/refer/ReferSubmitJourney';

export const metadata: Metadata = {
  title: 'Refer a Landlord | Ndotoni',
  description:
    'Submit landlord referrals to Ndotoni. Share your details and theirs — earn TZS 2,000 per landlord when they list.',
  robots: { index: false },
};

export default function ReferSubmitPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="container py-12 sm:py-16">
        <ReferSubmitHeader />
        <ReferSubmitJourney />
      </div>
    </div>
  );
}
