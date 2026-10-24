import type { PropertyCard } from '@/API';
import type { HomepageCacheData } from './homepage-cache';
const HOME_LISTINGS_COUNT = 6;
// Below this a TZS listing is almost certainly a data-entry error, not a monthly rent
const MIN_PLAUSIBLE_TZS_RENT = 10000;

const isShowcaseReady = (property: PropertyCard) =>
  Boolean(property.thumbnail) &&
  !/\.(mp4|mov|avi|webm)(\?|$)/i.test(property.thumbnail || '') &&
  (property.currency !== 'TZS' ||
    property.monthlyRent >= MIN_PLAUSIBLE_TZS_RENT);

export function showcase(data: HomepageCacheData): PropertyCard[] {
  const unique = new Map<string, PropertyCard>();
  for (const property of [...data.featured, ...data.highestPrice, ...data.recent, ...data.lowestPrice]) {
    if (!unique.has(property.propertyId) && isShowcaseReady(property)) unique.set(property.propertyId, property);
  }
  return Array.from(unique.values()).slice(0, HOME_LISTINGS_COUNT);
}

