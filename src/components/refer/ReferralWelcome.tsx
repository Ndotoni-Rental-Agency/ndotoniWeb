'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Check, Copy, MessageCircle, RotateCw, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { CLAIM_REFERRAL, clearPendingReferral, rememberReferral } from '@/lib/referral/attribution';
import { useAuth } from '@/contexts/AuthContext';
import { COMPANY_INFO } from '@/config/company';
import { WhatsAppIcon } from './WhatsAppIcon';
import { StoreButtons } from './StoreButtons';

const HERO = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=75&auto=format&fit=crop';
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
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const invited = state === 'ready' || state === 'error';
  const listHref = invited ? `/property/create?referralCode=${attributionCode}` : '/property/create';
  const whatsapp = `${COMPANY_INFO.social.whatsapp}?text=${encodeURIComponent(`${sw ? 'Nataka kutangaza nyumba yangu.' : 'I want to list my property.'}${invited ? `\nReferral: ${attributionCode}` : ''}`)}`;
  async function copyCode() {
    try { await navigator.clipboard.writeText(attributionCode); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  const trust = [
    { icon: Sparkles, label: sw ? 'Bure kutangaza' : 'Free to list' },
    { icon: BadgeCheck, label: sw ? 'Nyumba zinathibitishwa' : 'Verified listings' },
    { icon: MessageCircle, label: sw ? 'Msaada WhatsApp' : 'Help on WhatsApp' },
  ];

  return (
    <main className="bg-white text-ink-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-3 pb-14 pt-3 sm:px-6 sm:pb-20 sm:pt-6">
        <section className="relative">
          <div className="relative h-[340px] overflow-hidden rounded-[28px] sm:h-[440px] lg:h-[540px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${HERO}&w=1600`} srcSet={`${HERO}&w=800 800w, ${HERO}&w=1600 1600w, ${HERO}&w=2200 2200w`} sizes="(min-width: 1152px) 1152px, 100vw" alt="" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 pb-16 sm:p-10 sm:pb-20 lg:inset-y-0 lg:flex lg:max-w-xl lg:flex-col lg:justify-center lg:pb-10">
              <h1 className="text-balance font-poster text-[2.3rem] font-extrabold leading-[0.95] tracking-[-0.035em] text-white sm:text-6xl" style={{ fontStretch: '88%' }}>
                {sw ? 'Tangaza nyumba yako ' : 'List your place '}<span className="text-brand-400">{sw ? 'bure.' : 'for free.'}</span>
              </h1>
              <p className="mt-3 text-base font-medium text-white/85 sm:text-lg">{state === 'invalid' ? (sw ? 'Karibu Ndotoni.' : 'Welcome to Ndotoni.') : (sw ? 'Rafiki amekualika kwenye Ndotoni.' : 'A friend invited you to Ndotoni.')}</p>
            </div>
          </div>

          <div aria-live="polite" className="relative z-10 mx-2 -mt-10 rounded-3xl bg-white p-5 shadow-hero ring-1 ring-black/5 sm:mx-auto sm:max-w-lg sm:p-6 lg:absolute lg:bottom-10 lg:right-10 lg:mt-0 lg:w-[420px] dark:bg-gray-900 dark:ring-white/10">
            {state === 'loading' ? (
              <div role="status" aria-label={sw ? 'Tunafungua mwaliko wako' : 'Opening your invitation'} className="space-y-3">
                <div className="h-12 animate-pulse rounded-full bg-stone-100 dark:bg-gray-800" />
                <div className="h-12 animate-pulse rounded-full bg-stone-100 dark:bg-gray-800" />
              </div>
            ) : (
              <>
                {state !== 'ready' && (
                  <div role="alert" className="mb-4 rounded-2xl bg-stone-50 p-4 text-sm text-ink-700 dark:bg-gray-800 dark:text-gray-300">
                    <p className="font-bold text-ink-900 dark:text-white">{state === 'invalid' ? (sw ? 'Link hii ya mwaliko haipo' : 'This invitation Link isn’t valid') : (sw ? 'Hatukuweza kuthibitisha mwaliko' : 'We couldn’t check your invitation')}</p>
                    <p className="mt-1">{state === 'invalid' ? (sw ? 'Bado unaweza kutangaza nyumba yako.' : 'You can still list your place.') : (sw ? 'Endelea; tutauthibitisha ukitangaza.' : 'Carry on; we’ll check it when you list.')}</p>
                    {state === 'error' && (
                      <button type="button" onClick={() => setRetry(n => n + 1)} className="mt-1 inline-flex min-h-10 items-center gap-1.5 font-bold text-ink-900 underline underline-offset-4 dark:text-white">
                        <RotateCw size={15} aria-hidden="true" />{sw ? 'Jaribu tena' : 'Try again'}
                      </button>
                    )}
                  </div>
                )}
                <div className="grid gap-2.5">
                  <Link href={listHref} className={`${pill} bg-brand-500 text-base text-ink-900 hover:bg-brand-400`}>
                    {sw ? 'Tangaza nyumba yangu' : 'List my property'}<ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${pill} border border-stone-200 text-ink-900 hover:bg-stone-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800`}>
                    <WhatsAppIcon className="h-[18px] w-[18px] text-brand-600" />{sw ? 'Tuma WhatsApp badala yake' : 'Use WhatsApp instead'}
                  </a>
                </div>
                <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-semibold text-ink-500 dark:text-gray-400">
                  {trust.map(({ icon: Icon, label }) => (
                    <li key={label} className="inline-flex items-center gap-1.5"><Icon size={14} className="text-brand-600" aria-hidden="true" />{label}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-5xl gap-3 sm:mt-12 lg:grid-cols-2 lg:gap-4">
          <div className="rounded-3xl bg-stone-50 p-5 sm:p-6 dark:bg-gray-900">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ink-900 shadow-soft dark:bg-gray-800 dark:text-white"><Smartphone size={20} aria-hidden="true" /></span>
              <div>
                <h2 className="text-lg font-bold tracking-tight">{sw ? 'Au tumia app ya Ndotoni' : 'Or use the Ndotoni app'}</h2>
                <p className="mt-0.5 text-sm text-ink-500 dark:text-gray-400">{sw ? 'Simamia nyumba na ujibu wapangaji popote.' : 'Manage your place and reply to tenants on the go.'}</p>
              </div>
            </div>
            <div className="mt-5"><StoreButtons sw={sw} /></div>
            {invited && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-2 pl-4 dark:bg-gray-800">
                <span className="min-w-0 text-xs text-ink-500 dark:text-gray-400">
                  {sw ? 'Msimbo wako wa mwaliko' : 'Your invitation code'}
                  <code className="block select-all truncate text-sm font-bold tracking-wide text-ink-900 dark:text-white">{attributionCode}</code>
                </span>
                <button type="button" onClick={copyCode} className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition-colors ${copied ? 'bg-brand-100 text-brand-800' : 'bg-stone-100 text-ink-900 hover:bg-stone-200 dark:bg-gray-700 dark:text-white'}`}>
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}{copied ? (sw ? 'Imenakiliwa' : 'Copied') : (sw ? 'Nakili' : 'Copy')}
                </button>
              </div>
            )}
            {invited && <p role="status" className="mt-2 text-xs text-ink-500 dark:text-gray-400">{copyError ? (sw ? 'Bonyeza msimbo kwa muda kuunakili.' : 'Press and hold the code to copy it.') : (sw ? 'Uweke kwenye “Rufaa” ndani ya app.' : 'Enter it under “Refer” in the app.')}</p>}
          </div>

          <a href={invited ? `https://www.ndotonistays.com/r/${attributionCode}` : 'https://www.ndotonistays.com/become-host'} className="group flex items-center justify-between gap-4 rounded-3xl border border-stone-200 p-5 transition-colors hover:border-ink-900 sm:p-6 dark:border-gray-800 dark:hover:border-white">
            <span>
              <span className="block text-lg font-bold tracking-tight">{sw ? 'Ni malazi ya muda mfupi?' : 'Hosting short stays?'}</span>
              <span className="mt-0.5 block text-sm text-ink-500 dark:text-gray-400">{sw ? 'Endelea kwenye Ndotoni Stays.' : 'Continue on Ndotoni Stays.'}</span>
            </span>
            <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </section>

        {state === 'ready' && (
          <p className="mx-auto mt-6 max-w-5xl px-2 text-center text-xs text-ink-500 dark:text-gray-400">
            {sw ? 'Mwaliko umehifadhiwa kwa siku 30. ' : 'Your invitation is saved for 30 days. '}
            <Link href="/terms#referral-programme" className="font-semibold underline underline-offset-4">{sw ? 'Masharti' : 'Terms'}</Link>
          </p>
        )}
      </div>
    </main>
  );
}
