type ScrubBreadcrumb = {
  category?: string;
  data?: { url?: string };
};

type ScrubEvent = {
  request?: { headers?: unknown; cookies?: unknown };
  extra?: Record<string, unknown>;
  exception?: { values?: Array<{ mechanism?: { handled?: boolean } }> };
  tags?: Record<string, unknown>;
};

const UUID_RE =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi;
const LONG_NUMERIC_PATH = /\/\d{6,}(?=\/|$)/g;

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
}

export function scrubBreadcrumb(breadcrumb: ScrubBreadcrumb): ScrubBreadcrumb | null {
  if (breadcrumb.category === 'console') {
    return null;
  }
  if (breadcrumb.data?.url) {
    breadcrumb.data.url = scrubUrl(String(breadcrumb.data.url));
  }
  return breadcrumb;
}
