import type { ReactNode } from 'react';
import Image from 'next/image';
import { KangaBand } from '@/components/ui/KangaBand';

export function PageHeader({
  title,
  highlight,
  subtitle,
  actions,
  children,
  image,
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <header className="relative overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(186,207,150,0.12),transparent_65%)]"
      />
      <div
        className={`relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 ${image || children ? 'grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16' : ''}`}
      >
        <div>
          <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold tracking-[0.25em] text-white/80">
            <span className="h-px w-8 bg-white/50" aria-hidden="true" />
            NDOTONI · TANZANIA
          </p>
          <h1 className="max-w-4xl font-poster text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-white text-balance sm:text-6xl lg:text-7xl">
            {title}
            {highlight && (
              <span className="mt-1 block font-sans font-semibold tracking-[-0.04em] text-white">
                {highlight}
              </span>
            )}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {subtitle}
            </p>
          )}
          {actions && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {actions}
            </div>
          )}
          <KangaBand variant="thin" className="mt-8 w-28 bg-transparent" />
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-[8rem] rounded-b-2xl border border-white/15 sm:rounded-t-[12rem] lg:aspect-[5/6] lg:max-h-[420px]">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              unoptimized={image.startsWith('/')}
              priority
              className="object-cover"
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-brand-900/30 to-transparent"
              aria-hidden="true"
            />
          </div>
        ) : (
          children
        )}
      </div>
    </header>
  );
}
