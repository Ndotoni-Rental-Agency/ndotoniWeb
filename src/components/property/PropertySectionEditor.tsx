'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import PropertyMediaManager from '@/components/media/PropertyMediaManager';
import { useLanguage } from '@/contexts/LanguageContext';

const LocationMapPicker = dynamic(
  () => import('@/components/location/LocationMapPicker'),
  { ssr: false }
);

// ─── i18n for section editor ─────────────────────────────────
const labels: Record<string, Record<string, string>> = {
  en: {
    basicInfo: '✏️ Basic Info', pricing: '💰 Pricing & Fees', details: '🏗️ Property Details',
    location: '📍 Location', availability: '📅 Availability', amenities: '✅ Amenities', media: '📸 Photos & Media',
    title: 'Title', description: 'Description', propertyType: 'Property Type', status: 'Status',
    monthlyRent: 'Monthly Rent (TZS)', deposit: 'Deposit (TZS)', serviceCharge: 'Service Charge (TZS)',
    currency: 'Currency', utilitiesIncluded: 'Utilities Included', utilitiesSub: 'Water, electricity included in rent',
    bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', size: 'Size (m²)', floors: 'Floors',
    parking: 'Parking Spaces', furnished: 'Furnished', furnishedSub: 'Property comes with furniture',
    district: 'District', ward: 'Ward', street: 'Street', postalCode: 'Postal Code', pinOnMap: 'Pin on Map',
    availableForRent: 'Available for Rent', availableSub: 'Show this property to potential tenants',
    availableFrom: 'Available From', minLease: 'Min. Lease (months)', maxLease: 'Max. Lease (months)',
    save: 'Save', saving: 'Saving…', saved: 'Saved!', cancel: 'Cancel',
    select: 'Select', available: 'Available', rented: 'Rented', draft: 'Draft',
  },
  sw: {
    basicInfo: '✏️ Taarifa za Msingi', pricing: '💰 Bei na Gharama zingine', details: '🏗️ Maelezo ya Nyumba',
    location: '📍 Mahali', availability: '📅 Upatikanaji', amenities: '✅ Vifaa', media: '📸 Picha na Video',
    title: 'Jina la Nyumba', description: 'Maelezo', propertyType: 'Aina ya Nyumba', status: 'Hali',
    monthlyRent: 'Kodi ya Mwezi (TZS)', deposit: 'Amana (TZS)', serviceCharge: 'Service Charge(TZS)',
    currency: 'Sarafu', utilitiesIncluded: 'Huduma Zimejumuishwa', utilitiesSub: 'Maji, umeme vimejumuishwa kwenye kodi',
    bedrooms: 'Vyumba vya Kulala', bathrooms: 'Bafu na Choo', size: 'Ukubwa (m²)', floors: 'Ghorofa',
    parking: 'Nafasi za Kuegesha', furnished: 'Ina Samani', furnishedSub: 'Nyumba ina samani',
    district: 'Wilaya', ward: 'Kata', street: 'Mtaa', postalCode: 'Sanduku la Posta', pinOnMap: 'Weka kwenye Ramani',
    availableForRent: 'Inapatikana Kukodishwa', availableSub: 'Onyesha nyumba hii kwa wapangaji',
    availableFrom: 'Inapatikana Kuanzia', minLease: 'Muda wa Chini (miezi)', maxLease: 'Muda wa Juu (miezi)',
    save: 'Hifadhi', saving: 'Inahifadhi…', saved: 'Imehifadhiwa!', cancel: 'Ghairi',
    select: 'Chagua', available: 'Inapatikana', rented: 'Imekodishwa', draft: 'Rasimu',
  },
};

// ─── Types ───────────────────────────────────────────────────

interface Coords { latitude?: number; longitude?: number }
interface Address { region?: string; district?: string; ward?: string; street?: string; postalCode?: string; coordinates?: Coords }
interface Pricing { monthlyRent?: number; currency?: string; deposit?: number; serviceCharge?: number; utilitiesIncluded?: boolean }
interface Specifications { bedrooms?: number; bathrooms?: number; squareMeters?: number; floors?: number; parkingSpaces?: number; furnished?: boolean }
interface Availability { available?: boolean; availableFrom?: string; minimumLeaseTerm?: number; maximumLeaseTerm?: number }

