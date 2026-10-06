'use client';

import type { ImgHTMLAttributes } from 'react';
import { proxiedImageUrl } from '@/lib/images/loader';

/**
 * Plain <img> that requests a resized copy through the image proxy and falls
 * back to the original URL if the proxy fails. For places that can't use
 * next/image (fixed-size thumbnails, media pickers).
 */
export function ProxiedImg({
  src,
  width,
  alt,
  ...rest
}: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width'> & {
  src: string;
  /** Rendered width in CSS px; 2x is requested for sharp screens. */
  width: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxiedImageUrl(src, width * 2)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        if (e.currentTarget.src !== src) e.currentTarget.src = src;
      }}
      {...rest}
    />
  );
}
