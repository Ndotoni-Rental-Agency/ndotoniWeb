'use client';

import design from '@/components/design/Brand.module.css';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, toTitleCase } from '@/lib/utils/common';
import type { SearchInterpretation } from '@/lib/search/interpretation';
import { Highlight, ThinkingDots } from '@/components/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Filters = {
  originalText?: string;
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
};
type Location = {
  name: string;
  region: string;
  district?: string;
  type: string;
};
type Result = {
  engine: 'basic' | 'ai';
  interpretation: SearchInterpretation;
  locations: Location[];
  locationUnresolved: boolean;
};

export default function NaturalLanguageSearch({
  filters,
  onApply,
  onSearch,
  children,
}: {
  filters: Filters;
  children?: ReactNode;
  onSearch?: () => void;
  onApply: (filters: Filters, unsupported?: string[]) => void;
}) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const reducedMotion = useReducedMotion();
  const [text, setText] = useState(filters.originalText || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLDetailsElement>(null);
  const invitationRef = useRef<HTMLElement>(null);
  const searchRequest = useRef(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<Result | null>(null);
  useEffect(() => () => { searchRequest.current += 1; }, []);
  useEffect(() => {
    setText(filters.originalText || '');
    setApplied(null);
    setResult(null);
    setError('');
  }, [filters.originalText]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    if (!text.trim() && onSearch) { onSearch(); return; }
    if (text.trim().length < 3) return;
    const request = ++searchRequest.current;
    setLoading(true);
    setError('');
    setResult(null);
    setApplied(null);
    try {
      const response = await GraphQLClient.executePublic<{
        interpretPropertySearch: string | Result;
      }>(
        `query InterpretPropertySearch($text: String!) { interpretPropertySearch(text: $text) }`,
        { text },
      );
      if (request !== searchRequest.current) return;
      const payload = response.interpretPropertySearch;
      const data: Result =
        typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (!data.locationUnresolved && data.locations.length <= 1) {
        apply(data, data.locations[0] || null);
      } else {
        setResult(data);
      }
    } catch (error) {
      if (request !== searchRequest.current) return;
      setError(
        !(error instanceof Error) || error.message !== 'SEARCH_NOT_UNDERSTOOD'
          ? sw
            ? 'Utafutaji haujakamilika. Jaribu tena au chagua eneo na bajeti.'
            : 'We couldn’t run that search. Try again or choose an area and budget.'
          : sw
            ? 'Hatukuelewa utafutaji huo. Jaribu jina la kata na bajeti ya mwezi.'
            : 'We could not interpret that search. Try a ward name and monthly budget.',
      );
    } finally {
      if (request === searchRequest.current) setLoading(false);
    }
  };
  const apply = (data: Result, location: Location | null) => {
    if (data.locationUnresolved) return;
    const next: Filters = location
      ? {
          ...filters,
          region: location.region,
          district: location.type === 'district' ? location.name : location.type === 'ward' ? location.district : undefined,
          ward: location.type === 'ward' ? location.name : undefined,
        }
      : { ...filters };
    const interpreted = data.interpretation;
    for (const key of [
      'minPrice',
      'maxPrice',
      'bedrooms',
      'bathrooms',
      'propertyType',
    ] as const) {
      const value = interpreted[key];
      if (value !== null) Object.assign(next, { [key]: value });
    }
    onApply({ ...next, originalText: text.trim() }, data.interpretation.unsupported);
    setResult(null);
    setApplied(data);
  };
  const descriptionInput = (
<div className={`${design.descriptionSearch} ${children ? design.optionalDescription : ''}`}>
          <div className={children ? design.descriptionFieldHeader : undefined}>
            <label htmlFor="natural-search" className={children ? design.descriptionLabel : 'sr-only'}>{sw ? 'Eleza unachotaka' : 'Describe what you need'}</label>
            {children && <button type="button" className={design.dialogClose} aria-label={sw ? 'Funga maelezo ya utafutaji' : 'Dismiss description search'} onClick={() => {
              searchRequest.current += 1;
              setLoading(false);
              setResult(null);
              setError('');
              if (descriptionRef.current) descriptionRef.current.open = false;
              invitationRef.current?.focus();
            }}><X size={19} aria-hidden="true" /></button>}
          </div>
          <textarea
            ref={inputRef}
            id="natural-search"
            value={text}
            onChange={(event) => { setText(event.target.value); setResult(null); setError(''); setApplied(null); }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault(); event.currentTarget.form?.requestSubmit();
              }
            }}
            disabled={loading}
            required={!children}
            minLength={children ? undefined : 3}
            maxLength={500}
            aria-describedby={children ? 'description-search-help' : undefined}
            rows={children ? 3 : 1}
            placeholder={children
              ? (sw ? 'Mfano: Nyumba vyumba 2 Mbezi, hadi laki sita kwa mwezi…' : 'A 2-bedroom home in Mbezi, under TSh 600,000 a month…')
              : (sw ? 'Eleza nyumba unayotafuta…' : 'Describe your ideal home…')}
          />
          {children && <p id="description-search-help" className={design.descriptionHelp}>{sw ? 'Bonyeza Enter kutafuta nyumba.' : 'Press Enter to find homes.'}</p>}
          {!children && <button type="submit" className={design.searchSubmit} disabled={loading || text.trim().length < 3} aria-label={sw ? 'Tafuta nyumba' : 'Find homes'}>
            {loading ? <ThinkingDots /> : <Search size={21} aria-hidden="true" />}
          </button>}
        </div>
  );
  return (
    <section className={design.unifiedSearch} aria-label={sw ? 'Tafuta nyumba' : 'Find a home'}>
      <form action="/search" method="get" onSubmit={submit} aria-busy={loading}>
        {children ? <div className={design.unifiedFields}>
          {children}
          <button type="submit" className={design.searchSubmit} disabled={loading} aria-label={sw ? 'Tafuta nyumba' : 'Find homes'}>
            {loading ? <ThinkingDots /> : <Search size={22} aria-hidden="true" />}
          </button>
        </div> : null}
        {children ? <details ref={descriptionRef} className={design.descriptionDetails} open={filters.originalText ? true : undefined} onToggle={(event) => {
          if (!event.currentTarget.open) {
            searchRequest.current += 1;
            setLoading(false);
            setResult(null);
            return;
          }
          requestAnimationFrame(() => {
            inputRef.current?.focus({ preventScroll: true });
            inputRef.current?.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
          });
        }}>
          <summary ref={invitationRef} className={design.descriptionInvitation}>{sw ? 'Nyumba gani ingekufaa?' : 'Have a home in mind?'}</summary>
          {descriptionInput}
        </details> : descriptionInput}
      </form>
      {loading && <p role="status" className="mt-3 text-sm text-brand-800 dark:text-brand-200">{sw ? 'Tunatafuta…' : 'Finding homes…'}</p>}
      {applied && (
        <div role="status" className="mt-3 animate-panel-in text-sm leading-relaxed text-brand-800 dark:text-brand-300">
          <p>{sw ? 'Vichujio vimesasishwa. Angalia matokeo hapa chini.' : 'Filters updated. See your results below.'}</p>
          {applied.interpretation.unsupported.length > 0 && <p className="mt-1 text-ink-500 dark:text-gray-400">
            {sw ? 'Tumetafuta kwa vichujio vinavyopatikana. Hatuwezi kuchuja haya bado:' : 'We searched using the supported filters. We cannot filter these preferences yet:'} {applied.interpretation.unsupported.join(', ')}
          </p>}
        </div>
      )}
      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-ink-700 dark:text-gray-300"
        >
          {error}
        </p>
      )}
      {result && (
        <Highlight
          trigger={result}
          variant="ring"
          fireOnMount
          className="mt-4 block rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40"
        >
         <div aria-live="polite" className="animate-panel-in">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              ?
            </span>
            {sw ? 'Tusaidie kuthibitisha eneo' : 'Help us confirm the location'}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {(
              [
                'propertyType',
                'minPrice',
                'maxPrice',
                'bedrooms',
                'bathrooms',
              ] as const
            )
              .filter((key) => result.interpretation[key] !== null)
              .map((key, chipIndex) => (
                <span
                  key={key}
                  className={cn(
                    'rounded-full bg-brand-50 px-3 py-2 text-brand-900',
                    !reducedMotion && 'animate-pop-in',
                  )}
                  style={
                    reducedMotion
                      ? undefined
                      : { animationDelay: `${chipIndex * 70}ms` }
                  }
                >
                  {key === 'minPrice' || key === 'maxPrice'
                    ? `${key === 'maxPrice' ? (sw ? 'Hadi' : 'Up to') : sw ? 'Kuanzia' : 'From'} TSh ${Number(result.interpretation[key]).toLocaleString()}`
                    : key === 'propertyType'
                      ? {
                          ROOM: sw ? 'Chumba' : 'Room',
                          HOUSE: sw ? 'Nyumba' : 'House',
                          APARTMENT: sw ? 'Ghorofa' : 'Apartment',
                          STUDIO: 'Studio',
                        }[result.interpretation.propertyType as 'ROOM']
                      : `${result.interpretation[key]}+ ${key === 'bedrooms' ? (sw ? 'vyumba' : 'bedrooms') : sw ? 'bafu' : 'bathrooms'}`}
                </span>
              ))}
          </div>
          {result.locationUnresolved ? (
            <p className="mt-3 text-sm">
              {sw
                ? 'Eneo halijapatikana kwenye orodha yetu. Jaribu jina la kata na mkoa, au chagua eneo hapa chini.'
                : 'That area was not found in our directory. Try the ward and region name, or choose an area below.'}
            </p>
          ) : result.locations.length > 0 ? (
            <fieldset className="mt-3 space-y-2">
              <legend className="mb-2 text-xs text-ink-500">
                {result.locations.length > 1
                  ? sw
                    ? 'Unamaanisha eneo gani?'
                    : 'Which location do you mean?'
                  : sw
                    ? 'Eneo'
                    : 'Location'}
              </legend>
              {result.locations.map((location, index) => (
                <button
                  type="button"
                  onClick={() => apply(result, location)}
                  key={`${location.region}-${location.district}-${location.type}`}
                  className={cn(
                    'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-brand-600 hover:bg-brand-50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 motion-reduce:hover:translate-y-0 dark:border-gray-600',
                    !reducedMotion && 'animate-pop-in',
                  )}
                  style={
                    reducedMotion
                      ? undefined
                      : { animationDelay: `${index * 70}ms` }
                  }
                >
                  <span>
                    <strong>{toTitleCase(location.name)}</strong>
                    <span className="ml-2 text-ink-500">
                      {[
                        location.district !== location.name
                          ? location.district
                          : null,
                        location.region !== location.name
                          ? location.region
                          : null,
                      ]
                        .filter(Boolean)
                        .map((value) => toTitleCase(value || undefined))
                        .join(', ')}
                    </span>
                  </span>
                </button>
              ))}
            </fieldset>
          ) : (
            <p className="mt-3 text-sm text-ink-500">
              {sw
                ? 'Eneo ulilochagua litatumika.'
                : 'Your currently selected area will be used.'}
            </p>
          )}
          {result.interpretation.unsupported.length > 0 && (
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              {sw
                ? 'Hatuwezi kuchuja haya bado:'
                : 'These requests cannot be filtered yet:'}{' '}
              {result.interpretation.unsupported.join(', ')}
            </p>
          )}
         </div>
        </Highlight>
      )}
    </section>
  );
}
