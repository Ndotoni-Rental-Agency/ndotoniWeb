import { Property, ShortTermProperty } from '@/API';

type AdminProperty = Property | ShortTermProperty;

const SEARCH_STOP_WORDS = new Set(['a', 'an', 'the', 'for', 'in', 'at', 'to', 'of', 'and']);

export function normalizeAdminSearchTerm(term: string): string {
  return term.trim().replace(/^["']+|["']+$/g, '').trim();
}

export function isPropertyIdSearch(term: string): boolean {
  const normalized = normalizeAdminSearchTerm(term);
  return /^[A-Za-z0-9_-]{8,}$/.test(normalized);
}

function getSearchableText(property: AdminProperty): string {
  const parts = [
    property.title,
    property.propertyId,
    'address' in property ? property.address?.district : undefined,
    'address' in property ? property.address?.region : undefined,
    'address' in property && property.address && 'ward' in property.address
      ? property.address.ward
      : undefined,
    'district' in property ? property.district : undefined,
    'region' in property ? property.region : undefined,
  ];

  return parts.filter(Boolean).join(' ').toLowerCase();
}

export function matchesAdminPropertySearch(
  property: AdminProperty,
  rawSearchTerm: string
): boolean {
  const searchTerm = normalizeAdminSearchTerm(rawSearchTerm).toLowerCase();
  if (!searchTerm) return true;

  const searchableText = getSearchableText(property);

  if (property.propertyId.toLowerCase().includes(searchTerm)) {
    return true;
  }

  if (searchableText.includes(searchTerm)) {
    return true;
  }

  const tokens = searchTerm
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 0 && !SEARCH_STOP_WORDS.has(token));

  if (tokens.length === 0) {
    return searchableText.includes(searchTerm);
  }

  return tokens.every(token => searchableText.includes(token));
}
