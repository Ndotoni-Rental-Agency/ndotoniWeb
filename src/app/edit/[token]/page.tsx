'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PropertySectionEditor, { PropertyData } from '@/components/property/PropertySectionEditor';

const API_BASE = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || '';

export default function PropertyEditPage() {
  const params = useParams();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [property, setProperty] = useState<PropertyData | null>(null);

  useEffect(() => {
    if (!token) return;

    // Preview mode: auto-enable on localhost, or via ?preview=true
    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const hasPreviewParam = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'true';
    
    if (isLocalhost || hasPreviewParam) {
      const mock: PropertyData = {
        propertyId: 'preview-123',
        title: '2 Bedroom Apartment in Kinondoni',
        description: 'A spacious and well-lit apartment close to main road.',
        propertyType: 'APARTMENT',
        status: 'AVAILABLE',
        pricing: { monthlyRent: 500000, currency: 'TZS', deposit: 1000000, serviceCharge: 50000, utilitiesIncluded: false },
        specifications: { bedrooms: 2, bathrooms: 1, squareMeters: 75, floors: 3, parkingSpaces: 1, furnished: false },
        address: { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mbezi', street: 'Mbezi Beach Road' },
        availability: { available: true, availableFrom: '', minimumLeaseTerm: 6, maximumLeaseTerm: 24 },
        amenities: ['WiFi', 'Parking', 'Security Guard'],
        media: { images: [], videos: [], floorPlan: '', virtualTour: '' },
      };
      setProperty(mock);
      setExpiresAt(Date.now() + 60 * 60 * 1000);
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/edit-token/${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Link not found or expired');
        return res.json();
      })
      .then(({ property: p, expiresAt: exp }) => { setProperty(p); setExpiresAt(exp); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async (updates: Partial<PropertyData>) => {
    const res = await fetch(`${API_BASE}/edit-token/${token}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed to save');
    setProperty((prev) => prev ? { ...prev, ...updates } : prev);
  };

  if (loading) return <Loader />;
  if (error || !property) return <ErrorState message={error || 'Property not found'} />;

  const expiryText = expiresAt ? `Link expires ${new Date(expiresAt).toLocaleString()}` : '';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <PropertySectionEditor property={property} onSave={handleSave} expiryText={expiryText} />
    </div>
  );
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your property…</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⏰</div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Link Expired or Invalid</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">{message}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Go back to WhatsApp and tap <strong>Edit</strong> to get a new link.</p>
      </div>
    </div>
  );
}
