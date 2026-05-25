'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GraphQLClient } from '@/lib/graphql-client';
import { getLandlordPropertiesInfo } from '@/graphql/queries';
import type { GetLandlordPropertiesInfoQuery, LandlordPublicInfo, Property } from '@/API';
import PropertyGrid from '@/components/property/PropertyGrid';
import { usePropertyFavorites } from '@/hooks/useProperty';
import { PropertyCardSkeletonGrid } from '@/components/property/PropertyCardSkeleton';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default function AgentPublicPage() {
  const params = useParams();
  const phone = params.phone as string;

  const [landlord, setLandlord] = useState<LandlordPublicInfo | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const { toggleFavorite, isFavorited } = usePropertyFavorites();

  useEffect(() => {
    if (!phone) return;

    // Preview mode: /agent/preview
    if (phone === 'preview') {
      setLandlord({
        __typename: 'LandlordPublicInfo',
        firstName: 'Emmanuel',
        lastName: 'Makoye',
        email: 'emmanuel@ndotoni.com',
        businessName: 'Ndotoni Properties',
        profileImage: null,
        phoneNumber: '255790720329',
        whatsappNumber: '255790720329',
        region: 'Dar es Salaam',
        district: 'Kinondoni',
        createdAt: '2024-06-01T00:00:00Z',
      });
      setProperties([
        { propertyId: 'mock-1', title: '2 Bedroom Apartment in Mbezi Beach', propertyType: 'APARTMENT', status: 'AVAILABLE', pricing: { monthlyRent: 800000, currency: 'TZS', __typename: 'Pricing' }, specifications: { bedrooms: 2, bathrooms: 1, __typename: 'Specifications' }, address: { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mbezi', __typename: 'Address' }, media: { images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'], __typename: 'Media' }, availability: { available: true, __typename: 'Availability' } } as any,
        { propertyId: 'mock-2', title: 'Studio in Masaki', propertyType: 'STUDIO', status: 'AVAILABLE', pricing: { monthlyRent: 1200000, currency: 'TZS', __typename: 'Pricing' }, specifications: { bedrooms: 1, bathrooms: 1, __typename: 'Specifications' }, address: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Masaki', __typename: 'Address' }, media: { images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600'], __typename: 'Media' }, availability: { available: true, __typename: 'Availability' } } as any,
        { propertyId: 'mock-3', title: '3 Bedroom House in Mikocheni', propertyType: 'HOUSE', status: 'AVAILABLE', pricing: { monthlyRent: 2000000, currency: 'TZS', __typename: 'Pricing' }, specifications: { bedrooms: 3, bathrooms: 2, __typename: 'Specifications' }, address: { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mikocheni', __typename: 'Address' }, media: { images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600'], __typename: 'Media' }, availability: { available: true, __typename: 'Availability' } } as any,
      ]);
      setLoading(false);
      return;
    }

    fetchData();
  }, [phone]);

  const fetchData = async (token?: string) => {
    try {
      if (!token) setLoading(true);
      else setLoadingMore(true);

      const result = await GraphQLClient.executePublic<GetLandlordPropertiesInfoQuery>(
        getLandlordPropertiesInfo,
        { phone, limit: 20, nextToken: token }
      );

      const data = result?.getLandlordPropertiesInfo;
      if (!data) throw new Error('Agent not found');

      setLandlord(data.landlord);
      setProperties(prev => token ? [...prev, ...data.properties] : data.properties);
      setNextToken(data.nextToken ?? null);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const displayName = landlord?.businessName
    || [landlord?.firstName, landlord?.lastName].filter(Boolean).join(' ')
    || `+${phone}`;

  const initials = landlord?.firstName?.[0]?.toUpperCase()
    ? `${landlord.firstName[0]}${landlord.lastName?.[0] ?? ''}`.toUpperCase()
    : '#';

  const formatPropertyForCard = (p: Property) => ({
    propertyId: p.propertyId,
    title: p.title,
    monthlyRent: p.pricing?.monthlyRent || 0,
    currency: p.pricing?.currency || 'TZS',
    propertyType: p.propertyType,
    bedrooms: p.specifications?.bedrooms || 0,
    district: p.address?.district || '',
    region: p.address?.region || '',
    thumbnail: p.media?.images?.[0] || '',
    available: p.availability?.available || false,
    __typename: 'PropertyCard' as const,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-20 h-20 rounded-full bg-stone-200 animate-pulse" />
            <div>
              <div className="h-6 w-48 bg-stone-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
            </div>
          </div>
          <PropertyCardSkeletonGrid count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-xl font-bold text-ink-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 mb-8 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {landlord?.profileImage ? (
              <img src={landlord.profileImage} alt={displayName} className="w-20 h-20 rounded-full object-cover border-2 border-brand-100" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-2xl">
                {initials}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-ink-900 truncate">{displayName}</h1>
              {landlord?.businessName && landlord.firstName && (
                <p className="text-sm text-gray-500">{landlord.firstName} {landlord.lastName}</p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                {(landlord?.region || landlord?.district) && (
                  <span className="flex items-center gap-1">
                    📍 {[landlord?.district, landlord?.region].filter(Boolean).join(', ')}
                  </span>
                )}
                <span>🏠 {properties.length} {properties.length === 1 ? 'property' : 'properties'}</span>
                {landlord?.createdAt && (
                  <span className="text-xs text-gray-400">
                    Member since {new Date(landlord.createdAt).toLocaleDateString('en-TZ', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="flex gap-2 mt-3 sm:mt-0">
              {landlord?.whatsappNumber && (
                <a
                  href={`https://wa.me/${landlord.whatsappNumber.replace(/\D/g, '')}?text=Habari%2C%20nimeona%20nyumba%20zako%20kwenye%20Ndotoni`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
              )}
              {landlord?.phoneNumber && (
                <a
                  href={`tel:+${landlord.phoneNumber.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-ink-700 text-sm font-medium rounded-xl transition-colors"
                >
                  📞 Call
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink-900 mb-1">Available Properties</h2>
          <p className="text-sm text-gray-500 mb-6">{properties.length} listed</p>
        </div>

        {properties.length > 0 ? (
          <PropertyGrid
            properties={properties.map(formatPropertyForCard)}
            onFavoriteToggle={toggleFavorite}
            isFavorited={isFavorited}
          />
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">🏠</div>
            <p>No properties listed yet.</p>
          </div>
        )}

        {nextToken && (
          <div className="text-center mt-8">
            <Button onClick={() => fetchData(nextToken)} loading={loadingMore} variant="outline">
              Load More
            </Button>
          </div>
        )}

        {/* Branding */}
        <div className="text-center mt-16 py-8 border-t border-stone-200">
          <p className="text-sm text-gray-400">
            Powered by{' '}
            <Link href="/" className="text-brand-600 font-semibold hover:text-brand-700">Ndotoni</Link>
            {' '}— Pata Makazi Bora Tanzania
          </p>
        </div>
      </div>
    </div>
  );
}
