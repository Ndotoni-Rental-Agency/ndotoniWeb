import { SearchOptimizedLocationItem } from './data';

/**
 * Calculate match score for hierarchical search
 */
export function getMatchScore(query: string, target: string): number {
  if (!query || !target) return 0;
  
  const queryLower = query.toLowerCase();
  const targetLower = target.toLowerCase();
  
  if (targetLower === queryLower) return 1.0;
  if (targetLower.startsWith(queryLower)) return 0.9;
  if (targetLower.includes(queryLower)) return 0.7;
  
  return 0;
}

/**
 * Get hierarchy level (lower number = higher priority)
 */
export function getHierarchyLevel(location: SearchOptimizedLocationItem): number {
  if (!location.district) return 1; // Region
  if (!location.ward) return 2;     // District
  if (!location.street) return 3;   // Ward
  return 4;                         // Street
}

/**
 * Create unique key for location deduplication
 */
export function createLocationKey(location: SearchOptimizedLocationItem): string {
  return `${location.region}-${location.district || ''}-${location.ward || ''}-${location.street || ''}`;
}

/**
 * Normalize search query for consistent caching
 */
export function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Sort locations alphabetically within their hierarchy level
 */
export function sortLocationsByName(locations: SearchOptimizedLocationItem[]): SearchOptimizedLocationItem[] {
  return locations.sort((a, b) => {
    const aName = a.street || a.ward || a.district || a.region;
    const bName = b.street || b.ward || b.district || b.region;
    return aName.localeCompare(bName);
  });
}