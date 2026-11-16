import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kuhusu Ndotoni – Jukwaa la Nyumba za Kupanga Tanzania | About Ndotoni',
  description:
    'Ndotoni inaunganisha wapangaji na wamiliki wa nyumba Tanzania kwa nyumba zilizothibitishwa, picha halisi na mawasiliano ya moja kwa moja. Learn about Ndotoni.',
  alternates: { canonical: 'https://www.ndotoni.com/about' },
  openGraph: {
    title: 'Kuhusu Ndotoni',
    url: 'https://www.ndotoni.com/about',
    siteName: 'Ndotoni',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
