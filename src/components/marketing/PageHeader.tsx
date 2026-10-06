import type { ReactNode } from 'react';
import { KangaBand } from '@/components/ui/KangaBand';

/**
 * Lighter page header for reading pages (about, contact, blog): poster
 * headline on white, optional green highlight, thin kanga strip.
 */
export function PageHeader({
  title,
  highlight,
  subtitle,
  actions,
  children,
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-16 lg:px-8">
      <h1
        className="max-w-4xl font-poster text-4xl font-extrabold leading-[1] tracking-[-0.035em] text-ink-900 text-balance sm:text-6xl dark:text-white"
        style={{ fontStretch: '88%' }}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className="text-brand-700 dark:text-brand-300">{highlight}</span>
          </>
        )}
      </h1>
      <KangaBand variant="thin" className="mt-6 max-w-[11rem]" />
      {subtitle && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-500 dark:text-gray-400">{subtitle}</p>
      )}
      {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div>}
      {children}
    </header>
  );
}
