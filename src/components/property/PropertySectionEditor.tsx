'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import MediaSelector from '@/components/media/MediaSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { AIService } from '@/lib/ai/AIService';

import { PropertyData, EditSection, AmenitiesEditor, Field, Toggle, PROPERTY_TYPES, labels } from './editor';

export type { PropertyData } from './editor';

const LocationMapPicker = dynamic(() => import('@/components/location/LocationMapPicker'), { ssr: false });

interface PropertySectionEditorProps {
  property: PropertyData;
  onSave: (updates: Partial<PropertyData>) => Promise<void>;
  expiryText?: string;
}

export default function PropertySectionEditor({ property, onSave, expiryText }: PropertySectionEditorProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('basicInfo');
  const tog = (s: string) => setExpandedSection((p) => (p === s ? null : s));
  const { language } = useLanguage();
  const t = labels[language] || labels.en;

  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState<{ suggestedPrice: number; reasoning: string; range: { min: number; max: number } } | null>(null);

  const handleGenerateTitle = async (set: (field: keyof PropertyData, v: any) => void) => {
    setIsGeneratingTitle(true);
    try {
      const title = await AIService.generateTitle({ propertyType: property.propertyType || 'HOUSE', district: property.address?.district || '', region: property.address?.region || 'Dar es Salaam', bedrooms: property.specifications?.bedrooms, monthlyRent: property.pricing?.monthlyRent, currency: property.pricing?.currency, rentalType: 'long-term' });
      if (title) set('title', title);
    } catch (err) { console.error('Title generation failed:', err); }
    finally { setIsGeneratingTitle(false); }
  };

  const handleGenerateDescription = async (set: (field: keyof PropertyData, v: any) => void, currentTitle: string) => {
    setIsGeneratingDescription(true);
    try {
      const description = await AIService.generateDescription({ title: currentTitle || property.title || '', propertyType: property.propertyType || 'HOUSE', district: property.address?.district || '', region: property.address?.region || 'Dar es Salaam', bedrooms: property.specifications?.bedrooms, monthlyRent: property.pricing?.monthlyRent, currency: property.pricing?.currency, amenities: property.amenities, rentalType: 'long-term' });
      if (description) set('description', description);
    } catch (err) { console.error('Description generation failed:', err); }
    finally { setIsGeneratingDescription(false); }
  };

  const handleSuggestPrice = async () => {
    setIsGeneratingPrice(true);
    setPriceSuggestion(null);
    try {
      const prediction = await AIService.predictPrice({ propertyType: property.propertyType || 'HOUSE', district: property.address?.district || '', region: property.address?.region || 'Dar es Salaam', bedrooms: property.specifications?.bedrooms, bathrooms: property.specifications?.bathrooms, amenities: property.amenities, rentalType: 'long-term' });
      if (prediction?.suggestedPrice) setPriceSuggestion(prediction);
    } catch (err) { console.error('Price prediction failed:', err); }
    finally { setIsGeneratingPrice(false); }
  };

  const Spinner = () => <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"><span>🏠</span> Edit Property</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{property.title}</p>
        {expiryText && <p className="text-xs text-amber-500 mt-0.5">⏰ {expiryText}</p>}
      </div>

      <div className="space-y-3">
        {/* Basic Info */}
        <EditSection title={t.basicInfo} icon="✏️" expanded={expandedSection === 'basicInfo'} onToggle={() => tog('basicInfo')} onSave={onSave} fields={['title', 'description', 'propertyType', 'status']} property={property}>
          {(form, set) => (
            <div className="space-y-3">
              <Field label="Title">
                <div className="flex items-center gap-2">
                  <input className="input flex-1" value={form.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. 2 Bedroom Apartment in Kinondoni" />
                  <button type="button" onClick={() => handleGenerateTitle(set)} disabled={isGeneratingTitle} className="flex-shrink-0 px-2 py-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 transition-colors" title="Generate title with AI">
                    {isGeneratingTitle ? <Spinner /> : '✨'}
                  </button>
                </div>
              </Field>
              <Field label="Description">
                <div className="relative">
                  <textarea className="input min-h-[90px] resize-none" value={form.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Describe your property..." />
                  <button type="button" onClick={() => handleGenerateDescription(set, form.title || '')} disabled={isGeneratingDescription} className="absolute top-2 right-2 px-2 py-1 text-xs font-medium text-brand-600 hover:text-brand-700 bg-white dark:bg-gray-800 rounded disabled:opacity-50 transition-colors" title="Generate description with AI">
                    {isGeneratingDescription ? <Spinner /> : '✨ Write'}
                  </button>
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Property Type">
                  <select className="input" value={form.propertyType || ''} onChange={(e) => set('propertyType', e.target.value)}>
                    <option value="">Select</option>
                    {PROPERTY_TYPES.map((pt) => <option key={pt} value={pt}>{pt.charAt(0) + pt.slice(1).toLowerCase()}</option>)}
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

        {/* Pricing */}
        <EditSection title={t.pricing} icon="💰" expanded={expandedSection === 'pricing'} onToggle={() => tog('pricing')} onSave={onSave} fields={['pricing']} property={property}>
          {(form, set) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly Rent (TZS)"><input className="input" type="number" value={form.pricing?.monthlyRent ?? ''} onChange={(e) => set('pricing', { ...form.pricing, monthlyRent: Number(e.target.value) })} placeholder="500000" /></Field>
                <Field label="Deposit (TZS)"><input className="input" type="number" value={form.pricing?.deposit ?? ''} onChange={(e) => set('pricing', { ...form.pricing, deposit: Number(e.target.value) })} placeholder="Optional" /></Field>
                <Field label="Service Charge (TZS)"><input className="input" type="number" value={form.pricing?.serviceCharge ?? ''} onChange={(e) => set('pricing', { ...form.pricing, serviceCharge: Number(e.target.value) })} placeholder="Optional" /></Field>
                <Field label="Currency">
                  <select className="input" value={form.pricing?.currency || 'TZS'} onChange={(e) => set('pricing', { ...form.pricing, currency: e.target.value })}><option value="TZS">TZS</option><option value="USD">USD</option></select>
                </Field>
              </div>
              <div>
                <button type="button" onClick={handleSuggestPrice} disabled={isGeneratingPrice} className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 transition-colors">
                  {isGeneratingPrice ? <><Spinner /> Analyzing...</> : '💡 Suggest price'}
                </button>
                {priceSuggestion && (
                  <div className="mt-2 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-brand-900 dark:text-brand-100">Suggested: TZS {priceSuggestion.suggestedPrice.toLocaleString()}/month</p>
                        <p className="text-xs text-brand-700 dark:text-brand-300 mt-0.5">Range: TZS {priceSuggestion.range.min.toLocaleString()} – {priceSuggestion.range.max.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{priceSuggestion.reasoning}</p>
                      </div>
                      <button type="button" onClick={() => { set('pricing', { ...form.pricing, monthlyRent: priceSuggestion.suggestedPrice }); setPriceSuggestion(null); }} className="ml-3 px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">Apply</button>
                    </div>
                  </div>
                )}
              </div>
              <Toggle label="Utilities Included" sub="Water, electricity included in rent" value={!!form.pricing?.utilitiesIncluded} onChange={(v) => set('pricing', { ...form.pricing, utilitiesIncluded: v })} />
            </div>
          )}
        </EditSection>

        {/* Media */}
        <EditSection title={t.media} icon="📸" expanded={expandedSection === 'media'} onToggle={() => tog('media')} onSave={onSave} fields={['media']} property={property}>
          {(form, set) => (
            <div className="space-y-3">
              <p className="text-xs text-gray-500">{language === 'sw' ? 'Ongeza picha za nyumba yako. Picha nzuri huvutia wapangaji zaidi.' : 'Add photos of your property. Good photos attract more tenants.'}</p>
              <MediaSelector selectedMedia={form.media?.images || []} onMediaChange={(urls: string[]) => set('media', { ...form.media, images: urls })} maxSelection={10} />
              {(form.media?.images?.length ?? 0) > 0 && <p className="text-xs text-gray-400">{language === 'sw' ? `Picha ${form.media?.images?.length ?? 0} zimechaguliwa` : `${form.media?.images?.length ?? 0} photos selected`}</p>}
            </div>
          )}
        </EditSection>

        {/* Details */}
        <EditSection title={t.details} icon="🏗️" expanded={expandedSection === 'details'} onToggle={() => tog('details')} onSave={onSave} fields={['specifications']} property={property}>
          {(form, set) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bedrooms"><input className="input" type="number" min={0} value={form.specifications?.bedrooms ?? ''} onChange={(e) => set('specifications', { ...form.specifications, bedrooms: Number(e.target.value) })} /></Field>
                <Field label="Bathrooms"><input className="input" type="number" min={0} value={form.specifications?.bathrooms ?? ''} onChange={(e) => set('specifications', { ...form.specifications, bathrooms: Number(e.target.value) })} /></Field>
                <Field label="Size (m²)"><input className="input" type="number" min={0} value={form.specifications?.squareMeters ?? ''} onChange={(e) => set('specifications', { ...form.specifications, squareMeters: Number(e.target.value) })} placeholder="Optional" /></Field>
                <Field label="Floors"><input className="input" type="number" min={0} value={form.specifications?.floors ?? ''} onChange={(e) => set('specifications', { ...form.specifications, floors: Number(e.target.value) })} placeholder="Optional" /></Field>
                <Field label="Parking Spaces"><input className="input" type="number" min={0} value={form.specifications?.parkingSpaces ?? ''} onChange={(e) => set('specifications', { ...form.specifications, parkingSpaces: Number(e.target.value) })} placeholder="Optional" /></Field>
              </div>
              <Toggle label="Furnished" sub="Property comes with furniture" value={!!form.specifications?.furnished} onChange={(v) => set('specifications', { ...form.specifications, furnished: v })} />
            </div>
          )}
        </EditSection>

        {/* Location */}
        <EditSection title={t.location} icon="📍" expanded={expandedSection === 'location'} onToggle={() => tog('location')} onSave={onSave} fields={['address']} property={property}>
          {(form, set) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="District"><input className="input" value={form.address?.district || ''} onChange={(e) => set('address', { ...form.address, district: e.target.value })} placeholder="e.g. Kinondoni" /></Field>
                <Field label="Ward"><input className="input" value={form.address?.ward || ''} onChange={(e) => set('address', { ...form.address, ward: e.target.value })} placeholder="e.g. Mbezi" /></Field>
              </div>
              <Field label="Street"><input className="input" value={form.address?.street || ''} onChange={(e) => set('address', { ...form.address, street: e.target.value })} placeholder="Optional" /></Field>
              <Field label="Postal Code"><input className="input" value={form.address?.postalCode || ''} onChange={(e) => set('address', { ...form.address, postalCode: e.target.value })} placeholder="Optional" /></Field>
              <Field label="Pin on Map">
                <LocationMapPicker location={{ region: form.address?.region || 'Dar es Salaam', district: form.address?.district || '', ward: form.address?.ward || '', street: form.address?.street || '' }} onChange={({ lat, lng }) => set('address', { ...form.address, coordinates: { latitude: lat, longitude: lng } })} />
              </Field>
            </div>
          )}
        </EditSection>

        {/* Availability */}
        <EditSection title={t.availability} icon="📅" expanded={expandedSection === 'availability'} onToggle={() => tog('availability')} onSave={onSave} fields={['availability']} property={property}>
          {(form, set) => (
            <div className="space-y-3">
              <Toggle label="Available for Rent" sub="Show this property to potential tenants" value={!!form.availability?.available} onChange={(v) => set('availability', { ...form.availability, available: v })} />
              <Field label="Available From"><input className="input" type="date" value={form.availability?.availableFrom || ''} onChange={(e) => set('availability', { ...form.availability, availableFrom: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Min. Lease (months)"><input className="input" type="number" min={1} value={form.availability?.minimumLeaseTerm ?? ''} onChange={(e) => set('availability', { ...form.availability, minimumLeaseTerm: Number(e.target.value) })} placeholder="e.g. 6" /></Field>
                <Field label="Max. Lease (months)"><input className="input" type="number" min={1} value={form.availability?.maximumLeaseTerm ?? ''} onChange={(e) => set('availability', { ...form.availability, maximumLeaseTerm: Number(e.target.value) })} placeholder="e.g. 24" /></Field>
              </div>
            </div>
          )}
        </EditSection>

        {/* Amenities */}
        <EditSection title={t.amenities} icon="✅" expanded={expandedSection === 'amenities'} onToggle={() => tog('amenities')} onSave={onSave} fields={['amenities']} property={property}>
          {(form, set) => <AmenitiesEditor value={form.amenities || []} onChange={(v) => set('amenities', v)} />}
        </EditSection>
      </div>

      <div className="h-10" />
    </div>
  );
}
