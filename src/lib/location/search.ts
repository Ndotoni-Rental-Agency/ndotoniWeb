import Fuse, { IFuseOptions } from 'fuse.js';
import { SearchOptimizedLocationItem } from './data';
import { getMatchScore, getHierarchyLevel, createLocationKey, normalizeQuery } from './utils';

// Fuse.js configuration
const FUSE_OPTIONS: IFuseOptions<SearchOptimizedLocationItem> = {
  keys: [
    { name: 'region', weight: 0.4 },
    { name: 'district', weight: 0.3 },
    { name: 'ward', weight: 0.2 },
    { name: 'street', weight: 0.1 }
  ],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2,
  includeScore: true,
  ignoreLocation: true,
};

interface HierarchicalMatches {
  regions: Map<string, number>;
  districts: Map<string, number>;
  wards: Map<string, number>;
  streets: Map<string, number>;
}

interface SearchCache {
  query: string;
  limit: number;
  results: SearchOptimizedLocationItem[];
  timestamp: number;
}

export class LocationSearch {
  private fuse: Fuse<SearchOptimizedLocationItem>;
  private locations: SearchOptimizedLocationItem[];
  private cache: Map<string, SearchCache> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100; // Prevent memory leaks

  constructor(locations: SearchOptimizedLocationItem[]) {
    this.locations = locations;
    this.fuse = new Fuse(locations, FUSE_OPTIONS);
  }

