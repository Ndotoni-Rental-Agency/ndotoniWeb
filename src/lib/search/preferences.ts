"use client";

export type SearchPreferences = {
  region?: string; district?: string; ward?: string; propertyType?: string;
  minPrice?: number; maxPrice?: number; bedrooms?: number; bathrooms?: number;
  moveInDate?: string; originalText?: string;
};
const KEY = 'ndotoni.latest-search.v1';
export const SEARCH_UPDATED = 'ndotoni-search-updated';
export function readSearchPreferences(): SearchPreferences | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!saved || typeof saved.savedAt !== 'number' || Date.now() - saved.savedAt > 30 * 86400000) return null;
    const result: SearchPreferences = {};
    for (const key of ['region', 'district', 'ward', 'propertyType', 'moveInDate', 'originalText'] as const)
      if (typeof saved.filters?.[key] === 'string') result[key] = saved.filters[key].slice(0, 500);
    for (const key of ['minPrice', 'maxPrice', 'bedrooms', 'bathrooms'] as const)
      if (typeof saved.filters?.[key] === 'number' && Number.isFinite(saved.filters[key]) && saved.filters[key] >= 0)
        result[key] = saved.filters[key];
    return result;
  } catch { return null; }
}
export function saveSearchPreferences(filters: SearchPreferences) {
  try { localStorage.setItem(KEY, JSON.stringify({savedAt: Date.now(), filters})); } catch { /* Storage is optional. */ }
  window.dispatchEvent(new CustomEvent(SEARCH_UPDATED, {detail: filters}));
}
export function searchDescription(filters: SearchPreferences, sw: boolean): string {
  const types: Record<string, string> = sw
    ? { ROOM: 'Chumba', HOUSE: 'Nyumba', APARTMENT: 'Ghorofa', STUDIO: 'Studio' }
    : { ROOM: 'Room', HOUSE: 'House', APARTMENT: 'Apartment', STUDIO: 'Studio' };
  const parts = [types[filters.propertyType || ''] || (sw ? 'Nyumba' : 'Home'),
    [filters.ward, filters.district, filters.region].filter(Boolean).join(', ')];
  if (filters.minPrice !== undefined) parts.push(`${sw ? 'kuanzia' : 'from'} TSh ${filters.minPrice.toLocaleString()}`);
  if (filters.maxPrice !== undefined) parts.push(`${sw ? 'hadi' : 'up to'} TSh ${filters.maxPrice.toLocaleString()} ${sw ? 'kwa mwezi' : 'per month'}`);
  if (filters.bedrooms !== undefined) parts.push(`${filters.bedrooms}+ ${sw ? 'vyumba' : 'bedrooms'}`);
  if (filters.bathrooms !== undefined) parts.push(`${filters.bathrooms}+ ${sw ? 'bafu' : 'bathrooms'}`);
  return parts.filter(Boolean).join(' · ');
}
