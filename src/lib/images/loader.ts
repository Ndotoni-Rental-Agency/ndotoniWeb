/**
 * next/image loader that resizes remote photos through wsrv.nl, a free
 * open-source image proxy on Cloudflare's CDN.
 *
 * Vercel's built-in optimizer is disabled (free-tier quota, see d873289), so
 * without this every listing photo shipped at full upload size (up to 1.5 MB
 * for a 300px card). Local files, SVGs and data URIs pass through untouched.
 * Components can fall back to the original via next/image `unoptimized`.
 */
const PROXY = 'https://wsrv.nl/';

export function isProxyable(src: string): boolean {
  return /^https?:\/\//i.test(src) && !/\.svg(\?|$)/i.test(src);
}

export function proxiedImageUrl(src: string, width: number, quality = 70): string {
  if (!isProxyable(src)) return src;
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality),
    output: 'webp',
    we: '', // never upscale beyond the original
  });
  return `${PROXY}?${params.toString()}`;
}

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  return proxiedImageUrl(src, width, quality ?? 70);
}
