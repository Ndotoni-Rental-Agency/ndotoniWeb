import cloudConfig from './cloud-config.json';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Promotion, PromotionSettings } from './content';
import { ShortTermProperty } from '@/API';
import { createPoster } from './render';
export type PublishingJob = { id: string; propertyId: string; date: string; status: string; title: string; error?: string; postUrl?: string; approvedAt: string; actor: string };
export type PublishingState = { mode: 'live' | 'dry-run'; connected: boolean; workerOnline?: boolean; jobs: PublishingJob[] };
// Employees connect to the authenticated cloud queue; the Mac connects outbound.
const ENDPOINT = process.env.NEXT_PUBLIC_SOCIAL_PUBLISHER_URL || cloudConfig.endpoint || 'http://127.0.0.1:8775';
export async function publisherRequest<T>(path: string, input?: unknown): Promise<T> {
  const session = await fetchAuthSession(); const token = session.tokens?.idToken?.toString();
  if (!token) throw new Error('Sign into your Ndotoni admin account first.');
  let response: Response;
  try { response = await fetch(`${ENDPOINT}${path}`, { method: input === undefined ? 'GET' : 'POST', headers: { Authorization: `Bearer ${token}`, ...(input === undefined ? {} : { 'Content-Type': 'application/json' }) }, ...(input === undefined ? {} : { body: JSON.stringify(input) }), signal: AbortSignal.timeout(60000) }); }
  catch { throw new Error('The publishing queue is unreachable. Your draft is saved; try again shortly.'); }
  const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Publishing request failed.'); return result;
}
export async function publishPromotion(p: ShortTermProperty, draft: Promotion, settings: PromotionSettings): Promise<void> {
  const blob = await createPoster(p, draft.image, settings.phone, settings.language);
  const media = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(blob); });
  await publisherRequest('/jobs', { approved: true, groupId: '422792019508088', propertyId: p.propertyId, date: draft.date, publishAt: `${draft.date}T09:00:00+03:00`, caption: draft.caption, image: draft.image, nightlyRate: p.nightlyRate, currency: p.currency, title: p.title, media });
}
