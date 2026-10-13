'use client';

import { useEffect, useState } from 'react';
import { getHomepagePropertiesFromCache } from '@/lib/homepage-cache';
import { ListingImage } from '@/components/property/ListingImage';
import { normalizeLocationName } from '@/lib/location/normalize';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Home,
  Building2,
  KeyRound,
  LayoutGrid,
  Banknote,
  Sparkles,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Area {
  id: string;
  nameEn: string;
  nameSw: string;
  descriptionEn: string;
  descriptionSw: string;
  href: string;
}

const areas: Area[] = [
  {
    id: 'kinondoni',
    nameEn: 'Kinondoni',
    nameSw: 'Kinondoni',
    descriptionEn: 'Bustling area with great amenities',
    descriptionSw: 'Eneo lenye shughuli nyingi na huduma nzuri',
    href: '/search?region=DAR ES SALAAM&district=KINONDONI',
  },
  {
    id: 'ilala',
    nameEn: 'Ilala',
    nameSw: 'Ilala',
    descriptionEn: 'Central location, city living',
    descriptionSw: 'Eneo la kati, maisha ya mjini',
    href: '/search?region=DAR ES SALAAM&district=ILALA',
  },
  {
    id: 'temeke',
    nameEn: 'Temeke',
    nameSw: 'Temeke',
    descriptionEn: 'Growing area with affordable options',
    descriptionSw: 'Eneo linalokua na bei nafuu',
    href: '/search?region=DAR ES SALAAM&district=TEMEKE',
  },
  {
    id: 'ubungo',
    nameEn: 'Ubungo',
    nameSw: 'Ubungo',
    descriptionEn: 'Near universities and transport hubs',
    descriptionSw: 'Karibu na vyuo vikuu na vituo vya usafiri',
    href: '/search?region=DAR ES SALAAM&district=UBUNGO',
  },
  {
    id: 'kigamboni',
    nameEn: 'Kigamboni',
    nameSw: 'Kigamboni',
    descriptionEn: 'Coastal living, peaceful neighborhoods',
    descriptionSw: 'Makazi ya pwani, maeneo ya amani',
    href: '/search?region=DAR ES SALAAM&district=KIGAMBONI',
  },
  {
    id: 'dar',
    nameEn: 'All Dar es Salaam',
    nameSw: 'Dar es Salaam Yote',
    descriptionEn: 'Explore the entire city',
    descriptionSw: 'Tafuta jiji lote',
    href: '/search?region=DAR ES SALAAM',
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
  {
    id: 'rooms',
    labelEn: 'Single rooms',
    labelSw: 'Vyumba',
    icon: KeyRound,
    href: '/search?region=DAR ES SALAAM&propertyType=ROOM',
  },
  {
    id: 'houses',
    labelEn: 'Houses',
    labelSw: 'Nyumba',
    icon: Home,
    href: '/search?region=DAR ES SALAAM&propertyType=HOUSE',
  },
  {
    id: 'apartments',
    labelEn: 'Apartments',
    labelSw: 'Ghorofa',
    icon: Building2,
    href: '/search?region=DAR ES SALAAM&propertyType=APARTMENT',
  },
  {
    id: 'studios',
    labelEn: 'Studios',
    labelSw: 'Studio',
    icon: LayoutGrid,
    href: '/search?region=DAR ES SALAAM&propertyType=STUDIO',
  },
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
  const [areaImages, setAreaImages] = useState<Record<string, string>>({});
  useEffect(() => {
    let active = true;
    getHomepagePropertiesFromCache()
      .then((data) => {
        const homes = [
          ...data.featured,
          ...data.recent,
          ...data.lowestPrice,
          ...data.highestPrice,
        ];
        const images: Record<string, string> = {};
        for (const area of areas) {
          const home = homes.find(
            (p) =>
              p.thumbnail &&
              !/\.(mp4|mov|webm)(\?|$)/i.test(p.thumbnail) &&
              (area.id === 'dar' ||
                normalizeLocationName(p.district) ===
                  normalizeLocationName(area.nameEn)),
          );
          if (home?.thumbnail) images[area.id] = home.thumbnail;
        }
        if (active) setAreaImages(images);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className="border-t border-stone-200/70 py-12 sm:py-16 dark:border-gray-800"
      aria-labelledby="home-browse-title"
    >
      <h2 id="home-browse-title" className="poster-heading sm:!text-4xl">
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
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
        {areas.map((area) => {
          const name = sw ? area.nameSw : area.nameEn;
          return (
            <li key={area.id}>
              <Link
                href={area.href}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600 sm:aspect-[16/10]"
              >
                {areaImages[area.id] ? (
                  <ListingImage
                    src={areaImages[area.id]}
                    alt=""
                    sizes="(max-width: 639px) 50vw, 33vw"
                    imageClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute -right-6 -top-8 h-48 w-48 rounded-full border-[24px] border-white/5"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/5" />
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-sm">
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <span className="block font-poster text-xl font-bold tracking-tight text-white sm:text-3xl">
                    {name}
                  </span>
                  <span className="mt-1 block text-xs text-white/80 sm:text-sm">
                    {sw ? 'Angalia nyumba' : 'Explore homes'}
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
                <Icon
                  size={18}
                  strokeWidth={2}
                  className="text-brand-700 dark:text-brand-300"
                  aria-hidden="true"
                />
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
