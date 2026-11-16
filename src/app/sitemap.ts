import type { MetadataRoute } from 'next';
import { blogPosts } from './blog/posts'
import { loadSitemapScopes } from '@/lib/seo/locationData';
import { pageUrl } from '@/lib/seo/locationPages';
import { getSitemapListings } from '@/lib/sitemap-listings';

const BASE_URL = 'https://www.ndotoni.com';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/impact`, changeFrequency: 'monthly', priority: 0.6 },
    {
      url: BASE_URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/landlord`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/refer`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
  const blogPages: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated || post.date), changeFrequency: 'monthly', priority: 0.7,
  }));
  const listings = await getSitemapListings();
  const propertyPages: MetadataRoute.Sitemap = listings.map(property => ({
    url: `${BASE_URL}/property/${encodeURIComponent(property.propertyId)}`,
    ...(property.updatedAt && Number.isFinite(Date.parse(property.updatedAt)) ? { lastModified: new Date(property.updatedAt) } : {}),
    changeFrequency: 'weekly', priority: 0.8,
  }));
  // Location landing pages: every indexable region / area / bedroom / price-band URL. Read from the
  // precomputed summary when available (no card data loaded), else from a live crawl.
  const locationPages: MetadataRoute.Sitemap = [
    { url: pageUrl(), changeFrequency: 'daily', priority: 0.9 },
    ...(await loadSitemapScopes()).map(({ regionSlug, areaSlug, filterSlug }) => ({
      url: pageUrl(regionSlug, areaSlug, filterSlug),
      changeFrequency: (filterSlug ? 'weekly' : 'daily') as 'weekly' | 'daily',
      priority: filterSlug ? (areaSlug ? 0.6 : 0.7) : areaSlug ? 0.8 : 0.9,
    })),
  ];
  return [...staticPages, ...locationPages, ...blogPages, ...propertyPages];
}
