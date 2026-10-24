'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Building2, Check, Home, LayoutGrid, DoorOpen, X } from 'lucide-react';
import MoneyInput from '@/components/ui/MoneyInput';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './HomeDesign.module.css';

type Props = { propertyType: string; budget: string; onTypeChange: (value: string) => void; onBudgetChange: (value: string) => void };

export default function HomeSearchChoices({ propertyType, budget, onTypeChange, onBudgetChange }: Props) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const typeTrigger = useRef<HTMLButtonElement>(null);
  const budgetTrigger = useRef<HTMLButtonElement>(null);
  const [kind, setKind] = useState<'type' | 'budget' | null>(null);
  const [draft, setDraft] = useState('');
  const types = [
    { value: '', label: sw ? 'Aina zote' : 'All home types', icon: LayoutGrid },
    { value: 'APARTMENT', label: sw ? 'Ghorofa' : 'Apartment', icon: Building2 },
    { value: 'HOUSE', label: sw ? 'Nyumba' : 'House', icon: Home },
    { value: 'STUDIO', label: 'Studio', icon: LayoutGrid },
    { value: 'ROOM', label: sw ? 'Chumba' : 'Room', icon: DoorOpen },
  ];
  const format = (value: string | number) => Number(value).toLocaleString('en-US');
  const invalid = !!draft && (!Number.isSafeInteger(Number(draft)) || Number(draft) < 1);
  useEffect(() => {
    if (!kind) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [kind]);
  function show(next: 'type' | 'budget') {
    setDraft(budget);
    setKind(next);
    dialog.current?.showModal();
    // Open with the choices visible, without bringing up a phone keyboard.
    dialog.current?.focus();
  }
  function close() { dialog.current?.close(); }
  function applyBudget() { if (invalid) return; onBudgetChange(draft); close(); }
  return <>
    <input type="hidden" name="propertyType" value={propertyType} />
    <input type="hidden" name="maxPrice" value={budget} />
    <div className={styles.searchField}>
      <label htmlFor="home-type">{sw ? 'Aina ya nyumba' : 'Home type'}</label>
      <button ref={typeTrigger} id="home-type" type="button" className={styles.locationButton} aria-haspopup="dialog" aria-expanded={kind === 'type'} onClick={() => show('type')}>
        <span className="truncate">{types.find(t => t.value === propertyType)?.label || types[0].label}</span>
      </button>
    </div>
    <div className={styles.searchField}>
      <label htmlFor="home-budget">{sw ? 'Bajeti ya mwezi · TSh' : 'Monthly budget · TSh'}</label>
      <button ref={budgetTrigger} id="home-budget" type="button" className={styles.locationButton} aria-haspopup="dialog" aria-expanded={kind === 'budget'} onClick={() => show('budget')}>
        <span className="truncate">{budget ? `${sw ? 'Hadi' : 'Up to'} ${format(budget)}` : (sw ? 'Bajeti yoyote' : 'Any budget')}</span>
      </button>
    </div>
    <dialog ref={dialog} tabIndex={-1} aria-labelledby={titleId}
      onClose={() => { (kind === 'type' ? typeTrigger : budgetTrigger).current?.focus(); setKind(null); }}
      onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } else if (e.key === 'Enter' && e.target instanceof HTMLInputElement) { e.preventDefault(); applyBudget(); } }}
      onClick={e => { if (e.target !== e.currentTarget) return; const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close(); }}
      className="location-choice-dialog fixed inset-x-0 bottom-0 top-auto m-0 max-h-[90dvh] w-full max-w-lg rounded-t-3xl border-0 bg-white p-0 text-ink-900 shadow-xl outline-none backdrop:bg-black/40 sm:inset-0 sm:m-auto sm:rounded-3xl dark:bg-gray-800 dark:text-white">
      <div className="max-h-[90dvh] overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-xl font-semibold tracking-tight">{kind === 'type' ? (sw ? 'Unatafuta nyumba ya aina gani?' : 'What kind of home?') : (sw ? 'Bajeti yako ya mwezi ni kiasi gani?' : 'What’s your monthly budget?')}</h2>
          <button type="button" onClick={close} aria-label={sw ? 'Funga' : 'Close choices'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-ink-50 dark:hover:bg-gray-700"><X size={21} /></button>
        </div>
        {kind === 'type' ? <div className="space-y-1">{types.map(({ value, label, icon: Icon }) => <button key={value} type="button" aria-pressed={propertyType === value} onClick={() => { onTypeChange(value); close(); }} className={`flex min-h-[68px] w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700 motion-reduce:transition-none dark:hover:bg-gray-700 ${propertyType === value ? 'bg-brand-50 dark:bg-brand-900/30' : ''}`}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-brand-700 dark:bg-gray-700"><Icon size={20} /></span><span className="flex-1 text-base font-medium">{label}</span>{propertyType === value && <Check size={19} className="text-brand-700" />}
        </button>)}</div> : <>
          <label htmlFor="monthly-budget-amount" className="mb-2 block text-sm font-medium text-ink-500 dark:text-gray-300">{sw ? 'Kodi ya juu kwa mwezi' : 'Maximum monthly rent'}</label>
          <div className="flex items-center gap-3 rounded-xl border border-ink-300 px-4 focus-within:border-brand-700 focus-within:ring-2 focus-within:ring-brand-100 dark:border-gray-600">
            <span className="text-base font-semibold text-brand-700 dark:text-brand-300">TSh</span>
            <MoneyInput id="monthly-budget-amount" value={draft} onValueChange={setDraft} min="1" placeholder={sw ? 'Andika kiasi' : 'Enter an amount'} aria-invalid={invalid} className="h-16 w-full min-w-0 border-0 bg-transparent text-2xl font-semibold outline-none focus:ring-0" />
          </div>
          {invalid && <p role="alert" className="mt-2 text-sm text-red-700">{sw ? 'Weka kiasi sahihi zaidi ya sifuri.' : 'Enter a valid amount greater than zero.'}</p>}
          <div className="mt-5 grid grid-cols-2 gap-2">{['200000', '500000', '1000000', '2000000'].map(amount => <button key={amount} type="button" aria-pressed={draft === amount} onClick={() => setDraft(amount)} className={`min-h-12 rounded-xl border px-3 py-3 text-base font-medium transition-colors hover:border-brand-700 motion-reduce:transition-none ${draft === amount ? 'border-brand-700 bg-brand-50 text-brand-800 dark:bg-brand-900/30 dark:text-brand-200' : 'border-ink-200 dark:border-gray-600'}`}>{format(amount)}</button>)}</div>
          <div className="mt-6 flex items-center justify-between gap-4"><button type="button" onClick={() => setDraft('')} className="min-h-12 text-sm font-semibold underline underline-offset-4">{sw ? 'Bajeti yoyote' : 'Any budget'}</button><button type="button" onClick={applyBudget} disabled={invalid} className="min-h-12 rounded-xl bg-brand-700 px-6 font-semibold text-white hover:bg-brand-800 disabled:opacity-50">{sw ? 'Weka bajeti' : 'Set budget'}</button></div>
        </>}
      </div>
    </dialog>
  </>;
}
