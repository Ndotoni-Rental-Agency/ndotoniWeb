
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import DestinationPicker from '@/components/location/DestinationPicker';
import CalendarDatePicker from '@/components/ui/CalendarDatePicker';
import type { FlattenedLocation } from '@/lib/location/cloudfront-locations';

interface SimpleSearchBarProps { variant?: 'hero' | 'sticky'; isScrolled?: boolean; className?: string; }
export default function SimpleSearchBar({ className = '' }: SimpleSearchBarProps) {
 const router = useRouter(); const { language } = useLanguage(); const sw = language === 'sw';
 const [location, setLocation] = useState<FlattenedLocation | null>(null);
 const [moveInDate, setMoveInDate] = useState('');
 return <form className={`flex flex-wrap items-end gap-3 ${className}`} onSubmit={e => { e.preventDefault(); if (!location) return; const params = new URLSearchParams(); params.set('region', location.type === 'region' ? location.name : location.regionName || ''); if (location.type === 'district') params.set('district', location.name); if (moveInDate) params.set('moveInDate', moveInDate); router.push(`/search?${params}`); }}>
 <div className="min-w-[180px] flex-1"><DestinationPicker selected={location} onSelect={setLocation} /></div>
 <div className="min-w-[150px] flex-1"><CalendarDatePicker label={sw ? 'Tarehe ya kuhamia' : 'Move-in date'} value={moveInDate} onChange={setMoveInDate} min={new Date().toLocaleDateString('en-CA')} /></div>
 <button type="submit" disabled={!location} className="min-h-12 rounded-xl bg-brand-700 px-5 font-semibold text-white disabled:opacity-50">{sw ? 'Tafuta' : 'Search'}</button>
 </form>;
}
