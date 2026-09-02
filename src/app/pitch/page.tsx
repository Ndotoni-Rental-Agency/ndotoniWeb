import type { Metadata } from 'next';
import { PitchTeleprompter } from '@/components/pitch/PitchTeleprompter';

export const metadata: Metadata = {
  title: 'Ndotoni Teleprompter',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PitchPage() {
  return <PitchTeleprompter />;
}
