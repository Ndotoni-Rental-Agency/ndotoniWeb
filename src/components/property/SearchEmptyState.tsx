'use client';

import { Search, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegisterInlineHousingRequestCTA } from '@/contexts/HousingRequestInlineContext';
import { useHousingRequestModal } from '@/hooks/useHousingRequestModal';
import { HousingRequestModal } from '@/components/housing/HousingRequestModal';
import { searchDescription, type SearchPreferences } from '@/lib/search/preferences';

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
  return (
    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white dark:border-gray-700 dark:bg-gray-900" aria-labelledby="empty-search-title">
      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        <div className="p-6 sm:p-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-300"><Search size={23} aria-hidden="true" /></div>
          <h2 id="empty-search-title" className="max-w-md font-display text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl dark:text-white">
            {sw ? 'Bado hatujapata inayokufaa' : 'We haven’t found your match yet'}
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500 dark:text-gray-400">
            {hasMore
              ? sw ? 'Hakuna inayolingana kwenye nyumba zilizopakiwa hadi sasa. Angalia nyumba zaidi au badilisha kichujio kimoja.' : 'No matches in the homes loaded so far. Check more homes or adjust one filter.'
              : sw ? 'Hakuna nyumba inayolingana na utafutaji huu kwa sasa. Jaribu kubadilisha kichujio kimoja ili kuona chaguo zaidi.' : 'No homes match this search right now. Try adjusting one filter to see more options.'}
          </p>
          <p className="mt-5 rounded-xl bg-stone-50 px-4 py-3 text-sm font-medium leading-relaxed text-ink-700 dark:bg-gray-800 dark:text-gray-200">{searchDescription(filters, sw)}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {hasMore && <Button onClick={onLoadMore} variant="primary">{sw ? 'Angalia nyumba zaidi' : 'Check more homes'}</Button>}
            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && <Button variant="outline" onClick={() => remove(['minPrice', 'maxPrice'])}>{sw ? 'Bei zote' : 'All budgets'}</Button>}
            {(filters.ward || filters.district) && <Button variant="outline" onClick={() => remove(['ward', 'district'])}>{sw ? 'Eneo pana zaidi' : 'Widen the area'}</Button>}
            {filters.propertyType && <Button variant="outline" onClick={() => remove(['propertyType'])}>{sw ? 'Aina zote za nyumba' : 'All home types'}</Button>}
          </div>
          {hasConstraints && <button type="button" onClick={() => onChange({ region: filters.region })} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-800 underline underline-offset-4 dark:text-brand-300"><SlidersHorizontal size={15} aria-hidden="true" />{sw ? 'Ondoa vichujio, baki na mkoa huu' : 'Clear filters, keep this region'}</button>}
        </div>
        <div className="flex flex-col justify-center border-t border-stone-200 bg-brand-50/60 p-6 sm:p-9 lg:border-l lg:border-t-0 dark:border-gray-700 dark:bg-brand-950/20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-800 dark:text-brand-300">{sw ? 'Tukusaidie kutafuta' : 'Let us help you search'}</span>
          <h3 className="mt-3 font-display text-xl font-semibold text-ink-900 dark:text-white">{sw ? 'Unataka kubaki na mahitaji haya?' : 'Want to keep these preferences?'}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 dark:text-gray-400">{sw ? 'Utafutaji wako uko tayari. Ongeza namba yako ya WhatsApp, kisha timu yetu itakusaidia kupata nyumba inayofaa.' : 'Your search details are ready. Add your WhatsApp number and our team can help find a suitable home.'}</p>
          <Button onClick={modal.openModal} className="mt-6 gap-2" fullWidth>{sw ? 'Nisaidie kupata nyumba' : 'Help me find a home'}<ArrowRight size={17} aria-hidden="true" /></Button>
          <p className="mt-3 text-xs leading-relaxed text-ink-500 dark:text-gray-400">{sw ? 'Unaweza kukagua na kubadilisha maelezo kabla ya kutuma.' : 'Review and edit your details before sending.'}</p>
        </div>
      </div>
      <HousingRequestModal isOpen={modal.isOpen} onClose={modal.closeModal} titleId={modal.titleId} />
    </section>
  );
}