  /**
   * Main search method with hierarchical prioritization and caching
   */
  search(query: string, limit: number = 8): SearchOptimizedLocationItem[] {
    if (!query || query.length < 2) return [];

    // Normalize query for consistent caching
    const normalizedQuery = normalizeQuery(query);
    const cacheKey = `${normalizedQuery}-${limit}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    // Perform search
    const results = this.performSearch(normalizedQuery, limit);
    
    // Cache results
    this.setCache(cacheKey, normalizedQuery, limit, results);
    
    return results;
  }

  /**
   * Update search index with new locations and clear cache
   */
  updateIndex(locations: SearchOptimizedLocationItem[]) {
    this.locations = locations;
    this.fuse.setCollection(locations);
    this.clearCache(); // Clear cache when data changes
  }

  /**
   * Clear all cached results
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * Get results from cache if valid
   */
  private getFromCache(cacheKey: string): SearchOptimizedLocationItem[] | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    // Check if cache is still valid
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(cacheKey);
      return null;
    }

    return cached.results;
  }

  /**
   * Store results in cache
   */
  private setCache(cacheKey: string, query: string, limit: number, results: SearchOptimizedLocationItem[]) {
    // Prevent cache from growing too large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value as string;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(cacheKey, {
      query,
      limit,
      results: [...results], // Clone array to prevent mutations
      timestamp: Date.now()
    });
  }

  /**
   * Calculate cache hit rate for monitoring
   */
  private calculateHitRate(): number {
    // This would need to be tracked over time for real hit rate calculation
    // For now, just return cache utilization
    return this.cache.size / this.MAX_CACHE_SIZE;
  }

  /**
   * Perform the actual search (extracted from main search method)
   */
  private performSearch(query: string, limit: number): SearchOptimizedLocationItem[] {
    const matches = this.findMatches(query);
    const bestScores = this.getBestScores(matches);
    const maxScore = Math.max(...Object.values(bestScores));

    // Fall back to fuzzy search if no strong matches
    if (maxScore < 0.7) {
      return this.fuzzySearchWithHierarchy(query, limit);
    }

    return this.buildHierarchicalResults(matches, bestScores, maxScore, limit, query);
  }

  /**
   * Find matches at each hierarchy level
   */
  private findMatches(query: string): HierarchicalMatches {
    const queryLower = query.toLowerCase();
    const matches: HierarchicalMatches = {
      regions: new Map(),
      districts: new Map(),
      wards: new Map(),
      streets: new Map()
    };

    this.locations.forEach(location => {
      this.scoreLocationField(location._region, location.region, queryLower, matches.regions);
      this.scoreLocationField(location._district, `${location.region}|${location.district}`, queryLower, matches.districts);
      this.scoreLocationField(location._ward, `${location.region}|${location.district}|${location.ward}`, queryLower, matches.wards);
      this.scoreLocationField(location._street, `${location.region}|${location.district}|${location.ward}|${location.street}`, queryLower, matches.streets);
    });

    return matches;
  }

  /**
   * Score a location field and update matches map
   */
  private scoreLocationField(field: string | undefined, key: string, query: string, matchesMap: Map<string, number>) {
    if (!field) return;
    
    const score = getMatchScore(query, field);
    if (score > 0) {
      matchesMap.set(key, Math.max(matchesMap.get(key) || 0, score));
    }
  }

  /**
   * Get best scores for each hierarchy level
   */
  private getBestScores(matches: HierarchicalMatches) {
    return {
      region: Math.max(...Array.from(matches.regions.values()), 0),
      district: Math.max(...Array.from(matches.districts.values()), 0),
      ward: Math.max(...Array.from(matches.wards.values()), 0),
      street: Math.max(...Array.from(matches.streets.values()), 0)
    };
  }

  /**
   * Build hierarchical results based on best match level
   */
  private buildHierarchicalResults(
    matches: HierarchicalMatches, 
    bestScores: any, 
    maxScore: number, 
    limit: number,
    query: string
  ): SearchOptimizedLocationItem[] {
    const results: SearchOptimizedLocationItem[] = [];
    const seen = new Set<string>();

    const addLocation = (location: SearchOptimizedLocationItem) => {
      const key = createLocationKey(location);
      if (!seen.has(key) && results.length < limit) {
        seen.add(key);
        results.push(location);
      }
    };

    if (bestScores.region === maxScore && maxScore >= 0.7) {
      this.addRegionResults(matches.regions, addLocation, limit, results);
    } else if (bestScores.district === maxScore && maxScore >= 0.7) {
      this.addDistrictResults(matches.districts, addLocation);
    } else {
      this.fuzzySearchWithHierarchy(query, limit).forEach(addLocation);
    }

    return results;
  }

  /**
   * Add region-level results (region → districts → wards)
   */
  private addRegionResults(
    regionMatches: Map<string, number>, 
    addLocation: (loc: SearchOptimizedLocationItem) => void,
    limit: number,
    results: SearchOptimizedLocationItem[]
  ) {
    const topRegions = Array.from(regionMatches.entries())
      .filter(([, score]) => score >= 0.7)
      .sort((a, b) => b[1] - a[1]);

    topRegions.forEach(([region]) => {
      // Add region
      const regionLocation = this.locations.find(loc => 
        loc.region === region && !loc.district
      );
      if (regionLocation) addLocation(regionLocation);

      // Add districts in region
      const districts = this.locations
        .filter(loc => loc.region === region && loc.district && !loc.ward)
        .sort((a, b) => a.district!.localeCompare(b.district!));
      districts.forEach(addLocation);

      // Add some wards
      const wards = this.locations
        .filter(loc => loc.region === region && loc.ward && !loc.street)
        .sort((a, b) => `${a.district}-${a.ward}`.localeCompare(`${b.district}-${b.ward}`))
        .slice(0, limit - results.length);
      wards.forEach(addLocation);
    });
  }

  /**
   * Add district-level results (district → wards)
   */
  private addDistrictResults(
    districtMatches: Map<string, number>,
    addLocation: (loc: SearchOptimizedLocationItem) => void
  ) {
    const topDistricts = Array.from(districtMatches.entries())
      .filter(([, score]) => score >= 0.7)
      .sort((a, b) => b[1] - a[1]);

    topDistricts.forEach(([districtKey]) => {
      const [region, district] = districtKey.split('|');
      
      // Add district
      const districtLocation = this.locations.find(loc => 
        loc.region === region && loc.district === district && !loc.ward
      );
      if (districtLocation) addLocation(districtLocation);

      // Add wards in district
      const wards = this.locations
        .filter(loc => loc.region === region && loc.district === district && loc.ward && !loc.street)
        .sort((a, b) => a.ward!.localeCompare(b.ward!));
      wards.forEach(addLocation);
    });
  }

  /**
   * Fallback fuzzy search with hierarchy sorting
   */
  private fuzzySearchWithHierarchy(query: string, limit: number): SearchOptimizedLocationItem[] {
    const results = this.fuse.search(query, { limit: limit * 2 });
    
    return results
      .map(result => result.item)
      .sort((a, b) => getHierarchyLevel(a) - getHierarchyLevel(b))
      .slice(0, limit);
  }
}

/**
 * Simple function interface for easy usage
 */
export function searchLocations(
  locations: SearchOptimizedLocationItem[], 
  query: string, 
  limit: number = 8
): SearchOptimizedLocationItem[] {
  const search = new LocationSearch(locations);
  return search.search(query, limit);
}