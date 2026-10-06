'use client';

import { useState } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { Search, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toTitleCase } from '@/lib/utils/common';
import type { SearchInterpretation } from '@/lib/search/interpretation';

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
}: {
  filters: Filters;
  onApply: (filters: Filters) => void;
}) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [applied, setApplied] = useState<Result | null>(null);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
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
      const payload = response.interpretPropertySearch;
      const data: Result =
        typeof payload === 'string' ? JSON.parse(payload) : payload;
      if (!data.locationUnresolved && data.locations.length <= 1) {
        apply(data, data.locations[0] || null);
      } else {
        setResult(data);
      }
    } catch (error) {
      setError(
        !(error instanceof Error) || error.message !== 'SEARCH_NOT_UNDERSTOOD'
          ? sw
            ? 'Utafutaji wa AI haupatikani kwa sasa. Tumia vichujio hapa chini.'
            : 'AI search is unavailable right now. Use the filters below.'
          : sw
            ? 'Hatukuelewa utafutaji huo. Jaribu jina la kata na bajeti ya mwezi.'
            : 'We could not interpret that search. Try a ward name and monthly budget.',
      );
    } finally {
      setLoading(false);
    }
  };
  const apply = (data: Result, location: Location | null) => {
    if (data.locationUnresolved) return;
    const next: Filters = location
      ? {
          region: location.region,
          ...(location.type === 'ward'
            ? { ward: location.name }
            : location.type === 'district'
              ? { district: location.name }
              : {}),
        }
      : {
          region: filters.region,
          district: filters.district,
          ward: filters.ward,
        };
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
    onApply({ ...next, originalText: text.trim() });
    setResult(null);
    setApplied(data);
  };
  return (
    <section className="mb-6 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5 dark:border-brand-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center gap-2 text-brand-800 dark:text-brand-300">
        <Sparkles size={17} aria-hidden="true" />
        <h2 className="text-sm font-bold">
          {sw ? 'Eleza nyumba unayotafuta' : 'Describe the home you want'}
        </h2>
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800">
          AI
        </span>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="natural-search" className="sr-only">
          {sw ? 'Eleza utafutaji wako' : 'Describe your search'}
        </label>
        <input
          id="natural-search"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
            setError('');
            setApplied(null);
          }}
          disabled={loading}
          required
          minLength={3}
          maxLength={500}
          className="min-h-12 min-w-0 flex-1 rounded-xl border border-stone-200 bg-cream-100 px-4 text-sm text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder={
            sw
              ? 'Mfano: chumba Kimara chini ya laki tatu'
              : 'e.g. a room in Kimara under TSh 300,000'
          }
        />
        <button
          type="submit"
          disabled={loading || text.trim().length < 3}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-800 px-6 text-sm font-bold text-white hover:bg-brand-900 disabled:opacity-50"
        >
          <Search size={17} aria-hidden="true" />
          {loading
            ? sw
              ? 'Inatafsiri…'
              : 'Interpreting…'
            : sw
              ? 'Tafuta'
              : 'Find homes'}
        </button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-ink-500 dark:text-gray-400">
        {sw
          ? 'Andika kwa Kiswahili au Kiingereza. Unaweza kubadilisha vichujio baada ya kutafuta.'
          : 'Write in Kiswahili or English. You can adjust the filters after searching.'}
      </p>
      {applied && (
        <div role="status" className="mt-3 text-xs leading-relaxed text-brand-800 dark:text-brand-300">
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
        <div
          className="mt-4 border-t border-stone-200 pt-4 dark:border-gray-700"
          aria-live="polite"
        >
          <h3 className="text-sm font-bold">
            {sw ? 'Tusaidie kuthibitisha eneo' : 'Help us confirm the location'}
          </h3>
          {result.engine === 'basic' && (
            <p className="mt-2 text-xs leading-relaxed text-ink-500">
              {sw
                ? 'Utafutaji wa msingi umetambua eneo na vichujio vya kawaida. AI bado haijawezeshwa; hakiki kila kichujio.'
                : 'Basic search recognized the area and common filters. AI is not enabled yet; please review each filter.'}
            </p>
          )}
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
              .map((key) => (
                <span
                  key={key}
                  className="rounded-full bg-brand-50 px-3 py-2 text-brand-900"
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
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-3 text-left text-sm hover:border-brand-600 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 dark:border-gray-600"
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
            <p className="mt-3 text-xs leading-relaxed text-ink-500">
              {sw
                ? 'Hatuwezi kuchuja haya bado:'
                : 'These requests cannot be filtered yet:'}{' '}
              {result.interpretation.unsupported.join(', ')}
            </p>
          )}

        </div>
      )}
    </section>
  );
}
