'use client';

import MoneyInput from '@/components/ui/MoneyInput';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import SearchFilters, { type PropertyFilters } from '@/components/ui/SearchFilters';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import design from '@/components/design/Brand.module.css';

type Filters = PropertyFilters & { originalText?: string };

export default function SearchFilterDialog({ isOpen, onClose, filters, onApply }: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (filters: Filters) => void;
}) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const reducedMotion = useReducedMotion();
  const [draft, setDraft] = useState<Filters>(filters);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) setDraft(filters);
  }, [isOpen, filters]);

  const change = (next: PropertyFilters) => setDraft({ ...next, originalText: undefined });
  const invalidBudget = draft.minPrice !== undefined && draft.maxPrice !== undefined && draft.minPrice > draft.maxPrice;
  const numberField = 'min-h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-base text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white';

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-[70]" onClose={onClose} initialFocus={closeRef}>
        <Transition.Child as={Fragment} enter={reducedMotion ? '' : 'ease-out duration-150'} enterFrom="opacity-0" enterTo="opacity-100" leave={reducedMotion ? '' : 'ease-in duration-100'} leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/35" aria-hidden="true" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center sm:items-center sm:p-6">
            <Transition.Child as={Fragment} enter={reducedMotion ? '' : 'ease-out duration-200'} enterFrom={reducedMotion ? 'opacity-0' : 'opacity-0 translate-y-3'} enterTo="opacity-100 translate-y-0" leave={reducedMotion ? '' : 'ease-in duration-150'} leaveFrom="opacity-100 translate-y-0" leaveTo={reducedMotion ? 'opacity-0' : 'opacity-0 translate-y-2'}>
              <Dialog.Panel className={design.filterDialog}>
                <header className={design.filterDialogHeader}>
                  <div>
                    <Dialog.Title className="text-xl font-bold tracking-tight text-ink-900 dark:text-white">{sw ? 'Nyumba inayokufaa' : 'Make it your kind of home'}</Dialog.Title>
                    <Dialog.Description className="mt-1 text-sm text-ink-500 dark:text-gray-400">{sw ? 'Chagua unachohitaji, kisha onyesha matokeo.' : 'Choose what matters, then see your results.'}</Dialog.Description>
                  </div>
                  <button ref={closeRef} type="button" onClick={onClose} className={design.dialogClose} aria-label={sw ? 'Funga vichujio' : 'Close filters'}><X size={21} aria-hidden="true" /></button>
                </header>
                <form className={design.filterDialogForm} onSubmit={(event) => {
                  event.preventDefault();
                  if (!invalidBudget) { onApply(draft); onClose(); }
                }}>
                  <div className={design.filterDialogBody}>
                    <SearchFilters filters={draft} onFiltersChange={change} embedded />
                    <details className={design.morePreferences}>
                      <summary>{sw ? 'Vyumba, bafu na machaguo zaidi' : 'Rooms, bathrooms and more'}</summary>
                      <div className="mt-5 grid grid-cols-2 gap-5">
                        {(['bedrooms', 'bathrooms'] as const).map((key) => <label key={key} className="text-sm font-semibold text-ink-700 dark:text-gray-300">
                          {key === 'bedrooms' ? (sw ? 'Vyumba vya kulala' : 'Bedrooms') : (sw ? 'Bafu' : 'Bathrooms')}
                          <select className={`${numberField} mt-2`} value={draft[key] ?? ''} onChange={(event) => change({ ...draft, [key]: event.target.value ? Number(event.target.value) : undefined })}>
                            <option value="">{sw ? 'Yoyote' : 'Any'}</option>
                            {[1, 2, 3, 4, 5].map((number) => <option key={number} value={number}>{number}+</option>)}
                          </select>
                        </label>)}
                        {(['minPrice', 'maxPrice'] as const).map((key) => <label key={key} className="text-sm font-semibold text-ink-700 dark:text-gray-300">
                          {key === 'minPrice' ? (sw ? 'Kodi ya chini · TSh' : 'Minimum rent · TSh') : (sw ? 'Kodi ya juu · TSh' : 'Maximum rent · TSh')}
                          <MoneyInput  min="0" step="1" inputMode="numeric" className={`${numberField} mt-2`} value={draft[key] ?? ''} onValueChange={(value) => change({ ...draft, [key]: value ? Number(value) : undefined })} />
                        </label>)}
                        <label className="col-span-2 text-sm font-semibold text-ink-700 dark:text-gray-300">{sw ? 'Tarehe ya kuhamia' : 'Move-in date'}
                          <input type="date" className={`${numberField} mt-2`} value={draft.moveInDate || ''} onChange={(event) => change({ ...draft, moveInDate: event.target.value || undefined })} />
                        </label>
                      </div>
                    </details>
                    {invalidBudget && <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-300">{sw ? 'Kodi ya juu lazima iwe sawa au zaidi ya kodi ya chini.' : 'Maximum rent must be at least the minimum rent.'}</p>}
                  </div>
                  <footer className={design.filterDialogFooter}>
                    <button type="button" onClick={() => setDraft({ region: filters.region })} className="min-h-11 px-2 text-sm font-semibold text-ink-700 underline underline-offset-4 dark:text-gray-200">{sw ? 'Anza upya' : 'Reset'}</button>
                    <button type="submit" disabled={invalidBudget} className="min-h-12 rounded-xl bg-brand-800 px-6 text-sm font-semibold text-white hover:bg-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:opacity-50">{sw ? 'Onyesha matokeo' : 'Show results'}</button>
                  </footer>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
