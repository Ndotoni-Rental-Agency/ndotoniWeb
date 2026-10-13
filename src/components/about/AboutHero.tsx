'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/marketing/PageHeader';
import { posterButton } from '@/components/marketing/PosterHero';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutHero() {
  const { t } = useLanguage();

  return (
    <PageHeader
      image="/images/hero3.avif"
      title={t('about.hero.title')}
      highlight={t('about.hero.titleHighlight')}
      subtitle={t('about.hero.subtitle')}
      actions={
        <>
          <Link href="/contact" className={posterButton.onGreenSecondary}>
            {t('about.hero.getInTouch')}
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 px-7 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            {t('about.hero.browseProperties')}
          </Link>
        </>
      }
    />
  );
}
