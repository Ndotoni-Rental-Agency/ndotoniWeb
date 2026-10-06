import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The slice of listing-wizard state worth surviving a reload, a dropped
 * connection, or the browser backgrounding mid-upload (common on mobile).
 */
export interface ListingDraftSnapshot<TForm> {
  version: number;
  step: number;
  formData: TForm;
  selectedMedia: string[];
  selectedImages: string[];
  selectedVideos: string[];
  coords: { lat: number; lng: number };
  savedAt: number;
}

const STORAGE_PREFIX = 'ndotoni:listing-draft:';
const SNAPSHOT_VERSION = 1;
// Drafts older than this are ignored on restore (stale, likely abandoned).
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
const SAVE_DEBOUNCE_MS = 600;

function storageKey(ownerKey: string) {
  return `${STORAGE_PREFIX}${ownerKey}`;
}

/**
 * Reads any saved draft for this owner synchronously. SSR-safe (returns null on
 * the server) and defensive against corrupt / stale / version-mismatched data.
 */
export function readListingDraft<TForm>(
  ownerKey: string,
): ListingDraftSnapshot<TForm> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey(ownerKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ListingDraftSnapshot<TForm>;
    if (
      !parsed ||
      parsed.version !== SNAPSHOT_VERSION ||
      typeof parsed.savedAt !== 'number' ||
      Date.now() - parsed.savedAt > MAX_AGE_MS
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearListingDraft(ownerKey: string) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey(ownerKey));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

interface UseListingDraftPersistenceArgs<TForm> {
  /** Stable per-identity key, e.g. a user id or 'guest'. */
  ownerKey: string;
  snapshot: Omit<ListingDraftSnapshot<TForm>, 'version' | 'savedAt'>;
  /** Pause saving (e.g. after a successful publish, or before restore runs). */
  enabled?: boolean;
}

/**
 * Debounced autosave of the listing wizard to localStorage. Returns the time of
 * the last successful save so the UI can show a subtle "saved" affordance.
 *
 * Restore is intentionally NOT automatic here — the consumer decides whether to
 * offer the user their draft back (via readListingDraft) so we never silently
 * overwrite a fresh start.
 */
export function useListingDraftPersistence<TForm>({
  ownerKey,
  snapshot,
  enabled = true,
}: UseListingDraftPersistenceArgs<TForm>) {
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const timerRef = useRef<number>();

  // Keep the latest snapshot in a ref so the debounce always flushes fresh data.
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      try {
        const payload: ListingDraftSnapshot<TForm> = {
          version: SNAPSHOT_VERSION,
          savedAt: Date.now(),
          ...snapshotRef.current,
        };
        window.localStorage.setItem(storageKey(ownerKey), JSON.stringify(payload));
        setLastSavedAt(payload.savedAt);
      } catch {
        /* ignore quota / privacy-mode errors — autosave is best-effort */
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // Re-run whenever any saved field changes.
  }, [ownerKey, enabled, snapshot]);

  const clear = useCallback(() => {
    clearListingDraft(ownerKey);
    setLastSavedAt(null);
  }, [ownerKey]);

  return { lastSavedAt, clear };
}
