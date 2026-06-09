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
      <div className="text-center mb-10 sm:mb-12">
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 dark:text-white">
          {language === 'sw' ? 'Kwanini watu wanatuchagua' : 'Why people choose us'}
        </h2>
      </div>

      {/* Mobile: horizontal card layout, Desktop: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
        {trustPoints.map((point) => {
          const Icon = point.icon;
          return (
            <div
              key={point.id}
              className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-gray-800/50 border border-stone-100 dark:border-gray-700/50"
            >
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
                <Icon size={22} className="text-brand-500" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-ink-900 dark:text-white mb-1 sm:mb-2">
                  {language === 'sw' ? point.titleSw : point.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-ink-500 dark:text-gray-400 leading-relaxed">
                  {language === 'sw' ? point.descriptionSw : point.descriptionEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
