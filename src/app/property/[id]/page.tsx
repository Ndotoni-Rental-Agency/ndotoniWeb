import { Metadata } from 'next';
import { fetchLongTermPropertyForSEO } from '@/lib/fetch-property';
import { PropertyJsonLd } from '@/components/seo/PropertyJsonLd';
import PropertyDetailClient from './PropertyDetailClient';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const property = await fetchLongTermPropertyForSEO(params.id);

  if (!property) {
    return {
      title: 'Nyumba Haijapatikana – Ndotoni',
      description: 'Nyumba hii haijapatikana kwenye Ndotoni.',
    };
  }

  const location = [property.address?.district, property.address?.region].filter(Boolean).join(', ');
  const title = `${property.title} – ${location} | Ndotoni`;
  
  const priceText = property.pricing
    ? `${property.pricing.currency} ${property.pricing.monthlyRent.toLocaleString()}/mwezi`
    : '';
  
  const specs = [
    property.specifications?.bedrooms ? `${property.specifications.bedrooms} vyumba` : '',
    property.specifications?.bathrooms ? `${property.specifications.bathrooms} bafu` : '',
  ].filter(Boolean).join(', ');

  const description =
    property.description?.slice(0, 155) ||
    `${property.title} inapatikana ${location}. ${priceText}${specs ? `. ${specs}` : ''}. Thibitishwa na Ndotoni.`;

  const images = property.media?.images?.length
    ? [{ url: property.media.images[0], width: 1200, height: 630, alt: property.title }]
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: 'website',
      url: `https://www.ndotoni.com/property/${property.propertyId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: property.media?.images?.[0] || undefined,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const property = await fetchLongTermPropertyForSEO(params.id);

  return (
    <>
      {property && <PropertyJsonLd property={property} />}
      <PropertyDetailClient />
    </>
  );
}
