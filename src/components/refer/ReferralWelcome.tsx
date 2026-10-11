'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Copy, RotateCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { CLAIM_REFERRAL, clearPendingReferral, rememberReferral } from '@/lib/referral/attribution';
import { useAuth } from '@/contexts/AuthContext';
import { COMPANY_INFO } from '@/config/company';
import { KangaBand } from '@/components/ui/KangaBand';
import { WhatsAppIcon } from './WhatsAppIcon';

const pill = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 active:scale-[0.98] dark:focus-visible:outline-white';

export function ReferralWelcome({ code }: { code: string }) {
  const { language } = useLanguage();
  const sw = language === 'sw';
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState<'loading' | 'ready' | 'invalid' | 'error'>('loading');
  const [attributionCode, setAttributionCode] = useState(code);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setState('loading');
    GraphQLClient.executePublic<{ resolveReferralLink: { code: string } | null }>(
      'query ResolveReferralLink($code: String!) { resolveReferralLink(code: $code) { code } }', { code }
    ).then(async data => {
      if (!active) return;
      if (!data.resolveReferralLink) { setState('invalid'); return; }
      const firstCode = rememberReferral(code) || code;
      setAttributionCode(firstCode);
      if (isAuthenticated) {
        try {
          await GraphQLClient.executeAuthenticated(CLAIM_REFERRAL, { code: firstCode });
          clearPendingReferral();
        } catch {
          // Keep the validated invitation available and retain its code for a later claim.
        }
      }
      if (active) setState('ready');
    }).catch(() => { if (active) setState('error'); });
    return () => { active = false; };
  }, [code, isAuthenticated, retry]);

  const invited = state === 'ready' || state === 'error';
  const listHref = invited ? `/property/create?referralCode=${attributionCode}` : '/property/create';
  const whatsapp = `${COMPANY_INFO.social.whatsapp}?text=${encodeURIComponent(`${sw ? 'Nataka kutangaza nyumba yangu.' : 'I want to list my property.'}${invited ? `\nReferral: ${attributionCode}` : ''}`)}`;
  async function copyCode() {
    try { await navigator.clipboard.writeText(attributionCode); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }

  return (
    <main className="bg-white text-ink-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6 sm:pb-20 sm:pt-8">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl bg-brand-500 dark:bg-brand-800">
            <KangaBand variant="thin" className="h-4 rounded-none" />
            <div className="p-5 pb-6 sm:p-10">
              <h1 className="max-w-xl text-balance font-poster text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink-900 sm:text-6xl dark:text-white" style={{ fontStretch: '88%' }}>
                {sw ? 'Tangaza nyumba yako bure.' : 'List your property for free.'}
              </h1>
              <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-ink-800 sm:text-lg dark:text-brand-50">
                {sw ? 'Rafiki amekualika. Weka picha chache na taarifa za nyumba, nasi tutakusaidia kuwafikia watu wanaotafuta nyumba.' : 'A friend invited you. Add a few photos and the basics, and we’ll help you reach people looking for a home.'}
              </p>

              <div className="mt-7" aria-live="polite">
                {state === 'loading' ? (
                  <div role="status" aria-label={sw ? 'Tunafungua mwaliko wako' : 'Opening your invitation'} className="grid gap-2.5 sm:max-w-md">
                    <div className="h-12 animate-pulse rounded-full bg-ink-900/15" />
                    <div className="h-12 animate-pulse rounded-full bg-white/50" />
                  </div>
                ) : (
                  <>
                    {state !== 'ready' && (
                      <div role="alert" className="mb-4 max-w-md rounded-2xl bg-white/90 p-4 text-sm text-ink-800">
                        <p className="font-bold text-ink-900">
                          {state === 'invalid' ? (sw ? 'Link hii ya mwaliko haipo' : 'This invitation Link isn’t valid') : (sw ? 'Hatukuweza kuthibitisha mwaliko' : 'We couldn’t check your invitation')}
                        </p>
                        <p className="mt-1">
                          {state === 'invalid'
                            ? (sw ? 'Mwombe rafiki yako akutumie Link yake tena. Bado unaweza kutangaza nyumba yako.' : 'Ask your friend to send their Link again. You can still list your property.')
                            : (sw ? 'Unaweza kuendelea; tutathibitisha mwaliko ukitangaza.' : 'You can carry on; we’ll check the invitation when you list.')}
                        </p>
                        {state === 'error' && (
                          <button type="button" onClick={() => setRetry(n => n + 1)} className="mt-2 inline-flex min-h-10 items-center gap-1.5 font-bold text-ink-900 underline underline-offset-4">
                            <RotateCw size={15} aria-hidden="true" />{sw ? 'Jaribu tena' : 'Try again'}
                          </button>
                        )}
                      </div>
                    )}
                    <div className="grid gap-2.5 sm:flex sm:flex-wrap">
                      <Link href={listHref} className={`${pill} bg-ink-900 px-7 text-base text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900`}>
                        {sw ? 'Tangaza nyumba yangu' : 'List my property'}<ArrowRight size={18} aria-hidden="true" />
                      </Link>
                      <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${pill} bg-white text-ink-900 hover:bg-cream-100`}>
                        <WhatsAppIcon className="h-[18px] w-[18px] text-brand-600" />{sw ? 'Nisaidie kupitia WhatsApp' : 'Get help on WhatsApp'}
                      </a>
                    </div>
                    <p className="mt-3 text-sm font-medium text-ink-800 dark:text-brand-100">{sw ? 'Kwenye tovuti, hakuna haja ya kupakua app.' : 'Right here on the website. No download needed.'}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <figure className="relative hidden overflow-hidden rounded-3xl lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/property-hero.jpeg" alt={sw ? 'Nyumba yenye bustani' : 'A home with a garden'} className="absolute inset-0 h-full w-full object-cover object-[35%_center]" />
          </figure>
        </section>

        <section className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
          <div className="space-y-3">
            <a href={invited ? `https://www.ndotonistays.com/r/${attributionCode}` : 'https://www.ndotonistays.com/become-host'} className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-200 p-5 transition-colors hover:border-ink-900 dark:border-gray-700 dark:hover:border-white">
              <span>
                <span className="block text-base font-bold">{sw ? 'Ni nyumba ya muda mfupi?' : 'Listing a short-term stay?'}</span>
                <span className="mt-0.5 block text-sm text-ink-500 dark:text-gray-400">{sw ? 'Kwa malazi ya usiku, endelea kwenye Ndotoni Stays.' : 'For nightly stays, continue on Ndotoni Stays.'}</span>
              </span>
              <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>

            {invited && (
              <details className="group rounded-2xl border border-stone-200 dark:border-gray-700">
                <summary className="flex min-h-[4.25rem] cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block text-base font-bold">{sw ? 'Unapendelea app?' : 'Prefer the app?'}</span>
                    <span className="mt-0.5 block text-sm text-ink-500 dark:text-gray-400">{sw ? 'Hiari. Mwaliko wako unaenda nawe.' : 'Optional. Your invitation comes with you.'}</span>
                  </span>
                  <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="space-y-4 border-t border-stone-200 p-5 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    <a href={`ndotoniapp://r/${attributionCode}`} className={`${pill} min-h-11 bg-ink-900 px-5 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900`}>{sw ? 'Fungua app' : 'Open the app'}</a>
                    <a href="https://apps.apple.com/us/app/ndotoni/id6767931205" className={`${pill} min-h-11 border border-stone-200 px-5 hover:bg-stone-50 dark:border-gray-700 dark:hover:bg-gray-900`}>App Store</a>
                    <a href="https://play.google.com/store/apps/details?id=com.ndotoni.app" className={`${pill} min-h-11 border border-stone-200 px-5 hover:bg-stone-50 dark:border-gray-700 dark:hover:bg-gray-900`}>Google Play</a>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-500 dark:text-gray-400">{sw ? 'Ukishapakua, rudi hapa ubonyeze “Fungua app”, au weka msimbo huu kwenye ukurasa wa rufaa ndani ya app.' : 'After installing, come back and tap “Open the app”, or enter this code on the app’s referral screen.'}</p>
                  <button type="button" onClick={copyCode} className="flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-stone-200 bg-stone-50 pl-5 pr-2 text-sm dark:border-gray-700 dark:bg-gray-900">
                    <code className="select-all font-semibold tracking-wide">{attributionCode}</code>
                    <span className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold ${copied ? 'bg-brand-100 text-brand-800' : 'bg-white text-ink-900 shadow-soft dark:bg-gray-800 dark:text-white'}`}>
                      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? (sw ? 'Imenakiliwa' : 'Copied') : (sw ? 'Nakili msimbo' : 'Copy code')}
                    </span>
                  </button>
                  {copyError && <p role="status" className="text-xs text-ink-500 dark:text-gray-400">{sw ? 'Bonyeza msimbo kwa muda kuunakili.' : 'Press and hold the code to copy it.'}</p>}
                </div>
              </details>
            )}
          </div>
          {state === 'ready' && (
            <p className="text-sm leading-relaxed text-ink-500 lg:pl-4 dark:text-gray-400">
              {sw ? 'Mwaliko wako umehifadhiwa kwa siku 30. Rafiki aliyekualika anaweza kupata zawadi nyumba yako ikithibitishwa na kuchapishwa. ' : 'Your invitation is saved for 30 days. The friend who invited you may be rewarded once your property is verified and published. '}
              <Link href="/terms#referral-programme" className="font-semibold text-ink-700 underline underline-offset-4 dark:text-gray-300">{sw ? 'Masharti' : 'Terms'}</Link>
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
