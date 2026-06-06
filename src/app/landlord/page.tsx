import type { Metadata } from 'next';
import { LandlordsPageContent } from '@/components/landlords/LandlordsPageContent';

export const metadata: Metadata = {
  title: 'Wamiliki – Tunasimamia Nyumba Yako Bure | Ndotoni Property Management',
  description:
    'Ndotoni inasimamia nyumba yako bure. Tunapiga picha, tunatangaza, na kukutafutia wapangaji. Wewe pokea kodi tu. Hakuna gharama kwa mwenye nyumba.',
  keywords: [
    'property management Tanzania',
    'kusimamia nyumba bure',
    'find tenants Tanzania',
    'landlord services Tanzania',
    'kupata wapangaji',
    'nyumba za kupangisha',
    'free property listing Tanzania',
  ],
  openGraph: {
    title: 'Ndotoni – Tunasimamia Nyumba Yako Bure',
    description:
      'Picha, matangazo, wapangaji. Tunashughulikia kila kitu. Wewe pokea kodi tu.',
    url: 'https://www.ndotoni.com/landlord',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function LandlordsPage() {
  return <LandlordsPageContent />;
}
