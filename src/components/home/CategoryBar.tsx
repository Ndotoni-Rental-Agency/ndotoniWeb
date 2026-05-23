'use client';

import React, { useRef } from 'react';
import { RentalType, isFeatureEnabled } from '@/config/features';
import { PropertyType } from '@/API';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Calendar,
  Moon,
  Home,
  Building2,
  KeyRound,
  LayoutGrid,
  Store,
  type LucideIcon,
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  label: string;
  labelSw: string;
  icon: LucideIcon;
  rentalType?: RentalType;
  propertyType?: PropertyType;
}

export const categories: CategoryItem[] = [
  { id: 'all', label: 'All', labelSw: 'Zote', icon: Calendar, rentalType: RentalType.LONG_TERM },
  { id: 'nightly', label: 'Nightly', labelSw: 'Kila Usiku', icon: Moon, rentalType: RentalType.SHORT_TERM },
  { id: 'house', label: 'Houses', labelSw: 'Nyumba', icon: Home, propertyType: PropertyType.HOUSE },
  { id: 'apartment', label: 'Apartments', labelSw: 'Apartments', icon: Building2, propertyType: PropertyType.APARTMENT },
  { id: 'room', label: 'Rooms', labelSw: 'Vyumba', icon: KeyRound, propertyType: PropertyType.ROOM },
  { id: 'studio', label: 'Studios', labelSw: 'Studio', icon: LayoutGrid, propertyType: PropertyType.STUDIO },
  { id: 'commercial', label: 'Commercial', labelSw: 'Biashara', icon: Store, propertyType: PropertyType.COMMERCIAL },
];

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: CategoryItem) => void;
}

export function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const shortTermEnabled = isFeatureEnabled('shortTermStays');
  const visibleCategories = shortTermEnabled
    ? categories
    : categories.filter((c) => c.rentalType !== RentalType.SHORT_TERM);

  return (
    <div className="border-b border-stone-200/70 dark:border-gray-700 bg-cream-100/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-[64px] z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto py-3 hide-scrollbar"
        >
          {visibleCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            const label = language === 'sw' ? cat.labelSw : cat.label;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat)}
                aria-pressed={isSelected}
                className={`
                  inline-flex items-center gap-2 px-3.5 sm:px-4 h-10 sm:h-11 rounded-full
                  whitespace-nowrap transition-all duration-200 border
                  ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-green-sm'
                      : 'bg-white/70 text-ink-700 border-stone-200 hover:border-brand-500/40 hover:bg-white dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon size={16} strokeWidth={isSelected ? 2 : 1.75} />
                <span className={`text-sm ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
