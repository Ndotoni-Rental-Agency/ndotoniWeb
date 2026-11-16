/**
 * Data + copy for the programmatic location landing pages
 * (/nyumba-za-kupanga, /nyumba-za-kupanga/[region], /nyumba-za-kupanga/[region]/[district]).
 *
 * Server-only: uses raw fetch (same approach as sitemap.ts / fetch-property.ts) so pages
 * stay statically cacheable and do not depend on the Amplify client.
 */
import type { PropertyCard } from '@/API';
import { getPropertiesByLocation } from '@/graphql/queries';

export const BASE_URL = 'https://www.ndotoni.com';
export const LOCATION_BASE_PATH = '/nyumba-za-kupanga';

/** Minimum active listings before a page is indexable / listed in the sitemap. */
export const MIN_LISTINGS_TO_INDEX = 3;

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
  'https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/graphql';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'da2-4kqoqw7d2jbndbilqiqpkypsve';

export interface RegionInfo {
  /** URL slug */
  slug: string;
  /** Exact value stored on properties / used by the API */
  name: string;
  /** Short Swahili intro, written by hand – this is the unique content of the page. */
  introSw: string;
  /** Things renters in this region actually ask about. */
  tips: string[];
}

export const REGIONS: RegionInfo[] = [
  {
    slug: 'dar-es-salaam',
    name: 'Dar es Salaam',
    introSw:
      'Dar es Salaam ndilo jiji kubwa zaidi Tanzania na soko kubwa zaidi la nyumba za kupanga. Bei hutofautiana sana kulingana na eneo: vyumba na nyumba ndogo katika maeneo kama Ubungo, Kimara na Mbagala ni nafuu zaidi, wakati Masaki, Oyster Bay na Mbezi Beach ni ghali zaidi. Kabla ya kuchagua, linganisha umbali wa kazini, usafiri (BRT na daladala), na upatikanaji wa maji na umeme.',
    tips: [
      'Angalia msongamano wa magari katika saa za asubuhi kabla ya kuamua eneo – umbali mfupi unaweza kuchukua saa nzima.',
      'Uliza majirani kuhusu maji na umeme, si mwenye nyumba pekee.',
      'Kodi nyingi hulipwa kwa miezi 6 au 12 kwa pamoja; hakikisha mkataba ulioandikwa.',
    ],
  },
  {
    slug: 'arusha',
    name: 'Arusha',
    introSw:
      'Arusha ni kituo cha utalii na biashara kaskazini mwa Tanzania, chenye wageni wengi, wafanyakazi wa mashirika na wanafunzi. Maeneo kama Njiro, Sakina, Kijenge na Sinoni yana mchanganyiko wa nyumba za kupanga za bei ya kati hadi juu. Hali ya hewa ni ya baridi kiasi, kwa hiyo angalia pia upatikanaji wa maji ya moto na usalama wa eneo.',
    tips: [
      'Nyumba karibu na katikati ya jiji ni ghali zaidi; maeneo ya pembezoni hutoa nafasi kubwa kwa bei nafuu.',
      'Kwa wageni wa muda mfupi, angalia pia nyumba za kukaa kwa muda mfupi kwenye Ndotoni Stays.',
    ],
  },
  {
    slug: 'mwanza',
    name: 'Mwanza',
    introSw:
      'Mwanza ni jiji la pili kwa ukubwa Tanzania na kitovu cha biashara ya Ziwa Victoria. Nyamagana na Ilemela ndizo wilaya kuu za makazi, zenye maeneo kama Mabatini, Buhongwa, Igoma na Kirumba. Bei za kupanga kwa ujumla ni nafuu kuliko Dar es Salaam.',
    tips: [
      'Maeneo ya karibu na ziwa yana mandhari nzuri lakini angalia hali ya mafuriko wakati wa mvua.',
      'Ukaribu na barabara kuu ya Mwanza–Shinyanga hurahisisha usafiri.',
    ],
  },
  {
    slug: 'dodoma',
    name: 'Dodoma',
    introSw:
      'Dodoma ni makao makuu ya serikali, na mahitaji ya nyumba za kupanga yamekua kutokana na watumishi wa umma na wafanyakazi wa taasisi mbalimbali. Maeneo kama Area D, Area C, Njedengwa, Nzuguni na Iyumbu yanatafutwa sana. Jiji linakua kwa kasi, kwa hiyo bei zinaweza kubadilika haraka.',
    tips: [
      'Angalia umbali wa Mji wa Serikali (Mtumba) ikiwa unafanya kazi serikalini.',
      'Uliza kuhusu hali ya barabara na upatikanaji wa maji katika maeneo mapya.',
    ],
  },
  {
    slug: 'mbeya',
    name: 'Mbeya',
    introSw:
      'Mbeya ni kitovu cha biashara na usafirishaji kusini-magharibi mwa Tanzania, karibu na mipaka ya Malawi na Zambia. Nyumba za kupanga zinapatikana Mbalizi Road, Iyela, Forest, Uyole na Sisimba, kwa bei za kati hadi nafuu.',
    tips: [
      'Hali ya hewa ni ya baridi – angalia ubora wa madirisha na paa.',
      'Maeneo ya Uyole yako karibu na soko kubwa na kituo cha mabasi.',
    ],
  },
  {
    slug: 'morogoro',
    name: 'Morogoro',
    introSw:
      'Morogoro ina wanafunzi wengi kutokana na Chuo Kikuu cha Sokoine (SUA), Mzumbe na vyuo vingine, hivyo vyumba vya kupanga karibu na vyuo vinatafutwa sana mwanzoni mwa mwaka wa masomo. Pia ni mahali pazuri pa kuishi kwa wanaofanya kazi Dar es Salaam lakini wanataka maisha tulivu.',
    tips: [
      'Tafuta chumba mapema kabla ya wanafunzi kuripoti ili upate chaguo zaidi.',
      'Ukaribu na barabara kuu ya Dar–Morogoro ni faida kwa wasafiri wa mara kwa mara.',
    ],
  },
  {
    slug: 'tanga',
    name: 'Tanga',
    introSw:
      'Tanga ni jiji la pwani ya kaskazini lenye maisha ya utulivu, bandari na viwanda vidogo. Nyumba za kupanga ni za bei nafuu ikilinganishwa na Dar es Salaam, na maeneo mengi yako karibu na bahari.',
    tips: [
      'Angalia hali ya chumvi na unyevu kwenye kuta za nyumba karibu na pwani.',
    ],
  },
  {
    slug: 'zanzibar',
    name: 'Zanzibar',
    introSw:
      'Zanzibar ina soko la nyumba la aina mbili: wakazi wanaotafuta nyumba za kupanga za muda mrefu, na wageni wanaotafuta makazi ya muda mfupi. Maeneo ya Mjini Magharibi kama Stone Town, Mwanakwerekwe na Fuoni ni maarufu kwa wakazi. Kwa kukaa kwa siku au wiki chache, tembelea Ndotoni Stays.',
    tips: [
      'Wamiliki wengi hupendelea malipo kwa dola kwa nyumba za wageni – hakikisha sarafu ya kodi imeandikwa wazi kwenye mkataba.',
    ],
  },
  {
    slug: 'kilimanjaro',
    name: 'Kilimanjaro',
    introSw:
      'Mkoa wa Kilimanjaro, hasa Moshi mjini, una wanafunzi, wafanyakazi wa taasisi na wafanyabiashara. Maeneo ya Shanty Town, Pasua, Majengo na Boma yana nyumba za kupanga za bei ya kati.',
    tips: ['Maeneo ya karibu na katikati ya Moshi yana usafiri rahisi zaidi.'],
  },
  {
    slug: 'iringa',
    name: 'Iringa',
    introSw:
      'Iringa ni mji wa baridi wenye Chuo Kikuu cha Iringa na Ruaha, hivyo vyumba vya wanafunzi na nyumba ndogo za familia vinapatikana kwa bei nafuu.',
    tips: ['Angalia umbali wa chuo na upatikanaji wa usafiri wa bodaboda au daladala.'],
  },
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getRegionBySlug(slug: string): RegionInfo | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

/** Title-case a stored place name (values can be slugs or lower-case). */
export function displayName(value: string): string {
  const small = new Set(['es', 'wa', 'ya', 'la', 'na', 'za', 'cha', 'kwa']);
  return value
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

interface LocationResponse {
  data?: {
    getPropertiesByLocation?: {
      nextToken?: string | null;
      properties?: (PropertyCard | null)[] | null;
    } | null;
  };
}

const PAGE_SIZE = 100;
const MAX_PAGES = 5;

/**
 * All active listings for a region (paged, capped at MAX_PAGES * PAGE_SIZE).
 * Identical requests are de-duplicated and cached by Next's fetch cache for an hour, so the
 * region page and each of its district pages share one backend fetch.
 */
export async function fetchRegionProperties(region: string): Promise<PropertyCard[]> {
  const all: PropertyCard[] = [];
  let nextToken: string | null | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    try {
      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        body: JSON.stringify({
          query: getPropertiesByLocation,
          variables: { region, limit: PAGE_SIZE, nextToken: nextToken || undefined },
        }),
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const json = (await res.json()) as LocationResponse;
      const result = json.data?.getPropertiesByLocation;
      for (const p of result?.properties ?? []) if (p) all.push(p);
      nextToken = result?.nextToken;
      if (!nextToken) break;
    } catch (error) {
      console.error('[locationPages] fetch failed for', region, error);
      break;
    }
  }

  const seen = new Set<string>();
  return all.filter((p) => (seen.has(p.propertyId) ? false : (seen.add(p.propertyId), true)));
}

export interface DistrictSummary {
  slug: string;
  name: string;
  count: number;
}

export function summariseDistricts(properties: PropertyCard[]): DistrictSummary[] {
  const map = new Map<string, DistrictSummary>();
  for (const p of properties) {
    if (!p.district) continue;
    const slug = slugify(p.district);
    if (!slug) continue;
    const existing = map.get(slug);
    if (existing) existing.count += 1;
    else map.set(slug, { slug, name: displayName(p.district), count: 1 });
  }
  return Array.from(map.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function filterByDistrict(properties: PropertyCard[], districtSlug: string): PropertyCard[] {
  return properties.filter((p) => p.district && slugify(p.district) === districtSlug);
}

export interface RentStats {
  count: number;
  /** Stats computed over TZS-priced listings only. */
  tzsCount: number;
  min: number | null;
  median: number | null;
  max: number | null;
}

export function computeRentStats(properties: PropertyCard[]): RentStats {
  const rents = properties
    .filter((p) => p.currency === 'TZS' && typeof p.monthlyRent === 'number' && p.monthlyRent > 0)
    .map((p) => p.monthlyRent as number)
    .sort((a, b) => a - b);
  if (rents.length === 0) return { count: properties.length, tzsCount: 0, min: null, median: null, max: null };
  const mid = Math.floor(rents.length / 2);
  const median = rents.length % 2 ? rents[mid] : Math.round((rents[mid - 1] + rents[mid]) / 2);
  return { count: properties.length, tzsCount: rents.length, min: rents[0], median, max: rents[rents.length - 1] };
}

export function formatTzs(amount: number): string {
  // Round to the nearest 5,000 so copy does not imply false precision.
  const rounded = Math.round(amount / 5000) * 5000;
  return `TSh ${rounded.toLocaleString('en-US')}`;
}

export function pageUrl(regionSlug?: string, districtSlug?: string): string {
  return [BASE_URL + LOCATION_BASE_PATH, regionSlug, districtSlug].filter(Boolean).join('/');
}
