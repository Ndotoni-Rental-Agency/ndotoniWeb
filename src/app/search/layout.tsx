import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tafuta Nyumba za Kupanga Tanzania | Search Rentals – Ndotoni',
  description:
    'Tafuta nyumba, vyumba na apartments za kupanga Tanzania kwa eneo, bei na idadi ya vyumba. Search verified rentals across Tanzania.',
  // Filtered result URLs are infinite combinations; the indexable entry points are the
  // /nyumba-za-kupanga location pages.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://www.ndotoni.com/nyumba-za-kupanga' },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
