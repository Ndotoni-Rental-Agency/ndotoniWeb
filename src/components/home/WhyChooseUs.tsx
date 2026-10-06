'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Camera, MessageCircle, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TrustPoint {
  id: string;
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  icon: LucideIcon;
}

const trustPoints: TrustPoint[] = [
  {
    id: 'verified',
    titleEn: 'Verified Listings',
    titleSw: 'Nyumba Zilizothibitishwa',
    descriptionEn: 'Every property is visited and photographed. Real photos, accurate descriptions.',
    descriptionSw: 'Kila nyumba imetembelewa na kupigwa picha. Picha halisi, maelezo sahihi.',
    icon: Shield,
  },
  {
    id: 'photos',
    titleEn: 'Real Photos',
    titleSw: 'Picha Halisi',
    descriptionEn: 'We take the photos ourselves. What you see is exactly what you get.',
    descriptionSw: 'Sisi wenyewe tunapiga picha. Unachokiona ndicho unachokipata.',
    icon: Camera,
  },
  {
    id: 'whatsapp',
    titleEn: 'WhatsApp Support',
    titleSw: 'Msaada wa WhatsApp',
    descriptionEn: 'Questions? Chat with us directly on WhatsApp. Fast responses guaranteed.',
    descriptionSw: 'Maswali? Tuandikie WhatsApp moja kwa moja. Majibu ya haraka.',
    icon: MessageCircle,
  },
  {
    id: 'fair',
    titleEn: 'Fair & Transparent',
    titleSw: 'Bei Wazi',
    descriptionEn: 'All costs shown upfront. No hidden fees or surprise charges.',
    descriptionSw: 'Gharama zote zinaonekana. Hakuna ada za siri.',
    icon: Wallet,
  },
];

export function WhyChooseUs() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 border-t border-stone-200/70 dark:border-gray-800">
      <h2 className="poster-heading mb-10 sm:mb-12 max-w-2xl">
        {language === 'sw' ? 'Kwanini watu wanatuchagua' : 'Why people choose us'}
      </h2>

      <dl className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
        {trustPoints.map((point) => {
          const Icon = point.icon;
          return (
            <div key={point.id} className="flex items-start gap-4">
              <Icon
                size={28}
                strokeWidth={2}
                className="mt-1 shrink-0 text-brand-700 dark:text-brand-300"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <dt className="font-poster text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] text-ink-900 dark:text-white">
                  {language === 'sw' ? point.titleSw : point.titleEn}
                </dt>
                <dd className="mt-1.5 text-base text-ink-500 dark:text-gray-400 leading-relaxed max-w-md">
                  {language === 'sw' ? point.descriptionSw : point.descriptionEn}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
