'use client';

import React, { useState, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { normalizeLocationName } from '@/lib/location/normalize';
import FiltersModal from './FiltersModal';
import {
  fetchRegions,
  fetchDistricts,
  fetchWards,
  type Ward,
  type Region,
  type District,
} from '@/lib/location/hierarchical';
import { useLanguage } from '@/contexts/LanguageContext';
import { toTitleCase } from '@/lib/utils/common';

// Define PropertyFilters interface here since it's frontend-specific
interface PropertyFilters {
  region?: string;
  district?: string;
  ward?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  moveInDate?: string;
  duration?: number;
  q?: string;
  priceSort?: 'asc' | 'desc';
}

interface SearchFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
}: SearchFiltersProps) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [wardQuery, setWardQuery] = useState('');
  const [wardError, setWardError] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  // Load regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      setLoadingRegions(true);
      try {
        const data = await fetchRegions();
        setRegions(data);
      } catch (error) {
        console.error('Error loading regions:', error);
      } finally {
        setLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  // Load districts when region changes
  useEffect(() => {
    if (!filters.region && !regions.length) {
      setDistricts([]);
      return;
    }

    let active = true;
    setDistricts([]);
    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        // Find the region ID from the region name
        const region = regions.find(
          (r) =>
            normalizeLocationName(r.name) ===
            normalizeLocationName(filters.region || 'Dar es Salaam'),
        );
        if (region) {
          const data = await fetchDistricts(region.id);
          if (active) setDistricts(data);
        }
      } catch (error) {
        console.error('Error loading districts:', error);
      } finally {
        if (active) setLoadingDistricts(false);
      }
    };
    loadDistricts();
    return () => {
      active = false;
    };
  }, [filters.region, regions]);

  useEffect(() => {
    let active = true;
    setWards([]);
    setWardError(false);
    setWardQuery('');
    const selectedDistricts = filters.district
      ? districts.filter(
          (d) =>
            normalizeLocationName(d.name) ===
            normalizeLocationName(filters.district),
        )
      : districts;
    if (!selectedDistricts.length) {
      setLoadingWards(false);
      return;
    }
    setLoadingWards(true);
    Promise.all(selectedDistricts.map((d) => fetchWards(d.id)))
      .then((groups) => {
        if (active)
          setWards(groups.flat().sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {
        if (active) setWardError(true);
      })
      .finally(() => {
        if (active) setLoadingWards(false);
      });
    return () => {
      active = false;
    };
  }, [districts, filters.district]);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };

    // Clear dependent filters when parent changes
    if (key === 'region') {
      delete newFilters.district;
      delete newFilters.ward;
    } else if (key === 'district') {
      delete newFilters.ward;
    }

    onFiltersChange(newFilters);
  };

  const clearFilters = () =>
    onFiltersChange({
      region: filters.region,
      district: filters.district,
      ward: filters.ward,
    });
  const activeEntries = (
    ['minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'moveInDate'] as const
  ).filter((key) => filters[key] !== undefined && filters[key] !== '');
  const fieldClass =
    'min-h-12 w-full min-w-0 rounded-xl border border-stone-200 bg-white px-3 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-brand-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white';
  const labelClass =
    'mb-2 block text-xs font-semibold text-ink-500 dark:text-gray-400';
  const budgetOptions = [
    100000, 200000, 300000, 500000, 800000, 1000000, 1500000, 2000000,
  ];
  const removeFilter = (key: keyof PropertyFilters) => {
    const next = { ...filters };
    delete next[key];
    onFiltersChange(next);
  };

  return (
    <>
      <section
        aria-label={sw ? 'Tafuta nyumba' : 'Find a home'}
        className="mb-8 rounded-2xl border border-stone-200 bg-cream-100 p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-900"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-poster text-xl font-bold tracking-tight">
            {sw ? 'Nyumba gani inakufaa?' : 'What feels like home?'}
          </h2>
          <span className="hidden text-xs text-ink-500 sm:block dark:text-gray-400">
            {sw
              ? 'Matokeo husasishwa ukichagua'
              : 'Results update as you choose'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <div className="min-w-0">
            <label htmlFor="region-select" className={labelClass}>
              {sw ? 'Mkoa' : 'Region'}
            </label>
            <select
              id="region-select"
              className={fieldClass}
              disabled={loadingRegions}
              value={
                regions.find(
                  (r) =>
                    normalizeLocationName(r.name) ===
                    normalizeLocationName(filters.region || 'Dar es Salaam'),
                )?.name || ''
              }
              onChange={(e) =>
                updateFilter('region', e.target.value || undefined)
              }
            >
              <option value="">
                {loadingRegions
                  ? sw
                    ? 'Inapakia…'
                    : 'Loading…'
                  : sw
                    ? 'Chagua mkoa'
                    : 'Choose region'}
              </option>
              {regions.map((r) => (
                <option key={r.id} value={r.name}>
                  {toTitleCase(r.name)}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor="district-select" className={labelClass}>
              {sw ? 'Wilaya' : 'District'}
            </label>
            <select
              id="district-select"
              className={fieldClass}
              disabled={loadingDistricts || !districts.length}
              value={
                districts.find(
                  (d) =>
                    normalizeLocationName(d.name) ===
                    normalizeLocationName(filters.district),
                )?.name || ''
              }
              onChange={(e) =>
                updateFilter('district', e.target.value || undefined)
              }
            >
              <option value="">
                {loadingDistricts
                  ? sw
                    ? 'Inapakia…'
                    : 'Loading…'
                  : sw
                    ? 'Wilaya zote'
                    : 'All districts'}
              </option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {toTitleCase(d.name)}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor="property-type-select" className={labelClass}>
              {sw ? 'Aina ya nyumba' : 'Home type'}
            </label>
            <select
              id="property-type-select"
              className={fieldClass}
              value={filters.propertyType || ''}
              onChange={(e) =>
                updateFilter('propertyType', e.target.value || undefined)
              }
            >
              <option value="">{sw ? 'Aina zote' : 'All types'}</option>
              <option value="ROOM">{sw ? 'Chumba' : 'Room'}</option>
              <option value="STUDIO">Studio</option>
              <option value="APARTMENT">{sw ? 'Ghorofa' : 'Apartment'}</option>
              <option value="HOUSE">{sw ? 'Nyumba' : 'House'}</option>
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor="budget-select" className={labelClass}>
              {sw ? 'Bajeti ya mwezi (TSh)' : 'Monthly budget (TSh)'}
            </label>
            <select
              id="budget-select"
              className={fieldClass}
              value={filters.maxPrice ?? ''}
              onChange={(e) => {
                const maxPrice = e.target.value
                  ? Number(e.target.value)
                  : undefined;
                onFiltersChange({
                  ...filters,
                  maxPrice,
                  minPrice:
                    maxPrice !== undefined && (filters.minPrice ?? 0) > maxPrice
                      ? undefined
                      : filters.minPrice,
                });
              }}
            >
              <option value="">{sw ? 'Bajeti yoyote' : 'Any budget'}</option>
              {filters.maxPrice !== undefined &&
                !budgetOptions.includes(filters.maxPrice) && (
                  <option value={filters.maxPrice}>
                    {sw ? 'Hadi' : 'Up to'} {filters.maxPrice.toLocaleString()}
                  </option>
                )}
              {budgetOptions.map((value) => (
                <option key={value} value={value}>
                  {sw ? 'Hadi' : 'Up to'} {value.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          <div className="relative col-span-2 min-w-0 lg:col-span-2">
            <Combobox
              value={filters.ward || ''}
              onChange={(ward: string | null) => {
                setWardQuery('');
                updateFilter('ward', ward || undefined);
              }}
              disabled={loadingWards || !wards.length}
            >
              <Combobox.Label className={labelClass}>
                {sw ? 'Kata / eneo' : 'Ward / neighborhood'}
              </Combobox.Label>
              <div className="relative">
                <Combobox.Input
                  className={`${fieldClass} pr-12`}
                  displayValue={(value: string) => toTitleCase(value)}
                  onChange={(e) => setWardQuery(e.target.value)}
                  placeholder={
                    loadingWards
                      ? sw
                        ? 'Inapakia kata…'
                        : 'Loading neighborhoods…'
                      : sw
                        ? 'Andika eneo, mfano Kimara'
                        : 'Type an area, e.g. Kimara'
                  }
                />
                <Combobox.Button
                  className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center text-brand-800 dark:text-brand-300"
                  aria-label={sw ? 'Onyesha kata' : 'Show neighborhoods'}
                >
                  ⌄
                </Combobox.Button>
              </div>
              <Combobox.Options className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-stone-200 bg-white p-1 shadow-editorial dark:border-gray-600 dark:bg-gray-800">
                <Combobox.Option
                  value=""
                  className={({ active }) =>
                    `cursor-pointer rounded-lg px-3 py-3 text-sm ${active ? 'bg-brand-50 text-brand-900' : ''}`
                  }
                >
                  {sw ? 'Kata zote' : 'All neighborhoods'}
                </Combobox.Option>
                {wards
                  .filter((w) =>
                    normalizeLocationName(w.name).includes(
                      normalizeLocationName(wardQuery),
                    ),
                  )
                  .map((w) => (
                    <Combobox.Option
                      key={w.id}
                      value={w.name}
                      className={({ active }) =>
                        `cursor-pointer rounded-lg px-3 py-3 text-sm ${active ? 'bg-brand-50 text-brand-900' : ''}`
                      }
                    >
                      <span className="font-semibold">
                        {toTitleCase(w.name)}
                      </span>
                      <span className="ml-2 text-xs text-ink-500">
                        {toTitleCase(
                          districts.find((d) => d.id === w.districtId)?.name ||
                            '',
                        )}
                      </span>
                    </Combobox.Option>
                  ))}
                {wardQuery &&
                  !wards.some((w) =>
                    normalizeLocationName(w.name).includes(
                      normalizeLocationName(wardQuery),
                    ),
                  ) && (
                    <p className="px-3 py-4 text-sm text-ink-500">
                      {sw
                        ? 'Hakuna kata inayolingana. Jaribu jina lingine au mkoa mwingine.'
                        : 'No matching ward. Try another name or region.'}
                    </p>
                  )}
              </Combobox.Options>
            </Combobox>
            {wardError && (
              <p role="status" className="mt-2 text-xs text-ink-500">
                {sw
                  ? 'Kata hazijapakia. Jaribu kuchagua mkoa tena.'
                  : 'Neighborhoods could not load. Try selecting the region again.'}
              </p>
            )}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-4 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-700 bg-white px-4 text-sm font-semibold text-brand-800 dark:bg-gray-800 dark:text-brand-300"
              aria-haspopup="dialog"
            >
              <span aria-hidden="true">+</span>{' '}
              {sw ? 'Vichujio zaidi' : 'More filters'}
              {activeEntries.length > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-800">
                  {activeEntries.length}
                </span>
              )}
            </button>
            {(activeEntries.length > 0 ||
              filters.propertyType ||
              filters.priceSort) && (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 px-3 text-sm font-medium text-ink-500 underline underline-offset-4 dark:text-gray-400"
              >
                {sw ? 'Ondoa vichujio' : 'Reset filters'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="price-sort"
              className="text-xs font-semibold text-ink-500 dark:text-gray-400"
            >
              {sw ? 'Panga' : 'Sort'}
            </label>
            <select
              id="price-sort"
              className="min-h-11 max-w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-ink-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              value={filters.priceSort || ''}
              onChange={(e) =>
                updateFilter('priceSort', e.target.value || undefined)
              }
            >
              <option value="">
                {sw ? 'Mpangilio wa kawaida' : 'Default order'}
              </option>
              <option value="asc">
                {sw ? 'Bei: ndogo hadi kubwa' : 'Price: low to high'}
              </option>
              <option value="desc">
                {sw ? 'Bei: kubwa hadi ndogo' : 'Price: high to low'}
              </option>
            </select>
          </div>
        </div>
        {activeEntries.length > 0 && (
          <div
            className="mt-4 flex flex-wrap gap-2"
            aria-label={sw ? 'Vichujio ulivyochagua' : 'Selected filters'}
          >
            {activeEntries.map((key) => {
              const value = filters[key];
              const labels = {
                minPrice: `${sw ? 'Kuanzia' : 'From'} TSh ${Number(value).toLocaleString()}`,
                maxPrice: `${sw ? 'Hadi' : 'Up to'} TSh ${Number(value).toLocaleString()}`,
                bedrooms: `${value}+ ${sw ? 'vyumba' : 'bedrooms'}`,
                bathrooms: `${value}+ ${sw ? 'bafu' : 'bathrooms'}`,
                moveInDate: `${sw ? 'Kuhamia' : 'Move in'}: ${value}`,
              };
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => removeFilter(key)}
                  className="inline-flex min-h-11 items-center gap-3 rounded-full bg-brand-50 px-4 text-xs font-semibold text-brand-800 dark:bg-brand-900 dark:text-white"
                  aria-label={`${sw ? 'Ondoa' : 'Remove'} ${labels[key]}`}
                >
                  {labels[key]} <span aria-hidden="true">×</span>
                </button>
              );
            })}
          </div>
        )}
      </section>
      <FiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={clearFilters}
      />
    </>
  );
}
