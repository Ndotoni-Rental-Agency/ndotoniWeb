'use client';
import Link from 'next/link';
import { ArrowUpRight, Home, Building2, KeyRound, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './HomeDesign.module.css';
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

];

export function HomeBrowse() {
  const { language } = useLanguage();
  const sw = language === 'sw';
  return (
    <section className={styles.browse} aria-labelledby="home-browse-title">
      <div className={styles.sectionHead}>
        <div><p className={styles.eyebrow}>{sw ? 'MAENEO YA DAR ES SALAAM' : 'EXPLORE DAR ES SALAAM'}</p><h2 id="home-browse-title" className={styles.sectionTitle}>{sw ? 'Maisha yako, eneo lako.' : 'Find your kind of neighbourhood.'}</h2></div>
        <p className={styles.sectionDescription}>{sw ? 'Karibu na kazi, familia au sehemu unazopenda. Anza na eneo linalokufaa.' : 'Closer to work, family, or your favourite corner of the city. Start with the area that suits your everyday.'}</p>
      </div>
      <ul className={styles.areaGrid}>
        {areas.map((area) => <li key={area.id}><Link href={area.href} className={styles.areaLink}><span><span className={styles.areaName}>{sw ? area.nameSw : area.nameEn}</span></span><ArrowUpRight size={17} aria-hidden="true" /></Link></li>)}
      </ul>
      <ul className={styles.typeLinks}>{homeTypes.map(type => { const Icon = type.icon; return <li key={type.id}><Link href={type.href}><Icon size={15} aria-hidden="true" />{sw ? type.labelSw : type.labelEn}</Link></li>; })}</ul>
    </section>
  );
}
