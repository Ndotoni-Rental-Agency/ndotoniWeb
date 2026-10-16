import { ShortTermProperty } from '@/API';
export type PromotionLocation = { label: string; source: 'address' | 'title' | 'description' | 'district' };
const pretty = (s: string) => s.trim().replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).replace(/\bJnIA\b/gi, 'JNIA').replace(/\bDar Es Salaam\b/g, 'Dar es Salaam');
/** Only literal listing evidence; proximity is kept as proximity, never converted into a ward. */
export function promotionLocation(p: ShortTermProperty, language: 'en' | 'sw' = 'en'): PromotionLocation {
  const address = p.address as (NonNullable<ShortTermProperty['address']> & { ward?: string; neighbourhood?: string; neighborhood?: string }) | undefined;
  const region = pretty(p.region || address?.region || '');
  const district = pretty(p.district || address?.district || '');
  const broad = new Set([region.toLowerCase(), district.toLowerCase(), 'tanzania', 'dar es salaam']);
  const join = (area: string) => [area, district, region].filter(Boolean).filter((value, index, values) => values.findIndex(x => x.toLowerCase() === value.toLowerCase()) === index).join(', ');
  for (const value of [address?.neighbourhood, address?.neighborhood, address?.ward, address?.city]) {
    if (value?.trim() && !broad.has(pretty(value).toLowerCase())) return { label: join(pretty(value)), source: 'address' };
  }
  for (const [source, text] of [['title', p.title], ['description', p.description || '']] as const) {
    const ward = text.match(/(?:\bward\s+(?:of\s+)?|\bkata\s+ya\s+|\bneighbou?rhood\s+of\s+)([A-Za-z][A-Za-z -]{1,45})/i);
    const area = text.match(/(?:\b(?:located|situated|based)\s+(?:in|at)\s+|\b(?:in|at)\s+)([A-Za-z][A-Za-z -]{1,45})(?=[,|.!?\n]|$)/i);
    for (const match of [ward, area]) {
      if (!match) continue;
      const value = match[1].split(/\s+(?:with|and|near|for|is|which|just|featuring)\b/i)[0].trim();
      if (value.split(/\s+/).length > 4 || /^(a|an|the|this|walking|close|quiet|peaceful|stylish)\b/i.test(value) || broad.has(pretty(value).toLowerCase())) continue;
      return { label: join(pretty(value)), source };
    }
    // Common named areas must occur literally, and "near" must remain "near".
    const named = text.match(/\b(Mbezi Beach|Oyster Bay|Oysterbay|Mikocheni|Masaki|Ada Estate|Kijitonyama|Sinza|Bunju|Goba|Kunduchi|Mivumoni|Njiro|Moshono|Kihonda|Nungwi|Paje|Jambiani|Uroa|Bwejuu)\b/i);
    if (named) { const before = text.slice(Math.max(0, named.index! - 24), named.index); const near = /(?:near|close to|karibu na)\s*$/i.test(before); return { label: join(`${near ? (language === 'sw' ? 'Karibu na ' : 'Near ') : ''}${pretty(named[1])}`), source }; }
    if (/\bJNIA\b|Julius Nyerere International Airport/i.test(text) && /\bnear\b|\bminutes?\s+(?:away\s+)?from\b|karibu\s+na/i.test(text)) return { label: join(language === 'sw' ? 'Karibu na JNIA' : 'Near JNIA'), source };
  }
  return { label: join(district), source: 'district' };
}
