import type { Metadata } from 'next';
import { ReferPageContent } from '@/components/refer/ReferPageContent';

export const metadata: Metadata = {
  title: 'Pata Pesa – Tambulisha Mwenye Nyumba | Ndotoni Referral Program',
  description:
    'Unafahamu mtu anayepangisha? Tuunganishe naye upate hadi TZS 25,000 kwa wenyeji wapya watano wanaostahili. Malipo kwa M-Pesa moja kwa moja.',
  keywords: [
    'pata pesa Tanzania',
    'refer landlord Tanzania',
    'earn money referral Tanzania',
    'Ndotoni referral program',
    'tambulisha mwenye nyumba',
    'kupata pesa kwa referral',
  ],
  openGraph: {
    title: 'Pata Pesa kwa Kutambulisha Mwenye Nyumba | Ndotoni',
    description:
      'Tambulisha mwenye nyumba. Pata hadi TZS 25,000 kwa wenyeji wapya watano wanaostahili.',
    url: 'https://www.ndotoni.com/refer',
    siteName: 'Ndotoni',
    locale: 'en_TZ',
    type: 'website',
  },
};

export default function ReferPage() {
  return <ReferPageContent />;
}
