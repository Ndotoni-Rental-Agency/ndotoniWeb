/**
 * 🎯 Location - Centralized Entry Point
 * 
 * This is the single file developers should import from for all location-related functionality.
 * Everything is organized and exported from here for easy access.
 */

// === TYPES & INTERFACES ===
export type {
  LocationItem,
  SearchOptimizedLocationItem
} from './data';

// === DATA MANAGEMENT ===
export {
  fetchLocations,
  flattenLocations,
  flattenLocationsForSearch,
  getLocationDisplayName,
  getUniqueRegions,
  getDistrictsByRegion,
  getWardsByDistrict,
  getStreetsByWard,
  clearLocationsCache,
  getCacheInfo
} from './data';

// === SEARCH FUNCTIONALITY ===
export {
  LocationSearch,
  searchLocations
} from './search';

// === SEARCH UTILITIES ===
export {
  getMatchScore,
  getHierarchyLevel,
  createLocationKey,
  normalizeQuery,
  sortLocationsByName
} from './utils';

// === QUICK START EXAMPLES ===
/*

// 🚀 Quick Start - Simple Search
import { searchLocations, flattenLocationsForSearch, fetchLocations } from '@/lib/location';

const locations = flattenLocationsForSearch(await fetchLocations());
const results = searchLocations(locations, 'arusha', 8);

// 🔧 Advanced - Custom Search Instance  
import { LocationSearch, flattenLocationsForSearch, fetchLocations } from '@/lib/location';

const locations = flattenLocationsForSearch(await fetchLocations());
const search = new LocationSearch(locations);
const results = search.search('ubungo', 10);

// 📊 Cache Management
console.log(search.getCacheStats());
search.clearCache();

// 🛠️ Utilities
import { getHierarchyLevel, normalizeQuery } from '@/lib/location';

const level = getHierarchyLevel(location); // 1=Region, 2=District, 3=Ward, 4=Street
const clean = normalizeQuery('  ARUSHA  '); // 'arusha'

*/