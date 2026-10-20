'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './HomeDesign.module.css';

const steps = [
  { en: 'Find a home that fits.', sw: 'Chagua nyumba inayokufaa.', bodyEn: 'Explore photos, locations and monthly rents. Save the places you would like to see.', bodySw: 'Angalia picha, maeneo na kodi za mwezi. Hifadhi nyumba unazopenda.' },
  { en: 'Talk it through. Take a look.', sw: 'Uliza. Tembelea. Jionee.', bodyEn: 'Ask us about availability, rental terms and arranging a viewing on WhatsApp.', bodySw: 'Tuulize kuhusu upatikanaji, masharti ya upangaji na kupanga kutembelea kupitia WhatsApp.' },
  { en: 'Make your next move.', sw: 'Anza ukurasa mpya.', bodyEn: 'See the home in person and confirm the full move-in costs and terms with the landlord before deciding.', bodySw: 'Tembelea nyumba na uthibitishe gharama zote na masharti na mwenye nyumba kabla ya kuamua.' },
];

export function WhyNdotoni() {
  const { language } = useLanguage();
  const sw = language === 'sw';
  return (
    <section className={styles.service} aria-labelledby="why-ndotoni-title">
      <div className={styles.serviceIntro}>
        <p className={styles.eyebrow}>{sw ? 'NJIA YA KWENDA NYUMBANI' : 'A MORE PERSONAL WAY HOME'}</p>
        <h2 id="why-ndotoni-title" className={styles.serviceTitle}>{sw ? 'Hatua inayofuata, tuko pamoja.' : 'Your next chapter. A little guidance.'}</h2>
        <p>{sw ? 'Kutafuta nyumba ni uamuzi mkubwa. Anza kwa kuangalia, uliza maswali, na upate msaada wa timu yetu kupitia WhatsApp.' : 'Finding a home is a big decision. Take your time, ask your questions, and reach our team on WhatsApp when you need a hand.'}</p>
      </div>
      <ol className={styles.serviceSteps}>
        {steps.map((step, index) => <li key={step.en} className={styles.serviceStep}><span aria-hidden="true">0{index + 1}</span><div><h3>{sw ? step.sw : step.en}</h3><p>{sw ? step.bodySw : step.bodyEn}</p></div></li>)}
      </ol>
    </section>
  );
}
