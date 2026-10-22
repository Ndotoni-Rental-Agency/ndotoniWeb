'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegisterInlineHousingRequestCTA } from '@/contexts/HousingRequestInlineContext';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';
import { HousingRequestModal } from '@/components/housing/HousingRequestModal';
import { type SearchPreferences } from '@/lib/search/preferences';

export default function SearchEmptyState({ filters, onChange, hasMore, onLoadMore }: {
  filters: SearchPreferences;
  onChange: (filters: SearchPreferences) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const modal = useHousingRequestModal();
  useRegisterInlineHousingRequestCTA();
  const remove = (keys: (keyof SearchPreferences)[]) => {
    const next = { ...filters };
    keys.forEach(key => delete next[key]);
    delete next.originalText;
    onChange(next);
  };
  const hasConstraints = ['ward', 'district', 'propertyType', 'minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'moveInDate'].some(key => filters[key as keyof SearchPreferences] !== undefined);
  const broaden = () => {
    if (hasMore) { onLoadMore(); return; }
    if (filters.ward || filters.district) { remove(['ward', 'district']); return; }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) { remove(['minPrice', 'maxPrice']); return; }
    onChange({ region: filters.region });
  };
  const broadenLabel = hasMore ? (sw ? 'Angalia nyumba zaidi' : 'Check more homes')
    : filters.ward || filters.district ? (sw ? 'Tafuta eneo pana zaidi' : 'Search a wider area')
    : filters.minPrice !== undefined || filters.maxPrice !== undefined ? (sw ? 'Angalia bajeti zote' : 'Explore all budgets')
    : (sw ? 'Angalia nyumba zote hapa' : 'Explore all homes here');
  return (
    <section className="rounded-3xl border border-gray-200 bg-white px-6 py-10 sm:p-10 dark:border-gray-700 dark:bg-gray-900" aria-labelledby="empty-search-title">
      <div aria-hidden="true" className="mb-6 h-16 w-12 rounded-t-[999px] border-[5px] border-brand-500 bg-brand-50 dark:bg-brand-950" />
      <h2 id="empty-search-title" className="max-w-md text-2xl font-bold tracking-tight text-ink-900 dark:text-white">{sw ? 'Bado hatujapata inayokufaa.' : 'Your next home is still out there.'}</h2>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-500 dark:text-gray-400">{hasMore
        ? (sw ? 'Angalia nyumba zaidi kabla ya kubadilisha unachotafuta.' : 'Check more homes before changing what you’re looking for.')
        : (sw ? 'Hakuna inayolingana kwa sasa. Jaribu eneo pana zaidi, au timu yetu ikusaidie kutafuta.' : 'No matches right now. Try a broader search, or let our team help you find a place.')}</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
        {(hasMore || hasConstraints) && <Button onClick={broaden}>{broadenLabel}<ArrowRight size={17} className="ml-2" aria-hidden="true" /></Button>}
        <button type="button" onClick={modal.openModal} className="min-h-11 text-sm font-semibold text-brand-800 underline underline-offset-4 dark:text-brand-300">{sw ? 'Tukusaidie kutafuta' : 'Let us help you find it'}</button>
      </div>
      <HousingRequestModal isOpen={modal.isOpen} onClose={modal.closeModal} titleId={modal.titleId} />
    </section>
  );
}