export interface PropertyData {
  propertyId: string;
  title?: string;
  description?: string;
  propertyType?: string;
  status?: string;
  address?: Address;
  pricing?: Pricing;
  specifications?: Specifications;
  availability?: Availability;
  amenities?: string[];
  media?: { images?: string[]; videos?: string[]; floorPlan?: string; virtualTour?: string };
  // flat fields from DynamoDB
  monthlyRent?: number; currency?: string; district?: string; region?: string; ward?: string; street?: string;
  bedrooms?: number; bathrooms?: number; squareMeters?: number; furnished?: boolean;
}

// ─── Constants ───────────────────────────────────────────────

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'ROOM', 'STUDIO', 'COMMERCIAL', 'LAND'];

const PRESET_AMENITIES = [
  'WiFi', 'Parking', 'Security Guard', 'Generator', 'Water Tank',
  'Air Conditioning', 'Swimming Pool', 'Gym', 'Balcony', 'Garden',
  'CCTV', 'Elevator', 'Laundry', 'Furnished Kitchen', 'Borehole',
  'Solar Power', 'Intercom', 'Gated Community',
];

// ─── Props ───────────────────────────────────────────────────

interface PropertySectionEditorProps {
  property: PropertyData;
  onSave: (updates: Partial<PropertyData>) => Promise<void>;
  expiryText?: string;
}

// ─── Main Component ──────────────────────────────────────────

