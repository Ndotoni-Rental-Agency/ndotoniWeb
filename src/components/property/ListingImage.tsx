'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/common';
import { isProxyable, proxiedImageUrl } from '@/lib/images/loader';

type Stage = 'proxy' | 'original' | 'failed';

/**
 * Listing photo with a branded loading sequence:
 * shimmer → tiny blurred preview (~1 KB) → sharp photo fades in.
 * If the resizing proxy fails, it retries the original URL before giving up.
 */
export function ListingImage({
  src,
  alt,
  sizes,
  priority = false,
  quality = 70,
  className,
  imageClassName,
  fallback,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  imageClassName?: string;
  fallback?: React.ReactNode;
}) {
  const [stage, setStage] = useState<Stage>(isProxyable(src) ? 'proxy' : 'original');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStage(isProxyable(src) ? 'proxy' : 'original');
    setLoaded(false);
  }, [src]);

  const preview = stage === 'proxy' ? proxiedImageUrl(src, 32, 40) : null;

  if (stage === 'failed') {
    return <div className={cn('absolute inset-0', className)}>{fallback}</div>;
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-stone-100 dark:bg-gray-700', className)}>
      {/* Shimmer until anything arrives */}
      {!loaded && <div aria-hidden="true" className="listing-shimmer absolute inset-0" />}
      {/* Tiny blurred preview of the real photo */}
      {preview && !loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 bg-cover bg-center blur-xl"
          style={{ backgroundImage: `url("${preview}")` }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        unoptimized={stage === 'original'}
        onLoad={() => setLoaded(true)}
        onError={() => setStage((s) => (s === 'proxy' ? 'original' : 'failed'))}
        className={cn(
          'object-cover transition-[opacity,filter,transform] duration-500 ease-out motion-reduce:transition-none',
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
          imageClassName,
        )}
      />
    </div>
  );
}
