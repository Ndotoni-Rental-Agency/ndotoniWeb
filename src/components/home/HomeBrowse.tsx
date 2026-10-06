'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Building2, KeyRound, LayoutGrid, Banknote, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Area {
  id: string;
  nameEn: string;
  nameSw: string;
  descriptionEn: string;
  descriptionSw: string;
  href: string;
  image: string;
}

const areas: Area[] = [
  {
    id: 'kinondoni',
    nameEn: 'Kinondoni',
    nameSw: 'Kinondoni',
    descriptionEn: 'Bustling area with great amenities',
    descriptionSw: 'Eneo lenye shughuli nyingi na huduma nzuri',
    href: '/search?region=DAR ES SALAAM&district=KINONDONI',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=75&w=600&auto=format&fit=crop',
  },
  {
    id: 'ilala',
    nameEn: 'Ilala',
    nameSw: 'Ilala',
    descriptionEn: 'Central location, city living',
    descriptionSw: 'Eneo la kati, maisha ya mjini',
    href: '/search?region=DAR ES SALAAM&district=ILALA',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=75&w=600&auto=format&fit=crop',
  },
  {
    id: 'temeke',
    nameEn: 'Temeke',
    nameSw: 'Temeke',
    descriptionEn: 'Growing area with affordable options',
    descriptionSw: 'Eneo linalokua na bei nafuu',
    href: '/search?region=DAR ES SALAAM&district=TEMEKE',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=75&w=600&auto=format&fit=crop',
  },
  {
    id: 'ubungo',
    nameEn: 'Ubungo',
    nameSw: 'Ubungo',
    descriptionEn: 'Near universities and transport hubs',
    descriptionSw: 'Karibu na vyuo vikuu na vituo vya usafiri',
    href: '/search?region=DAR ES SALAAM&district=UBUNGO',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=75&w=600&auto=format&fit=crop',
  },
  {
    id: 'kigamboni',
    nameEn: 'Kigamboni',
    nameSw: 'Kigamboni',
    descriptionEn: 'Coastal living, peaceful neighborhoods',
    descriptionSw: 'Makazi ya pwani, maeneo ya amani',
    href: '/search?region=DAR ES SALAAM&district=KIGAMBONI',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=75&w=600&auto=format&fit=crop',
  },
  {
    id: 'dar',
    nameEn: 'All Dar es Salaam',
    nameSw: 'Dar es Salaam Yote',
    descriptionEn: 'Explore the entire city',
    descriptionSw: 'Tafuta jiji lote',
    href: '/search?region=DAR ES SALAAM',
    image: 'https://i.natgeofe.com/n/2afb3b75-e325-42f3-89cb-d8ddb9a9dc08/dar-es-salaam-sobecki-01.jpg',
  },
];

interface HomeType {
  id: string;
  labelEn: string;
  labelSw: string;
  hintEn?: string;
  hintSw?: string;
  icon: LucideIcon;
  href: string;
}

const homeTypes: HomeType[] = [
  { id: 'rooms', labelEn: 'Single rooms', labelSw: 'Vyumba', icon: KeyRound, href: '/search?region=DAR ES SALAAM&propertyType=ROOM' },
  { id: 'houses', labelEn: 'Houses', labelSw: 'Nyumba', icon: Home, href: '/search?region=DAR ES SALAAM&propertyType=HOUSE' },
  { id: 'apartments', labelEn: 'Apartments', labelSw: 'Ghorofa', icon: Building2, href: '/search?region=DAR ES SALAAM&propertyType=APARTMENT' },
  { id: 'studios', labelEn: 'Studios', labelSw: 'Studio', icon: LayoutGrid, href: '/search?region=DAR ES SALAAM&propertyType=STUDIO' },
  {
    id: 'cheap',
    labelEn: 'Budget friendly',
    labelSw: 'Bei nafuu',
    hintEn: 'under TZS 300K',
    hintSw: 'chini ya TZS 300K',
    icon: Banknote,
    href: '/search?region=DAR ES SALAAM&minPrice=50000&maxPrice=300000',
  },
  {
    id: 'premium',
    labelEn: 'Premium',
    labelSw: 'Za kifahari',
    hintEn: 'from TZS 1M',
    hintSw: 'kuanzia TZS 1M',
    icon: Sparkles,
    href: '/search?region=DAR ES SALAAM&minPrice=1000000&maxPrice=5000000',
  },
];

export function HomeBrowse() {
  const { language } = useLanguage();
  const sw = language === 'sw';

  return (
    <section className="py-14 sm:py-20" aria-labelledby="home-browse-title">
      <h2 id="home-browse-title" className="poster-heading">
        {sw ? 'Tafuta kwa njia yako' : 'Browse your way'}
      </h2>
      <p className="mt-2 max-w-xl text-base text-ink-500 sm:text-lg dark:text-gray-400">
        {sw
          ? 'Chagua eneo la Dar es Salaam, au aina ya nyumba unayohitaji.'
          : 'Pick an area of Dar es Salaam, or the kind of home you need.'}
      </p>

      <h3 className="mt-8 text-sm font-semibold text-ink-700 dark:text-gray-300">
        {sw ? 'Kwa eneo' : 'By area'}
      </h3>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {areas.map((area) => {
          const name = sw ? area.nameSw : area.nameEn;
          return (
            <li key={area.id}>
              <Link
                href={area.href}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100 dark:bg-gray-800"
              >
                <img
                  src={area.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="block text-lg font-bold leading-tight text-white">{name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-white/85 line-clamp-2 sm:text-sm">
                    {sw ? area.descriptionSw : area.descriptionEn}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-10 text-sm font-semibold text-ink-700 dark:text-gray-300">
        {sw ? 'Kwa aina' : 'By type'}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {homeTypes.map((type) => {
          const Icon = type.icon;
          return (
            <li key={type.id}>
              <Link
                href={type.href}
                className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-ink-900 transition-colors hover:border-ink-900 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:border-white dark:hover:bg-gray-700"
              >
                <Icon size={18} strokeWidth={2} className="text-brand-700 dark:text-brand-300" aria-hidden="true" />
                {sw ? type.labelSw : type.labelEn}
                {type.hintEn && (
                  <span className="font-normal text-ink-500 dark:text-gray-400">
                    · {sw ? type.hintSw : type.hintEn}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
