/**
 * Budget and bedroom presets shared by the homepage search and the search page filters.
 * Amounts are monthly rent in TZS. `bedrooms` is a minimum (the backend filters `>=`).
 */

export interface BudgetPreset {
  id: string;
  labelKey: string;
  minPrice?: number;
  maxPrice?: number;
}

export const BUDGET_PRESETS: BudgetPreset[] = [
  { id: 'under-200k', labelKey: 'home.budgetUnder200', maxPrice: 200_000 },
  { id: '200k-500k', labelKey: 'home.budget200to500', minPrice: 200_000, maxPrice: 500_000 },
  { id: '500k-1m', labelKey: 'home.budget500to1m', minPrice: 500_000, maxPrice: 1_000_000 },
  { id: 'over-1m', labelKey: 'home.budgetOver1m', minPrice: 1_000_000 },
];

export const BEDROOM_PRESETS = [1, 2, 3] as const;

export function findBudgetPreset(minPrice?: number, maxPrice?: number): BudgetPreset | undefined {
  return BUDGET_PRESETS.find((p) => p.minPrice === minPrice && p.maxPrice === maxPrice);
}
