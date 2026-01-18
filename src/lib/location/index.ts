/**
 * 🎯 Location - Centralized Entry Point
 * 
 * This is the single file developers should import from for all location-related functionality.
 * Everything is organized and exported from here for easy access.
 */

// === HIERARCHICAL LOCATION FETCHING (RECOMMENDED) ===
// Use these for better performance - only loads data when needed
export {
  fetchRegions,
  fetchDistricts,
  fetchWards,
  fetchStreets,
  clearLocationCache,
  getCacheStats,
  type Region,
  type District,
  type Ward,
  type Street,
} from './hierarchical';

// === QUICK START EXAMPLES ===
/*

// 🚀 RECOMMENDED: Hierarchical Location Selection
import { useHierarchicalLocation } from '@/hooks/useHierarchicalLocation';

function MyComponent() {
  const {
    regions,
    districts,
    wards,
    streets,
    selected,
    selectRegion,
    selectDistrict,
    selectWard,
    selectStreet,
    loadingRegions,
    error
  } = useHierarchicalLocation();
  
  // Only regions are loaded initially (~30 items)
  // Districts/wards/streets load on-demand when selected
}

// 🔧 Manual Hierarchical Fetching
import { fetchRegions, fetchDistricts, fetchWards, fetchStreets } from '@/lib/location';

const regions = await fetchRegions(); // Load ~30 regions
const districts = await fetchDistricts(regionId); // Load districts for selected region
const wards = await fetchWards(districtId); // Load wards for selected district
const streets = await fetchStreets(wardId); // Load streets for selected ward

*/