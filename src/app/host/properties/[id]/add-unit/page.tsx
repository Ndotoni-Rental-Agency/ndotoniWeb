'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { addUnitToLongTermProperty } from '@/graphql/mutations';
import { Property } from '@/API';
import { Counter } from '@/components/shared/forms/Counter';
import { CurrencyInput } from '@/components/shared/forms/CurrencyInput';
import MediaSelector from '@/components/media/MediaSelector';

export default function AddUnitPage() {
  const router = useRouter();
  const params = useParams();
  const sourcePropertyId = params.id as string;

  const [source, setSource] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [unitLabel, setUnitLabel] = useState('');
  const [customTitle, setCustomTitle] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);

  const [monthlyRent, setMonthlyRent] = useState(0);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await GraphQLClient.executeAuthenticated<{ getProperty: Property }>(
          getProperty,
          { propertyId: sourcePropertyId }
        );
        setSource(data.getProperty);
      } catch (err) {
        console.error('Failed to load source property:', err);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [sourcePropertyId]);

  const autoTitle = unitLabel.trim() && source ? `${unitLabel.trim()} at ${source.title}` : source?.title || '';
  const effectiveTitle = customTitle ?? autoTitle;

  function handleMediaChange(_urls: string[], mediaImages?: string[], mediaVideos?: string[]) {
    setImages(mediaImages || []);
    setVideos(mediaVideos || []);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await GraphQLClient.executeAuthenticated<{
        addUnitToLongTermProperty: { propertyId: string; success: boolean; message: string };
      }>(addUnitToLongTermProperty, {
        sourcePropertyId,
        input: {
          title: effectiveTitle,
          unitLabel: unitLabel.trim() || undefined,
          monthlyRent,
          currency: source?.pricing?.currency || 'TZS',
          available: true,
          bedrooms,
          bathrooms,
          images,
          videos,
        },
      });
      setSuccess(true);
    } catch (err: any) {
      console.error('Failed to add unit:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const canAdvance = unitLabel.trim().length > 0;
  const canSubmit = monthlyRent > 0 && (images.length > 0 || videos.length > 0);

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unit added!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Your new unit is live and bookable.</p>
          <button
            onClick={() => router.push('/host/properties')}
            className="px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Back to properties
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 focus:border-brand-500 dark:focus:border-emerald-900 transition-colors';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/host/properties" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to properties
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Add another unit</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
            <span className={step === 1 ? 'text-red-600 dark:text-red-400' : ''}>1. Unit details</span>
            <span>·</span>
            <span className={step === 2 ? 'text-red-600 dark:text-red-400' : ''}>2. Price & photos</span>
          </div>
        </div>

        {source && (
          <div className="flex gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3.5 mb-6">
            {source.media?.images?.[0] && (
              <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img src={source.media.images[0]} alt={source.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Same address as</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{source.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {[source.address?.street, source.address?.district, source.address?.region].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This unit shares the address, property type, and house rules already set for &quot;{source?.title}&quot;. You&apos;ll set its own name, price, capacity, and photos next.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit name</label>
              <input
                type="text"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                placeholder="e.g. Room 2B, Studio A, Unit 12"
                className={inputClass}
                autoFocus
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                Shown on your dashboard and to guests choosing between units here.
              </p>
            </div>

            {unitLabel.trim() && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3.5">
                <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">
                  Listing title
                </label>
                {editingTitle ? (
                  <>
                    <input
                      type="text"
                      value={effectiveTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => { setCustomTitle(null); setEditingTitle(false); }}
                      className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 mt-2"
                    >
                      Use auto-generated title instead
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-900 dark:text-white">{effectiveTitle}</p>
                    <button
                      type="button"
                      onClick={() => setEditingTitle(true)}
                      className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 shrink-0"
                    >
                      Edit title
                    </button>
                  </div>
                )}
                {!editingTitle && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Auto-generated from the unit name.</p>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canAdvance}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <CurrencyInput
              label="Monthly rent"
              value={monthlyRent}
              onChange={setMonthlyRent}
              currency={source?.pricing?.currency || 'TZS'}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Counter label="Bedrooms" value={bedrooms} min={0} max={20} onChange={setBedrooms} />
              <Counter label="Bathrooms" value={bathrooms} min={0} max={20} onChange={setBathrooms} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Photos <span className="text-red-500">*</span>
                </label>
              </div>
              <MediaSelector selectedMedia={selectedMedia} onMediaChange={(urls, imgs, vids) => { setSelectedMedia(urls); handleMediaChange(urls, imgs, vids); }} maxSelection={10} />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-3"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !canSubmit}
                className="inline-flex items-center gap-2 px-6 sm:px-10 py-3 rounded-lg bg-red-600 text-white text-sm sm:text-base font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Adding...' : 'Add unit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
