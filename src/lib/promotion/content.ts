import { promotionLocation } from './location';
import { PropertyStatus, ShortTermProperty } from '@/API';

export type Promotion = { id: string; propertyId: string; date: string; status: 'draft' | 'approved' | 'posted'; caption: string; image: string; postedUrl?: string; nightlyRate: number; currency: string; title: string; phone: string; language: 'sw' | 'en' };
export type PromotionSettings = { phone: string; language: 'sw' | 'en' };
export const STAYS_SITE = 'https://www.ndotonistays.com';
export function eligibleStay(p: ShortTermProperty): boolean {
  return p.status === PropertyStatus.AVAILABLE && !!p.title && !/hydratest|smoke.?test/i.test(p.title) && (!p.address?.country || /^(TZ|Tanzania)$/i.test(p.address.country.trim())) && Number.isFinite(p.nightlyRate) && p.nightlyRate > 0 && !!p.currency && !!(p.images?.length || p.thumbnail);
}
export function stayUrl(id: string): string { return `${STAYS_SITE}/property/${encodeURIComponent(id)}`; }
export function enquiryText(p: ShortTermProperty, language: 'sw' | 'en'): string {
  return language === 'sw' ? `Habari Ndotoni! Nimeona ${p.title}. Nimevutiwa na stay hii.\nNDOTONI-STAY:${p.propertyId}\n${stayUrl(p.propertyId)}\nTarehe na wageni wangu: ` : `Hi Ndotoni! I saw ${p.title} and I'm interested in this stay.\nNDOTONI-STAY:${p.propertyId}\n${stayUrl(p.propertyId)}\nMy dates and guests: `;
}
export function enquiryUrl(p: ShortTermProperty, settings: PromotionSettings): string {
  const phone = settings.phone.replace(/\D/g, '');
  if (!/^[1-9]\d{9,14}$/.test(phone)) throw new Error('Enter the guest WhatsApp line with its country code.');
  return `https://wa.me/${phone}?text=${encodeURIComponent(enquiryText(p, settings.language))}`;
}
export function publicEnquiryUrl(p: ShortTermProperty, settings: PromotionSettings): string {
  return settings.phone.replace(/\D/g, '') === '255790720329' ? `${STAYS_SITE}/enquire/${encodeURIComponent(p.propertyId)}?lang=${settings.language}` : enquiryUrl(p, settings);
}
export function caption(p: ShortTermProperty, settings: PromotionSettings): string {
  const sw = settings.language === 'sw';
  return `${p.title}\n📍 ${promotionLocation(p, settings.language).label}\n${p.currency} ${p.nightlyRate.toLocaleString('en-US')} ${sw ? 'kwa usiku' : 'per night'}${p.maxGuests ? ` · ${sw ? 'Wageni hadi' : 'Up to'} ${p.maxGuests}` : ''}\n\n${sw ? 'Bei ya mwisho na upatikanaji hutegemea tarehe. Ada nyingine zinaweza kuongezwa.' : 'Final price and availability depend on your dates. Additional fees may apply.'}\n\n${sw ? 'Angalia na book' : 'View and book'}: ${stayUrl(p.propertyId)}\nWhatsApp: ${publicEnquiryUrl(p, settings)}\n${sw ? 'Pakua app' : 'Get the app'}: ${STAYS_SITE}/app`;
}
/** One stay per day; properties already drafted or promoted are excluded. */
export function planWeek(properties: ShortTermProperty[], existing: Pick<Promotion, 'date' | 'propertyId'>[], settings: PromotionSettings, startDate: string): Promotion[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || new Date(`${startDate}T12:00:00Z`).toISOString().slice(0, 10) !== startDate) throw new Error('Choose a valid start date.');
  enquiryUrl(properties[0] || { title: 'Stay', propertyId: 'check' } as ShortTermProperty, settings);
  const used = new Set(existing.map(x => x.propertyId));
  const pool = Array.from(new Map(properties.filter(p => eligibleStay(p) && !used.has(p.propertyId)).map(p => [p.propertyId, p])).values()).sort((a, b) => a.propertyId.localeCompare(b.propertyId));
  if (!pool.length) return [];
  const result: Promotion[] = [];
  for (let i = 0; result.length < Math.min(7, pool.length); i++) {
    const date = new Date(`${startDate}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + i);
    const day = date.toISOString().slice(0, 10);
    if (existing.some(x => x.date === day)) continue;
    const p = pool[result.length];
    result.push({ id: `${day}:${p.propertyId}`, propertyId: p.propertyId, date: day, status: 'draft', caption: caption(p, settings), image: p.images?.[0] || p.thumbnail!, nightlyRate: p.nightlyRate, currency: p.currency, title: p.title, phone: settings.phone, language: settings.language });
  }
  return result;
}
