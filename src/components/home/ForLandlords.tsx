'use client';

import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './HomeDesign.module.css';

export function ForLandlords() {
  const { language } = useLanguage();
  const sw = language === 'sw';
  return (
    <section className={styles.ownerSection} aria-labelledby="for-landlords-title">
      <div>
        <p className={styles.eyebrow}>{sw ? 'KWA WENYE NYUMBA' : 'FOR PROPERTY OWNERS'}</p>
        <h2 id="for-landlords-title" className={styles.sectionTitle}>{sw ? 'Nyumba yako. Mwanzo wa mtu mwingine.' : 'Your property. Someone’s next chapter.'}</h2>
        <p>{sw ? 'Una nyumba ya kupangisha? Tangaza bure au tuandikie kuhusu nyumba yako na namna ya kuionyesha vizuri.' : 'Have a home to rent? List it for free, or talk to us about your property and how to present it at its best.'}</p>
        <div className={styles.ownerActions}>
          <Link className={styles.textLink} href="/property/create">{sw ? 'Tangaza nyumba bure' : 'List your home for free'}<ArrowRight size={16} /></Link>
          <a className={styles.textLink} href={`https://wa.me/255790720329?text=${encodeURIComponent(sw ? 'Habari, nina nyumba ya kupangisha. Ningependa kuzungumza na timu yenu.' : 'Hello, I have a home to rent and would like to speak with your team.')}`} target="_blank" rel="noopener noreferrer">{sw ? 'Zungumza nasi' : 'Talk to our team'}<ArrowUpRight size={16} /></a>
        </div>
      </div>
      <div className={styles.ownerAside}>
        <div><h3>{sw ? 'Unakaa kwa muda mfupi?' : 'Just staying a little while?'}</h3><p>{sw ? 'Pata makazi ya muda mfupi kwenye Ndotoni Stays.' : 'Discover short stays and spaces for your next visit on Ndotoni Stays.'}</p><a href="https://www.ndotonistays.com" target="_blank" rel="noopener noreferrer" className={styles.textLink}>Ndotoni Stays<ArrowUpRight size={16} /></a></div>
        <div><h3>{sw ? 'Unamjua mwenye nyumba?' : 'Know a property owner?'}</h3><Link href="/refer" className={styles.textLink}>{sw ? 'Tazama mpango wetu wa rufaa' : 'Explore our referral programme'}<ArrowRight size={16} /></Link></div>
      </div>
    </section>
  );
}