export default function PropertySectionEditor({ property, onSave, expiryText }: PropertySectionEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('basicInfo');
  const toggle = (s: string) => setExpandedSection((p) => (p === s ? null : s));
  const { language } = useLanguage();
  const t = labels[language] || labels.en;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span>🏠</span> Edit Property
        </h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{property.title}</p>
        {expiryText && <p className="text-xs text-amber-500 mt-0.5">⏰ {expiryText}</p>}
      </div>

      <div className="space-y-3">
        <EditSection
          title={t.basicInfo}
          icon="✏️"
          expanded={expandedSection === 'basicInfo'}
          onToggle={() => toggle('basicInfo')}
          onSave={onSave}
          fields={['title', 'description', 'propertyType', 'status']}
          property={property}
        >
          {(form, set) => (
            <div className="space-y-3">
              <Field label="Title">
                <input className="input" value={form.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 2 Bedroom Apartment in Kinondoni" />
              </Field>
              <Field label="Description">
                <textarea className="input min-h-[90px] resize-none" value={form.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Describe your property..." />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Property Type">
                  <select className="input" value={form.propertyType || ''} onChange={(e) => set('propertyType', e.target.value)}>
                    <option value="">Select</option>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
                  </select>
                </Field>
                <Field label="Status">
                  <select className="input" value={form.status || 'AVAILABLE'} onChange={(e) => set('status', e.target.value)}>
                    <option value="AVAILABLE">Available</option>
                    <option value="RENTED">Rented</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="DRAFT">Draft</option>
                  </select>
                </Field>
              </div>
            </div>
          )}
        </EditSection>

        <EditSection
          title={t.pricing}
          icon="💰"
          expanded={expandedSection === 'pricing'}
          onToggle={() => toggle('pricing')}
          onSave={onSave}
          fields={['pricing']}
          property={property}
        >
          {(form, set) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Rent (TZS)">
                  <input className="input" type="number" value={form.pricing?.monthlyRent ?? ''} onChange={(e) => set('pricing', { ...form.pricing, monthlyRent: Number(e.target.value) })} placeholder="500000" />
                </Field>
                <Field label="Deposit (TZS)">
                  <input className="input" type="number" value={form.pricing?.deposit ?? ''} onChange={(e) => set('pricing', { ...form.pricing, deposit: Number(e.target.value) })} placeholder="Optional" />
                </Field>
                <Field label="Service Charge (TZS)">
                  <input className="input" type="number" value={form.pricing?.serviceCharge ?? ''} onChange={(e) => set('pricing', { ...form.pricing, serviceCharge: Number(e.target.value) })} placeholder="Optional" />
                </Field>
                <Field label="Currency">
                  <select className="input" value={form.pricing?.currency || 'TZS'} onChange={(e) => set('pricing', { ...form.pricing, currency: e.target.value })}>
                    <option value="TZS">TZS</option>
                    <option value="USD">USD</option>
                  </select>
                </Field>
              </div>
              <Toggle label="Utilities Included" sub="Water, electricity included in rent" value={!!form.pricing?.utilitiesIncluded} onChange={(v) => set('pricing', { ...form.pricing, utilitiesIncluded: v })} />
            </div>
          )}
        </EditSection>

        <EditSection
          title={t.details}
          icon="🏗️"
          expanded={expandedSection === 'details'}
          onToggle={() => toggle('details')}
          onSave={onSave}
          fields={['specifications']}
          property={property}
        >
          {(form, set) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bedrooms">
                  <input className="input" type="number" min={0} value={form.specifications?.bedrooms ?? ''} onChange={(e) => set('specifications', { ...form.specifications, bedrooms: Number(e.target.value) })} />
                </Field>
                <Field label="Bathrooms">
                  <input className="input" type="number" min={0} value={form.specifications?.bathrooms ?? ''} onChange={(e) => set('specifications', { ...form.specifications, bathrooms: Number(e.target.value) })} />
                </Field>
                <Field label="Size (m²)">
                  <input className="input" type="number" min={0} value={form.specifications?.squareMeters ?? ''} onChange={(e) => set('specifications', { ...form.specifications, squareMeters: Number(e.target.value) })} placeholder="Optional" />
                </Field>
                <Field label="Floors">
                  <input className="input" type="number" min={0} value={form.specifications?.floors ?? ''} onChange={(e) => set('specifications', { ...form.specifications, floors: Number(e.target.value) })} placeholder="Optional" />
                </Field>
                <Field label="Parking Spaces">
                  <input className="input" type="number" min={0} value={form.specifications?.parkingSpaces ?? ''} onChange={(e) => set('specifications', { ...form.specifications, parkingSpaces: Number(e.target.value) })} placeholder="Optional" />
                </Field>
              </div>
              <Toggle label="Furnished" sub="Property comes with furniture" value={!!form.specifications?.furnished} onChange={(v) => set('specifications', { ...form.specifications, furnished: v })} />
            </div>
          )}
        </EditSection>

        <EditSection
          title={t.location}
          icon="📍"
          expanded={expandedSection === 'location'}
          onToggle={() => toggle('location')}
          onSave={onSave}
          fields={['address']}
          property={property}
        >
          {(form, set) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="District">
                  <input className="input" value={form.address?.district || ''} onChange={(e) => set('address', { ...form.address, district: e.target.value })} placeholder="e.g. Kinondoni" />
                </Field>
                <Field label="Ward">
                  <input className="input" value={form.address?.ward || ''} onChange={(e) => set('address', { ...form.address, ward: e.target.value })} placeholder="e.g. Mbezi" />
                </Field>
              </div>
              <Field label="Street">
                <input className="input" value={form.address?.street || ''} onChange={(e) => set('address', { ...form.address, street: e.target.value })} placeholder="Optional" />
              </Field>
              <Field label="Postal Code">
                <input className="input" value={form.address?.postalCode || ''} onChange={(e) => set('address', { ...form.address, postalCode: e.target.value })} placeholder="Optional" />
              </Field>
              <Field label="Pin on Map">
                <LocationMapPicker
                  location={{
                    region: form.address?.region || 'Dar es Salaam',
                    district: form.address?.district || '',
                    ward: form.address?.ward || '',
                    street: form.address?.street || '',
                  }}
                  onChange={({ lat, lng }) => set('address', { ...form.address, coordinates: { latitude: lat, longitude: lng } })}
                />
              </Field>
            </div>
          )}
        </EditSection>

        <EditSection
          title={t.availability}
          icon="📅"
          expanded={expandedSection === 'availability'}
          onToggle={() => toggle('availability')}
          onSave={onSave}
          fields={['availability']}
          property={property}
        >
          {(form, set) => (
            <div className="space-y-3">
              <Toggle label="Available for Rent" sub="Show this property to potential tenants" value={!!form.availability?.available} onChange={(v) => set('availability', { ...form.availability, available: v })} />
              <Field label="Available From">
                <input className="input" type="date" value={form.availability?.availableFrom || ''} onChange={(e) => set('availability', { ...form.availability, availableFrom: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min. Lease (months)">
                  <input className="input" type="number" min={1} value={form.availability?.minimumLeaseTerm ?? ''} onChange={(e) => set('availability', { ...form.availability, minimumLeaseTerm: Number(e.target.value) })} placeholder="e.g. 6" />
                </Field>
                <Field label="Max. Lease (months)">
                  <input className="input" type="number" min={1} value={form.availability?.maximumLeaseTerm ?? ''} onChange={(e) => set('availability', { ...form.availability, maximumLeaseTerm: Number(e.target.value) })} placeholder="e.g. 24" />
                </Field>
              </div>
            </div>
          )}
        </EditSection>

        <EditSection
          title={t.amenities}
          icon="✅"
          expanded={expandedSection === 'amenities'}
          onToggle={() => toggle('amenities')}
          onSave={onSave}
          fields={['amenities']}
          property={property}
        >
          {(form, set) => (
            <AmenitiesEditor
              value={form.amenities || []}
              onChange={(v) => set('amenities', v)}
            />
          )}
        </EditSection>

        <EditSection
          title={t.media}
          icon="📸"
          expanded={expandedSection === 'media'}
          onToggle={() => toggle('media')}
          onSave={onSave}
          fields={['media']}
          property={property}
        >
          {(form, set) => (
            <PropertyMediaManager
              media={{
                images: form.media?.images || [],
                videos: form.media?.videos || [],
                floorPlan: form.media?.floorPlan || '',
                virtualTour: form.media?.virtualTour || '',
              }}
              onMediaChange={(media) => set('media', media)}
            />
          )}
        </EditSection>
      </div>

      <div className="h-10" />
    </div>
  );
}

// ─── EditSection ─────────────────────────────────────────────

interface EditSectionProps {
  title: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  onSave: (updates: Partial<PropertyData>) => Promise<void>;
  fields: (keyof PropertyData)[];
  property: PropertyData;
  children: (form: PropertyData, set: (field: keyof PropertyData, value: any) => void) => React.ReactNode;
}

function EditSection({ title, icon, expanded, onToggle, onSave, fields, property, children }: EditSectionProps) {
  const [form, setForm] = useState<PropertyData>({ ...property });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setForm({ ...property }); }, [property]);

  const hasChanges = fields.some((f) => JSON.stringify(form[f]) !== JSON.stringify(property[f]));

  const set = (field: keyof PropertyData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const updates: Partial<PropertyData> = {};
      fields.forEach((f) => { (updates as any)[f] = form[f]; });
      await onSave(updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...property });
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
          {hasChanges && !expanded && (
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" title="Unsaved changes" />
          )}
          {saved && <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ Saved</span>}
        </div>
        <svg className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <>
          <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700">
            <div className="pt-4">{children(form, set)}</div>
          </div>

          {error && (
            <div className="mx-5 mb-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2">{error}</div>
          )}

          <div className="flex gap-3 px-5 pb-5">
            <button
              type="button"
              onClick={handleCancel}
              disabled={!hasChanges || saving}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── AmenitiesEditor ─────────────────────────────────────────

function AmenitiesEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (a: string) =>
    onChange(value.includes(a) ? value.filter((x) => x !== a) : [...value, a]);

  const addCustom = () => {
    const trimmed = custom.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setCustom('');
    inputRef.current?.focus();
  };

  const customAmenities = value.filter((a) => !PRESET_AMENITIES.includes(a));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESET_AMENITIES.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              value.includes(a)
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
            {a}
          </button>
        ))}
        {customAmenities.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className="px-3 py-1.5 rounded-full text-sm font-medium border bg-green-600 text-white border-green-600 flex items-center gap-1"
          >
            {a}
            <span className="text-green-200 text-xs">✕</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="input flex-1"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom amenity…"
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="px-4 py-2 rounded-xl bg-gray-800 dark:bg-gray-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}
