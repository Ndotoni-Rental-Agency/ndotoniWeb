'use client';

import Link from 'next/link';
import { PlusIcon, ArrowRightIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { HomeModernIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils/common';
import { CardItem } from './types';
import UnitCard from './UnitCard';

interface Props {
  item: CardItem;
  onDelete: (propertyId: string) => void;
  onAddUnit: (sourcePropertyId: string) => void;
  className?: string;
}

/** One card per listing: a standalone unit renders directly; a group renders a summary
 * that opens a dedicated page rather than expanding inline — a complex can have dozens
 * of units, so listing them all on the dashboard doesn't scale. */
export default function ListingCard({ item, onDelete, onAddUnit, className }: Props) {
  if (item.kind === 'single') {
    return (
      <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden', className)}>
        <UnitCard property={item.property} onDelete={onDelete} />
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => onAddUnit(item.property.propertyId)}
            className="w-full flex items-center justify-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add another unit here
          </button>
        </div>
      </div>
    );
  }

  const { primary, units, groupId } = item;
  const thumbnail = primary.media?.images?.[0];

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden', className)}>
      <Link href={`/host/properties/group/${groupId}`} className="block">
        <div className="relative h-40 bg-gray-100 dark:bg-gray-900">
          {thumbnail ? (
            <img src={thumbnail} alt={primary.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <HomeModernIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-black/55 backdrop-blur px-2.5 py-1 rounded-full">
            <Squares2X2Icon className="h-3.5 w-3.5 text-white" />
            <span className="text-[11px] font-bold text-white tracking-wide">{units.length} units</span>
          </span>
        </div>
        <div className="px-4 pt-3.5 pb-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate">{primary.title}</h3>
          <p className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{primary.address?.district}, {primary.address?.region}</span>
          </p>
          <p className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 mt-2.5">
            Manage units
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </p>
        </div>
      </Link>

      <div className="mx-4 mt-3 border-t border-gray-100 dark:border-gray-700" />

      <div className="p-3">
        <button
          type="button"
          onClick={() => onAddUnit(primary.propertyId)}
          className="w-full flex items-center justify-center gap-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
          Add another unit here
        </button>
      </div>
    </div>
  );
}
