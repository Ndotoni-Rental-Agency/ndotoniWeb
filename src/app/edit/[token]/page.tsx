'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PropertySectionEditor, { PropertyData } from '@/components/property/PropertySectionEditor';
import { useLanguage } from '@/contexts/LanguageContext';

const API_BASE = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || '';

// ── Types ──────────────────────────────────────────────────────────────────
interface ApiResponse {
  mode: 'single' | 'multi';
  property?: PropertyData;
  properties?: PropertyData[];
  token: string;
  expiresAt: number;
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function PropertyEditPage() {
  const params = useParams();
  const token = params?.token as string;
  const { language, setLanguage } = useLanguage();

  // Default to Swahili for WhatsApp landlords
  useEffect(() => {
    if (language !== 'sw') setLanguage('sw');
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  // In multi mode, which property is being edited (null = list view)
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);

  useEffect(() => {
    if (!token) return;

    const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    const hasPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === 'true';

    if (isLocalhost || hasPreview) {
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
      setData({ mode: 'multi', properties: [mock, { ...mock, propertyId: 'preview-456', title: 'Studio in Masaki' }], token, expiresAt: Date.now() + 3600000 });
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/edit-token/${token}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Link not found or expired');
        return res.json();
      })
      .then((d: ApiResponse) => setData(d))
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
    // Update local state
    if (editingProperty) {
      setEditingProperty(prev => prev ? { ...prev, ...updates } : prev);
    }
  };

  if (loading) return <Loader />;
  if (error || !data) return <ErrorState message={error || 'Property not found'} />;

  const expiryText = data.expiresAt ? `Link expires ${new Date(data.expiresAt).toLocaleString()}` : '';

  // ── Single property mode (legacy) ──
  if (data.mode === 'single' && data.property) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <PropertySectionEditor property={data.property} onSave={handleSave} expiryText={expiryText} />
      </div>
    );
  }

  // ── Multi property mode ──
  const properties = data.properties ?? [];

  // Editing a specific property
  if (editingProperty) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-2xl mx-auto mb-4">
          <button
            onClick={() => setEditingProperty(null)}
            className="flex items-center gap-2 text-sm text-brand-600 font-medium hover:text-brand-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === 'sw' ? 'Rudi kwenye orodha' : 'Back to list'}
          </button>
        </div>
        <PropertySectionEditor property={editingProperty} onSave={handleSave} expiryText={expiryText} />
      </div>
    );
  }

  // Property list
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{language === 'sw' ? 'Nyumba Zako' : 'Your Properties'}</h1>
          <p className="text-sm text-gray-500 mt-1">{language === 'sw' ? 'Chagua nyumba unayotaka kuboresha' : 'Select a property to improve'}</p>
          {expiryText && <p className="text-xs text-gray-400 mt-1">{expiryText}</p>}

          {/* Language toggle */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setLanguage('sw')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                language === 'sw' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
              }`}
            >
              🇹🇿 Kiswahili
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                language === 'en' ? 'bg-brand-600 text-white' : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">{language === 'sw' ? 'Hakuna nyumba zilizopatikana.' : 'No properties found.'}</div>
        ) : (
          <div className="space-y-3">
            {properties.map((prop) => (
              <div
                key={prop.propertyId}
                className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between gap-4 shadow-soft"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{prop.title}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {prop.address?.district}, {prop.address?.region}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      prop.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      prop.status === 'OCCUPIED'  ? 'bg-blue-100 text-blue-700' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {prop.status === 'AVAILABLE' ? (language === 'sw' ? 'INAPATIKANA' : 'AVAILABLE') :
                       prop.status === 'OCCUPIED' ? (language === 'sw' ? 'IMEKODISHWA' : 'OCCUPIED') :
                       prop.status}
                    </span>
                    {prop.specifications?.bedrooms && (
                      <span className="text-[11px] text-gray-400">{prop.specifications.bedrooms} {language === 'sw' ? 'vyumba' : 'bed'}</span>
                    )}
                    {prop.pricing?.monthlyRent && (
                      <span className="text-[11px] text-gray-400">
                        {prop.pricing.currency} {prop.pricing.monthlyRent.toLocaleString()}/{language === 'sw' ? 'mwezi' : 'mo'}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setEditingProperty(prop)}
                  className="flex-shrink-0 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-green-sm"
                >
                  {language === 'sw' ? 'Hariri' : 'Edit'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Inapakia nyumba zako…</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⏰</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Kiungo Kimeisha au Si Sahihi</h1>
        <p className="text-gray-500 mb-4 text-sm">{message}</p>
        <p className="text-xs text-gray-400">Rudi WhatsApp na bonyeza <strong>Hariri</strong> kupata kiungo kipya.</p>
      </div>
    </div>
  );
}
