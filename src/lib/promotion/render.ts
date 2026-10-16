import { promotionLocation } from './location';
import { ShortTermProperty } from '@/API';

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => { const image = new Image(); image.crossOrigin = 'anonymous'; image.onload = () => resolve(image); image.onerror = () => reject(new Error('This photo cannot be exported. Choose another photo; its server must allow image downloads.')); image.src = url; });
}
/** The site's own DM Sans (next/font hashes its name), loaded before drawing so the canvas never falls back to Arial. */
async function brandFont(): Promise<string> {
  const family = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif';
  await Promise.all(['400', '500', '600', '700'].map(w => document.fonts.load(`${w} 40px ${family}`))).catch(() => undefined);
  return family;
}
function spaced(ctx: CanvasRenderingContext2D, px: number) { if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`; }
function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const words = text.split(/\s+/); const output: string[] = []; let line = '';
  for (const word of words) { const next = `${line} ${word}`.trim(); if (ctx.measureText(next).width > width && line) { output.push(line); line = word; } else line = next; }
  if (line) output.push(line);
  return output;
}
/** Two lines split near the middle so a title never leaves one word on its own line. */
function balanced(ctx: CanvasRenderingContext2D, text: string, width: number): string[] | null {
  if (ctx.measureText(text).width <= width) return [text];
  const words = text.split(/\s+/); let best: string[] | null = null; let bestWidth = Infinity;
  for (let i = 1; i < words.length; i++) {
    const pair = [words.slice(0, i).join(' '), words.slice(i).join(' ')]; const widest = Math.max(...pair.map(x => ctx.measureText(x).width));
    if (widest <= width && widest < bestWidth) { best = pair; bestWidth = widest; }
  }
  return best;
}
function lines(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, size: number, maxLines: number) {
  const output = wrap(ctx, text, width);
  for (let i = 0; i < Math.min(output.length, maxLines); i++) {
    let value = output[i];
    if (i === maxLines - 1 && output.length > maxLines) { while (ctx.measureText(`${value}…`).width > width) value = value.slice(0, -1); value += '…'; }
    ctx.fillText(value, x, y + i * size * 1.2);
  }
}
// Recorded listing facts only, in a fixed priority; unknown free-text amenities are skipped rather than guessed at.
const AMENITIES: [RegExp, string, string][] = [
  [/swimmingpool|^pool$/, 'Pool', 'Bwawa la kuogelea'], [/^wi-?fi$/, 'Wi-Fi', 'Wi-Fi'], [/airconditioning|^ac$/, 'Air conditioning', 'Kiyoyozi'],
  [/generator/, 'Generator', 'Jenereta'], [/parking/, 'Parking', 'Maegesho'], [/security/, 'Security', 'Ulinzi'], [/garden/, 'Garden', 'Bustani'], [/balcony/, 'Balcony', 'Roshani'],
];
function facts(p: ShortTermProperty, sw: boolean): string[] {
  const recorded = (p.amenities || []).filter((a): a is string => !!a).map(a => a.toLowerCase().replace(/[^a-z-]/g, ''));
  const amenities = AMENITIES.filter(([match]) => recorded.some(a => match.test(a))).slice(0, 2).map(([, en, swahili]) => sw ? swahili : en);
  return [...(p.maxGuests ? [sw ? `Wageni hadi ${p.maxGuests}` : `Up to ${p.maxGuests} guests`] : []), ...amenities, ...(p.instantBookEnabled ? [sw ? 'Book papo hapo' : 'Instant booking'] : [])];
}
function frame(canvas: HTMLCanvasElement, image: HTMLImageElement, logo: HTMLImageElement, p: ShortTermProperty, phone: string, language: 'en' | 'sw', font: string, zoom = 1) {
  const ctx = canvas.getContext('2d')!; if (canvas.width !== 1080) canvas.width = 1080; if (canvas.height !== 1350) canvas.height = 1350;
  // ndotonistays.com tokens: ink-900/500/200, brand-50/600/700; the contact block uses the site's brand-600 button green.
  const ink = '#0f172a', paper = '#ffffff', muted = '#64748b', rule = '#e2e8f0', green = '#16a34a', deep = '#15803d', chip = '#f0fdf4'; const sw = language === 'sw'; const L = 60, R = 1020, W = R - L;
  const f = (weight: number, size: number) => { ctx.font = `${weight} ${size}px ${font}`; };
  ctx.textAlign = 'left'; spaced(ctx, 0); ctx.fillStyle = paper; ctx.fillRect(0, 0, 1080, 1350);
  // Calm masthead: the actual brand mark, never an AI recreation of the logo.
  // Same lockup as the Stays header: green "ndotoni" + ink "Stays".
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(logo, L, 28, 58, 58); f(700, 34); ctx.fillStyle = green; ctx.fillText('ndotoni', 132, 69); const markW = ctx.measureText('ndotoni ').width; ctx.fillStyle = ink; ctx.fillText('Stays', 132 + markW, 69); spaced(ctx, 1);
  ctx.textAlign = 'right'; ctx.fillStyle = muted; f(500, 18); ctx.fillText(sw ? 'TANZANIA · MALAZI YA MUDA MFUPI' : 'TANZANIA · SHORT STAYS', R, 66); ctx.textAlign = 'left'; spaced(ctx, 0);
  const photoY = 112, photoH = 762; const scale = Math.max(1080 / image.width, photoH / image.height) * zoom;
  ctx.save(); ctx.beginPath(); ctx.rect(0, photoY, 1080, photoH); ctx.clip(); ctx.drawImage(image, (1080 - image.width * scale) / 2, photoY + (photoH - image.height * scale) / 2, image.width * scale, image.height * scale);
  const gradient = ctx.createLinearGradient(0, 440, 0, 874); gradient.addColorStop(0, 'rgba(15,23,42,0)'); gradient.addColorStop(0.45, 'rgba(15,23,42,.55)'); gradient.addColorStop(1, 'rgba(15,23,42,.9)'); ctx.fillStyle = gradient; ctx.fillRect(0, photoY, 1080, photoH); ctx.restore();
  const area = promotionLocation(p, language).label;
  f(500, 21); const pillW = Math.min(W, ctx.measureText(area).width + 42); ctx.fillStyle = paper; ctx.beginPath(); ctx.roundRect(L, 150, pillW, 48, 24); ctx.fill(); ctx.fillStyle = ink; lines(ctx, area, L + 21, 181, pillW - 42, 21, 1);
  // Title sits on the photo's dark foot; one line or two balanced lines, smaller before it ever truncates.
  let size = 56; f(600, size); let title = balanced(ctx, p.title, W);
  if (!title) { size = 48; f(600, size); title = balanced(ctx, p.title, W); }
  ctx.fillStyle = '#ffffff'; const titleBottom = 836; const titleTop = titleBottom - (title ? title.length - 1 : 1) * size * 1.15;
  if (title) title.forEach((line, i) => ctx.fillText(line, L, titleTop + i * size * 1.15)); else lines(ctx, p.title, L, titleTop, W, size, 2);
  ctx.save(); ctx.fillStyle = '#4ade80'; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 8; f(600, 22); spaced(ctx, 2); ctx.fillText(sw ? 'KAA KWA STAREHE' : 'MAKE YOURSELF AT HOME', L, titleTop - size - 2); ctx.restore(); spaced(ctx, 0);
  // Real facts take priority over adjectives or unsupported trust badges.
  ctx.fillStyle = ink; f(600, 58); const rate = `${p.currency} ${p.nightlyRate.toLocaleString('en-US')}`; ctx.fillText(rate, L, 966);
  const rateWidth = ctx.measureText(rate).width; f(400, 24); ctx.fillStyle = muted; ctx.fillText(sw ? '/ usiku' : '/ night', Math.min(890, L + 16 + rateWidth), 964);
  const chips = facts(p, sw); f(500, 20); let chipX = L;
  if (chips.length) for (const label of chips) { const w = ctx.measureText(label).width + 36; if (chipX + w > R) break; ctx.fillStyle = chip; ctx.strokeStyle = '#bbf7d0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(chipX, 992, w, 42, 21); ctx.fill(); ctx.stroke(); ctx.fillStyle = deep; ctx.fillText(label, chipX + 18, 1020); chipX += w + 10; }
  else { ctx.fillStyle = muted; f(400, 22); ctx.fillText(sw ? 'Angalia picha zote na maelezo ya stay.' : 'See every photo and the full listing.', L, 1022); }
  ctx.strokeStyle = rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, 1066); ctx.lineTo(R, 1066); ctx.stroke();
  ctx.fillStyle = ink; f(500, 23); ctx.fillText(sw ? 'Book moja kwa moja na Ndotoni Stays — uliza chochote WhatsApp.' : 'Book direct with Ndotoni Stays — ask us anything on WhatsApp.', L, 1110);
  // Contact block, not a fake button: nothing inside a feed image is tappable, the caption carries the links.
  const digits = phone.replace(/\D/g, ''); const display = digits.startsWith('255') && digits.length === 12 ? `+255 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}` : `+${digits}`;
  ctx.fillStyle = green; ctx.beginPath(); ctx.roundRect(L, 1140, W, 104, 16); ctx.fill(); ctx.fillStyle = paper; f(700, 31); ctx.fillText('ndotonistays.com', L + 28, 1185); f(600, 22); ctx.fillText(`WhatsApp ${display}`, L + 28, 1222);
  ctx.textAlign = 'right'; f(600, 22); ctx.fillText(`${sw ? 'Pakua app' : 'Get the app'} · ndotonistays.com/app`, R - 28, 1185);  ctx.textAlign = 'left';
  ctx.fillStyle = muted; f(400, 19); lines(ctx, sw ? 'Bei ya mwisho na upatikanaji hutegemea tarehe. Ada nyingine zinaweza kuongezwa.' : 'Final price and availability depend on dates. Additional fees may apply.', L, 1284, W, 19, 2);
}
export async function createPoster(p: ShortTermProperty, imageUrl: string, phone: string, language: 'sw' | 'en'): Promise<Blob> {
  const [image, logo, font] = await Promise.all([loadImage(imageUrl), loadImage('/images/ndotoni-stays-brand.png'), brandFont()]); const canvas = document.createElement('canvas'); frame(canvas, image, logo, p, phone, language, font);
  return new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Could not export poster.')), 'image/png'));
}
export async function exportPoster(p: ShortTermProperty, imageUrl: string, phone: string, language: 'sw' | 'en') {
  download(await createPoster(p, imageUrl, phone, language), `ndotoni-${p.propertyId}.png`);
}
/** Uses only existing listing photos, no generated rooms or invented amenities. */
export async function createVideo(p: ShortTermProperty, imageUrls: string[], phone: string, language: 'sw' | 'en') {
  if (typeof MediaRecorder === 'undefined') throw new Error('Video export requires a browser with MediaRecorder support. Try Chrome.');
  const mime = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(x => MediaRecorder.isTypeSupported(x));
  if (!mime) throw new Error('Video export is unavailable in this browser.');
  const [images, logo, font] = await Promise.all([Promise.all(imageUrls.slice(0, 3).map(loadImage)), loadImage('/images/ndotoni-stays-brand.png'), brandFont()]);
  if (!images.length) throw new Error('Choose a photo first.');
  const canvas = document.createElement('canvas'); frame(canvas, images[0], logo, p, phone, language, font);
  const stream = canvas.captureStream(25); const chunks: BlobPart[] = []; const recorder = new MediaRecorder(stream, { mimeType: mime });
  try {
    const complete = new Promise<Blob>((resolve, reject) => { recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); }; recorder.onstop = () => resolve(new Blob(chunks, { type: mime })); recorder.onerror = () => reject(new Error('Video recording failed.')); });
    recorder.start(); const start = performance.now();
    await new Promise<void>(resolve => { const draw = () => { const elapsed = performance.now() - start; if (elapsed >= 12000) { resolve(); return; } frame(canvas, images[Math.min(images.length - 1, Math.floor(elapsed / (12000 / images.length)))], logo, p, phone, language, font, 1 + (elapsed % (12000 / images.length)) / 100000); requestAnimationFrame(draw); }; draw(); });
    recorder.stop(); return await complete;
  } finally { if (recorder.state !== 'inactive') recorder.stop(); stream.getTracks().forEach(t => t.stop()); }
}

export async function exportVideo(p: ShortTermProperty, images: string[], phone: string, language: 'sw' | 'en') {
  const blob = await createVideo(p, images, phone, language);
  download(blob, `ndotoni-${p.propertyId}.${blob.type.startsWith('video/mp4') ? 'mp4' : 'webm'}`);
}
