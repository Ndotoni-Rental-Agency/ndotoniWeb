type ScrubBreadcrumb = {
  category?: string;
  message?: string;
  data?: { url?: string };
};

type ScrubEvent = {
  request?: { headers?: unknown; cookies?: unknown };
  extra?: Record<string, unknown>;
  message?: string;
  exception?: { values?: Array<{ value?: string; mechanism?: { handled?: boolean } }> };
  tags?: Record<string, unknown>;
};

const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;
const LONG_NUMERIC_PATH = /\/\d{6,}(?=\/|$)/g;

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
const PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;

/** Redact emails and phone-like numbers from free text (error messages, breadcrumbs). */
export function scrubText(text: string | undefined): string | undefined {
  if (!text) return text;
  return text.replace(EMAIL_RE, '[email]').replace(PHONE_RE, '[phone]');
}

export function scrubUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  try {
    const parsed = new URL(url, 'https://placeholder.local');
    parsed.search = '';
    let path = parsed.pathname.replace(UUID_RE, ':id').replace(LONG_NUMERIC_PATH, '/:id');
    return `${parsed.origin === 'https://placeholder.local' ? '' : parsed.origin}${path}`;
  } catch {
    return url.split('?')[0]?.replace(UUID_RE, ':id');
  }
}

export function scrubEventInPlace(event: ScrubEvent): void {
  if (event.request) {
    delete event.request.headers;
    delete event.request.cookies;
  }
  if (event.extra) {
    delete event.extra.variables;
    delete event.extra.graphqlVariables;
  }
  event.message = scrubText(event.message);
  for (const ex of event.exception?.values ?? []) {
    ex.value = scrubText(ex.value);
  }
}

export function scrubBreadcrumb(breadcrumb: ScrubBreadcrumb): ScrubBreadcrumb | null {
  if (breadcrumb.category === 'console') {
    return null;
  }
  breadcrumb.message = scrubText(breadcrumb.message);
  if (breadcrumb.data?.url) {
    breadcrumb.data.url = scrubUrl(String(breadcrumb.data.url));
  }
  return breadcrumb;
}
