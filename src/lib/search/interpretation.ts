export interface SearchInterpretation {
  area: string | null;
  region: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string | null;
  unsupported: string[];
}
