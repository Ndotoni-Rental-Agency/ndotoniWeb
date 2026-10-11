'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, RotateCw, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';
import { KangaBand } from '@/components/ui/KangaBand';
import { COMPANY_INFO } from '@/config/company';
import { WhatsAppIcon } from './WhatsAppIcon';

const pill = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 active:scale-[0.98] dark:focus-visible:outline-white';

export function ReferPageContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { requireAuth } = useAuthPrompt();
  const { language } = useLanguage();
  const sw = language === 'sw';
  const [url, setUrl] = useState('');
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const linkRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function'); }, []);
  useEffect(() => {
    if (!isAuthenticated) { setUrl(''); return; }
    let active = true;
    setFailed(false);
    GraphQLClient.executeAuthenticated<{ getMyReferralLink: { url: string } }>('query GetMyReferralLink { getMyReferralLink { url } }')
      .then(data => { if (active) setUrl(data.getMyReferralLink.url); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [isAuthenticated, retry]);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2500);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const message = sw
    ? `Una nyumba ya kupangisha? Itangaze bure kwenye Ndotoni kupitia Link yangu: ${url}`
    : `Have a property to rent out? List it free on Ndotoni with my Link: ${url}`;
  const whatsappChat = `${COMPANY_INFO.social.whatsapp}?text=${encodeURIComponent(sw ? 'Pata pesa' : 'Referral')}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      linkRef.current?.select();
      setCopyFailed(true);
    }
  }
  async function shareMore() {
    try { await navigator.share({ text: message }); } catch { /* Cancelled by the user. */ }
  }

  const reward = [
    { title: sw ? 'Wenyeji watano wa kwanza' : 'Your first five hosts', text: sw ? 'Zawadi za fedha ni kwa wenyeji wapya watano wa kwanza wanaoidhinishwa, kwenye Ndotoni, Ndotoni Stays na app. Unaweza kuendelea kushiriki baada ya hapo, bila zawadi ya fedha.' : 'Cash rewards cover your first five approved new hosts across Ndotoni, Ndotoni Stays and the app. Keep sharing after that; further referrals don’t earn cash.' },
    { title: sw ? 'Zawadi moja kwa kila mwenyeji' : 'One reward per host', text: sw ? 'Hata akitangaza nyumba au vyumba vingi, mwenyeji mmoja ni zawadi moja.' : 'However many properties or units they list, each host counts once.' },
    { title: sw ? 'Kiasi kinathibitishwa' : 'Amount confirmed on review', text: sw ? 'Hadi TZS 5,000 kwa kila mwenyeji. Tunathibitisha kiasi baada ya nyumba kuthibitishwa na kuchapishwa.' : 'Up to TZS 5,000 per host. We confirm the amount once their property is verified and published.' },
  ];
  const steps = [
    { title: sw ? 'Tuma Link yako' : 'Send your Link', text: sw ? 'Kwa rafiki, jirani au kikundi cha WhatsApp. Hakuna kikomo.' : 'To a friend, a neighbour or a WhatsApp group. No limit.' },
    { title: sw ? 'Wanatangaza nyumba' : 'They list their property', text: sw ? 'Kwenye tovuti, app au WhatsApp. Rufaa yako inabaki nao kwa siku 30.' : 'On the website, app or WhatsApp. Your referral stays with them for 30 days.' },
    { title: sw ? 'Unapata zawadi' : 'You get rewarded', text: sw ? 'Nyumba ikithibitishwa na kuchapishwa, tunakagua na kuthibitisha zawadi yako.' : 'Once their property is verified and published, we review it and confirm your reward.' },
  ];

  return (
    <main className="bg-white text-ink-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6 sm:pb-20 sm:pt-8">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl bg-brand-500 dark:bg-brand-800">
            <KangaBand variant="thin" className="h-4 rounded-none" />
            <div className="p-5 pb-6 sm:p-10">
              <h1 className="max-w-xl text-balance font-poster text-[2.5rem] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink-900 sm:text-6xl dark:text-white" style={{ fontStretch: '88%' }}>
                {sw ? 'Unamfahamu mwenye nyumba?' : 'Know someone with a place to rent?'}
              </h1>
              <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-ink-800 sm:text-lg dark:text-brand-50">
                {sw ? 'Mtumie Link yako. Akiwa mwenyeji mpya kwenye Ndotoni, unapata zawadi.' : 'Send them your Link. When they become a new host on Ndotoni, you get rewarded.'}
              </p>
              <p className="mt-6 text-lg font-bold text-ink-900 sm:text-xl dark:text-white">
                {sw ? 'Pata hadi ' : 'Earn up to '}<span className="whitespace-nowrap font-poster text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">TZS 25,000</span>
              </p>
              <p className="mt-1 text-sm font-medium text-ink-800 dark:text-brand-100">
                {sw ? 'Hadi TZS 5,000 kwa kila mmoja wa wenyeji wako wapya watano wa kwanza.' : 'Up to TZS 5,000 for each of your first five new hosts.'}
              </p>

              <div className="mt-6 rounded-2xl bg-white p-4 shadow-editorial sm:p-5 dark:bg-gray-900" aria-live="polite">
                {isLoading || (isAuthenticated && !url && !failed) ? (
                  <div role="status" aria-label={sw ? 'Tunaandaa Link yako' : 'Getting your Link ready'} className="space-y-3">
                    <div className="h-12 animate-pulse rounded-full bg-stone-100 dark:bg-gray-800" />
                    <div className="h-12 animate-pulse rounded-full bg-stone-100 dark:bg-gray-800" />
                  </div>
                ) : !isAuthenticated ? (
                  <>
                    <p className="text-base font-bold">{sw ? 'Pata Link yako binafsi' : 'Get your personal Link'}</p>
                    <p className="mt-1 text-sm text-ink-500 dark:text-gray-400">{sw ? 'Ni bure. Link moja kwa watu wote unaowafahamu.' : 'It’s free. One Link for everyone you know.'}</p>
                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      <button type="button" onClick={() => requireAuth({ mode: 'signup' })} className={`${pill} bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900`}>
                        {sw ? 'Pata Link yangu' : 'Get my Link'}<ArrowRight size={17} aria-hidden="true" />
                      </button>
                      <a href={whatsappChat} target="_blank" rel="noopener noreferrer" className={`${pill} border border-stone-200 text-ink-900 hover:bg-stone-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800`}>
                        <WhatsAppIcon className="h-[18px] w-[18px] text-brand-600" />{sw ? 'Ipate WhatsApp' : 'Get it on WhatsApp'}
                      </a>
                    </div>
                    <p className="mt-3 text-xs text-ink-500 dark:text-gray-400">{sw ? 'Kwenye WhatsApp hakuna haja ya kufungua akaunti.' : 'No account needed on WhatsApp.'}</p>
                  </>
                ) : failed ? (
                  <div role="alert">
                    <p className="text-base font-bold">{sw ? 'Hatukuweza kupata Link yako' : 'We couldn’t load your Link'}</p>
                    <p className="mt-1 text-sm text-ink-500 dark:text-gray-400">{sw ? 'Angalia mtandao wako kisha ujaribu tena.' : 'Check your connection and try again.'}</p>
                    <button type="button" onClick={() => setRetry(n => n + 1)} className={`${pill} mt-4 w-full bg-ink-900 text-white hover:bg-ink-800 sm:w-auto dark:bg-white dark:text-ink-900`}>
                      <RotateCw size={16} aria-hidden="true" />{sw ? 'Jaribu tena' : 'Try again'}
                    </button>
                  </div>
                ) : (
                  <>
                    <label htmlFor="referral-link" className="text-sm font-bold">{sw ? 'Link yako' : 'Your Link'}</label>
                    <div className="mt-2 flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-1 pl-4 dark:border-gray-700 dark:bg-gray-800">
                      <input id="referral-link" ref={linkRef} readOnly value={url} onFocus={e => e.target.select()} className="min-w-0 flex-1 bg-transparent text-sm text-ink-700 outline-none selection:bg-brand-200 dark:text-gray-200" />
                      <button type="button" onClick={copy} className={`${pill} min-h-10 shrink-0 px-4 ${copied ? 'bg-brand-100 text-brand-800' : 'bg-white text-ink-900 shadow-soft hover:bg-stone-100 dark:bg-gray-900 dark:text-white'}`}>
                        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                        {copied ? (sw ? 'Imenakiliwa' : 'Copied') : (sw ? 'Nakili' : 'Copy')}
                      </button>
                    </div>
                    <a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className={`${pill} mt-3 w-full bg-brand-500 text-ink-900 hover:bg-brand-400`}>
                      <WhatsAppIcon className="h-5 w-5" />{sw ? 'Shiriki kwenye WhatsApp' : 'Share on WhatsApp'}
                    </a>
                    {canShare && (
                      <button type="button" onClick={shareMore} className="mx-auto mt-2 flex min-h-11 items-center gap-2 px-3 text-sm font-semibold text-ink-700 underline-offset-4 hover:underline dark:text-gray-300">
                        <Share2 size={16} aria-hidden="true" />{sw ? 'Njia nyingine za kushiriki' : 'More ways to share'}
                      </button>
                    )}
                    <p role="status" className="min-h-[1.25rem] text-center text-xs font-medium text-ink-500 dark:text-gray-400">
                      {copyFailed ? (sw ? 'Link imechaguliwa. Bonyeza kwa muda kuinakili.' : 'Link selected. Press and hold, or use Ctrl+C, to copy.') : copied ? (sw ? 'Iko tayari kubandikwa popote.' : 'Ready to paste anywhere.') : ''}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <figure className="relative hidden overflow-hidden rounded-3xl lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/property-hero.jpeg" alt={sw ? 'Nyumba yenye bustani' : 'A home with a garden'} className="absolute inset-0 h-full w-full object-cover object-[35%_center]" />
            <figcaption className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 text-sm font-semibold leading-snug text-ink-900 shadow-editorial">
              {sw ? 'Nyumba nzuri mara nyingi huanza na mtu unayemfahamu.' : 'Good homes often start with someone you know.'}
            </figcaption>
          </figure>
        </section>

        <section className="mt-14 sm:mt-20" aria-labelledby="how-it-works">
          <h2 id="how-it-works" className="font-poster text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{sw ? 'Inavyofanya kazi' : 'How it works'}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4 sm:block">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-ink-900">{i + 1}</span>
                <div className="sm:mt-4">
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-ink-500 dark:text-gray-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 border-t border-stone-200 pt-10 sm:mt-20 dark:border-gray-800" aria-labelledby="good-to-know">
          <h2 id="good-to-know" className="font-poster text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">{sw ? 'Mambo ya kujua' : 'Good to know'}</h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-8">
            {reward.map(item => (
              <div key={item.title}>
                <dt className="text-sm font-bold">{item.title}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-500 dark:text-gray-400">{item.text}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold">
            <Link href="/terms#referral-programme" className="text-brand-800 underline underline-offset-4 hover:text-brand-700 dark:text-brand-300">{sw ? 'Masharti kamili ya programu' : 'Full programme terms'}</Link>
            <Link href="/property/create" className="inline-flex items-center gap-1.5 text-ink-700 hover:text-ink-900 dark:text-gray-300">{sw ? 'Una nyumba yako? Itangaze' : 'Own a property? List it yourself'}<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </section>
      </div>
    </main>
  );
}
