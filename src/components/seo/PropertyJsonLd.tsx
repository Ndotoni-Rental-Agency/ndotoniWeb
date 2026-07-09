import { LongTermPropertySEO } from '@/lib/fetch-property';

interface PropertyJsonLdProps {
  property: LongTermPropertySEO;
}

export function PropertyJsonLd({ property }: PropertyJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Apartment',
    name: property.title,
    description: property.description,
    image: property.media?.images?.length ? property.media.images : undefined,
    address: property.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: property.address.street || undefined,
          addressLocality: property.address.district || undefined,
          addressRegion: property.address.region || undefined,
          addressCountry: 'TZ',
        }
      : undefined,
    geo: property.address?.coordinates
      ? {
          '@type': 'GeoCoordinates',
          latitude: property.address.coordinates.latitude,
          longitude: property.address.coordinates.longitude,
        }
      : undefined,
    numberOfRooms: property.specifications?.bedrooms || undefined,
    numberOfBathroomsTotal: property.specifications?.bathrooms || undefined,
    floorSize: property.specifications?.squareMeters
      ? {
          '@type': 'QuantitativeValue',
          value: property.specifications.squareMeters,
          unitCode: 'MTK',
        }
      : undefined,
    amenityFeature: property.amenities?.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    url: `https://www.ndotoni.com/property/${property.propertyId}`,
    offers: property.pricing
      ? {
          '@type': 'Offer',
          price: property.pricing.monthlyRent,
          priceCurrency: property.pricing.currency === 'TZS' ? 'TZS' : property.pricing.currency === '$' ? 'USD' : property.pricing.currency,
          availability: property.availability?.available
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          description: 'Monthly rent',
        }
      : undefined,
  };

  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
    />
  );
}
