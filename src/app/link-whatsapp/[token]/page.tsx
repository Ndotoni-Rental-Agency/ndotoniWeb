'use client';

/**
 * One tap from WhatsApp: the owner signs in (or signs up) and this WhatsApp number — with any
 * listings our team added under it — joins their account. The token in the link says which
 * number; it works once and for 14 days. (ndotonistays.com has the same page.)
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Link2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPrompt } from '@/contexts/AuthPromptContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { GraphQLClient } from '@/lib/graphql-client';

const LINK_WHATSAPP = /* GraphQL */ `mutation LinkWhatsAppWithToken($token: String!) {
  linkWhatsAppWithToken(token: $token) { success message }
}`;

const APP_STORE = 'https://apps.apple.com/us/app/ndotoni/id6767931205';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.ndotoni.app';

type Status = 'signin' | 'linking' | 'done' | 'error';

const COPY = {
  en: {
    appTitle: 'Prefer the app?',
    appBody: 'Install the Ndotoni app, then tap the link in WhatsApp again: it opens in the app.',
    title: 'Link your WhatsApp',
    intro: 'Sign in or create an account to link this WhatsApp number. Your listing will appear in your account, and updates about it will come to you on WhatsApp.',
    signIn: 'Sign in',
    signUp: 'Create an account',
    linking: 'Linking your WhatsApp…',
    done: 'WhatsApp linked',
    goToListings: 'Go to my listings',
    staysNote: 'Short stays are managed on ndotonistays.com with the same account.',
    failed: "Couldn't link your WhatsApp",
    help: 'Send "unganisha" to our WhatsApp number to get a new link.',
    home: 'Back to Ndotoni',
  },
  sw: {
    appTitle: 'Unapendelea app?',
    appBody: 'Pakua app ya Ndotoni, kisha bonyeza kiungo kwenye WhatsApp tena: kitafunguka kwenye app.',
    title: 'Unganisha WhatsApp yako',
    intro: 'Ingia au fungua akaunti ili kuunganisha namba hii ya WhatsApp. Nyumba yako itaonekana kwenye akaunti yako, na taarifa zake zitakuja kwako WhatsApp.',
    signIn: 'Ingia',
    signUp: 'Fungua akaunti',
    linking: 'Tunaunganisha WhatsApp yako…',
    done: 'WhatsApp imeunganishwa',
    goToListings: 'Nenda kwenye nyumba zangu',
    staysNote: 'Nyumba za muda mfupi zinasimamiwa kwenye ndotonistays.com kwa akaunti hii hii.',
    failed: 'Hatukuweza kuunganisha WhatsApp yako',
    help: 'Tuma "unganisha" kwenye namba yetu ya WhatsApp upate kiungo kipya.',
    home: 'Rudi Ndotoni',
  },
};

const BUTTON = 'w-full px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors';

export default function LinkWhatsAppPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { openAuthModal } = useAuthPrompt();
  const { language } = useLanguage();
  const c = COPY[language === 'sw' ? 'sw' : 'en'];
  const [status, setStatus] = useState<Status>('signin');
  const [message, setMessage] = useState('');
  const started = useRef(false);

  // Signed in (also after returning from Google/Apple sign-in): link once
  useEffect(() => {
    if (isLoading || !isAuthenticated || started.current) return;
    started.current = true;
    setStatus('linking');
    GraphQLClient.executeAuthenticated<{ linkWhatsAppWithToken: { success: boolean; message: string } }>(LINK_WHATSAPP, { token: decodeURIComponent(token) })
      .then((data) => {
        setMessage(data.linkWhatsAppWithToken.message);
        setStatus(data.linkWhatsAppWithToken.success ? 'done' : 'error');
      })
      .catch((err: any) => {
        setMessage(err?.errors?.[0]?.message || err?.message || '');
        setStatus('error');
      });
  }, [isLoading, isAuthenticated, token]);

  const icon = (Icon: typeof Link2, tone: 'brand' | 'red', pulse = false) => (
    <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 ${tone === 'red' ? 'bg-red-50' : 'bg-brand-50'} ${pulse ? 'animate-pulse' : ''}`}>
      <Icon className={`h-8 w-8 ${tone === 'red' ? 'text-red-500' : 'text-brand-600'}`} />
    </div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        {(isLoading || status === 'linking') && (
          <>
            {icon(Link2, 'brand', true)}
            <h1 className="text-xl font-bold text-ink-900 mb-2">{c.linking}</h1>
          </>
        )}

        {!isLoading && !isAuthenticated && status === 'signin' && (
          <>
            {icon(Link2, 'brand')}
            <h1 className="text-xl font-bold text-ink-900 mb-2">{c.title}</h1>
            <p className="text-sm text-ink-500 mb-6">{c.intro}</p>
            <div className="space-y-3">
              <button onClick={() => openAuthModal('signin')} className={BUTTON}>{c.signIn}</button>
              <button onClick={() => openAuthModal('signup')} className="w-full text-sm font-semibold text-brand-700 hover:underline">{c.signUp}</button>
            </div>
            {/* People without the app: install it, and the same WhatsApp link opens there next time */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-ink-900 mb-1">📱 {c.appTitle}</p>
              <p className="text-xs text-ink-500 mb-3">{c.appBody}</p>
              <div className="flex justify-center gap-3">
                <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-ink-900 hover:bg-gray-50">App Store</a>
                <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-ink-900 hover:bg-gray-50">Google Play</a>
              </div>
            </div>
          </>
        )}

        {status === 'done' && (
          <>
            {icon(CheckCircle2, 'brand')}
            <h1 className="text-xl font-bold text-ink-900 mb-2">{c.done}</h1>
            <p className="text-sm text-ink-500 mb-2">{message}</p>
            <p className="text-xs text-ink-400 mb-6">{c.staysNote}</p>
            <button onClick={() => router.push('/host')} className={BUTTON}>{c.goToListings}</button>
          </>
        )}

        {status === 'error' && (
          <>
            {icon(XCircle, 'red')}
            <h1 className="text-xl font-bold text-ink-900 mb-2">{c.failed}</h1>
            <p className="text-sm text-ink-500 mb-2">{message}</p>
            <p className="text-sm text-ink-500 mb-6">{c.help}</p>
            <button onClick={() => router.push('/')} className={BUTTON}>{c.home}</button>
          </>
        )}
      </div>
    </div>
  );
}
