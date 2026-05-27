'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GraphQLClient } from '@/lib/graphql-client';
import { getLandlordPropertiesInfo } from '@/graphql/queries';
import type { GetLandlordPropertiesInfoQuery, LandlordPublicInfo, Property } from '@/API';
import { PropertyCardSkeletonGrid } from '@/components/property/PropertyCardSkeleton';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils/common';

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

  useEffect(() => {
    if (!phone) return;
    if (phone === 'preview') {
      setLandlord({
        __typename: 'LandlordPublicInfo',
        firstName: 'Emmanuel', lastName: 'Makoye', email: 'emmanuel@ndotoni.com',
        businessName: 'Ndotoni Properties', profileImage: null,
        phoneNumber: '255790720329', whatsappNumber: '255790720329',
        region: 'Dar es Salaam', district: 'Kinondoni', createdAt: '2024-06-01T00:00:00Z',
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
      if (!token) setLoading(true); else setLoadingMore(true);
      const result = await GraphQLClient.executePublic<GetLandlordPropertiesInfoQuery>(
        getLandlordPropertiesInfo, { phone, limit: 20, nextToken: token }
      );
      const data = result?.getLandlordPropertiesInfo;
      if (!data) throw new Error('Agent not found');
      setLandlord(data.landlord);
      setProperties(prev => token ? [...prev, ...data.properties] : data.properties);
      setNextToken(data.nextToken ?? null);
    } catch (e: any) { setError(e.message || 'Failed to load'); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  const displayName = landlord?.businessName
    || [landlord?.firstName, landlord?.lastName].filter(Boolean).join(' ')
    || `+${phone}`;
  const initials = landlord?.firstName?.[0]
    ? `${landlord.firstName[0]}${landlord.lastName?.[0] ?? ''}`.toUpperCase()
    : '#';
  const memberSince = landlord?.createdAt
    ? new Date(landlord.createdAt).toLocaleDateString('en-TZ', { month: 'long', year: 'numeric' })
    : null;

  const formatPropertyForCard = (p: Property) => ({
    propertyId: p.propertyId, title: p.title,
    monthlyRent: p.pricing?.monthlyRent || 0, currency: p.pricing?.currency || 'TZS',
    propertyType: p.propertyType, bedrooms: p.specifications?.bedrooms || 0,
    district: p.address?.district || '', region: p.address?.region || '',
    thumbnail: p.media?.images?.[0] || '', available: p.availability?.available || false,
    __typename: 'PropertyCard' as const,
  });

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100">
        <div className="h-56 bg-gradient-to-br from-brand-600 to-brand-800 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 -mt-16">
          <div className="flex items-end gap-5 mb-10">
            <div className="w-28 h-28 rounded-2xl bg-white shadow-editorial animate-pulse" />
            <div className="pb-2"><div className="h-7 w-56 bg-stone-200 rounded animate-pulse mb-2" /><div className="h-4 w-36 bg-stone-200 rounded animate-pulse" /></div>
          </div>
          <PropertyCardSkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center"><span className="text-3xl">🏠</span></div>
          <h1 className="text-xl font-bold text-ink-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/"><Button variant="primary">Back to Home</Button></Link>
        </div>
      </div>
    );
  }

  // ── Main ──
  return (
    <div className="min-h-screen bg-cream-100">

      {/* ── Hero banner — editorial dark wash like homepage hero ── */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {/* Background image */}
        <img
          src="https://d3qiuw9agheakm.cloudfront.net/image/28214330-80c1-7048-64a8-0e745f9e5c39/dgyZmIWNX3kA-hero3.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark editorial wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink-900/80 via-ink-900/60 to-brand-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-transparent" />
        {/* Warm accent shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-16 w-72 h-72 bg-sand-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* ── Profile card (overlaps banner) ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-editorial border border-stone-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

            {/* Avatar */}
            <div className="relative">
              {landlord?.profileImage ? (
                <img src={landlord.profileImage} alt={displayName} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-soft border-4 border-white" />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-bold text-3xl shadow-soft border-4 border-white">
                  {initials}
                </div>
              )}
              {/* Verified badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border-3 border-white shadow-sm">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 truncate">{displayName}</h1>
              </div>
              {landlord?.businessName && landlord.firstName && (
                <p className="text-sm text-gray-500 mb-2">{landlord.firstName} {landlord.lastName}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                {(landlord?.region || landlord?.district) && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {[landlord?.district, landlord?.region].filter(Boolean).join(', ')}
                  </span>
                )}
                {memberSince && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Member since {memberSince}
                  </span>
                )}
              </div>
            </div>

            {/* Contact buttons */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
              {landlord?.whatsappNumber && (
                <a
                  href={`https://wa.me/${landlord.whatsappNumber.replace(/\D/g, '')}?text=Habari%2C%20nimeona%20nyumba%20zako%20kwenye%20Ndotoni`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#1da851] text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  WhatsApp
                </a>
              )}
              {landlord?.phoneNumber && (
                <a
                  href={`tel:+${landlord.phoneNumber.replace(/\D/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-ink-700 text-sm font-medium rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Call
                </a>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-600">{properties.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-600">
                {properties.filter(p => p.availability?.available).length}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-600">
                {Array.from(new Set(properties.map(p => p.address?.district).filter(Boolean))).length}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Areas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-600">
                {Array.from(new Set(properties.map(p => p.propertyType))).length}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Properties section ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center w-full">
            <h2 className="font-display text-2xl tracking-tight text-ink-900">Available Properties</h2>
            <p className="text-sm text-gray-500 mt-1">{properties.length} listings by {displayName}</p>
          </div>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.map(formatPropertyForCard).map((p) => (
              <Link key={p.propertyId} href={`/property/${p.propertyId}`} className="block h-full">
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-soft hover:shadow-editorial transition-shadow h-full flex flex-col">
                  {p.thumbnail ? (
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                      {p.available && (
                        <span className="absolute top-3 left-3 text-[11px] font-semibold bg-brand-600 text-white px-2 py-0.5 rounded-full">Available</span>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center text-stone-300 text-3xl">🏠</div>
                  )}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-ink-900 text-sm leading-tight line-clamp-2 mb-1.5 flex-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{p.district}, {p.region}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-bold text-brand-700 text-sm">
                        {formatCurrency(p.monthlyRent, p.currency)}<span className="text-xs font-normal text-gray-400">/mo</span>
                      </p>
                      {p.bedrooms > 0 && (
                        <span className="text-xs text-gray-400">{p.bedrooms} bed</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-soft">
            <div className="text-5xl mb-4">🏠</div>
            <p className="text-gray-500">No properties listed yet.</p>
          </div>
        )}

        {nextToken && (
          <div className="text-center mt-10">
            <Button onClick={() => fetchData(nextToken)} loading={loadingMore} variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        )}

        {/* Ndotoni branding */}
        <div className="text-center mt-20 pt-8 border-t border-stone-200">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32"><path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.782 6.86L2 30l7.347-1.757A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z"/></svg>
            Powered by <span className="font-semibold text-brand-600">Ndotoni</span>
          </Link>
          <p className="text-xs text-gray-300 mt-2">Pata Makazi Bora Tanzania</p>
        </div>
      </div>
    </div>
  );
}
