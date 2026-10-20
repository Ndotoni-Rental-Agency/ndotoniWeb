'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Brand.module.css';

const guidance = [
  { en: 'Start with the essentials', sw: 'Anza na taarifa muhimu', bodyEn: 'Choose the home type, location, and monthly rent.', bodySw: 'Chagua aina ya nyumba, eneo na kodi ya mwezi.' },
  { en: 'Show the whole home', sw: 'Onyesha nyumba nzima', bodyEn: 'Use bright, upright photos of each room and the outside.', bodySw: 'Weka picha zenye mwanga mzuri za kila chumba na nje.' },
  { en: 'Make it easy to reach you', sw: 'Rahisisha mawasiliano', bodyEn: 'Add contact details so enquiries can reach the right person.', bodySw: 'Weka mawasiliano ili maswali yawafikie wahusika.' },
];

export function ListingShell({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeading}>
          <div>
            <p className={styles.eyebrow}>{sw ? 'KWA WENYE NYUMBA' : 'FOR PROPERTY OWNERS'}</p>
            <h1 className={styles.title}>{sw ? 'Nyumba yako. Wapangaji wapya.' : 'Your property. Their next home.'}</h1>
            <p className={styles.description}>{sw ? 'Weka taarifa na picha zinazowasaidia wapangaji kuelewa nyumba yako.' : 'Give your home a clear introduction, with useful details and photos.'}</p>
          </div>
        </div>
        <div className={styles.listingLayout}>
          <aside className={styles.listingNote}>
            <h2>{sw ? 'Tangazo zuri huanza hapa.' : 'A thoughtful listing starts here.'}</h2>
            <ol>{guidance.map((item, index) => <li key={item.en}><span aria-hidden="true">0{index + 1}</span><div><h3>{sw ? item.sw : item.en}</h3><p>{sw ? item.bodySw : item.bodyEn}</p></div></li>)}</ol>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
