'use client';

import React, { useRef } from 'react';
import { RentalType } from '@/config/features';
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
  { id: 'monthly', label: 'Monthly', labelSw: 'Kila Mwezi', icon: Calendar, rentalType: RentalType.LONG_TERM },
  { id: 'nightly', label: 'Nightly', labelSw: 'Kila Usiku', icon: Moon, rentalType: RentalType.SHORT_TERM },
  { id: 'house', label: 'Houses', labelSw: 'Nyumba', icon: Home, propertyType: PropertyType.HOUSE },
  { id: 'apartment', label: 'Apartments', labelSw: 'Fleti', icon: Building2, propertyType: PropertyType.APARTMENT },
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

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-[64px] z-30">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div
          ref={scrollRef}
          className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-8 overflow-x-auto py-3"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const Icon = cat.icon;
            const label = language === 'sw' ? cat.labelSw : cat.label;

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat)}
                className={`
                  flex flex-col items-center gap-1 min-w-[60px] flex-1 max-w-[120px] pb-2 pt-1 border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer
                  ${isSelected
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <Icon size={20} strokeWidth={isSelected ? 2 : 1.5} className={isSelected ? 'opacity-100' : 'opacity-60'} />
                <span className={`text-xs ${isSelected ? 'font-semibold' : 'font-medium'}`}>
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
