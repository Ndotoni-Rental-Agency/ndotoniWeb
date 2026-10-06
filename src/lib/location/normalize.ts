export const normalizeLocationName = (value?: string | null) =>
  (value || '')
    .trim()
    .toUpperCase()
    .replace(/[-_\s]+/g, ' ');
