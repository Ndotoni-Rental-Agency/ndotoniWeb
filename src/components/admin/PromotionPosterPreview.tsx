'use client';
import { useEffect, useState } from 'react';
import { ShortTermProperty } from '@/API';
import { createPoster } from '@/lib/promotion/render';
export function PromotionPosterPreview({ property, image, phone, language, revision = 0 }: { property: ShortTermProperty; image: string; phone: string; language: 'sw' | 'en'; revision?: number }) {
  const [url, setUrl] = useState(''); const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false; let objectUrl = ''; setUrl(''); setError('');
    createPoster(property, image, phone, language).then(blob => { if (cancelled) return; objectUrl = URL.createObjectURL(blob); setUrl(objectUrl); }).catch(e => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [property, image, phone, language, revision]);
  return <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#f7f4ed] dark:border-gray-700">{url ? <img src={url} alt={`Branded poster for ${property.title}`} className="h-auto w-full" /> : <p role={error ? 'alert' : 'status'} className="p-8 text-center text-sm text-gray-600">{error || 'Preparing your branded poster…'}</p>}</div>;
}
