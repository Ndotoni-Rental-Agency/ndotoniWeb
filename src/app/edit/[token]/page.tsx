'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface PropertyData {
  propertyId: string;
  title?: string;
  description?: string;
  monthlyRent?: number;
  currency?: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  furnished?: boolean;
  district?: string;
  region?: string;
  ward?: string;
  street?: string;
  address?: {
    region?: string;
    district?: string;
    ward?: string;
    street?: string;
    coordinates?: { latitude?: number; longitude?: number };
  };
  pricing?: { monthlyRent?: number; currency?: string; deposit?: number };
  specifications?: { bedrooms?: number; bathrooms?: number; squareMeters?: number; furnished?: boolean };
  amenities?: string[];
  status?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_WHATSAPP_API_URL || '';

const AMENITY_OPTIONS = [
  'WiFi', 'Parking', 'Security', 'Generator', 'Water Tank',
  'Air Conditioning', 'Swimming Pool', 'Gym', 'Balcony', 'Garden',
  'CCTV', 'Elevator', 'Laundry', 'Furnished Kitchen',
];

export default function PropertyEditPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [form, setForm] = useState<PropertyData>({} as PropertyData);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/edit-token/${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || 'Link not found or expired');
        }
        return res.json();
      })
      .then(({ property, expiresAt: exp }) => {
        setForm(property);
        setExpiresAt(exp);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updates: any = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType,
        amenities: form.amenities,
        pricing: {
          monthlyRent: Number(form.pricing?.monthlyRent || form.monthlyRent),
          currency: form.pricing?.currency || form.currency || 'TZS',
          deposit: form.pricing?.deposit,
        },
        specifications: {
          bedrooms: Number(form.specifications?.bedrooms ?? form.bedrooms),
          bathrooms: Number(form.specifications?.bathrooms ?? form.bathrooms),
          squareMeters: form.specifications?.squareMeters ?? form.squareMeters,
          furnished: form.specifications?.furnished ?? form.furnished,
        },
        address: {
          region: form.address?.region || form.region || 'Dar es Salaam',
          district: form.address?.district || form.district || '',
          ward: form.address?.ward || form.ward || '',
          street: form.address?.street || form.street || '',
          coordinates: form.address?.coordinates,
        },
      };

      const res = await fetch(`${API_BASE}/edit-token/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save');
      }

      setSuccess(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setNested = (parent: string, field: string, value: any) =>
    setForm((prev) => ({
      ...prev,
      [parent]: { ...(prev as any)[parent], [field]: value },
    }));

  const toggleAmenity = (amenity: string) => {
    const current = form.amenities || [];
    setForm((prev) => ({
      ...prev,
      amenities: current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your property...</p>
        </div>
      </div>
    );
  }

  if (error && !form.propertyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⏰</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Link Expired or Invalid</h1>
          <p className="text-gray-500 mb-6">{error}</p>
          <p className="text-sm text-gray-400">
            Go back to WhatsApp and tap <strong>Edit via Web</strong> to get a new link.
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Property Updated!</h1>
          <p className="text-gray-500">Your changes have been saved successfully.</p>
        </div>
      </div>
    );
  }

  const expiryText = expiresAt
    ? `Link expires ${new Date(expiresAt).toLocaleString()}`
    : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏠</span>
            <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
          </div>
          {expiryText && <p className="text-xs text-gray-400">{expiryText}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Basic Info */}
          <Section title="Basic Info">
            <Field label="Title">
              <input
                className="input"
                value={form.title || ''}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. 2 Bedroom Apartment in Kinondoni"
              />
            </Field>
            <Field label="Description">
              <textarea
                className="input min-h-[100px] resize-none"
                value={form.description || ''}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe your property..."
              />
            </Field>
            <Field label="Property Type">
              <select
                className="input"
                value={form.propertyType || ''}
                onChange={(e) => set('propertyType', e.target.value)}
              >
                <option value="">Select type</option>
                {['APARTMENT', 'HOUSE', 'ROOM', 'STUDIO', 'VILLA', 'OFFICE', 'SHOP', 'WAREHOUSE'].map((t) => (
                  <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                ))}
              </select>
            </Field>
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <Field label="Monthly Rent (TZS)">
              <input
                className="input"
                type="number"
                value={form.pricing?.monthlyRent ?? form.monthlyRent ?? ''}
                onChange={(e) => setNested('pricing', 'monthlyRent', e.target.value)}
                placeholder="e.g. 500000"
              />
            </Field>
            <Field label="Deposit (TZS)">
              <input
                className="input"
                type="number"
                value={form.pricing?.deposit ?? ''}
                onChange={(e) => setNested('pricing', 'deposit', e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </Section>

          {/* Specifications */}
          <Section title="Specifications">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bedrooms">
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.specifications?.bedrooms ?? form.bedrooms ?? ''}
                  onChange={(e) => setNested('specifications', 'bedrooms', Number(e.target.value))}
                />
              </Field>
              <Field label="Bathrooms">
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.specifications?.bathrooms ?? form.bathrooms ?? ''}
                  onChange={(e) => setNested('specifications', 'bathrooms', Number(e.target.value))}
                />
              </Field>
              <Field label="Size (m²)">
                <input
                  className="input"
                  type="number"
                  min={0}
                  value={form.specifications?.squareMeters ?? form.squareMeters ?? ''}
                  onChange={(e) => setNested('specifications', 'squareMeters', Number(e.target.value))}
                  placeholder="Optional"
                />
              </Field>
              <Field label="Furnished">
                <select
                  className="input"
                  value={String(form.specifications?.furnished ?? form.furnished ?? '')}
                  onChange={(e) => setNested('specifications', 'furnished', e.target.value === 'true')}
                >
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Location */}
          <Section title="Location">
            <Field label="District">
              <input
                className="input"
                value={form.address?.district ?? form.district ?? ''}
                onChange={(e) => setNested('address', 'district', e.target.value)}
                placeholder="e.g. Kinondoni"
              />
            </Field>
            <Field label="Ward">
              <input
                className="input"
                value={form.address?.ward ?? form.ward ?? ''}
                onChange={(e) => setNested('address', 'ward', e.target.value)}
                placeholder="e.g. Mbezi"
              />
            </Field>
            <Field label="Street">
              <input
                className="input"
                value={form.address?.street ?? form.street ?? ''}
                onChange={(e) => setNested('address', 'street', e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const selected = (form.amenities || []).includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selected
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Save Button */}
        <div className="mt-6 pb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 rounded-2xl text-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
