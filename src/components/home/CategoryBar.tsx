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
    <div className="border-b border-stone-100 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg sticky top-[64px] z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-2.5 sm:py-3 hide-scrollbar sm:justify-center"
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
                  inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 h-9 sm:h-10 rounded-full
                  whitespace-nowrap transition-all duration-200 flex-shrink-0
                  ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-green-sm'
                      : 'bg-stone-50 text-ink-600 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:text-gray-300'
                  }
                `}
              >
                <Icon size={14} strokeWidth={isSelected ? 2.5 : 1.75} />
                <span className={`text-xs sm:text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>
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
