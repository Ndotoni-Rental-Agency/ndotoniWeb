'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationCard {
  id: string;
  nameEn: string;
  nameSw: string;
  descriptionEn: string;
  descriptionSw: string;
  href: string;
  image: string;
}

const popularLocations: LocationCard[] = [
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

export function PopularLocations() {
  const { language } = useLanguage();

  return (
    <section className="py-16 sm:py-20 border-t border-stone-200/70 dark:border-gray-800">
      <div className="text-center mb-10 sm:mb-12">
        <p className="text-sm font-bold tracking-wide uppercase text-brand-500 mb-3">
          {language === 'sw' ? 'Maeneo maarufu' : 'Popular locations'}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-ink-900 dark:text-white">
          {language === 'sw' ? 'Tafuta kwa eneo' : 'Browse by location'}
        </h2>
        <p className="mt-3 text-ink-500 dark:text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
          {language === 'sw'
            ? 'Maeneo maarufu zaidi ya Dar es Salaam'
            : 'Most popular areas in Dar es Salaam'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {popularLocations.map((location) => (
          <Link
            key={location.id}
            href={location.href}
            className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-stone-100 dark:bg-gray-800"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={location.image}
                alt={language === 'sw' ? location.nameSw : location.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-bold text-base sm:text-lg">
                {language === 'sw' ? location.nameSw : location.nameEn}
              </h3>
              <p className="text-white/70 text-xs sm:text-sm mt-0.5 line-clamp-1">
                {language === 'sw' ? location.descriptionSw : location.descriptionEn}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
