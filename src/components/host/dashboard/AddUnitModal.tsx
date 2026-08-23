'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { GraphQLClient } from '@/lib/graphql-client';
import { getProperty } from '@/graphql/queries';
import { addUnitToLongTermProperty } from '@/graphql/mutations';
import { Property } from '@/API';
import { Counter } from '@/components/shared/forms/Counter';
import { CurrencyInput } from '@/components/shared/forms/CurrencyInput';
import MediaSelector from '@/components/media/MediaSelector';

interface Props {
  sourcePropertyId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

/** Overlay dialog for adding another unit to an existing property — not a routed page,
 * since it's a focused, dismissible sub-task rather than a destination of its own. */
export default function AddUnitModal({ sourcePropertyId, onClose, onSuccess }: Props) {
  const isOpen = !!sourcePropertyId;

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

  useEffect(() => {
    if (!sourcePropertyId) return;
    // Reset per-open so re-opening for a different property doesn't carry over state.
    setStep(1);
    setUnitLabel('');
    setCustomTitle(null);
    setEditingTitle(false);
    setMonthlyRent(0);
    setBedrooms(1);
    setBathrooms(1);
    setSelectedMedia([]);
    setImages([]);
    setVideos([]);
    setError(null);
    setLoading(true);

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
    if (!sourcePropertyId) return;
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
      onClose();
      onSuccess();
    } catch (err: any) {
      console.error('Failed to add unit:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const canAdvance = unitLabel.trim().length > 0;
  const canSubmit = monthlyRent > 0 && (images.length > 0 || videos.length > 0);
  const inputClass = 'w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-emerald-900 focus:border-brand-500 dark:focus:border-emerald-900 transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Add another unit</h2>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-0.5">
              <span className={step === 1 ? 'text-brand-600 dark:text-brand-400' : ''}>1. Unit details</span>
              {' · '}
              <span className={step === 2 ? 'text-brand-600 dark:text-brand-400' : ''}>2. Price & photos</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Close">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400 animate-pulse">Loading...</div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Photos <span className="text-red-500">*</span>
                    </label>
                    <MediaSelector
                      selectedMedia={selectedMedia}
                      onMediaChange={(urls, imgs, vids) => { setSelectedMedia(urls); handleMediaChange(urls, imgs, vids); }}
                      maxSelection={10}
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-gray-100 dark:border-gray-700 shrink-0">
              {step === 2 ? (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2.5 px-3"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              )}

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !canSubmit}
                  className="inline-flex items-center gap-2 px-6 sm:px-10 py-2.5 rounded-lg bg-red-600 text-white text-sm sm:text-base font-semibold hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Add unit
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
