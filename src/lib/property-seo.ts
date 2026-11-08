import type { Metadata } from 'next';
import type { LongTermPropertySEO } from './fetch-property';
import { locationLine } from './location/format';

export const PROPERTY_BASE_URL = 'https://www.ndotoni.com';
export function propertyCanonical(propertyId: string) {
  return `${PROPERTY_BASE_URL}/property/${encodeURIComponent(propertyId)}`;
}
function compact(value: string) { return value.replace(/\s+/g, ' ').trim(); }
function snippet(value: string) {
  const text = compact(value);
  if (text.length <= 160) return text;
  return text.slice(0, 157).replace(/\s+\S*$/, '') + '…';
}
export function buildPropertyMetadata(property: LongTermPropertySEO): Metadata {
  const name = compact(property.title);
  const location = locationLine(property.address);
  const price = property.pricing && Number.isFinite(property.pricing.monthlyRent) && property.pricing.monthlyRent > 0
    ? `Kodi: ${property.pricing.currency} ${property.pricing.monthlyRent.toLocaleString('en-TZ')}/mwezi.` : '';
  const specs = [property.specifications?.bedrooms ? `Vyumba ${property.specifications.bedrooms}` : '', property.specifications?.bathrooms ? `bafu ${property.specifications.bathrooms}` : ''].filter(Boolean).join(', ');
  const description = snippet([location ? `Nyumba ya kupanga ${location}.` : '', price, specs ? `${specs}.` : '', 'Angalia picha, huduma na maelezo ya nyumba kwenye Ndotoni.'].filter(Boolean).join(' '));
  const image = property.media?.images?.[0] || undefined;
  const title = `${name}${location && !name.toLowerCase().includes(location.toLowerCase()) ? ` – ${location}` : ''} | Ndotoni`;
  const canonical = propertyCanonical(property.propertyId);
  return {
    title, description,
    alternates: { canonical },
    robots: property.status === 'AVAILABLE' ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: { title, description, url: canonical, type: 'website', images: image ? [{ url: image, alt: name }] : undefined },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images: image ? [image] : undefined },
  };
}
