import type { MetadataRoute } from 'next';
import { blogPosts } from './blog/posts'
import {
  MIN_LISTINGS_TO_INDEX,
  REGIONS,
  fetchRegionProperties,
  filterByDistrict,
  pageUrl,
  summariseDistricts,
} from '@/lib/seo/locationPages';
import { filtersWithListings } from '@/lib/seo/listingFilters';
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
  // Location landing pages: hub, regions, and districts with enough listings to be indexable.
  const locationPages: MetadataRoute.Sitemap = [
    { url: pageUrl(), changeFrequency: 'daily', priority: 0.9 },
  ];
  for (const region of REGIONS) {
    const regionProps = await fetchRegionProperties(region.name);
    if (regionProps.length < MIN_LISTINGS_TO_INDEX) continue;
    locationPages.push({ url: pageUrl(region.slug), changeFrequency: 'daily', priority: 0.9 });
    // Region-wide bedroom / price-band pages
    for (const { filter } of filtersWithListings(regionProps, MIN_LISTINGS_TO_INDEX)) {
      locationPages.push({ url: pageUrl(region.slug, filter.slug), changeFrequency: 'weekly', priority: 0.7 });
    }
    for (const d of summariseDistricts(regionProps)) {
      if (d.count < MIN_LISTINGS_TO_INDEX) continue;
      locationPages.push({ url: pageUrl(region.slug, d.slug), changeFrequency: 'daily', priority: 0.8 });
      // Area-level bedroom / price-band pages
      for (const { filter } of filtersWithListings(filterByDistrict(regionProps, d.slug), MIN_LISTINGS_TO_INDEX)) {
        locationPages.push({ url: pageUrl(region.slug, d.slug, filter.slug), changeFrequency: 'weekly', priority: 0.6 });
      }
    }
  }
  return [...staticPages, ...locationPages, ...blogPages, ...propertyPages];
}
