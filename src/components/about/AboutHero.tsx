'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/marketing/PageHeader';
import { posterButton } from '@/components/marketing/PosterHero';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutHero() {
  const { t } = useLanguage();

  return (
    <PageHeader
      title={t('about.hero.title')}
      highlight={t('about.hero.titleHighlight')}
      subtitle={t('about.hero.subtitle')}
      actions={
        <>
          <Link href="/contact" className={posterButton.primary}>
            {t('about.hero.getInTouch')}
          </Link>
          <Link
            href="/search"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-ink-900 px-7 text-base font-bold text-ink-900 transition-colors hover:bg-stone-50 dark:border-white dark:text-white dark:hover:bg-gray-800"
          >
            {t('about.hero.browseProperties')}
          </Link>
        </>
      }
    />
  );
}

