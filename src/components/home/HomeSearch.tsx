'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { MapPin, Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRegionSearch } from '@/hooks/useRegionSearch';
import { toTitleCase } from '@/lib/utils/common';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';
import { BEDROOM_PRESETS, BUDGET_PRESETS } from '@/lib/search/presets';

const DEFAULT_AREA: FlattenedLocation = { type: 'region', name: 'DAR ES SALAAM', displayName: 'Dar es Salaam' };

export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 px-4 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
        selected
          ? 'bg-brand-700 border-brand-700 text-white'
          : 'bg-white border-stone-300 text-ink-800 hover:border-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export function HomeSearch() {
  const { t } = useLanguage();
  const router = useRouter();

  const [area, setArea] = useState<FlattenedLocation>(DEFAULT_AREA);
  const [budgetId, setBudgetId] = useState<string | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const { results } = useRegionSearch(query);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!pickerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPickerOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [pickerOpen]);

  const chooseArea = (location: FlattenedLocation) => {
    setArea(location);
    setQuery('');
    setPickerOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (area.type === 'region') {
      params.set('region', area.name);
    } else if (area.regionName) {
      params.set('region', area.regionName);
      params.set('district', area.name);
    }
    const budget = BUDGET_PRESETS.find((b) => b.id === budgetId);
    if (budget?.minPrice) params.set('minPrice', String(budget.minPrice));
    if (budget?.maxPrice) params.set('maxPrice', String(budget.maxPrice));
    if (bedrooms) params.set('bedrooms', String(bedrooms));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="bg-brand-50 dark:bg-gray-900 border-b border-brand-100 dark:border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <h1 className="font-display text-3xl sm:text-5xl tracking-tight text-ink-900 dark:text-white text-balance">
          {t('home.title')}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-ink-700 dark:text-gray-300 max-w-xl">{t('home.subtitle')}</p>

        <form
          onSubmit={handleSearch}
          className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-2xl border border-stone-200 dark:border-gray-700 shadow-soft p-4 sm:p-6 space-y-5"
        >
          <div>
            <span className="block text-sm font-bold text-ink-900 dark:text-white mb-2">{t('home.area')}</span>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="w-full min-h-12 flex items-center gap-3 px-4 rounded-xl border border-stone-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-left text-base font-semibold text-ink-900 dark:text-white hover:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              aria-haspopup="dialog"
            >
              <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0" aria-hidden />
              <span className="flex-1 truncate">{toTitleCase(area.displayName)}</span>
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">{t('home.chooseArea')}</span>
            </button>
          </div>

          <fieldset>
            <legend className="text-sm font-bold text-ink-900 dark:text-white mb-2">{t('home.budget')}</legend>
            <div className="flex flex-wrap gap-2">
              <Chip selected={budgetId === null} onClick={() => setBudgetId(null)}>
                {t('home.anyBudget')}
              </Chip>
              {BUDGET_PRESETS.map((b) => (
                <Chip key={b.id} selected={budgetId === b.id} onClick={() => setBudgetId(b.id)}>
                  {t(b.labelKey)}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-bold text-ink-900 dark:text-white mb-2">{t('home.bedrooms')}</legend>
            <div className="flex flex-wrap gap-2">
              <Chip selected={bedrooms === null} onClick={() => setBedrooms(null)}>
                {t('home.anyBedrooms')}
              </Chip>
              {BEDROOM_PRESETS.map((n) => (
                <Chip key={n} selected={bedrooms === n} onClick={() => setBedrooms(n)}>
                  {n}+
                </Chip>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full min-h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Search className="w-5 h-5" aria-hidden />
            {t('home.search')}
          </button>
        </form>
      </div>

      {pickerOpen &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPickerOpen(false)} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={t('home.chooseArea')}
              className="relative w-full sm:max-w-md max-h-[80vh] flex flex-col bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-2 p-4 border-b border-stone-100 dark:border-gray-700">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.searchArea')}
                  className="flex-1 min-h-12 rounded-xl bg-stone-50 dark:bg-gray-700 border-0 px-4 text-base text-ink-900 dark:text-white placeholder:text-ink-500 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-y-auto p-2">
                {!query && (
                  <button
                    type="button"
                    onClick={() => chooseArea(DEFAULT_AREA)}
                    className="w-full min-h-12 px-4 py-3 text-left rounded-xl hover:bg-stone-50 dark:hover:bg-gray-700 text-base font-semibold text-ink-900 dark:text-white"
                  >
                    {t('home.allDar')}
                  </button>
                )}
                {results.map((location, index) => (
                  <button
                    key={`${location.type}-${location.name}-${index}`}
                    type="button"
                    onClick={() => chooseArea(location)}
                    className="w-full min-h-12 px-4 py-3 text-left rounded-xl hover:bg-stone-50 dark:hover:bg-gray-700"
                  >
                    <span className="block text-base font-semibold text-ink-900 dark:text-white">
                      {toTitleCase(location.displayName)}
                    </span>
                    <span className="block text-sm text-ink-600 dark:text-gray-400">
                      {location.type === 'region' ? t('home.region') : t('home.district')}
                    </span>
                  </button>
                ))}
                {query && results.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-ink-600 dark:text-gray-400">{t('home.noAreas')}</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
