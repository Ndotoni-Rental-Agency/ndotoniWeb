'use client';

import React, { useState, useEffect } from 'react';
import FiltersModal from './FiltersModal';
import { SlidersHorizontal } from 'lucide-react';
import { Chip } from '@/components/home/HomeSearch';
import { useLanguage } from '@/contexts/LanguageContext';
import { BEDROOM_PRESETS, BUDGET_PRESETS, findBudgetPreset } from '@/lib/search/presets';
import { fetchRegions, fetchDistricts, type Region, type District } from '@/lib/location/hierarchical';
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

// Location names arrive as "DAR ES SALAAM", "DAR-ES-SALAAM" or "Dar es Salaam"; compare letters and digits only.
const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, '');
const sameName = (a?: string, b?: string) => !!a && !!b && slug(a) === slug(b);

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
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
    if (!filters.region) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        // Find the region ID from the region name
        const region = regions.find(r => sameName(r.name, filters.region));
        if (region) {
          const data = await fetchDistricts(region.id);
          setDistricts(data);
        }
      } catch (error) {
        console.error('Error loading districts:', error);
      } finally {
        setLoadingDistricts(false);
      }
    };
    loadDistricts();
  }, [filters.region, regions]);

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

  const clearFilters = () => {
    // Preserve region and district when clearing filters
    const preservedFilters: PropertyFilters = {};
    if (filters.region) preservedFilters.region = filters.region;
    if (filters.district) preservedFilters.district = filters.district;
    
    onFiltersChange(preservedFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => !['region', 'district'].includes(key) && filters[key as keyof PropertyFilters] !== undefined
  );

  // Count advanced filters (excluding location filters and basic filters shown in main bar)
  const advancedFiltersCount = Object.keys(filters).filter(key => 
    !['region', 'district', 'ward', 'propertyType', 'priceSort', 'minPrice', 'maxPrice', 'bedrooms'].includes(key) && filters[key as keyof PropertyFilters] !== undefined
  ).length;

  const selectClass =
    'w-full min-h-11 px-3 bg-white dark:bg-gray-800 text-ink-900 dark:text-white border border-stone-300 dark:border-gray-600 rounded-xl text-base font-medium hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors disabled:opacity-60';
  const labelClass = 'block text-sm font-bold text-ink-900 dark:text-white mb-1.5';
  const selectedBudget = findBudgetPreset(filters.minPrice, filters.maxPrice);
  const hasCustomBudget = !selectedBudget && (filters.minPrice !== undefined || filters.maxPrice !== undefined);

  const setBudget = (minPrice?: number, maxPrice?: number) => {
    onFiltersChange({ ...filters, minPrice, maxPrice });
  };

  return (
    <>
      <div className="mb-4 rounded-2xl border border-stone-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label htmlFor="region-select" className={labelClass}>{t('searchPage.area')}</label>
            <select
              id="region-select"
              value={regions.find((r) => sameName(r.name, filters.region))?.name || filters.region || ''}
              onChange={(e) => updateFilter('region', e.target.value || undefined)}
              disabled={loadingRegions}
              className={selectClass}
            >
              <option value="">{t('searchPage.allAreas')}</option>
              {filters.region && !regions.some((r) => sameName(r.name, filters.region)) && (
                <option value={filters.region}>{toTitleCase(filters.region)}</option>
              )}
              {regions.map((region) => (
                <option key={region.id} value={region.name}>{toTitleCase(region.name)}</option>
              ))}
            </select>
          </div>

          {filters.region && (
            <div>
              <label htmlFor="district-select" className={labelClass}>{t('home.district')}</label>
              <select
                id="district-select"
                value={districts.find((d) => sameName(d.name, filters.district))?.name || filters.district || ''}
                onChange={(e) => updateFilter('district', e.target.value || undefined)}
                disabled={loadingDistricts}
                className={selectClass}
              >
                <option value="">{t('searchPage.allDistricts')}</option>
                {filters.district && !districts.some((d) => sameName(d.name, filters.district)) && (
                  <option value={filters.district}>{toTitleCase(filters.district)}</option>
                )}
                {districts.map((district) => (
                  <option key={district.id} value={district.name}>{toTitleCase(district.name)}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="property-type-select" className={labelClass}>{t('searchPage.type')}</label>
            <select
              id="property-type-select"
              value={filters.propertyType || ''}
              onChange={(e) => updateFilter('propertyType', e.target.value || undefined)}
              className={selectClass}
            >
              <option value="">{t('searchPage.anyType')}</option>
              <option value="HOUSE">{t('properties.propertyTypes.house')}</option>
              <option value="APARTMENT">{t('properties.propertyTypes.apartment')}</option>
              <option value="ROOM">{t('properties.propertyTypes.room')}</option>
              <option value="STUDIO">{t('properties.propertyTypes.studio')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-select" className={labelClass}>{t('searchPage.sort')}</label>
            <select
              id="sort-select"
              value={filters.priceSort === 'desc' ? 'desc' : ''}
              onChange={(e) => updateFilter('priceSort', e.target.value === 'desc' ? 'desc' : undefined)}
              className={selectClass}
            >
              <option value="">{t('searchPage.sortLowest')}</option>
              <option value="desc">{t('searchPage.sortHighest')}</option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>{t('home.budget')}</legend>
          <div className="flex gap-2 overflow-x-auto sm:flex-wrap -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [scrollbar-width:none] [&>*]:flex-shrink-0">
            <Chip selected={!selectedBudget && !hasCustomBudget} onClick={() => setBudget(undefined, undefined)}>
              {t('home.anyBudget')}
            </Chip>
            {BUDGET_PRESETS.map((b) => (
              <Chip key={b.id} selected={selectedBudget?.id === b.id} onClick={() => setBudget(b.minPrice, b.maxPrice)}>
                {t(b.labelKey)}
              </Chip>
            ))}
            {hasCustomBudget && (
              <Chip selected onClick={() => setBudget(undefined, undefined)}>
                {(filters.minPrice ?? 0).toLocaleString()} – {filters.maxPrice ? filters.maxPrice.toLocaleString() : '∞'} ✕
              </Chip>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend className={labelClass}>{t('home.bedrooms')}</legend>
          <div className="flex flex-wrap gap-2">
            <Chip selected={!filters.bedrooms} onClick={() => updateFilter('bedrooms', undefined)}>
              {t('home.anyBedrooms')}
            </Chip>
            {BEDROOM_PRESETS.map((n) => (
              <Chip key={n} selected={filters.bedrooms === n} onClick={() => updateFilter('bedrooms', n)}>
                {n}+
              </Chip>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 min-h-11 px-4 rounded-full border border-stone-300 dark:border-gray-600 text-sm font-semibold text-ink-800 dark:text-gray-100 hover:border-brand-500 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden />
            {t('searchPage.moreFilters')}
            {advancedFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-brand-700 text-white text-xs font-bold">
                {advancedFiltersCount}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="min-h-11 px-4 text-sm font-semibold text-brand-700 dark:text-brand-300 underline underline-offset-4"
            >
              {t('searchPage.clearAll')}
            </button>
          )}
        </div>
      </div>

      {/* Filters Modal */}
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