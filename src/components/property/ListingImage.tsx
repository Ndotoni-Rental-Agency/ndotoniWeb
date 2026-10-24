'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/common';
import { isProxyable } from '@/lib/images/loader';

type Stage = 'proxy' | 'original' | 'failed';

/**
 * Listing photo with a branded loading sequence:
 * shimmer → photo. One request per photo size; photos can paint before hydration.
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


  if (stage === 'failed') {
    return <div className={cn('absolute inset-0', className)}>{fallback}</div>;
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-stone-100 dark:bg-gray-700', className)}>
      {/* Shimmer until anything arrives */}
      {!loaded && <div aria-hidden="true" className="listing-shimmer absolute inset-0" />}
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
          'object-cover',
          imageClassName,
        )}
      />
    </div>
  );
}
